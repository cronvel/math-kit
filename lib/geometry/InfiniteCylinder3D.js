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
	A InfiniteCylinder3D is a 3D line with a radius.

	* axis: BoundVector3D.
	* r: radius of the cylinder.
*/

function InfiniteCylinder3D( x , y , z , nx , ny , nz , r ) {
	this.axis = new BoundVector3D( x , y , z , nx , ny , nz ).normalizeCheck() ;
	this.r = + r ;
}

module.exports = InfiniteCylinder3D ;

//const Sphere3D = require( './Sphere3D.js' ) ;
//const Vector3D = require( './Vector3D.js' ) ;
const Circle2D = require( './Circle2D.js' ) ;
const Circle3D = require( './Circle3D.js' ) ;
const Ellipse3D = require( './Ellipse3D.js' ) ;
const BoundVector3D = require( './BoundVector3D.js' ) ;



InfiniteCylinder3D.fromObject = object => new InfiniteCylinder3D(
	object.axis.position.x ,
	object.axis.position.y ,
	object.axis.position.z ,
	object.axis.vector.x ,
	object.axis.vector.y ,
	object.axis.vector.z ,
	object.r
) ;

InfiniteCylinder3D.fromVectorsRadius = ( position , vector , r ) => new InfiniteCylinder3D(
	position.x ,
	position.y ,
	position.z ,
	vector.x ,
	vector.y ,
	vector.z ,
	r
) ;

// Since Circle3D share EXACTLY the same type of data, but with a different hierarchy...
InfiniteCylinder3D.fromCircle = circle => new InfiniteCylinder3D(
	circle.center.x ,
	circle.center.y ,
	circle.center.z ,
	circle.planeNormal.x ,
	circle.planeNormal.y ,
	circle.planeNormal.z ,
	circle.r
) ;



InfiniteCylinder3D.prototype.set = function( x , y , z , nx , ny , nz , r ) {
	this.axis.set( x , y , z , nx , ny , nz ).normalizeCheck() ;
	this.r = + r ;

	return this ;
} ;



InfiniteCylinder3D.prototype.setCylinder = function( cylinder ) {
	this.axis.setBoundVector( cylinder.axis ).normalizeCheck() ;
	this.r = + cylinder.r ;

	return this ;
} ;



InfiniteCylinder3D.prototype.setVectorsRadius = function( position , vector , r ) {
	this.axis.setVectors( position , vector ).normalizeCheck() ;
	this.r = + r ;

	return this ;
} ;



// Since Circle3D share EXACTLY the same type of data, but with a different hierarchy...
InfiniteCylinder3D.prototype.setCircle = function( circle ) {
	this.axis.setVectors( circle.center , circle.planeNormal ).normalizeCheck() ;
	this.r = + circle.r ;

	return this ;
} ;



InfiniteCylinder3D.prototype.dup = InfiniteCylinder3D.prototype.clone = function() {
	return InfiniteCylinder3D.fromObject( this ) ;
} ;



// Test if a position is inside the infinite cylinder area
InfiniteCylinder3D.prototype.test = function( x , y , z ) {
	// Using BoundVector3D#pointProjection() code again:
	var dx = x - this.axis.position.x ;
	var dy = y - this.axis.position.y ;
	var dz = z - this.axis.position.z ;

	// dot products...
	var t = ( dx * this.axis.vector.x + dy * this.axis.vector.y + dz * this.axis.vector.z ) /
		( this.axis.vector.dot( this.axis.vector ) ) ;
		//( this.axis.vector.x * this.axis.vector.x + this.axis.vector.y * this.axis.vector.y + this.axis.vector.z * this.axis.vector.z ) ;

	dx = this.axis.vector.x * t - dx ;
	dy = this.axis.vector.y * t - dy ;
	dz = this.axis.vector.z * t - dz ;

	return dx * dx + dy * dy + dz * dz - this.r * this.r ;
} ;



// Same with a vector
InfiniteCylinder3D.prototype.testVector = function( positionVector ) {
	return this.test( positionVector.x , positionVector.y , positionVector.z ) ;
} ;



InfiniteCylinder3D.prototype.normalizedTest = function( x , y , z ) {
	// Using BoundVector3D#pointProjection() code again:
	var dx = x - this.axis.position.x ;
	var dy = y - this.axis.position.y ;
	var dz = z - this.axis.position.z ;

	// dot products...
	var t = ( dx * this.axis.vector.x + dy * this.axis.vector.y + dz * this.axis.vector.z ) /
		( this.axis.vector.dot( this.axis.vector ) ) ;
		//( this.axis.vector.x * this.axis.vector.x + this.axis.vector.y * this.axis.vector.y + this.axis.vector.z * this.axis.vector.z ) ;

	dx = this.axis.vector.x * t - dx ;
	dy = this.axis.vector.y * t - dy ;
	dz = this.axis.vector.z * t - dz ;

	return utils.hypot3( dx , dy , dz ) - this.r ;
} ;



// Same with a vector
InfiniteCylinder3D.prototype.normalizedTestVector = function( positionVector ) {
	return this.normalizedTest( positionVector.x , positionVector.y , positionVector.z ) ;
} ;



// Normalize a test value that was produced by .test() or .testVector()
InfiniteCylinder3D.prototype.normalizeTest = function( testValue ) {
	return Math.sqrt( testValue + this.r * this.r ) - this.r ;
} ;



/*
InfiniteCylinder3D.prototype.isOnCylinder = function( positionVector )
{
	return utils.eeq( this.testVector( positionVector ) , 0 ) ;
} ;



InfiniteCylinder3D.prototype.isInsideCylinder = function( positionVector )
{
	return utils.elte( this.testVector( positionVector ) , 0 ) ;
} ;
*/



InfiniteCylinder3D.prototype.pointProjection = function( positionVector ) {
	// First project on the 3D line...
	var projected = this.axis.pointProjection( positionVector ) ;

	// Then move it toward the given position, at the correct distance
	return projected.moveToward( positionVector , this.r ) ;
} ;



// Common part: return the 2D transposed points
InfiniteCylinder3D.prototype._lineIntersection = function( boundVector , offset ) {
	// axis.vector MUST be normalized

	// Create a vector that is orthogonal to the normal
	var xAxis = this.axis.vector.getAnyOrthogonal().normalize() ;

	// Transpose to 2D, find the intersection times:
	// the t value at intersection for the transposed parametric boundVector
	var boundVector2D = boundVector.transpose2D( this.axis.position , this.axis.vector , xAxis ) ;
	if ( boundVector2D.vector.isNull() ) { return null ; }

	return new Circle2D( 0 , 0 , this.r ).lineIntersectionT( boundVector2D , offset ) ;
} ;



InfiniteCylinder3D.prototype.lineIntersection = function( boundVector , offset ) {
	var intersection = this._lineIntersection( boundVector , offset ) ;

	if ( ! intersection ) { return null ; }

	// If there are some points, then use the t values and apply them to the original 3D vector
	intersection[ 0 ] = boundVector.tPosition( intersection[ 0 ].t ) ;
	if ( intersection[ 1 ] ) { intersection[ 1 ] = boundVector.tPosition( intersection[ 1 ].t ) ; }

	return intersection ;
} ;



// Like .lineIntersection(), but add a 't' property containing the parametric t value for the collision
InfiniteCylinder3D.prototype.lineIntersectionT = function( boundVector , offset ) {
	var intersection = this._lineIntersection( boundVector , offset ) ;

	if ( ! intersection ) { return null ; }

	// If there are some points, then use the t values and apply them to the original 3D vector
	var t = intersection[ 0 ].t ;
	intersection[ 0 ] = boundVector.tPosition( t ) ;
	intersection[ 0 ].t = t ;

	if ( intersection[ 1 ] ) {
		t = intersection[ 1 ].t ;
		intersection[ 1 ] = boundVector.tPosition( t ) ;
		intersection[ 1 ].t = t ;
	}

	return intersection ;
} ;



// A trace is like a segment, collision should happen between 0 and 1,
// when there are two intersections, only the one with the smallest 't' is returned
InfiniteCylinder3D.prototype.traceIntersection = function( boundVector , offset , maxT = 1 , _3lte = utils._3lte ) {
	var t , intersection = this._lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }

	maxT = maxT || 1 ;

	if ( ! _3lte( 0 , intersection[ 0 ].t , maxT ) ) {
		// First intersection is out of range
		if ( intersection.length === 1 ) { return null ; }

		if ( ! _3lte( 0 , intersection[ 1 ].t , maxT ) ) { return null ; }

		t = intersection[ 1 ].t ;
		intersection[ 1 ] = boundVector.tPosition( t ) ;
		intersection[ 1 ].t = t ;
		return intersection[ 1 ] ;
	}
	else if ( intersection.length === 1 ) {
		// First intersection is in range, and there is no other intersection
		t = intersection[ 0 ].t ;
		intersection[ 0 ] = boundVector.tPosition( t ) ;
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}

	// Two intersections, the first is valid, check the second one

	if ( intersection[ 1 ].t > intersection[ 0 ].t || ! _3lte( 0 , intersection[ 1 ].t , maxT ) ) {
		// Second intersection is out of range, or happens after the first, return the first
		t = intersection[ 0 ].t ;
		intersection[ 0 ] = boundVector.tPosition( t ) ;
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}

	t = intersection[ 1 ].t ;
	intersection[ 1 ] = boundVector.tPosition( t ) ;
	intersection[ 1 ].t = t ;
	return intersection[ 1 ] ;
} ;

InfiniteCylinder3D.prototype.epsilonTraceIntersection = function( boundVector , offset , maxT = 1 ) {
	return this.traceIntersection( boundVector , offset , maxT , utils.e3lte ) ;
} ;



// Intersection of an infinite cylinder and a plane: return an Ellipse3D, a Circle3D or null
InfiniteCylinder3D.prototype.planeIntersection = function( plane ) {
	var center , majorAxis , semiMajor , dot ;

	dot = this.axis.vector.dot( plane.normal ) ;

	if ( utils.eeq( dot , 0 ) ) {
		// Does not intersect: the plane normal is perp to the cylinder axis
		return null ;
	}
	else if ( utils.eeq( Math.abs( dot ) , 1 ) ) {
		// Intersection is a circle: the plane normal is collinear to the cylinder axis
		center = plane.lineIntersection( this.axis ) ;
		return Circle3D.fromVectorsRadius( center , this.axis.vector , this.r ) ;
	}

	// Intersection is an ellipse
	majorAxis = plane.vectorProjection( this.axis.vector ).normalize() ;
	center = plane.lineIntersection( this.axis ) ;
	semiMajor = this.r / dot ;

	return Ellipse3D.fromVectorsAxis( center , plane.normal , majorAxis , semiMajor , this.r ) ;

} ;


