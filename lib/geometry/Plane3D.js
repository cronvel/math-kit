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
	This is the equation using the normal:
	vx * X + vy * Y + vz * Z + D = 0
	where D = - px * vx - py * vy - pz * vz
*/

function Plane3D( a , b , c , d ) {
	this.normal = new Vector3D( a , b , c ) ;
	this.d = + d ;
	this.normalizeCheck() ;
}

module.exports = Plane3D ;

const Vector3D = require( './Vector3D.js' ) ;
const BoundVector3D = require( './BoundVector3D.js' ) ;



Plane3D.fromObject = plane => new Plane3D( plane.normal.x , plane.normal.y , plane.normal.z , plane.d ) ;

Plane3D.fromNormal = ( px , py , pz , vx , vy , vz ) => new Plane3D(
	vx ,
	vy ,
	vz ,
	-px * vx - py * vy - pz * vz
) ;

Plane3D.fromVectors = Plane3D.fromNormalVectors = ( position , vector ) => new Plane3D(
	vector.x ,
	vector.y ,
	vector.z ,
	-position.x * vector.x - position.y * vector.y - position.z * vector.z
) ;


Plane3D.fromNormalBoundVector = boundVector => Plane3D.fromVectors( boundVector.position , boundVector.vector ) ;

Plane3D.fromThreePoints = ( p1 , p2 , p3 ) => {
	var plane = new Plane3D() ;
	plane.setThreePoints( p1 , p2 , p3 ) ;
	return plane ;
} ;



Plane3D.prototype.set = function( a , b , c , d ) {
	this.normal.x = + a ;
	this.normal.y = + b ;
	this.normal.z = + c ;
	this.d = + d ;
	this.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setA = function( a ) {
	this.normal.x = + a ;
	this.normal.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setB = function( b ) {
	this.normal.y = + b ;
	this.normal.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setC = function( c ) {
	this.normal.z = + c ;
	this.normal.normalizeCheck() ;
	return this ;
} ;



Plane3D.prototype.setD = function( d ) {
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
Plane3D.prototype.getNormalBoundVector = function() {
	var normal = this.normal ;
	var squareNorm = normal.dot( normal ) ;

	return new BoundVector3D(
		-this.d * normal.x / squareNorm ,
		-this.d * normal.y / squareNorm ,
		-this.d * normal.z / squareNorm ,
		normal.x , normal.y , normal.z
	) ;
} ;



Plane3D.prototype.setNormalBoundVector = function( boundVector ) {
	this.normal.setVector( boundVector.vector ) ;
	this.normal.normalizeCheck() ;
	this.d = -this.normal.dot( boundVector.position ) ;

	return this ;
} ;



// Same than setNormalBoundVector() but use an argument list instead of a BoundVector3D
Plane3D.prototype.setNormal = function( px , py , pz , vx , vy , vz ) {
	this.normal.set( vx , vy , vz ) ;
	this.normal.normalizeCheck() ;
	this.d = -px * this.normal.x - py * this.normal.y - pz * this.normal.z ;

	return this ;
} ;



// Same, but with 2 vectors
Plane3D.prototype.setNormalVectors = function( position , vector ) {
	this.normal.setVector( vector ) ;
	this.normal.normalizeCheck() ;
	this.d = -this.normal.dot( position ) ;

	return this ;
} ;



// This will not move the plane along the original position, since that position has already been lost.
// It will move it around the origin.
Plane3D.prototype.setNormalVector = function( vector ) {
	this.normal.setVector( vector ) ;
	this.normal.normalizeCheck() ;

	return this ;
} ;



// Same principle than .getNormalBoundVector()
Plane3D.prototype.getPositionVector = Plane3D.prototype.getPosition = function() {
	var normal = this.normal ;
	var squareNorm = normal.dot( normal ) ;

	return new Vector3D(
		-this.d * normal.x / squareNorm ,
		-this.d * normal.y / squareNorm ,
		-this.d * normal.z / squareNorm
	) ;
} ;



Plane3D.prototype.setPositionVector = Plane3D.prototype.setPosition = function( position ) {
	this.d = -this.normal.dot( position ) ;
} ;



Plane3D.prototype.setPlane = function( plane ) {
	this.normal.setVector( plane.normal ) ;
	this.d = + plane.d ;
	this.normalizeCheck() ;

	return this ;
} ;



Plane3D.prototype.setThreePoints = function( p1 , p2 , p3 ) {
	var normal = this.normal ;

	// Cross product of p1p2 x p1p3
	normal.x = ( p2.y - p1.y ) * ( p3.z - p1.z )  -  ( p2.z - p1.z ) * ( p3.y - p1.y ) ;
	normal.y = ( p2.z - p1.z ) * ( p3.x - p1.x )  -  ( p2.x - p1.x ) * ( p3.z - p1.z ) ;
	normal.z = ( p2.x - p1.x ) * ( p3.y - p1.y )  -  ( p2.y - p1.y ) * ( p3.x - p1.x ) ;

	normal.normalizeCheck() ;
	this.d = -normal.dot( p1 ) ;

	return this ;
} ;



Plane3D.prototype.dup = Plane3D.prototype.clone = function() {
	return Plane3D.fromObject( this ) ;
} ;



// Normalize the coordinate, so the normal vector length is 1
Plane3D.prototype.normalize = function() {
	var normal = this.normal ;
	var length = utils.hypot3( normal.x , normal.y , normal.z ) ;

	if ( length ) {
		normal.x /= length ;
		normal.y /= length ;
		normal.z /= length ;
		this.d /= length ;
	}

	return this ;
} ;



// Normalize only if it is needed: perform an extra check to avoid hypot() or sqrt()
Plane3D.prototype.normalizeCheck = function() {
	var normal = this.normal ;
	var length = normal.x * normal.x + normal.y * normal.y + normal.z * normal.z ;

	if ( length && utils.eneq( length , 1 ) ) {
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
Plane3D.prototype.test = function( x , y , z ) {
	return this.normal.x * x + this.normal.y * y + this.normal.z * z + this.d ;
} ;



// Same with a vector
Plane3D.prototype.testVector = function( vector ) {
	return this.normal.x * vector.x + this.normal.y * vector.y + this.normal.z * vector.z + this.d ;
} ;



Plane3D.prototype.translate = function( vector ) {
	// Compute D as if the vector was not a translation vector but the new position vector,
	// then simply add it to the existing D.
	this.d += -this.normal.dot( vector ) ;
} ;



// We use the normal collinearity
Plane3D.prototype.isParallelToPlane = Vector3D.prototype.isCollinearTo ;



Plane3D.prototype.pointDistance = function( positionVector ) {
	// This works because the plane is normalized, if it wasn't, one should divide by the normal's length
	return Math.abs( this.normal.dot( positionVector ) + this.d ) ;
} ;



Plane3D.prototype.pointProjection = function( positionVector ) {
	// Faster: this uses the intersection code directly, to be more efficient
	var common = ( this.normal.dotProduct( positionVector ) + this.d ) / this.normal.dotProduct( this.normal ) ;

	return new Vector3D(
		positionVector.x - ( this.normal.x * common ) ,
		positionVector.y - ( this.normal.y * common ) ,
		positionVector.z - ( this.normal.z * common )
	) ;
} ;



// Project a vector, similar to .pointProjection() but act as if the plane contained the origin (D=0)
Plane3D.prototype.vectorProjection = function( vector ) {
	// Faster: this uses the intersection code directly, to be more efficient
	var common = this.normal.dotProduct( vector ) / this.normal.dotProduct( this.normal ) ;

	return new Vector3D(
		vector.x - ( this.normal.x * common ) ,
		vector.y - ( this.normal.y * common ) ,
		vector.z - ( this.normal.z * common )
	) ;
} ;



Plane3D.prototype.lineIntersection = function( boundVector , offset = 0 ) {
	// First check if the bound vector is collinear/coplanar
	// The dot product should not be zero
	var dot = this.normal.dotProduct( boundVector.vector ) ;

	if ( ! dot ) { return null ; }

	var d = this.d - offset ;
	var common = ( this.normal.dotProduct( boundVector.position ) + d ) / dot ;

	return new Vector3D(
		boundVector.position.x - ( boundVector.vector.x * common ) ,
		boundVector.position.y - ( boundVector.vector.y * common ) ,
		boundVector.position.z - ( boundVector.vector.z * common )
	) ;
} ;



// Like .lineIntersection(), but add a 't' property containing the parametric t value for the collision
Plane3D.prototype.lineIntersectionT = function( boundVector , offset ) {
	var intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }
	intersection.t = boundVector.positionT( intersection ) ;
	return intersection ;
} ;



// A trace is like a segment, collision should happen between 0 and 1
Plane3D.prototype.traceIntersection = function( boundVector , offset , maxT = 1 , _3lte = utils._3lte ) {
	var intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }

	maxT = maxT || 1 ;

	var t = boundVector.positionT( intersection ) ;
	if ( ! _3lte( 0 , t , maxT ) ) { return null ; }

	intersection.t = t ;
	return intersection ;
} ;

Plane3D.prototype.epsilonTraceIntersection = function( boundVector , offset , maxT = 1 ) {
	return this.traceIntersection( boundVector , offset , maxT , utils.e3lte ) ;
} ;



// Two planes intersect as one line
Plane3D.prototype.planeIntersection = function( plane ) {
	var common ;

	// The cross product give the vector of the line
	var line = Object.create( BoundVector3D.prototype ) ;
	line.vector = this.normal.crossProduct( plane.normal ) ;

	//if ( lineVector.isEpsilonNull() ) { return null ; }
	if ( line.vector.isNull() ) { return null ; }

	if ( line.vector.z !== 0 ) {
		common = this.normal.x * plane.normal.y - this.normal.y * plane.normal.x ;

		line.position = new Vector3D(
			( this.normal.y * plane.d - plane.normal.y * this.d ) / common ,
			( plane.normal.x * this.d - this.normal.x * plane.d ) / common ,
			0
		) ;
	}
	else if ( line.vector.y !== 0 ) {
		common = this.normal.z * plane.normal.x - this.normal.x * plane.normal.z ;

		line.position = new Vector3D(
			( plane.normal.z * this.d - this.normal.z * plane.d ) / common ,
			0 ,
			( this.normal.x * plane.d - plane.normal.x * this.d ) / common
		) ;
	}
	else {
		// x cannot be null unless line.vector is null too
		common = this.normal.y * plane.normal.z - this.normal.z * plane.normal.y ;

		line.position = new Vector3D(
			0 ,
			( this.normal.z * plane.d - plane.normal.z * this.d ) / common ,
			( plane.normal.y * this.d - this.normal.y * plane.d ) / common
		) ;
	}

	return line ;
} ;



// Alternative code, using: http://paulbourke.net/geometry/pointlineplane/
// More elegant, but slightly slower (10%)
Plane3D.prototype.planeIntersection_alt = function( plane ) {
	// The cross product give the vector of the line
	var line = Object.create( BoundVector3D.prototype ) ;
	line.vector = this.normal.crossProduct( plane.normal ) ;

	//if ( lineVector.isEpsilonNull() ) { return null ; }
	if ( line.vector.isNull() ) { return null ; }

	var dot11 = this.normal.dotProduct( this.normal ) ;
	var dot22 = plane.normal.dotProduct( plane.normal ) ;
	var dot12 = this.normal.dotProduct( plane.normal ) ;
	var determinant = dot11 * dot22 - dot12 * dot12 ;
	var c1 = ( -this.d * dot22 + plane.d * dot12 ) / determinant ;
	var c2 = ( -plane.d * dot11 + this.d * dot12 ) / determinant ;

	line.position = new Vector3D(
		c1 * this.normal.x + c2 * plane.normal.x ,
		c1 * this.normal.y + c2 * plane.normal.y ,
		c1 * this.normal.z + c2 * plane.normal.z
	) ;

	return line ;
} ;



// http://paulbourke.net/geometry/pointlineplane/
Plane3D.prototype.threePlanesIntersection = function( plane2 , plane3 ) {
	var plane1 = this ;

	var cross12 = plane1.normal.crossProduct( plane2.normal ) ;
	var cross23 = plane2.normal.crossProduct( plane3.normal ) ;
	var cross31 = plane3.normal.crossProduct( plane1.normal ) ;

	// What cost the most? this check or the denominator check?
	//if ( cross12.isNull() || cross23.isNull() || cross31.isNull() ) { return null ; }

	var denominator = plane1.normal.dot( cross23 ) ;

	if ( denominator === 0 ) { return null ; }

	return new Vector3D(
		( -plane1.d * cross23.x - plane2.d * cross31.x - plane3.d * cross12.x ) / denominator ,
		( -plane1.d * cross23.y - plane2.d * cross31.y - plane3.d * cross12.y ) / denominator ,
		( -plane1.d * cross23.z - plane2.d * cross31.z - plane3.d * cross12.z ) / denominator
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
	}
} ) ;


