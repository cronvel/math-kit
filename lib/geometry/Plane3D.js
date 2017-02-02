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

/* jshint -W064 */

"use strict" ;



var utils = require( './utils.js' ) ;



/*
	This is the equation using the normal:
	vx * X + vy * Y + vz * Z + D = 0
	where D = - px * vx - py * vy - pz * vz
*/

function Plane3D( a , b , c , d )
{
	return Object.create( Plane3D.prototype ).set( a , b , c , d ) ;
}

module.exports = Plane3D ;



// Load modules
var Vector3D = require( './Vector3D.js' ) ;
var BoundVector3D = require( './BoundVector3D.js' ) ;



Plane3D.prototype = Object.create( Vector3D.prototype ) ;
Plane3D.prototype.constructor = Plane3D ;



Plane3D.fromObject = function fromObject( plane )
{
	return Object.create( Plane3D.prototype ).setPlane( plane ) ;
} ;



Plane3D.fromNormal = function fromNormal( px , py , pz , vx , vy , vz )
{
	return Object.create( Plane3D.prototype ).setNormal( px , py , pz , vx , vy , vz ) ;
} ;



Plane3D.fromNormalBoundVector = function fromNormalBoundVector( boundVector )
{
	return Object.create( Plane3D.prototype ).setNormalBoundVector( boundVector ) ;
} ;



Plane3D.fromNormalVectors = function fromNormalVectors( position , vector )
{
	return Object.create( Plane3D.prototype ).setNormalVectors( position , vector ) ;
} ;



Plane3D.fromThreePoints = function fromThreePoints( p1 , p2 , p3 )
{
	return Object.create( Plane3D.prototype ).setThreePoints( p1 , p2 , p3 ) ;
} ;



Plane3D.prototype.set = function set( a , b , c , d )
{
	this.x = + a ;
	this.y = + b ;
	this.z = + c ;
	this.d = + d ;
	this.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setA = function setA( a )
{
	this.x = + a ;
	Vector3D.prototype.normalizeCheck.call( this ) ;
	return this ;
} ;



Plane3D.prototype.setB = function setB( b )
{
	this.y = + b ;
	Vector3D.prototype.normalizeCheck.call( this ) ;
	return this ;
} ;



Plane3D.prototype.setC = function setC( c )
{
	this.z = + c ;
	Vector3D.prototype.normalizeCheck.call( this ) ;
	return this ;
} ;



Plane3D.prototype.setD = function setD( d )
{
	this.d = + d ;
	return this ;
} ;



/*
	ax + by + cz + d = 0
	x,y = 0,0 => cz + d = 0 => cz = -d => z = -d/c
*/
Plane3D.prototype.getNormalBoundVector_old = function getNormalBoundVector()
{
	return ( this.z && BoundVector3D( 0 , 0 , - this.d / this.z , this.x , this.y , this.z ) ) ||
		( this.y && BoundVector3D( 0 , - this.d / this.y , 0 , this.x , this.y , this.z ) ) ||
		( this.x && BoundVector3D( - this.d / this.x , 0 , 0 , this.x , this.y , this.z ) ) ;
} ;



/*
	More deterministic: find the position on the plane that is aligned with the normal and the origin.
	
	Equations:
	
	px / vx = py / vy = pz / vz
	<=> py = vy px / vx
	<=> pz = vz px / vx
	
	d = - ( px vx + py vy + pz vz )
	<=> px vx + vy² px / vx + vz² px / vx = -d
	<=> px ( vx + vy² /vx + vz² / vx ) = -d
	<=> px ( vx² / vx + vy² /vx + vz² / vx ) = -d
	<=> px = -d * vx / ( vx² + vy² + vz² )
	<=> px = -d * vx / ||v||²
*/
Plane3D.prototype.getNormalBoundVector = function getNormalBoundVector()
{
	var squareNorm = this.x * this.x + this.y * this.y + this.z * this.z ;
	
	return BoundVector3D(
		- this.d * this.x / squareNorm ,
		- this.d * this.y / squareNorm ,
		- this.d * this.z / squareNorm ,
		this.x , this.y , this.z
	) ;
} ;



Plane3D.prototype.setNormalBoundVector = function setNormalBoundVector( normal )
{
	this.x = normal.vector.x ;
	this.y = normal.vector.y ;
	this.z = normal.vector.z ;
	
	Vector3D.prototype.normalizeCheck.call( this ) ;
	this.d = - normal.position.x * this.x - normal.position.y * this.y - normal.position.z * this.z ;
	
	//this.normalizeCheck() ;
	
	return this ;
} ;



// Same than setNormalBoundVector() but use an argument list instead of a BoundVector3D
Plane3D.prototype.setNormal = function setNormal( px , py , pz , vx , vy , vz )
{
	this.x = vx ;
	this.y = vy ;
	this.z = vz ;
	
	Vector3D.prototype.normalizeCheck.call( this ) ;
	this.d = - px * this.x - py * this.y - pz * this.z ;
	
	//this.normalizeCheck() ;
	
	return this ;
} ;



// Same, but with 2 vectors
Plane3D.prototype.setNormalVectors = function setNormalVectors( position , vector )
{
	this.x = vector.x ;
	this.y = vector.y ;
	this.z = vector.z ;
	
	Vector3D.prototype.normalizeCheck.call( this ) ;
	this.d = - position.x * this.x - position.y * this.y - position.z * this.z ;
	
	//this.normalizeCheck() ;
	
	return this ;
} ;



Plane3D.prototype.getNormalVector = function getNormalVector()
{
	return Vector3D.fromObject( this ) ;
} ;



// This will not move the plane along the original position, since that position has already been lost.
// It will move it around the origin.
Plane3D.prototype.setNormalVector = function setNormalVector( vector )
{
	this.x = vector.x ;
	this.y = vector.y ;
	this.z = vector.z ;
	Vector3D.prototype.normalizeCheck.call( this ) ;
	
	return this ;
} ;



// Same principle than .getNormalBoundVector()
Plane3D.prototype.getPositionVector = Plane3D.prototype.getPosition = function getPositionVector()
{
	var squareNorm = this.x * this.x + this.y * this.y + this.z * this.z ;
	
	return Vector3D(
		- this.d * this.x / squareNorm ,
		- this.d * this.y / squareNorm ,
		- this.d * this.z / squareNorm
	) ;
} ;



Plane3D.prototype.setPositionVector = Plane3D.prototype.setPosition = function setPositionVector( vector )
{
	this.d = - vector.x * this.x - vector.y * this.y - vector.z * this.z ;
} ;



Plane3D.prototype.setPlane = function setPlane( plane )
{
	this.x = + plane.x ;
	this.y = + plane.y ;
	this.z = + plane.z ;
	this.d = + plane.d ;
	this.normalizeCheck() ;
	
	return this ;
} ;



Plane3D.prototype.setThreePoints = function setThreePoints( p1 , p2 , p3 )
{
	// Cross product of p1p2 x p1p3
	this.x = ( p2.y - p1.y ) * ( p3.z - p1.z )  -  ( p2.z - p1.z ) * ( p3.y - p1.y ) ;
	this.y = ( p2.z - p1.z ) * ( p3.x - p1.x )  -  ( p2.x - p1.x ) * ( p3.z - p1.z ) ;
	this.z = ( p2.x - p1.x ) * ( p3.y - p1.y )  -  ( p2.y - p1.y ) * ( p3.x - p1.x ) ;
	
	Vector3D.prototype.normalizeCheck.call( this ) ;
	this.d = - p1.x * this.x - p1.y * this.y - p1.z * this.z ;
	
	return this ;
} ;



Plane3D.prototype.dup = function dup()
{
	return Plane3D.fromObject( this ) ;
} ;



// Normalize the coordinate, so the normal vector length is 1
Plane3D.prototype.normalize = function normalize()
{
	var length = utils.hypot3( this.x , this.y , this.z ) ;
	
	if ( length )
	{
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
		this.d /= length ;
	}
	
	return this ;
} ;



// Normalize only if it is needed: perform an extra check to avoid hypot() or sqrt()
Plane3D.prototype.normalizeCheck = function normalizeCheck()
{
	var length = this.x * this.x + this.y * this.y + this.z * this.z ;
	
	if ( length && utils.eneq( length , 1 ) )
	{
		length = utils.sqHypot3( length , this.x , this.y , this.z ) ;
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
		this.d /= length ;
	}
	
	return this ;
} ;



/*
	Test a x,y,z coordinates with the plane equation: ax + by + cz + d
	
	* zero: it's on the plane
	* positive: it's on the side of the plane normal
	* negative: it's on the other side than the plane normal
	
	If the plane is normalized, like it should if userland doesn't directly modify it,
	the absolute value of the result is the distance from the plane.
*/
Plane3D.prototype.test = function test( x , y , z )
{
	return this.x * x + this.y * y + this.z * z + this.d ;
} ;



// Same with a vector
Plane3D.prototype.testVector = function testVector( vector )
{
	return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.d ;
} ;



/*
	ax + by + cz + d = 0
	x,y = 0,0 => cz + d = 0 => cz = -d => z = -d/c
*/
Plane3D.prototype.translate_old = function translate( vector )
{
	if ( this.z )
	{
		this.d = - vector.x * this.x - vector.y * this.y - ( vector.z - this.d / this.z ) * this.z ;
	}
	else if ( this.y )
	{
		this.d = - vector.x * this.x - ( vector.y - this.d / this.y ) * this.y - vector.z * this.z ;
	}
	else
	{
		this.d = - ( vector.x - this.d / this.x ) * this.x - vector.y * this.y - vector.z * this.z ;
	}
} ;



Plane3D.prototype.translate = function translate( vector )
{
	// Compute D as if the vector was not a translation vector but the new position vector,
	// then simply add it to the existing D.
	this.d += - vector.x * this.x - vector.y * this.y - vector.z * this.z ;
} ;



// We use the normal collinearity
Plane3D.prototype.isParallelToPlane = Vector3D.prototype.isCollinearTo ;



Plane3D.prototype.pointDistance = function pointDistance( positionVector )
{
	return Math.abs(
			this.x * positionVector.x +
			this.y * positionVector.y +
			this.z * positionVector.z +
			this.d
		) / utils.hypot3( this.x , this.y , this.z ) ;
} ;



Plane3D.prototype.lineIntersection = function lineIntersection( boundVector )
{
	// First check if the bound vector is collinear/coplanar
	// The dot product should not be zero
	var dot = this.dotProduct( boundVector.vector ) ;
	
	if ( ! dot ) { return null ; }
	
	var common = ( this.dotProduct( boundVector.position ) + this.d ) / dot ;
	
	return Vector3D(
		boundVector.position.x - ( boundVector.vector.x * common ) ,
		boundVector.position.y - ( boundVector.vector.y * common ) ,
		boundVector.position.z - ( boundVector.vector.z * common )
	) ;
} ;



Plane3D.prototype.pointProjection = function pointProjection( positionVector )
{
	//var projectionVector = BoundVector3D.fromVectors( positionVector , this ) ;
	//return this.lineIntersection( projectionVector ) ;
	
	// Faster: this uses the intersection code directly, to be more efficient
	var dot = this.dotProduct( this ) ;
	
	// Should never be null
	//if ( ! dot ) { return null ; }
	
	var common = ( this.dotProduct( positionVector ) + this.d ) / dot ;
	
	return Vector3D(
		positionVector.x - ( this.x * common ) ,
		positionVector.y - ( this.y * common ) ,
		positionVector.z - ( this.z * common )
	) ;
} ;



// Like .lineIntersection(), but add a 't' property containing the parametric t value for the collision
Plane3D.prototype.lineIntersectionT = function lineIntersectionT( boundVector )
{
	var intersection = this.lineIntersection( boundVector ) ;
	if ( intersection === null ) { return null ; }
	intersection.t = boundVector.positionT( intersection ) ;
	return intersection ;
} ;



// A trace is like a segment, collision should happen between 0 and 1
Plane3D.prototype.traceIntersection = function traceIntersection( boundVector )
{
	var intersection = this.lineIntersection( boundVector ) ;
	if ( intersection === null ) { return null ; }
	
	var t = boundVector.positionT( intersection ) ;
	if ( ! utils.e3lte( 0 , t , 1 ) ) { return null ; }
	
	intersection.t = t ;
	return intersection ;
} ;



// Two planes intersect as one line
Plane3D.prototype.planeIntersection = function planeIntersection( plane )
{
	var common ;
	
	// The cross product give the vector of the line
	var line = Object.create( BoundVector3D.prototype ) ;
	line.vector = this.crossProduct( plane ) ;
	
	//if ( lineVector.isEpsilonNull() ) { return null ; }
	if ( line.vector.isNull() ) { return null ; }
	
	if ( line.vector.z !== 0 )
	{
		common = this.x * plane.y - this.y * plane.x ;
		
		line.position = Vector3D(
			( this.y * plane.d - plane.y * this.d ) / common ,
			( plane.x * this.d - this.x * plane.d ) / common ,
			0
		) ;
	}
	else if ( line.vector.y !== 0 )
	{
		common = this.z * plane.x - this.x * plane.z ;
		
		line.position = Vector3D(
			( plane.z * this.d - this.z * plane.d ) / common ,
			0 ,
			( this.x * plane.d - plane.x * this.d ) / common
		) ;
	}
	else
	{
		// x cannot be null unless line.vector is null too
		common = this.y * plane.z - this.z * plane.y ;
		
		line.position = Vector3D(
			0 ,
			( this.z * plane.d - plane.z * this.d ) / common ,
			( plane.y * this.d - this.y * plane.d ) / common
		) ;
	}
	
	return line ;
} ;



// Alternative code, using: http://paulbourke.net/geometry/pointlineplane/
// More elegant, but slightly slower (10%)
Plane3D.prototype.planeIntersection_alt = function planeIntersection( plane )
{
	// The cross product give the vector of the line
	var line = Object.create( BoundVector3D.prototype ) ;
	line.vector = this.crossProduct( plane ) ;
	
	//if ( lineVector.isEpsilonNull() ) { return null ; }
	if ( line.vector.isNull() ) { return null ; }
	
	var dot11 = this.dotProduct( this ) ;
	var dot22 = plane.dotProduct( plane ) ;
	var dot12 = this.dotProduct( plane ) ;
	var determinant = dot11 * dot22 - dot12 * dot12 ;
	var c1 = ( - this.d * dot22 + plane.d * dot12 ) / determinant ;
	var c2 = ( - plane.d * dot11 + this.d * dot12 ) / determinant ;
	
	line.position = Vector3D(
		c1 * this.x + c2 * plane.x ,
		c1 * this.y + c2 * plane.y ,
		c1 * this.z + c2 * plane.z
	) ;
	
	return line ;
} ;



// http://paulbourke.net/geometry/pointlineplane/
Plane3D.prototype.threePlanesIntersection = function threePlanesIntersection( plane2 , plane3 )
{
	var plane1 = this ;
	
	var cross12 = plane1.crossProduct( plane2 ) ;
	var cross23 = plane2.crossProduct( plane3 ) ;
	var cross31 = plane3.crossProduct( plane1 ) ;
	
	// What cost the most? this check or the denominator check?
	//if ( cross12.isNull() || cross23.isNull() || cross31.isNull() ) { return null ; }
	
	var denominator = plane1.dot( cross23 ) ;
	
	if ( denominator === 0 ) { return null ; }
	
	return Vector3D(
		( - plane1.d * cross23.x - plane2.d * cross31.x - plane3.d * cross12.x ) / denominator ,
		( - plane1.d * cross23.y - plane2.d * cross31.y - plane3.d * cross12.y ) / denominator ,
		( - plane1.d * cross23.z - plane2.d * cross31.z - plane3.d * cross12.z ) / denominator
	) ;
} ;



// Getters/Setters
Object.defineProperties( BoundVector3D.prototype , {
	a: {
		get: function() { return this.x ; } ,
		set: Plane3D.prototype.setA
	} ,
	b: {
		get: function() { return this.y ; } ,
		set: Plane3D.prototype.setB
	} ,
	c: {
		get: function() { return this.z ; } ,
		set: Plane3D.prototype.setC
	} ,
} ) ;


