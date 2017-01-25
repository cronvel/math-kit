/*
	Math Kit
	
	Copyright (c) 2014 - 2017 Cédric Ronvel
	
	The MIT License (MIT)
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/* jshint -W064, -W014 */

"use strict" ;



//var utils = require( './utils.js' ) ;



/*
	This is the equation:
	(X - x)² + (Y - y)² + (Z - z)² = r²
*/

function Sphere3D( x , y , z , r )
{
	return Object.create( Sphere3D.prototype ).set( x , y , z , r ) ;
}

module.exports = Sphere3D ;



// Load modules
var Vector3D = require( './Vector3D.js' ) ;
//var BoundVector3D = require( './BoundVector3D.js' ) ;



Sphere3D.prototype = Object.create( Vector3D.prototype ) ;
Sphere3D.prototype.constructor = Sphere3D ;



Sphere3D.fromObject = function fromObject( sphere )
{
	return Object.create( Sphere3D.prototype ).setSphere( sphere ) ;
} ;



Sphere3D.fromVectorRadius = function fromVectorRadius( vector , r )
{
	var self = Object.create( Sphere3D.prototype ) ;
	
	self.x = + vector.x ;
	self.y = + vector.y ;
	self.z = + vector.z ;
	self.r = + r ;
	
	return self ;
} ;



Sphere3D.prototype.set = function set( x , y , z , r )
{
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	this.r = + r ;
	return this ;
} ;



Sphere3D.prototype.setVector = function setVector( vector , r )
{
	this.x = + vector.x ;
	this.y = + vector.y ;
	this.z = + vector.z ;
	return this ;
} ;



Sphere3D.prototype.setR = function setR( r )
{
	this.r = + r ;
	return this ;
} ;



Sphere3D.prototype.setSphere = function setSphere( sphere )
{
	this.x = + sphere.x ;
	this.y = + sphere.y ;
	this.z = + sphere.z ;
	this.d = + sphere.d ;
	return this ;
} ;



Sphere3D.prototype.dup = function dup()
{
	return Sphere3D.fromObject( this ) ;
} ;



/*
	Test a x,y coordinates with the sphere equation: (x - px)² + (y - py)² + (z - pz)² - r² = 0
	* zero: it's on the sphere
	* positive: it's on the outside of the sphere
	* negative: it's on the inside of the sphere
*/
Sphere3D.prototype.test = function test( x , y , z )
{
	var dx = x - this.x ,
		dy = y - this.y ,
		dz = z - this.z ;
	
	return dx * dx + dy * dy + dz * dz - this.r * this.r ;
} ;



// Same with a vector
Sphere3D.prototype.testVector = function testVector( vector )
{
	var dx = vector.x - this.x ,
		dy = vector.y - this.y ,
		dz = vector.z - this.z ;
	
	return dx * dx + dy * dy + dz * dz - this.r * this.r ;
} ;



// Like test, but the result is the distance outside (positive) or inside (negative)
Sphere3D.prototype.normalizedTest = function normalizedTest( x , y , z )
{
	var dx = x - this.x ,
		dy = y - this.y ,
		dz = z - this.z ;
	
	return Math.sqrt( dx * dx + dy * dy + dz * dz ) - this.r ;
} ;



// Same with a vector
Sphere3D.prototype.normalizedTestVector = function normalizedTestVector( vector )
{
	var dx = vector.x - this.x ,
		dy = vector.y - this.y ,
		dz = vector.z - this.z ;
	
	return Math.sqrt( dx * dx + dy * dy + dz * dz ) - this.r ;
} ;



// Normalize a test value that was produced by .test() or .testVector()
Sphere3D.prototype.normalizeTest = function normalizeTest( testValue )
{
	return Math.sqrt( testValue + this.r * this.r ) - this.r ;
} ;



/*
	Test a x,y coordinates with the sphere equation: sqrt( (x - px)² + (y - py)² + (z - pz)² ) - r = 0
*/
Sphere3D.prototype.pointDistance = function pointDistance( positionVector )
{
	var dx = positionVector.x - this.x ,
		dy = positionVector.y - this.y ,
		dz = positionVector.z - this.z ;
	
	return Math.abs( Math.sqrt( dx * dx + dy * dy + dz * dz ) - this.r ) ;
} ;



Sphere3D.prototype.intersection = function intersection( boundVector )
{
	// http://www.ambrsoft.com/TrigoCalc/Sphere/SpherLineIntersection_.htm
	// This use the parametric equations for the line
	
	var px = boundVector.position.x ;
	var py = boundVector.position.y ;
	var pz = boundVector.position.z ;
	
	var dx = boundVector.vector.x ;
	var dy = boundVector.vector.y ;
	var dz = boundVector.vector.z ;
	
	var a = dx * dx + dy * dy + dz * dz ;
	
	var b = 2 *  (  dx * ( px - this.x ) + dy * ( py - this.y ) + dz * ( pz - this.z )  ) ;
	
	var c = this.x * this.x + this.y * this.y + this.z * this.z
		+ px * px + py * py + pz * pz
		- 2 * ( this.x * px + this.y * py + this.z * pz )
		- this.r * this.r ;
	
	// The discriminant
	var delta = b * b - 4 * a * c ;
	
	if ( delta < 0 )
	{
		return null ;
	}
	else if ( delta === 0 )
	{
		return [ boundVector.position.dup().apply(  boundVector.vector , - b / ( 2 * a )  ) ] ;
	}
	else
	{
		var sqrtDelta = Math.sqrt( delta ) ;
		//console.log( ">>>>>>>" , sqrtDelta , delta , a , b , c , px , py , pz , dx , dy , dz , this.x , this.y , this.z ) ;
		
		return [
			boundVector.position.dup().apply(  boundVector.vector , ( - b + sqrtDelta ) / ( 2 * a )  ) ,
			boundVector.position.dup().apply(  boundVector.vector , ( - b - sqrtDelta ) / ( 2 * a )  )
		] ;
	}
} ;



// Like .intersection(), but add a 't' property containing the parametric t value for the collision
Sphere3D.prototype.intersectionT = function intersectionT( boundVector )
{
	var intersection = this.intersection( boundVector ) ;
	if ( intersection === null ) { return null ; }
	intersection[ 0 ].t = this.positionT( intersection[ 0 ] ) ;
	if ( intersection[ 1 ] ) { intersection[ 1 ].t = this.positionT( intersection[ 1 ] ) ; }
	return intersection ;
} ;



// A trace is like a segment, collision should happen between 0 and 1,
// when there are two intersections, only the one with the smallest 't' is returned
Sphere3D.prototype.intersectionTrace = function intersectionTrace( boundVector )
{
	var t , altT , intersection = this.intersection( boundVector ) ;
	if ( intersection === null ) { return null ; }
	
	t = this.positionT( intersection[ 0 ] ) ;
	
	if ( t < 0 || t > 1 )
	{
		// First intersection is out of range
		if ( intersection.length === 1 ) { return null ; }
		
		altT = this.positionT( intersection[ 1 ] ) ;
		if ( altT < 0 || altT > 1 ) { return null ; }
		
		intersection[ 1 ].t = altT ;
		return intersection[ 1 ] ;
	}
	else if ( intersection.length === 1 )
	{
		// First intersection is in range, and there is no other intersection
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}
	
	// Two intersections, the first is valid, check the second one
	
	altT = this.positionT( intersection[ 1 ] ) ;
	if ( altT < 0 || altT > 1 || altT > t )
	{
		// Second intersection is out of range, or happens after the first, return the first
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}
	
	intersection[ 1 ].t = altT ;
	return intersection[ 1 ] ;
} ;



Sphere3D.prototype.pointProjection = function pointProjection( positionVector )
{
	return Vector3D.fromTo( this , positionVector ).setLength( this.r ).add( this ) ;
} ;


