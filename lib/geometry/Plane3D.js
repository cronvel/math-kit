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
	var self = Object.create( Plane3D.prototype ) ;
	
	self.normal = Vector3D( a , b , c ) ;
	self.d = + d ;
	self.normalizeCheck() ;
	
	return self ;
}

module.exports = Plane3D ;



// Load modules
var Vector3D = require( './Vector3D.js' ) ;
var BoundVector3D = require( './BoundVector3D.js' ) ;



Plane3D.fromObject = function fromObject( plane )
{
	var self = Object.create( Plane3D.prototype ) ;
	
	self.normal = Vector3D.fromObject( plane.normal ) ;
	self.d = + plane.d ;
	self.normalizeCheck() ;
	
	return self ;
} ;



Plane3D.fromNormal = function fromNormal( px , py , pz , vx , vy , vz )
{
	var self = Object.create( Plane3D.prototype ) ;
	
	self.normal = Vector3D( vx , vy , vz ) ;
	self.d = - px * vx - py * vy - pz * vz ;
	self.normalizeCheck() ;
	
	return self ;
} ;



Plane3D.fromVectors = Plane3D.fromNormalVectors = function fromNormalVectors( position , vector )
{
	var self = Object.create( Plane3D.prototype ) ;
	
	self.normal = Vector3D.fromObject( vector ) ;
	self.d = - position.x * vector.x - position.y * vector.y - position.z * vector.z ;
	self.normalizeCheck() ;
	
	return self ;
} ;



Plane3D.fromNormalBoundVector = function fromNormalBoundVector( boundVector )
{
	return Plane3D.fromVectors( boundVector.position , boundVector.vector ) ;
} ;



Plane3D.fromThreePoints = function fromThreePoints( p1 , p2 , p3 )
{
	var self = Object.create( Plane3D.prototype ) ;
	
	self.normal = Vector3D() ;
	self.d = 0 ;
	self.setThreePoints( p1 , p2 , p3 ) ;
	
	return self ;
} ;



Plane3D.prototype.set = function set( a , b , c , d )
{
	this.normal.x = + a ;
	this.normal.y = + b ;
	this.normal.z = + c ;
	this.d = + d ;
	this.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setA = function setA( a )
{
	this.normal.x = + a ;
	this.normal.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setB = function setB( b )
{
	this.normal.y = + b ;
	this.normal.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setC = function setC( c )
{
	this.normal.z = + c ;
	this.normal.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setD = function setD( d )
{
	this.d = + d ;
	return this ;
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
	var normal = this.normal ;
	var squareNorm = normal.dot( normal ) ;
	
	return BoundVector3D(
		- this.d * normal.x / squareNorm ,
		- this.d * normal.y / squareNorm ,
		- this.d * normal.z / squareNorm ,
		normal.x , normal.y , normal.z
	) ;
} ;



Plane3D.prototype.setNormalBoundVector = function setNormalBoundVector( boundVector )
{
	this.normal.setVector( boundVector.vector ) ;
	this.normal.normalizeCheck() ;
	this.d = - this.normal.dot( boundVector.position ) ;
	
	return this ;
} ;



// Same than setNormalBoundVector() but use an argument list instead of a BoundVector3D
Plane3D.prototype.setNormal = function setNormal( px , py , pz , vx , vy , vz )
{
	this.normal.set( vx , vy , vz ) ;
	this.normal.normalizeCheck() ;
	this.d = - px * this.normal.x - py * this.normal.y - pz * this.normal.z ;
	
	return this ;
} ;



// Same, but with 2 vectors
Plane3D.prototype.setNormalVectors = function setNormalVectors( position , vector )
{
	this.normal.setVector( vector ) ;
	this.normal.normalizeCheck() ;
	this.d = - this.normal.dot( position ) ;
	
	return this ;
} ;



// This will not move the plane along the original position, since that position has already been lost.
// It will move it around the origin.
Plane3D.prototype.setNormalVector = function setNormalVector( vector )
{
	this.normal.setVector( vector ) ;
	this.normal.normalizeCheck() ;
	
	return this ;
} ;



// Same principle than .getNormalBoundVector()
Plane3D.prototype.getPositionVector = Plane3D.prototype.getPosition = function getPositionVector()
{
	var normal = this.normal ;
	var squareNorm = normal.dot( normal ) ;
	
	return Vector3D(
		- this.d * normal.x / squareNorm ,
		- this.d * normal.y / squareNorm ,
		- this.d * normal.z / squareNorm
	) ;
} ;



Plane3D.prototype.setPositionVector = Plane3D.prototype.setPosition = function setPositionVector( position )
{
	this.d = - this.normal.dot( position ) ;
} ;



Plane3D.prototype.setPlane = function setPlane( plane )
{
	this.normal.setVector( plane.normal ) ;
	this.d = + plane.d ;
	this.normalizeCheck() ;
	
	return this ;
} ;



Plane3D.prototype.setThreePoints = function setThreePoints( p1 , p2 , p3 )
{
	var normal = this.normal ;
	
	// Cross product of p1p2 x p1p3
	normal.x = ( p2.y - p1.y ) * ( p3.z - p1.z )  -  ( p2.z - p1.z ) * ( p3.y - p1.y ) ;
	normal.y = ( p2.z - p1.z ) * ( p3.x - p1.x )  -  ( p2.x - p1.x ) * ( p3.z - p1.z ) ;
	normal.z = ( p2.x - p1.x ) * ( p3.y - p1.y )  -  ( p2.y - p1.y ) * ( p3.x - p1.x ) ;
	
	normal.normalizeCheck() ;
	this.d = - normal.dot( p1 ) ;
	
	return this ;
} ;



Plane3D.prototype.dup = function dup()
{
	return Plane3D.fromObject( this ) ;
} ;



// Normalize the coordinate, so the normal vector length is 1
Plane3D.prototype.normalize = function normalize()
{
	var normal = this.normal ;
	var length = utils.hypot3( normal.x , normal.y , normal.z ) ;
	
	if ( length )
	{
		normal.x /= length ;
		normal.y /= length ;
		normal.z /= length ;
		this.d /= length ;
	}
	
	return this ;
} ;



// Normalize only if it is needed: perform an extra check to avoid hypot() or sqrt()
Plane3D.prototype.normalizeCheck = function normalizeCheck()
{
	var normal = this.normal ;
	var length = normal.x * normal.x + normal.y * normal.y + normal.z * normal.z ;
	
	if ( length && utils.eneq( length , 1 ) )
	{
		length = utils.sqHypot3( length , normal.x , normal.y , normal.z ) ;
		normal.x /= length ;
		normal.y /= length ;
		normal.z /= length ;
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
	return this.normal.x * x + this.normal.y * y + this.normal.z * z + this.d ;
} ;



// Same with a vector
Plane3D.prototype.testVector = function testVector( vector )
{
	return this.normal.x * vector.x + this.normal.y * vector.y + this.normal.z * vector.z + this.d ;
} ;



Plane3D.prototype.translate = function translate( vector )
{
	// Compute D as if the vector was not a translation vector but the new position vector,
	// then simply add it to the existing D.
	this.d += - this.normal.dot( vector ) ;
} ;



// We use the normal collinearity
Plane3D.prototype.isParallelToPlane = Vector3D.prototype.isCollinearTo ;



Plane3D.prototype.pointDistance = function pointDistance( positionVector )
{
	// This works because the plane is normalized, if it wasn't, one should divide by the normal's length
	return Math.abs( this.normal.dot( positionVector ) + this.d ) ;
} ;



Plane3D.prototype.pointProjection = function pointProjection( positionVector )
{
	// Faster: this uses the intersection code directly, to be more efficient
	var common = ( this.normal.dotProduct( positionVector ) + this.d ) / this.normal.dotProduct( this.normal ) ;
	
	return Vector3D(
		positionVector.x - ( this.normal.x * common ) ,
		positionVector.y - ( this.normal.y * common ) ,
		positionVector.z - ( this.normal.z * common )
	) ;
} ;



// Project a vector, similar to .pointProjection() but act as if the plane contained the origin (D=0)
Plane3D.prototype.vectorProjection = function vectorProjection( vector )
{
	// Faster: this uses the intersection code directly, to be more efficient
	var common = this.normal.dotProduct( vector ) / this.normal.dotProduct( this.normal ) ;
	
	return Vector3D(
		vector.x - ( this.normal.x * common ) ,
		vector.y - ( this.normal.y * common ) ,
		vector.z - ( this.normal.z * common )
	) ;
} ;



Plane3D.prototype.lineIntersection = function lineIntersection( boundVector )
{
	// First check if the bound vector is collinear/coplanar
	// The dot product should not be zero
	var dot = this.normal.dotProduct( boundVector.vector ) ;
	
	if ( ! dot ) { return null ; }
	
	var common = ( this.normal.dotProduct( boundVector.position ) + this.d ) / dot ;
	
	return Vector3D(
		boundVector.position.x - ( boundVector.vector.x * common ) ,
		boundVector.position.y - ( boundVector.vector.y * common ) ,
		boundVector.position.z - ( boundVector.vector.z * common )
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
Plane3D.prototype.traceIntersection = function traceIntersection( boundVector , maxT )
{
	var intersection = this.lineIntersection( boundVector ) ;
	if ( intersection === null ) { return null ; }
	
	var t = boundVector.positionT( intersection ) ;
	if ( ! utils.e3lte( 0 , t , maxT || 1 ) ) { return null ; }
	
	intersection.t = t ;
	return intersection ;
} ;



// Two planes intersect as one line
Plane3D.prototype.planeIntersection = function planeIntersection( plane )
{
	var common ;
	
	// The cross product give the vector of the line
	var line = Object.create( BoundVector3D.prototype ) ;
	line.vector = this.normal.crossProduct( plane.normal ) ;
	
	//if ( lineVector.isEpsilonNull() ) { return null ; }
	if ( line.vector.isNull() ) { return null ; }
	
	if ( line.vector.z !== 0 )
	{
		common = this.normal.x * plane.normal.y - this.normal.y * plane.normal.x ;
		
		line.position = Vector3D(
			( this.normal.y * plane.d - plane.normal.y * this.d ) / common ,
			( plane.normal.x * this.d - this.normal.x * plane.d ) / common ,
			0
		) ;
	}
	else if ( line.vector.y !== 0 )
	{
		common = this.normal.z * plane.normal.x - this.normal.x * plane.normal.z ;
		
		line.position = Vector3D(
			( plane.normal.z * this.d - this.normal.z * plane.d ) / common ,
			0 ,
			( this.normal.x * plane.d - plane.normal.x * this.d ) / common
		) ;
	}
	else
	{
		// x cannot be null unless line.vector is null too
		common = this.normal.y * plane.normal.z - this.normal.z * plane.normal.y ;
		
		line.position = Vector3D(
			0 ,
			( this.normal.z * plane.d - plane.normal.z * this.d ) / common ,
			( plane.normal.y * this.d - this.normal.y * plane.d ) / common
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
	line.vector = this.normal.crossProduct( plane.normal ) ;
	
	//if ( lineVector.isEpsilonNull() ) { return null ; }
	if ( line.vector.isNull() ) { return null ; }
	
	var dot11 = this.normal.dotProduct( this.normal ) ;
	var dot22 = plane.normal.dotProduct( plane.normal ) ;
	var dot12 = this.normal.dotProduct( plane.normal ) ;
	var determinant = dot11 * dot22 - dot12 * dot12 ;
	var c1 = ( - this.d * dot22 + plane.d * dot12 ) / determinant ;
	var c2 = ( - plane.d * dot11 + this.d * dot12 ) / determinant ;
	
	line.position = Vector3D(
		c1 * this.normal.x + c2 * plane.normal.x ,
		c1 * this.normal.y + c2 * plane.normal.y ,
		c1 * this.normal.z + c2 * plane.normal.z
	) ;
	
	return line ;
} ;



// http://paulbourke.net/geometry/pointlineplane/
Plane3D.prototype.threePlanesIntersection = function threePlanesIntersection( plane2 , plane3 )
{
	var plane1 = this ;
	
	var cross12 = plane1.normal.crossProduct( plane2.normal ) ;
	var cross23 = plane2.normal.crossProduct( plane3.normal ) ;
	var cross31 = plane3.normal.crossProduct( plane1.normal ) ;
	
	// What cost the most? this check or the denominator check?
	//if ( cross12.isNull() || cross23.isNull() || cross31.isNull() ) { return null ; }
	
	var denominator = plane1.normal.dot( cross23 ) ;
	
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
		get: function() { return this.normal.x ; } ,
		set: Plane3D.prototype.setA
	} ,
	b: {
		get: function() { return this.normal.y ; } ,
		set: Plane3D.prototype.setB
	} ,
	c: {
		get: function() { return this.normal.z ; } ,
		set: Plane3D.prototype.setC
	} ,
} ) ;


