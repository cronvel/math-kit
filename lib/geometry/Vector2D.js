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
const rad2deg = 360 / ( 2 * Math.PI ) ;



// Interesting functions: https://github.com/mrdoob/three.js/blob/master/src/math/Vector2.js

function Vector2D( x , y ) {
	this.x = + x ;
	this.y = + y ;
}

module.exports = Vector2D ;



// Load modules
const Vector3D = require( './Vector3D.js' ) ;



// Create a new vector from another vector or an object featuring x,y properties
Vector2D.fromObject = object => new Vector2D( object.x , object.y ) ;

// Create a new vector, starting from positional vector1 and pointing to the positional vector2
Vector2D.fromTo = ( fromVector , toVector ) => new Vector2D(
	+ toVector.x - fromVector.x ,
	+ toVector.y - fromVector.y
) ;



Vector2D.prototype.set = function( x , y ) {
	this.x = + x ;
	this.y = + y ;
	return this ;
} ;



Vector2D.prototype.setX = function( x ) {
	this.x = + x ;
	return this ;
} ;



Vector2D.prototype.setY = function( y ) {
	this.y = + y ;
	return this ;
} ;



Vector2D.prototype.setVector = function( vector ) {
	this.x = + vector.x ;
	this.y = + vector.y ;
	return this ;
} ;



Vector2D.prototype.setInvVector = function( vector ) {
	this.x = -vector.x ;
	this.y = -vector.y ;
	return this ;
} ;



Vector2D.prototype.setFromTo = function( fromVector , toVector ) {
	this.x = + toVector.x - fromVector.x ;
	this.y = + toVector.y - fromVector.y ;
	return this ;
} ;



Vector2D.prototype.set3Vectors = function( vector , addVector , subVector ) {
	this.x = + vector.x + addVector.x - subVector.x ;
	this.y = + vector.y + addVector.y - subVector.y ;
	return this ;
} ;



Vector2D.prototype.dup = function() {
	return Vector2D.fromObject( this ) ;
} ;



Vector2D.prototype.isUndefined = Vector2D.prototype.getUndefined = function() {
	return Number.isNaN( this.x ) || Number.isNaN( this.y ) ;
} ;



Vector2D.prototype.setUndefined = function() {
	this.x = this.y = NaN ;
	return this ;
} ;



Vector2D.prototype.isNull = Vector2D.prototype.getNull = function() {
	return this.x === 0 && this.y === 0 ;
} ;



Vector2D.prototype.isEpsilonNull = function() {
	return utils.eeq( this.x , 0 ) && utils.eeq( this.y , 0 ) ;
} ;



Vector2D.prototype.setNull = function() {
	this.x = this.y = 0 ;
	return this ;
} ;



Vector2D.prototype.isEqualTo = function( vector ) {
	return utils.eeq( this.x , vector.x ) && utils.eeq( this.y , vector.y ) ;
} ;



Vector2D.prototype.isInverseOf = function( vector ) {
	return utils.eeq( this.x , -vector.x ) && utils.eeq( this.y , -vector.y ) ;
} ;



Vector2D.prototype.test = function( x , y ) {
	return Math.abs( this.x - x ) + Math.abs( this.y - y ) ;
} ;



Vector2D.prototype.testVector = function( vector ) {
	return Math.abs( this.x - vector.x ) + Math.abs( this.y - vector.y ) ;
} ;



Vector2D.prototype.add = function( vector ) {
	this.x += vector.x ;
	this.y += vector.y ;

	return this ;
} ;



// addMulti( vector1 , [vector2] , [...] )
Vector2D.prototype.addMulti = function( ... args ) {
	for ( var i = 0 , l = args.length ; i < l ; i ++ ) {
		this.x += args[ i ].x ;
		this.y += args[ i ].y ;
	}

	return this ;
} ;



// Apply another vector with a rate/weight/time, useful for physics (apply a force)
Vector2D.prototype.apply = function( vector , w ) {
	this.x += vector.x * w ;
	this.y += vector.y * w ;
	return this ;
} ;



// Move along the vector for that distance
Vector2D.prototype.moveAlong = function( vector , distance ) {
	var rate = distance / utils.hypot2( vector.x , vector.y ) ;
	this.x += vector.x * rate ;
	this.y += vector.y * rate ;
	return this ;
} ;



// Move toward a position.
// Like moveAlong() but given a position rather than a vector.
// Reciprocal of moveAtDistanceOf.
Vector2D.prototype.moveToward = function( positionVector , distance ) {
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;

	var rate = distance / utils.hypot2( dx , dy ) ;

	this.x += dx * rate ;
	this.y += dy * rate ;

	return this ;
} ;



// Move a position at the distance of positionVector, along the line formed by both
Vector2D.prototype.moveAtDistanceOf = function( positionVector , distance ) {
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;

	var rate = 1 - distance / utils.hypot2( dx , dy ) ;

	this.x += dx * rate ;
	this.y += dy * rate ;

	return this ;
} ;



Vector2D.prototype.sub = function( vector ) {
	this.x -= vector.x ;
	this.y -= vector.y ;

	return this ;
} ;



Vector2D.prototype.mul = function( v ) {
	this.x *= v ;
	this.y *= v ;

	return this ;
} ;



Vector2D.prototype.div = function( v ) {
	this.x /= v ;
	this.y /= v ;

	return this ;
} ;



Vector2D.prototype.inv = function() {
	this.x = -this.x ;
	this.y = -this.y ;

	return this ;
} ;



// transform to the orthogonal vector in the trigonometric rotation (counter clockwise 90° rotation)
Vector2D.prototype.orthogonal = function() {
	var x = this.x ;
	this.x = -this.y ;
	this.y = x ;

	return this ;
} ;



Vector2D.prototype.getLength = function() {
	return utils.hypot2( this.x , this.y ) ;
} ;



Vector2D.prototype.getSquaredLength = function() {
	return this.x * this.x + this.y * this.y ;
} ;



Vector2D.prototype.setLength = function( length ) {
	if ( ! this.x && ! this.y ) { return this ; }

	var rate = Math.abs( length ) / utils.hypot2( this.x , this.y ) ;

	this.x *= rate ;
	this.y *= rate ;

	return this ;
} ;



// Limit the length of a vector
Vector2D.prototype.capLength = function( length ) {
	if ( this.x * this.x + this.y * this.y > length * length ) {
		this.setLength( length ) ;
	}

	return this ;
} ;



Vector2D.prototype.setValue = function( length ) {
	if ( ! this.x && ! this.y ) { return this ; }

	var rate = length / utils.hypot2( this.x , this.y ) ;

	this.x *= rate ;
	this.y *= rate ;

	return this ;
} ;



// E.g.: apply an absolute static friction
Vector2D.prototype.reduceLength = function( value ) {
	if ( ! this.x && ! this.y ) { return this ; }

	var length = utils.hypot2( this.x , this.y ) ;
	var rate = Math.max( 0 , length - value ) / length ;

	this.x *= rate ;
	this.y *= rate ;

	return this ;
} ;



Vector2D.prototype.normalize = Vector2D.prototype.unit = function() {
	var length = utils.hypot2( this.x , this.y ) ;

	if ( length ) {
		this.x /= length ;
		this.y /= length ;
	}

	return this ;
} ;



// Normalize only if it is needed: perform an extra check to avoid hypot() or sqrt()
Vector2D.prototype.normalizeCheck = function() {
	var length = this.x * this.x + this.y * this.y ;

	if ( length && utils.eneq( length , 1 ) ) {
		length = utils.sqHypot2( length , this.x , this.y ) ;
		this.x /= length ;
		this.y /= length ;
	}

	return this ;
} ;



Vector2D.prototype.pointDistance = function( positionVector ) {
	return utils.hypot2( positionVector.x - this.x , positionVector.y - this.y ) ;
} ;



Vector2D.prototype.pointSquaredDistance = function( positionVector ) {
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;
	return dx * dx + dy * dy ;
} ;



Vector2D.prototype.getAngle = function() {
	return Math.atan2( this.y , this.x ) ;
} ;



Vector2D.prototype.setAngle = function( angle ) {
	var length = utils.hypot2( this.x , this.y ) ;
	this.x = length * Math.cos( angle ) ;
	this.y = length * Math.sin( angle ) ;

	return this ;
} ;



Vector2D.prototype.getAngleDeg = function() {
	return rad2deg * Math.atan2( this.y , this.x ) ;
} ;



Vector2D.prototype.setAngleDeg = function( angle ) {
	var length = utils.hypot2( this.x , this.y ) ;
	angle /= rad2deg ;
	this.x = length * Math.cos( angle ) ;
	this.y = length * Math.sin( angle ) ;

	return this ;
} ;



Vector2D.prototype.rotate = function( angle ) {
	this.setAngle( this.getAngle() + angle ) ;
	return this ;
} ;



Vector2D.prototype.rotateDeg = function( angle ) {
	this.setAngle( this.getAngle() + angle / rad2deg ) ;
	return this ;
} ;



// "Produit Scalaire"
Vector2D.prototype.dot = Vector2D.prototype.dotProduct = function( vector ) {
	return this.x * vector.x  +  this.y * vector.y ;
} ;



// "Produit Vectoriel"
Vector2D.prototype.cross = Vector2D.prototype.crossProduct = function( vector ) {
	return this.x * vector.y  -  this.y * vector.x ;
} ;



Vector2D.determinant = function( u , v ) {
	return u.x * v.y  -  u.y * v.x ;
} ;



Vector2D.prototype.isCollinearTo = Vector2D.prototype.isColinearTo = function( vector ) {
	return utils.eeq( Vector2D.determinant( this , vector ) , 0 ) ;
} ;



Vector2D.prototype.isOrthogonalTo = function( vector ) {
	return ! this.isNull() && ! vector.isNull() && utils.eeq( this.dot( vector ) , 0 ) ;
} ;



// Get the angle between 2 vectors
Vector2D.prototype.angleTo = function( vector ) {
	return utils.epsilonAcos( this.dot( vector ) / ( this.getLength() * vector.getLength() ) ) ;
} ;



// Get the angle between 2 normalized vectors (faster)
Vector2D.prototype.normalizedAngleTo = function( vector ) {
	return utils.epsilonAcos( this.dot( vector ) ) ;
} ;



// Length of the argument vector after being projected on *this* vector
Vector2D.prototype.projectionLengthOf = function( vector ) {
	return Math.abs( this.dotProduct( vector ) / this.getLength() ) ;
} ;



// Same than projectionLengthOf(), but the result can be negative
Vector2D.prototype.projectionValueOf = function( vector ) {
	return this.dotProduct( vector ) / this.getLength() ;
} ;



// Projection of the argument vector on *this* vector
Vector2D.prototype.projectionOf = function( vector ) {
	var rate = this.dotProduct( vector ) / this.dotProduct( this ) ;
	return new Vector2D( this.x * rate , this.y * rate ) ;
} ;



// The "remainder" part of .decompose()
Vector2D.prototype.diffProjectionOf = function( vector ) {
	var rate = this.dotProduct( vector ) / this.dotProduct( this ) ;
	return new Vector2D( vector.x - this.x * rate , vector.y - this.y * rate ) ;
} ;



// Reciprocal of projectionOf, modify in-place
Vector2D.prototype.projectOn = function( vector ) {
	var rate = vector.dotProduct( this ) / vector.dotProduct( vector ) ;
	this.x = vector.x * rate ;
	this.y = vector.y * rate ;
	return this ;
} ;



// Reciprocal of diffProjectionOf, modify in-place
Vector2D.prototype.diffProjectOn = function( vector ) {
	var rate = vector.dotProduct( this ) / vector.dotProduct( vector ) ;
	this.x -= vector.x * rate ;
	this.y -= vector.y * rate ;
	return this ;
} ;



// Forbid a vector to go against a constraint vector (forbid negative dot-product)
Vector2D.prototype.applyDirectionalConstraint = function( vector ) {
	var dot = this.dotProduct( vector ) ;
	if ( dot >= 0 ) { return this ; }

	// .diffProjectOn() code, avoid computing dot-product twice
	var rate = dot / vector.dotProduct( vector ) ;

	this.x -= vector.x * rate ;
	this.y -= vector.y * rate ;

	return this ;
} ;



// Decompose a vector along another axis and its orthogonal
Vector2D.prototype.decompose = function( axis ) {
	var projection = axis.projectionOf( this ) ;
	var remainder = this.dup().sub( projection ) ;
	return [ projection , remainder ] ;
} ;



// Same, but assume axis is a normalized vector, and the result is put into arguments object
Vector2D.prototype.fastDecompose = function( axis , alongAxis , perpToAxis ) {
	var dot = axis.dotProduct( this ) ;
	alongAxis.set( dot * axis.x , dot * axis.y ) ;
	perpToAxis.set( this.x - alongAxis.x , this.y - alongAxis.y ) ;
} ;



// xAxis should be normalized
// If it is not normalized, it scales the transposition with its length
Vector2D.prototype.transpose = function( origin , xAxis ) {
	//*
	// First, transpose to the new origin
	this.x -= origin.x ;
	this.y -= origin.y ;

	// Then, change the orientation
	this.set(
		// Dot product
		xAxis.x * this.x + xAxis.y * this.y ,
		// Dot product of yAxis
		-xAxis.y * this.x + xAxis.x * this.y
	) ;
	//*/

	/*
	// All in one
	this.set(
		// Dot product
		xAxis.x * ( this.x - origin.x ) + xAxis.y * ( this.y - origin.y ) ,
		// Dot product of yAxis
		- xAxis.y * ( this.x - origin.x ) + xAxis.x * ( this.y - origin.y )
	) ;
	//*/

	return this ;
} ;



// Revert the transpose() operation
// xAxis should be normalized
// If it is not normalized, it scales the untransposition with its length
Vector2D.prototype.untranspose = function( origin , xAxis ) {
	/*
	// First, restore the orientation
	this.set(
		xAxis.x * this.x - xAxis.y * this.y ,
		xAxis.y * this.x + xAxis.x * this.y
	) ;

	// Then, restore to the origin
	this.x += origin.x ;
	this.y += origin.y ;
	//*/

	//*
	// All in one
	this.set(
		xAxis.x * this.x - xAxis.y * this.y + origin.x ,
		xAxis.y * this.x + xAxis.x * this.y + origin.y
	) ;
	//*/

	return this ;
} ;



// Transpose a vector 2D to a vector 3D lying on a plane coordinate defined by an origin, the plane normal and the xAxis
// xAxis and normal should be normalized and orthogonal (i.e. xAxis should belong to the plane)
Vector2D.prototype.transpose3D = function( origin , normal , xAxis ) {
	var yAxis = normal.crossProduct( xAxis ) ;

	return new Vector3D(
		origin.x + this.x * xAxis.x + this.y * yAxis.x ,
		origin.y + this.x * xAxis.y + this.y * yAxis.y ,
		origin.z + this.x * xAxis.z + this.y * yAxis.z
	) ;
} ;



// Scale the vector along an axis
// Axis should be normalized
// Used by Ellipse2D
Vector2D.prototype.fastScaleAxis = function( axis , scale ) {
	// From .fastDecompose() code:
	var dot = axis.dotProduct( this ) ;

	var alongX = dot * axis.x ;
	var alongY = dot * axis.y ;
	var perpX = this.x - alongX ;
	var perpY = this.y - alongY ;

	return this.set(
		alongX * scale + perpX ,
		alongY * scale + perpY
	) ;
} ;



// Scale the vector along an axis, from an origin point
// Axis should be normalized
// Used by Ellipse2D
Vector2D.prototype.fastScaleAxisFrom = function( origin , axis , scale ) {
	// First transpose the position to the ellipse origin
	var vx = this.x - origin.x ;
	var vy = this.y - origin.y ;

	// From .fastDecompose() code:
	var dot = axis.x * vx + axis.y * vy ;

	var alongX = dot * axis.x ;
	var alongY = dot * axis.y ;
	var perpX = vx - alongX ;
	var perpY = vy - alongY ;

	return this.set(
		alongX * scale + perpX + origin.x ,
		alongY * scale + perpY + origin.y
	) ;
} ;



// Getters/Setters
Object.defineProperties( Vector2D.prototype , {
	undefined: {
		get: Vector2D.prototype.getUndefined ,
		set: Vector2D.prototype.setUndefined
	} ,
	null: {
		get: Vector2D.prototype.getNull ,
		set: Vector2D.prototype.setNull
	} ,
	length: {
		get: Vector2D.prototype.getLength ,
		set: Vector2D.prototype.setLength
	} ,
	squaredLength: {
		get: Vector2D.prototype.getSquaredLength
	} ,
	angle: {
		get: Vector2D.prototype.getAngle ,
		set: Vector2D.prototype.setAngle
	} ,
	angleDeg: {
		get: Vector2D.prototype.getAngleDeg ,
		set: Vector2D.prototype.setAngleDeg
	}
} ) ;


