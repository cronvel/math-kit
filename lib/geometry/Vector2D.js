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



// Interesting functions: https://github.com/mrdoob/three.js/blob/master/src/math/Vector2.js

function Vector2D( x , y ) {
	this.x = + x ;
	this.y = + y ;
}

module.exports = Vector2D ;

const Vector3D = require( './Vector3D.js' ) ;
const Matrix = require( '../Matrix.js' ) ;



// For faster computing, we re-use some matrix
const REUSABLE_VECTOR_MATRIX = new Matrix( 2 , 1 ) ;
const REUSABLE_OUTPUT_VECTOR_MATRIX = new Matrix( 2 , 1 ) ;



// Create a new vector from another vector
Vector2D.fromVector = vector => new Vector2D( vector.x , vector.y ) ;



// Create a new vector from an arbitrary object featuring x,y properties or xy
Vector2D.fromObject = object => {
	var vector = new Vector2D() ;
	vector.setObject( object ) ;
	return vector ;
} ;



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



// Set using an object with partial data, or even shorthand like 'xy'
Vector2D.prototype.setObject = function( object ) {
	if ( object.xy !== undefined ) {
		this.x = + object.xy ;
		this.y = + object.xy ;
	}
	else {
		if ( object.x !== undefined ) { this.x = + object.x ; }
		if ( object.y !== undefined ) { this.y = + object.y ; }
	}

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



Vector2D.prototype.matrix = function() { return new Matrix( 2 , 1 , [ this.x , this.y ] ) ; } ;
Vector2D.fromMatrix = matrix => new Vector2D( matrix.get0( 0 , 0 ) , matrix.get0( 1 , 0 ) ) ;



Vector2D.prototype.setMatrix = function( matrix ) {
	this.x = matrix.get0( 0 , 0 ) ;
	this.y = matrix.get0( 1 , 0 ) ;
} ;



Vector2D.prototype.dup = Vector2D.prototype.clone = function() {
	return new Vector2D( this.x , this.y ) ;
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



Vector2D.prototype.reset = Vector2D.prototype.setNull = function() {
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



// Apply another vector/velocity with a rate/weight/time, useful for physics (apply a force)
Vector2D.prototype.apply = function( velocity , dt ) {
	this.x += velocity.x * dt ;
	this.y += velocity.y * dt ;
	return this ;
} ;

Vector2D.prototype.setApply = function( base , velocity , dt ) {
	this.x = base.x + velocity.x * dt ;
	this.y = base.y + velocity.y * dt ;
	return this ;
} ;



// Useful for Velocity Verlet or Leap
Vector2D.prototype.applyMid = function( velocity1 , velocity2 , dt ) {
	var dt_2 = 0.5 * dt ;
	this.x += ( velocity1.x + velocity2.x ) * dt_2 ;
	this.y += ( velocity1.y + velocity2.y ) * dt_2 ;
	return this ;
} ;

Vector2D.prototype.setApplyMid = function( base , velocity1 , velocity2 , dt ) {
	var dt_2 = 0.5 * dt ;
	this.x = base.x + ( velocity1.x + velocity2.x ) * dt_2 ;
	this.y = base.y + ( velocity1.y + velocity2.y ) * dt_2 ;
	return this ;
} ;



// Apply velocity and constant acceleration during dt second
Vector2D.prototype.apply2 = function( velocity , acceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ;
	this.x += velocity.x * dt + acceleration.x * dt2_2 ;
	this.y += velocity.y * dt + acceleration.y * dt2_2 ;
	return this ;
} ;

Vector2D.prototype.setApply2 = function( base , velocity , acceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ;
	this.x = base.x + velocity.x * dt + acceleration.x * dt2_2 ;
	this.y = base.y + velocity.y * dt + acceleration.y * dt2_2 ;
	return this ;
} ;



// Apply velocity and an accelerating acceleration during dt second
Vector2D.prototype.apply3 = function( velocity , acceleration , dAcceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ,
		dt3_6 = dt2_2 * dt / 3 ;
	this.x += velocity.x * dt + acceleration.x * dt2_2 + dAcceleration.x * dt3_6 ;
	this.y += velocity.y * dt + acceleration.y * dt2_2 + dAcceleration.y * dt3_6 ;
	return this ;
} ;

Vector2D.prototype.setApply3 = function( base , velocity , acceleration , dAcceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ,
		dt3_6 = dt2_2 * dt / 3 ;
	this.x = base.x + velocity.x * dt + acceleration.x * dt2_2 + dAcceleration.x * dt3_6 ;
	this.y = base.y + velocity.y * dt + acceleration.y * dt2_2 + dAcceleration.y * dt3_6 ;
	return this ;
} ;



// Useful to differentiate a vector over dt
Vector2D.prototype.setFromToDelta = function( fromVector , toVector , dt ) {
	this.x = ( toVector.x - fromVector.x ) / dt ;
	this.y = ( toVector.y - fromVector.y ) / dt ;
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

// Set to a vector multiplied by a scalar in one operation
Vector2D.prototype.setMul = function( vector , w ) {
	this.x = + vector.x * w ;
	this.y = + vector.y * w ;

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



Vector2D.prototype.getNorm =
Vector2D.prototype.getRadius =
Vector2D.prototype.getLength = function() {
	return utils.hypot2( this.x , this.y ) ;
} ;



Vector2D.prototype.getSquaredLength = function() {
	return this.x * this.x + this.y * this.y ;
} ;



Vector2D.prototype.setNorm =
Vector2D.prototype.setRadius =
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
	return utils.RAD_TO_DEG * Math.atan2( this.y , this.x ) ;
} ;



Vector2D.prototype.setAngleDeg = function( angle ) {
	var length = utils.hypot2( this.x , this.y ) ;
	angle *= utils.DEG_TO_RAD ;
	this.x = length * Math.cos( angle ) ;
	this.y = length * Math.sin( angle ) ;

	return this ;
} ;



// Because it's way faster to set all of them at once
Vector2D.prototype.setRadiusAngle = function( radius , angle ) {
	this.x = radius * Math.cos( angle ) ;
	this.y = radius * Math.sin( angle ) ;
	return this ;
} ;



// Because it's way faster to set all of them at once
Vector2D.prototype.setRadiusAngleDeg = function( radius , angle ) {
	angle *= utils.DEG_TO_RAD ;
	this.x = radius * Math.cos( angle ) ;
	this.y = radius * Math.sin( angle ) ;
	return this ;
} ;



Vector2D.prototype.rotate = function( angle ) {
	this.setAngle( this.getAngle() + angle ) ;
	return this ;
} ;



Vector2D.prototype.rotateDeg = function( angle ) {
	this.setAngle( this.getAngle() + angle * utils.DEG_TO_RAD ) ;
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
	var rate = this.dotProduct( vector ) / this.getSquaredLength() ;
	return new Vector2D( this.x * rate , this.y * rate ) ;
} ;



// The "remainder" part of .decompose()
Vector2D.prototype.diffProjectionOf = function( vector ) {
	var rate = this.dotProduct( vector ) / this.getSquaredLength() ;
	return new Vector2D( vector.x - this.x * rate , vector.y - this.y * rate ) ;
} ;



// Reciprocal of projectionOf, modify in-place
Vector2D.prototype.projectOn = function( vector ) {
	var rate = vector.dotProduct( this ) / vector.getSquaredLength() ;
	this.x = vector.x * rate ;
	this.y = vector.y * rate ;
	return this ;
} ;



// Reciprocal of diffProjectionOf, modify in-place
Vector2D.prototype.diffProjectOn = function( vector ) {
	var rate = vector.dotProduct( this ) / vector.getSquaredLength() ;
	this.x -= vector.x * rate ;
	this.y -= vector.y * rate ;
	return this ;
} ;



// Forbid a vector to go against a constraint vector (forbid negative dot-product)
Vector2D.prototype.applyDirectionalConstraint = function( constraintVector ) {
	var dot = this.dotProduct( constraintVector ) ;
	if ( dot >= 0 ) { return this ; }

	// .diffProjectOn() code, avoid computing dot-product twice
	var rate = dot / constraintVector.getSquaredLength() ;

	this.x -= constraintVector.x * rate ;
	this.y -= constraintVector.y * rate ;

	return this ;
} ;

Vector2D.prototype.applyDirectionalNormalizedConstraint = function( constraintVector ) {
	var dot = this.dotProduct( constraintVector ) ;
	if ( dot >= 0 ) { return this ; }

	this.x -= constraintVector.x * dot ;
	this.y -= constraintVector.y * dot ;

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



// Apply a transformation matrix, e.g. multiply the matrix by the vector.
// If "into" vector is specified, the transformation result is stored in that object instead affecting self.
Vector2D.prototype.transform = function( matrix , into = this ) {
	REUSABLE_VECTOR_MATRIX.a[ 0 ] = this.x ;
	REUSABLE_VECTOR_MATRIX.a[ 1 ] = this.y ;
	matrix.fastMultiplyByMatrix( REUSABLE_VECTOR_MATRIX , REUSABLE_OUTPUT_VECTOR_MATRIX ) ;
	into.x = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 0 ] ;
	into.y = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 1 ] ;
	return into ;
} ;



// Like .transform() but for affine matrix, supporting non-linear transformation (=translation)
Vector2D.prototype.affineTransform = function( matrix , into = this ) {
	REUSABLE_VECTOR_MATRIX.a[ 0 ] = this.x ;
	REUSABLE_VECTOR_MATRIX.a[ 1 ] = this.y ;
	matrix.fastMultiplyByAffineMatrix( REUSABLE_VECTOR_MATRIX , REUSABLE_OUTPUT_VECTOR_MATRIX ) ;
	into.x = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 0 ] ;
	into.y = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 1 ] ;
	return into ;
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
	norm: {
		get: Vector2D.prototype.getNorm ,
		set: Vector2D.prototype.setNorm
	} ,
	radius: {
		get: Vector2D.prototype.getRadius ,
		set: Vector2D.prototype.setRadius
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



// Tracer generator for the boundVector: a segment
Vector2D.prototype.tracer = function*() {
	yield {
		x: this.x ,
		y: this.y
	} ;
} ;

