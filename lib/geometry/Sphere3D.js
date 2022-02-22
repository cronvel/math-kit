/*
	Math Kit

	Copyright (c) 2014 - 2019 Cédric Ronvel

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

"use strict" ;



const utils = require( './utils.js' ) ;



/*
	This is the equation:
	(X - x)² + (Y - y)² + (Z - z)² = r²
*/

function Sphere3D( x , y , z , r ) {
	this.center = new Vector3D( x , y , z ) ;
	this.r = + r ;
}

module.exports = Sphere3D ;

const Vector3D = require( './Vector3D.js' ) ;
const Circle3D = require( './Circle3D.js' ) ;
//const BoundVector3D = require( './BoundVector3D.js' ) ;



Sphere3D.fromObject = object => new Sphere3D(
	object.center.x ,
	object.center.y ,
	object.center.z ,
	object.r
) ;

Sphere3D.fromVectorRadius = ( center , r ) => new Sphere3D(
	center.x ,
	center.y ,
	center.z ,
	r
) ;



Sphere3D.prototype.set = function( x , y , z , r ) {
	this.center.set( x , y , z ) ;
	this.r = + r ;
	return this ;
} ;



Sphere3D.prototype.setVector = function( vector ) {
	this.center.setVector( vector ) ;
	return this ;
} ;



Sphere3D.prototype.setR = function( r ) {
	this.r = + r ;
	return this ;
} ;



Sphere3D.prototype.setSphere = function( sphere ) {
	this.center.setVector( sphere.center ) ;
	this.d = + sphere.d ;
	return this ;
} ;



Sphere3D.prototype.dup = Sphere3D.prototype.clone = function() {
	return Sphere3D.fromObject( this ) ;
} ;



/*
	Test a x,y coordinates with the sphere equation: (x - px)² + (y - py)² + (z - pz)² - r² = 0
	* zero: it's on the sphere
	* positive: it's on the outside of the sphere
	* negative: it's on the inside of the sphere
*/
Sphere3D.prototype.test = function( x , y , z ) {
	var dx = x - this.center.x ,
		dy = y - this.center.y ,
		dz = z - this.center.z ;

	return dx * dx + dy * dy + dz * dz - this.r * this.r ;
} ;



// Same with a vector
Sphere3D.prototype.testVector = function( vector ) {
	var dx = vector.x - this.center.x ,
		dy = vector.y - this.center.y ,
		dz = vector.z - this.center.z ;

	return dx * dx + dy * dy + dz * dz - this.r * this.r ;
} ;



// Like test, but the result is the distance outside (positive) or inside (negative)
Sphere3D.prototype.normalizedTest = function( x , y , z ) {
	return utils.hypot3( x - this.center.x , y - this.center.y , z - this.center.z ) - this.r ;
} ;



// Same with a vector
Sphere3D.prototype.normalizedTestVector = function( vector ) {
	return utils.hypot3( vector.x - this.center.x , vector.y - this.center.y , vector.z - this.center.z ) - this.r ;
} ;



// Normalize a test value that was produced by .test() or .testVector()
Sphere3D.prototype.normalizeTest = function( testValue ) {
	return Math.sqrt( testValue + this.r * this.r ) - this.r ;
} ;



/*
	Test a x,y coordinates with the sphere equation: sqrt( (x - px)² + (y - py)² + (z - pz)² ) - r = 0
*/
Sphere3D.prototype.pointDistance = function( positionVector ) {
	return Math.abs(
		utils.hypot3( positionVector.x - this.center.x , positionVector.y - this.center.y , positionVector.z - this.center.z )
		- this.r
	) ;
} ;



Sphere3D.prototype.pointProjection = function( positionVector ) {
	return this.center.dup().moveToward( positionVector , this.r ) ;
} ;



Sphere3D.prototype.lineIntersection = function( boundVector , offset = 0 ) {
	// http://www.ambrsoft.com/TrigoCalc/Sphere/SpherLineIntersection_.htm
	// This use the parametric equations for the line

	var r = this.r + offset ;

	var px = boundVector.position.x ;
	var py = boundVector.position.y ;
	var pz = boundVector.position.z ;

	var dx = boundVector.vector.x ;
	var dy = boundVector.vector.y ;
	var dz = boundVector.vector.z ;

	var a = dx * dx + dy * dy + dz * dz ;

	var b = 2 *  (  dx * ( px - this.center.x ) + dy * ( py - this.center.y ) + dz * ( pz - this.center.z )  ) ;

	//var c = this.center.x * this.center.x + this.center.y * this.center.y + this.center.z * this.center.z
	var c = this.center.dot( this.center )
		+ px * px + py * py + pz * pz
		- 2 * ( this.center.x * px + this.center.y * py + this.center.z * pz )
		- r * r ;

	// The discriminant
	var delta = b * b - 4 * a * c ;

	if ( delta < 0 ) {
		return null ;
	}
	else if ( delta === 0 ) {
		return [ boundVector.position.dup().apply(  boundVector.vector , -b / ( 2 * a )  ) ] ;
	}

	var sqrtDelta = Math.sqrt( delta ) ;
	//console.log( ">>>>>>>" , sqrtDelta , delta , a , b , c , px , py , pz , dx , dy , dz , this.center.x , this.center.y , this.center.z ) ;

	return [
		boundVector.position.dup().apply(  boundVector.vector , ( -b + sqrtDelta ) / ( 2 * a )  ) ,
		boundVector.position.dup().apply(  boundVector.vector , ( -b - sqrtDelta ) / ( 2 * a )  )
	] ;

} ;



// Like .lineIntersection(), but add a 't' property containing the parametric t value for the collision
Sphere3D.prototype.lineIntersectionT = function( boundVector , offset ) {
	var intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }
	intersection[ 0 ].t = boundVector.positionT( intersection[ 0 ] ) ;
	if ( intersection[ 1 ] ) { intersection[ 1 ].t = boundVector.positionT( intersection[ 1 ] ) ; }
	return intersection ;
} ;



// A trace is like a segment, collision should happen between 0 and 1,
// when there are two intersections, only the one with the smallest 't' is returned
Sphere3D.prototype.traceIntersection = function( boundVector , offset , maxT = 1 ) {
	var t , altT , intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }

	maxT = maxT || 1 ;

	t = boundVector.positionT( intersection[ 0 ] ) ;

	//if ( ! utils.e3lte( 0 , t , maxT ) )
	if ( t < 0 || t > maxT ) {
		// First intersection is out of range
		if ( intersection.length === 1 ) { return null ; }

		altT = boundVector.positionT( intersection[ 1 ] ) ;
		//if ( ! utils.e3lte( 0 , altT , maxT ) ) { return null ; }
		if ( altT < 0 || altT > maxT ) { return null ; }

		intersection[ 1 ].t = altT ;
		return intersection[ 1 ] ;
	}
	else if ( intersection.length === 1 ) {
		// First intersection is in range, and there is no other intersection
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}

	// Two intersections, the first is valid, check the second one

	altT = boundVector.positionT( intersection[ 1 ] ) ;
	//if ( altT > t || ! utils.e3lte( 0 , altT , maxT ) )
	if ( altT > t || altT < 0 || altT > maxT ) {
		// Second intersection is out of range, or happens after the first, return the first
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}

	intersection[ 1 ].t = altT ;
	return intersection[ 1 ] ;
} ;



// Intersection of a sphere and a plane: return a Circle3D or null
Sphere3D.prototype.planeIntersection = function( plane ) {
	// Get the center of the circle: project the center of the sphere on the plane
	var center = plane.pointProjection( this.center ) ;

	// Get the distance between both center
	var thisR2 = this.r * this.r ;
	var squaredDistance = center.pointSquaredDistance( this.center ) ;

	// No intersection
	if ( squaredDistance > thisR2 ) { return null ; }

	// get the radius of the circle
	var r = Math.sqrt( thisR2 - squaredDistance ) ;

	return Circle3D.fromVectorsRadius( center , plane.normal , r ) ;
} ;


