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



// Interesting functions: https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js

function Vector3D( x , y , z ) {
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
}

module.exports = Vector3D ;

const math = require( '../math.js' ) ;
const Vector2D = require( './Vector2D.js' ) ;
const Matrix = require( '../Matrix.js' ) ;
const Quaternion = require( '../Quaternion.js' ) ;



// For faster computing, we re-use some matrix
const REUSABLE_VECTOR = new Vector3D() ;
const REUSABLE_VECTOR_FROM_QUATERNION = new Vector3D() ;
const REUSABLE_VECTOR_CROSS = new Vector3D() ;
const REUSABLE_VECTOR_MATRIX = new Matrix( 3 , 1 ) ;
const REUSABLE_OUTPUT_VECTOR_MATRIX = new Matrix( 3 , 1 ) ;
const REUSABLE_VECTOR_QUATERNION = new Quaternion( 0 , 0 , 0 , 1 ) ;
const REUSABLE_OUTPUT_VECTOR_QUATERNION = new Quaternion( 0 , 0 , 0 , 1 ) ;



// Create a new vector from another vector
Vector3D.fromVector = vector => new Vector3D( vector.x , vector.y , vector.z ) ;



// Create a new vector from an arbitrary object featuring x,y,z properties, or things like xy, or xyz
Vector3D.fromObject = object => {
	var vector = new Vector3D() ;
	vector.setObject( object ) ;
	return vector ;
} ;



// Create a new vector, starting from positional vector1 and pointing to the positional vector2
Vector3D.fromTo = ( fromVector , toVector ) => new Vector3D(
	+ toVector.x - fromVector.x ,
	+ toVector.y - fromVector.y ,
	+ toVector.z - fromVector.z
) ;



Vector3D.prototype.set = function( x , y , z ) {
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	return this ;
} ;



Vector3D.prototype.setX = function( x ) {
	this.x = + x ;
	return this ;
} ;



Vector3D.prototype.setY = function( y ) {
	this.y = + y ;
	return this ;
} ;



Vector3D.prototype.setZ = function( z ) {
	this.z = + z ;
	return this ;
} ;



Vector3D.prototype.setVector = function( vector ) {
	this.x = + vector.x ;
	this.y = + vector.y ;
	this.z = + vector.z ;
	return this ;
} ;



// Set using an object with partial data, or even shorthand like 'xy' or 'xyz'
Vector3D.prototype.setObject = function( object ) {
	if ( object.xyz !== undefined ) {
		this.x = + object.xyz ;
		this.y = + object.xyz ;
		this.z = + object.xyz ;
	}
	else if ( object.xy !== undefined ) {
		this.x = + object.xy ;
		this.y = + object.xy ;
		if ( object.z !== undefined ) { this.z = + object.z ; }
	}
	else {
		if ( object.x !== undefined ) { this.x = + object.x ; }
		if ( object.y !== undefined ) { this.y = + object.y ; }
		if ( object.z !== undefined ) { this.z = + object.z ; }
	}

	return this ;
} ;



Vector3D.prototype.setInvVector = function( vector ) {
	this.x = -vector.x ;
	this.y = -vector.y ;
	this.z = -vector.z ;
	return this ;
} ;



Vector3D.prototype.setFromTo = function( fromVector , toVector ) {
	this.x = + toVector.x - fromVector.x ;
	this.y = + toVector.y - fromVector.y ;
	this.z = + toVector.z - fromVector.z ;
	return this ;
} ;



Vector3D.prototype.set3Vectors = function( vector , addVector , subVector ) {
	this.x = + vector.x + addVector.x - subVector.x ;
	this.y = + vector.y + addVector.y - subVector.y ;
	this.z = + vector.z + addVector.z - subVector.z ;
	return this ;
} ;



Vector3D.prototype.matrix = function() { return new Matrix( 3 , 1 , [ this.x , this.y , this.z ] ) ; } ;
Vector3D.fromMatrix = matrix => new Vector3D( matrix.get0( 0 , 0 ) , matrix.get0( 1 , 0 ) , matrix.get0( 2 , 0 ) ) ;



Vector3D.prototype.setMatrix = function( matrix ) {
	this.x = matrix.get0( 0 , 0 ) ;
	this.y = matrix.get0( 1 , 0 ) ;
	this.z = matrix.get0( 2 , 0 ) ;
} ;



Vector3D.prototype.dup = Vector3D.prototype.clone = function() {
	return new Vector3D( this.x , this.y , this.z ) ;
} ;



Vector3D.prototype.isUndefined = Vector3D.prototype.getUndefined = function() {
	return Number.isNaN( this.x ) || Number.isNaN( this.y ) || Number.isNaN( this.z ) ;
} ;



Vector3D.prototype.setUndefined = function() {
	this.x = this.y = this.z = NaN ;
	return this ;
} ;



Vector3D.prototype.isNull = Vector3D.prototype.getNull = function() {
	return this.x === 0 && this.y === 0 && this.z === 0 ;
} ;



Vector3D.prototype.isEpsilonNull = function() {
	return utils.eeq( this.x , 0 ) && utils.eeq( this.y , 0 ) && utils.eeq( this.z , 0 ) ;
} ;



Vector3D.prototype.reset = Vector3D.prototype.setNull = function() {
	this.x = this.y = this.z = 0 ;
	return this ;
} ;



Vector3D.prototype.isEqualTo = function( vector ) {
	return utils.eeq( this.x , vector.x ) && utils.eeq( this.y , vector.y ) && utils.eeq( this.z , vector.z ) ;
} ;



Vector3D.prototype.isInverseOf = function( vector ) {
	return utils.eeq( this.x , -vector.x ) && utils.eeq( this.y , -vector.y ) && utils.eeq( this.z , -vector.z ) ;
} ;



Vector3D.prototype.test = function( x , y , z ) {
	return Math.abs( this.x - x ) + Math.abs( this.y - y ) + Math.abs( this.z - z ) ;
} ;



Vector3D.prototype.testVector = function( vector ) {
	return Math.abs( this.x - vector.x ) + Math.abs( this.y - vector.y ) + Math.abs( this.z - vector.z ) ;
} ;



Vector3D.prototype.add = function( vector ) {
	this.x += vector.x ;
	this.y += vector.y ;
	this.z += vector.z ;

	return this ;
} ;



// addMulti( vector1 , [vector2] , [...] )
Vector3D.prototype.addMulti = function( ... args ) {
	for ( var i = 0 , l = args.length ; i < l ; i ++ ) {
		this.x += args[ i ].x ;
		this.y += args[ i ].y ;
		this.z += args[ i ].z ;
	}

	return this ;
} ;



// Apply another vector/velocity with a rate/weight/time, useful for physics (apply a force)
Vector3D.prototype.apply = function( velocity , dt ) {
	this.x += velocity.x * dt ;
	this.y += velocity.y * dt ;
	this.z += velocity.z * dt ;
	return this ;
} ;

Vector3D.prototype.setApply = function( base , velocity , dt ) {
	this.x = base.x + velocity.x * dt ;
	this.y = base.y + velocity.y * dt ;
	this.z = base.z + velocity.z * dt ;
	return this ;
} ;



// Useful for Velocity Verlet or Leap
Vector3D.prototype.applyMid = function( velocity1 , velocity2 , dt ) {
	var dt_2 = 0.5 * dt ;
	this.x += ( velocity1.x + velocity2.x ) * dt_2 ;
	this.y += ( velocity1.y + velocity2.y ) * dt_2 ;
	this.z += ( velocity1.z + velocity2.z ) * dt_2 ;
	return this ;
} ;

Vector3D.prototype.setApplyMid = function( base , velocity1 , velocity2 , dt ) {
	var dt_2 = 0.5 * dt ;
	this.x = base.x + ( velocity1.x + velocity2.x ) * dt_2 ;
	this.y = base.y + ( velocity1.y + velocity2.y ) * dt_2 ;
	this.z = base.z + ( velocity1.z + velocity2.z ) * dt_2 ;
	return this ;
} ;



// Apply velocity and constant acceleration during dt second
Vector3D.prototype.apply2 = function( velocity , acceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ;
	this.x += velocity.x * dt + acceleration.x * dt2_2 ;
	this.y += velocity.y * dt + acceleration.y * dt2_2 ;
	this.z += velocity.z * dt + acceleration.z * dt2_2 ;
	return this ;
} ;

Vector3D.prototype.setApply2 = function( base , velocity , acceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ;
	this.x = base.x + velocity.x * dt + acceleration.x * dt2_2 ;
	this.y = base.y + velocity.y * dt + acceleration.y * dt2_2 ;
	this.z = base.z + velocity.z * dt + acceleration.z * dt2_2 ;
	return this ;
} ;



// Apply velocity and an accelerating acceleration during dt second
Vector3D.prototype.apply3 = function( velocity , acceleration , dAcceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ,
		dt3_6 = dt2_2 * dt / 3 ;
	this.x += velocity.x * dt + acceleration.x * dt2_2 + dAcceleration.x * dt3_6 ;
	this.y += velocity.y * dt + acceleration.y * dt2_2 + dAcceleration.y * dt3_6 ;
	this.z += velocity.z * dt + acceleration.z * dt2_2 + dAcceleration.z * dt3_6 ;
	return this ;
} ;

Vector3D.prototype.setApply3 = function( base , velocity , acceleration , dAcceleration , dt ) {
	var dt2_2 = 0.5 * dt * dt ,
		dt3_6 = dt2_2 * dt / 3 ;
	this.x = base.x + velocity.x * dt + acceleration.x * dt2_2 + dAcceleration.x * dt3_6 ;
	this.y = base.y + velocity.y * dt + acceleration.y * dt2_2 + dAcceleration.y * dt3_6 ;
	this.z = base.z + velocity.z * dt + acceleration.z * dt2_2 + dAcceleration.z * dt3_6 ;
	return this ;
} ;



// Useful to differentiate a vector over dt
Vector3D.prototype.setFromToDelta = function( fromVector , toVector , dt ) {
	this.x = ( toVector.x - fromVector.x ) / dt ;
	this.y = ( toVector.y - fromVector.y ) / dt ;
	this.z = ( toVector.z - fromVector.z ) / dt ;
	return this ;
} ;



// Move along the vector for that distance
Vector3D.prototype.moveAlong = function( vector , distance ) {
	var rate = distance / utils.hypot3( vector.x , vector.y , vector.z ) ;
	this.x += vector.x * rate ;
	this.y += vector.y * rate ;
	this.z += vector.z * rate ;
	return this ;
} ;



// Move toward a position.
// Like moveAlong() but given a position rather than a vector.
// Reciprocal of moveAtDistanceOf.
Vector3D.prototype.moveToward = function( positionVector , distance ) {
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;
	var dz = positionVector.z - this.z ;

	var rate = distance / utils.hypot3( dx , dy , dz ) ;

	this.x += dx * rate ;
	this.y += dy * rate ;
	this.z += dz * rate ;

	return this ;
} ;



// Move a position at the distance of positionVector, along the line formed by both
Vector3D.prototype.moveAtDistanceOf = function( positionVector , distance ) {
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;
	var dz = positionVector.z - this.z ;

	var rate = 1 - distance / utils.hypot3( dx , dy , dz ) ;

	this.x += dx * rate ;
	this.y += dy * rate ;
	this.z += dz * rate ;

	return this ;
} ;



Vector3D.prototype.sub = function( vector ) {
	this.x -= vector.x ;
	this.y -= vector.y ;
	this.z -= vector.z ;

	return this ;
} ;



Vector3D.prototype.mul = function( v ) {
	this.x *= v ;
	this.y *= v ;
	this.z *= v ;

	return this ;
} ;

// Set to a vector multiplied by a scalar in one operation
Vector3D.prototype.setMul = function( vector , w ) {
	this.x = + vector.x * w ;
	this.y = + vector.y * w ;
	this.z = + vector.z * w ;

	return this ;
} ;



Vector3D.prototype.div = function( v ) {
	this.x /= v ;
	this.y /= v ;
	this.z /= v ;

	return this ;
} ;



Vector3D.prototype.inv = function() {
	this.x = -this.x ;
	this.y = -this.y ;
	this.z = -this.z ;

	return this ;
} ;



// produce a vector that is orthogonal, do not preserve length
Vector3D.prototype.getAnyOrthogonal = function() {
	var xabs , yabs ;

	// Nullify the smallest axis distance for better precision
	if ( ( xabs = Math.abs( this.x ) ) < ( yabs = Math.abs( this.y ) ) ) {
		if ( xabs < Math.abs( this.z ) ) {
			return new Vector3D( 0 , -this.z , this.y ) ;
		}

		return new Vector3D( -this.y , this.x , 0 ) ;

	}
	else if ( yabs < Math.abs( this.z ) ) {
		return new Vector3D( this.z , 0 , -this.x ) ;
	}

	return new Vector3D( -this.y , this.x , 0 ) ;

} ;



Vector3D.prototype.getNorm =
Vector3D.prototype.getRadius =
Vector3D.prototype.getLength = function() {
	return utils.hypot3( this.x , this.y , this.z ) ;
} ;



Vector3D.prototype.getSquaredLength = function() {
	return this.x * this.x + this.y * this.y + this.z * this.z ;
} ;



Vector3D.prototype.setNorm =
Vector3D.prototype.setRadius =
Vector3D.prototype.setLength = function( length ) {
	if ( ! this.x && ! this.y && ! this.z ) { return this ; }

	var rate = Math.abs( length ) / utils.hypot3( this.x , this.y , this.z ) ;

	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;

	return this ;
} ;



// Limit the length of a vector
Vector3D.prototype.capLength = function( length ) {
	if ( this.x * this.x + this.y * this.y + this.z * this.z > length * length ) {
		this.setLength( length ) ;
	}

	return this ;
} ;



Vector3D.prototype.setValue = function( length ) {
	if ( ! this.x && ! this.y && ! this.z ) { return this ; }

	var rate = length / utils.hypot3( this.x , this.y , this.z ) ;

	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;

	return this ;
} ;



// E.g.: apply an absolute static friction
Vector3D.prototype.reduceLength = function( value ) {
	if ( ! this.x && ! this.y && ! this.z ) { return this ; }

	var length = utils.hypot3( this.x , this.y , this.z ) ;
	var rate = Math.max( 0 , length - value ) / length ;
	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;

	return this ;
} ;



Vector3D.prototype.normalize = Vector3D.prototype.unit = function() {
	var length = utils.hypot3( this.x , this.y , this.z ) ;

	if ( length ) {
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
	}

	return this ;
} ;



// Normalize only if it is needed: perform an extra check to avoid hypot() or sqrt()
Vector3D.prototype.normalizeCheck = function() {
	var length = this.x * this.x + this.y * this.y + this.z * this.z ;

	if ( length && utils.eneq( length , 1 ) ) {
		length = utils.sqHypot3( length , this.x , this.y , this.z ) ;
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
	}

	return this ;
} ;



Vector3D.prototype.pointDistance = function( positionVector ) {
	return utils.hypot3( positionVector.x - this.x , positionVector.y - this.y , positionVector.z - this.z ) ;
} ;



Vector3D.prototype.pointSquaredDistance = function( positionVector ) {
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;
	var dz = positionVector.z - this.z ;
	return dx * dx + dy * dy + dz * dz ;
} ;



Vector3D.prototype.getAzimuth = Vector3D.prototype.getAzimuthZUp =
Vector3D.prototype.getYaw = Vector3D.prototype.getYawZUp = function() {
	return Math.atan2( this.y , this.x ) ;
} ;

Vector3D.prototype.getAzimuthYUp =
Vector3D.prototype.getYawYUp = function() {
	return Math.atan2( this.z , this.x ) ;
} ;

Vector3D.prototype.getAzimuthDeg = Vector3D.prototype.getAzimuthZUpDeg =
Vector3D.prototype.getYawDeg = Vector3D.prototype.getYawZUpDeg = function() {
	return utils.RAD_TO_DEG * Math.atan2( this.y , this.x ) ;
} ;

Vector3D.prototype.getAzimuthYUpDeg =
Vector3D.prototype.getYawYUpDeg = function() {
	return utils.RAD_TO_DEG * Math.atan2( this.z , this.x ) ;
} ;



Vector3D.prototype.setAzimuth = Vector3D.prototype.setAzimuthZUp =
Vector3D.prototype.setYaw = Vector3D.prototype.setYawZUp = function( azimuth ) {
	var radius = utils.hypot2( this.x , this.y ) ;
	this.x = radius * Math.cos( azimuth ) ;
	this.y = radius * Math.sin( azimuth ) ;

	return this ;
} ;

Vector3D.prototype.setAzimuthYUp =
Vector3D.prototype.setYawYUp = function( azimuth ) {
	var radius = utils.hypot2( this.x , this.z ) ;
	this.x = radius * Math.cos( azimuth ) ;
	this.z = radius * Math.sin( azimuth ) ;

	return this ;
} ;

Vector3D.prototype.setAzimuthDeg = Vector3D.prototype.setAzimuthZUpDeg =
Vector3D.prototype.setYawDeg = Vector3D.prototype.setYawZUpDeg = function( azimuth ) {
	azimuth *= utils.DEG_TO_RAD ;

	var radius = utils.hypot2( this.x , this.y ) ;
	this.x = radius * Math.cos( azimuth ) ;
	this.y = radius * Math.sin( azimuth ) ;

	return this ;
} ;

Vector3D.prototype.setAzimuthYUpDeg =
Vector3D.prototype.setYawYUpDeg = function( azimuth ) {
	azimuth *= utils.DEG_TO_RAD ;

	var radius = utils.hypot2( this.x , this.z ) ;
	this.x = radius * Math.cos( azimuth ) ;
	this.z = radius * Math.sin( azimuth ) ;

	return this ;
} ;



Vector3D.prototype.rotateAzimuth = Vector3D.prototype.rotateAzimuthZUp =
Vector3D.prototype.rotateYaw = Vector3D.prototype.rotateYawZUp = function( azimuth ) {
	this.setAzimuth( this.getAzimuth() + azimuth ) ;
	return this ;
} ;

Vector3D.prototype.rotateAzimuthYUp =
Vector3D.prototype.rotateYawYUp = function( azimuth ) {
	this.setAzimuthYUp( this.getAzimuthYUp() + azimuth ) ;
	return this ;
} ;

Vector3D.prototype.rotateAzimuthDeg = Vector3D.prototype.rotateAzimuthZUpDeg =
Vector3D.prototype.rotateYawDeg = Vector3D.prototype.rotateYawZUpDeg = function( azimuth ) {
	this.setAzimuth( this.getAzimuth() + azimuth * utils.DEG_TO_RAD ) ;
	return this ;
} ;

Vector3D.prototype.rotateAzimuthYUpDeg =
Vector3D.prototype.rotateYawYUpDeg = function( azimuth ) {
	this.setAzimuthYUp( this.getAzimuthYUp() + azimuth * utils.DEG_TO_RAD ) ;
	return this ;
} ;



Vector3D.prototype.getDeclination = Vector3D.prototype.getDeclinationZUp =
Vector3D.prototype.getPitch = Vector3D.prototype.getPitchZUp = function() {
	return utils.epsilonAsin( this.z / utils.hypot3( this.x , this.y , this.z ) ) ;
} ;

Vector3D.prototype.getDeclinationYUp =
Vector3D.prototype.getPitchYUp = function() {
	return utils.epsilonAsin( this.y / utils.hypot3( this.x , this.y , this.z ) ) ;
} ;

Vector3D.prototype.getDeclinationDeg = Vector3D.prototype.getDeclinationZUpDeg =
Vector3D.prototype.getPitchDeg = Vector3D.prototype.getPitchZUpDeg = function() {
	return utils.RAD_TO_DEG * utils.epsilonAsin( this.z / utils.hypot3( this.x , this.y , this.z ) ) ;
} ;

Vector3D.prototype.getDeclinationYUpDeg =
Vector3D.prototype.getPitchYUpDeg = function() {
	return utils.RAD_TO_DEG * utils.epsilonAsin( this.y / utils.hypot3( this.x , this.y , this.z ) ) ;
} ;



Vector3D.prototype.setDeclination = Vector3D.prototype.setDeclinationZUp =
Vector3D.prototype.setPitch = Vector3D.prototype.setPitchZUp = function( declination ) {
	var radius = utils.hypot3( this.x , this.y , this.z ) ;
	this.z = radius * Math.sin( declination ) ;

	var xyRadius = radius * Math.cos( declination ) ;
	var azimuth = Math.atan2( this.y , this.x ) ;

	this.x = xyRadius * Math.cos( azimuth ) ;
	this.y = xyRadius * Math.sin( azimuth ) ;

	return this ;
} ;

Vector3D.prototype.setDeclinationYUp =
Vector3D.prototype.setPitchYUp = function( declination ) {
	var radius = utils.hypot3( this.x , this.y , this.z ) ;
	this.y = radius * Math.sin( declination ) ;

	var xzRadius = radius * Math.cos( declination ) ;
	var azimuth = Math.atan2( this.z , this.x ) ;

	this.x = xzRadius * Math.cos( azimuth ) ;
	this.z = xzRadius * Math.sin( azimuth ) ;

	return this ;
} ;

Vector3D.prototype.setDeclinationDeg = Vector3D.prototype.setDeclinationZUpDeg =
Vector3D.prototype.setPitchDeg = Vector3D.prototype.setPitchZUpDeg = function( declination ) {
	return this.setDeclination( declination * utils.DEG_TO_RAD ) ;
} ;

Vector3D.prototype.setDeclinationYUpDeg =
Vector3D.prototype.setPitchYUpDeg = function( declination ) {
	return this.setDeclinationYUp( declination * utils.DEG_TO_RAD ) ;
} ;



Vector3D.prototype.rotateDeclination = Vector3D.prototype.rotateDeclinationZUp =
Vector3D.prototype.rotatePitch = Vector3D.prototype.rotatePitchZUp = function( declination ) {
	this.setDeclination( math.range( this.getDeclination() + declination , -utils.PI_2 , utils.PI_2 ) ) ;
	return this ;
} ;

Vector3D.prototype.rotateDeclinationYUp =
Vector3D.prototype.rotatePitchYUp = function( declination ) {
	this.setDeclinationYUp( math.range( this.getDeclinationYUp() + declination , -utils.PI_2 , utils.PI_2 ) ) ;
	return this ;
} ;

Vector3D.prototype.rotateDeclinationDeg = Vector3D.prototype.rotateDeclinationZUpDeg =
Vector3D.prototype.rotatePitchDeg = Vector3D.prototype.rotatePitchZUpDeg = function( declination ) {
	this.setDeclination( math.range( this.getDeclination() + declination * utils.DEG_TO_RAD , -utils.PI_2 , utils.PI_2 ) ) ;
	return this ;
} ;

Vector3D.prototype.rotateDeclinationYUpDeg =
Vector3D.prototype.rotatePitchYUpDeg = function( declination ) {
	this.setDeclinationYUp( math.range( this.getDeclinationYUp() + declination * utils.DEG_TO_RAD , -utils.PI_2 , utils.PI_2 ) ) ;
	return this ;
} ;



// Because it's way faster to set all of them at once
Vector3D.prototype.setRadiusAzimuthDeclination = Vector3D.prototype.setRadiusAzimuthDeclinationZUp =
Vector3D.prototype.setRadiusYawPitch = Vector3D.prototype.setRadiusYawPitchZUp = function( radius , azimuth , declination ) {
	this.z = radius * Math.sin( declination ) ;

	var xyRadius = radius * Math.cos( declination ) ;

	this.x = xyRadius * Math.cos( azimuth ) ;
	this.y = xyRadius * Math.sin( azimuth ) ;

	return this ;
} ;

Vector3D.prototype.setRadiusAzimuthDeclinationYUp =
Vector3D.prototype.setRadiusYawPitchYUp = function( radius , azimuth , declination ) {
	this.y = radius * Math.sin( declination ) ;

	var xzRadius = radius * Math.cos( declination ) ;

	this.x = xzRadius * Math.cos( azimuth ) ;
	this.z = xzRadius * Math.sin( azimuth ) ;

	return this ;
} ;

Vector3D.prototype.setRadiusAzimuthDeclinationDeg = Vector3D.prototype.setRadiusAzimuthDeclinationZUpDeg =
Vector3D.prototype.setRadiusYawPitchDeg = Vector3D.prototype.setRadiusYawPitchZUpDeg = function( radius , azimuth , declination ) {
	return this.setRadiusAzimuthDeclination( radius , azimuth * utils.DEG_TO_RAD , declination * utils.DEG_TO_RAD ) ;
} ;

Vector3D.prototype.setRadiusAzimuthDeclinationYUpDeg =
Vector3D.prototype.setRadiusYawPitchYUpDeg = function( radius , azimuth , declination ) {
	return this.setRadiusAzimuthDeclinationYUp( radius , azimuth * utils.DEG_TO_RAD , declination * utils.DEG_TO_RAD ) ;
} ;



Vector3D.prototype.rotateXAxis = function( rotation ) { return this._rotateAxis( rotation , 'y' , 'z' ) ; } ;
Vector3D.prototype.rotateYAxis = function( rotation ) { return this._rotateAxis( rotation , 'z' , 'x' ) ; } ;
Vector3D.prototype.rotateZAxis = function( rotation ) { return this._rotateAxis( rotation , 'x' , 'y' ) ; } ;

// Like yaw pitch roll (object coordinate) with Y-Up and roll is along Z
Vector3D.prototype.rotateZXYAxis = function( zRotation , xRotation , yRotation ) {
	this._rotateAxis( zRotation , 'x' , 'y' ) ;
	this._rotateAxis( xRotation , 'y' , 'z' ) ;
	this._rotateAxis( yRotation , 'z' , 'x' ) ;
	return this ;
} ;

Vector3D.prototype._rotateAxis = function( rotation , axis1 , axis2 ) {
	var radius = utils.hypot2( this[ axis1 ] , this[ axis2 ] ) ;
	var angle = Math.atan2( this[ axis2 ] , this[ axis1 ] ) + rotation ;
	this[ axis1 ] = radius * Math.cos( angle ) ;
	this[ axis2 ] = radius * Math.sin( angle ) ;
	return this ;
} ;



// Axis vector should be normalized!
Vector3D.prototype.rotateAxisAngle = function( axisVector , angle , into = this ) {
	// This use the Rodrigues' rotation formula
	// https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
	// Vrot = V cos(angle) + ( axis x V ) sin(angle) + axis ( axis . V )( 1 - cos(angle) )

	var cos = Math.cos( angle ) ;
	var sin = Math.sin( angle ) ;

	REUSABLE_VECTOR.x = this.x * cos ;
	REUSABLE_VECTOR.y = this.y * cos ;
	REUSABLE_VECTOR.z = this.z * cos ;

	REUSABLE_VECTOR.apply(  axisVector.crossInto( this , REUSABLE_VECTOR_CROSS )  ,  sin  ) ;
	REUSABLE_VECTOR.apply(  axisVector  ,  axisVector.dot( this ) * ( 1 - cos )  ) ;

	into.x = REUSABLE_VECTOR.x ;
	into.y = REUSABLE_VECTOR.y ;
	into.z = REUSABLE_VECTOR.z ;

	return into ;
} ;

Vector3D.prototype.rotateAxisAngleDeg = function( axisVector , angle , into = this ) {
	return this.rotateAxisAngle( axisVector , angle * utils.DEG_TO_RAD , into ) ;
} ;



Vector3D.prototype.rotateQuaternion = function( quaternion , into = this ) {
	REUSABLE_VECTOR_QUATERNION.x = this.x ;
	REUSABLE_VECTOR_QUATERNION.y = this.y ;
	REUSABLE_VECTOR_QUATERNION.z = this.z ;
	//quaternion.rotateQuaternion( REUSABLE_VECTOR_QUATERNION , REUSABLE_OUTPUT_VECTOR_QUATERNION ) ;
	quaternion.fastRotateQuaternion( REUSABLE_VECTOR_QUATERNION , REUSABLE_OUTPUT_VECTOR_QUATERNION ) ;
	into.x = REUSABLE_OUTPUT_VECTOR_QUATERNION.x ;
	into.y = REUSABLE_OUTPUT_VECTOR_QUATERNION.y ;
	into.z = REUSABLE_OUTPUT_VECTOR_QUATERNION.z ;
	return into ;
} ;



// Instead of using quaternion methods, extracts the vector and angle from it and use Rodrigues's rotation formula.
// It could replace .rotateQuaternion() once it is proven to be faster and more reliable.
Vector3D.prototype.fastRotateQuaternion = function( quaternion , into = this ) {
	var angle = quaternion.fastGetVectorAngle( REUSABLE_VECTOR_FROM_QUATERNION ) ;
	return this.rotateAxisAngle( REUSABLE_VECTOR_FROM_QUATERNION , angle , into ) ;
} ;



// "Produit Scalaire"
Vector3D.prototype.dot = Vector3D.prototype.dotProduct = function( vector ) {
	return this.x * vector.x  +  this.y * vector.y  +  this.z * vector.z ;
} ;



// "Produit Vectoriel"
Vector3D.prototype.cross = Vector3D.prototype.crossProduct = function( vector ) {
	return new Vector3D(
		this.y * vector.z  -  this.z * vector.y ,
		this.z * vector.x  -  this.x * vector.z ,
		this.x * vector.y  -  this.y * vector.x
	) ;
} ;



// Same than .cross(), but store the result in the "into" vector instead of creating a new vector
Vector3D.prototype.crossInto = Vector3D.prototype.crossProductInto = function( vector , into ) {
	into.x = this.y * vector.z  -  this.z * vector.y ;
	into.y = this.z * vector.x  -  this.x * vector.z ;
	into.z = this.x * vector.y  -  this.y * vector.x ;
	return into ;
} ;



Vector3D.determinant = function( u , v , w ) {
	return u.x * v.y * w.z  +  v.x * w.y * u.z  +  w.x * u.y * v.z  -  u.z * v.y * w.x  -  v.z * w.y * u.x  -  w.z * u.y * v.x ;
} ;



Vector3D.prototype.isCollinearTo = Vector3D.prototype.isColinearTo = function( vector ) {
	// We are using cross product, but avoid creating a vector for nothing
	//return this.cross( vector ).isEpsilonNull() ;
	return utils.eeq( this.y * vector.z  -  this.z * vector.y , 0 ) &&
		utils.eeq( this.z * vector.x  -  this.x * vector.z , 0 ) &&
		utils.eeq( this.x * vector.y  -  this.y * vector.x , 0 ) ;
} ;



Vector3D.prototype.isOrthogonalTo = function( vector ) {
	return ! this.isNull() && ! vector.isNull() && utils.eeq( this.dot( vector ) , 0 ) ;
} ;



// Get the angle between 2 vectors
Vector3D.prototype.angleTo = function( vector ) {
	return utils.epsilonAcos( this.dot( vector ) / ( this.getLength() * vector.getLength() ) ) ;
} ;



// Get the angle between 2 normalized vectors (faster)
Vector3D.prototype.normalizedAngleTo = function( vector ) {
	return utils.epsilonAcos( this.dot( vector ) ) ;
} ;



// Length of the argument vector after being projected on *this* vector
Vector3D.prototype.projectionLengthOf = function( vector ) {
	return Math.abs( this.dotProduct( vector ) / this.getLength() ) ;
} ;



// Same than projectionLengthOf(), but the result can be negative
Vector3D.prototype.projectionValueOf = function( vector ) {
	return this.dotProduct( vector ) / this.getLength() ;
} ;



// Projection of the argument vector on *this* vector
Vector3D.prototype.projectionOf = function( vector ) {
	//var rate = this.dotProduct( vector ) / ( this.x * this.x + this.y * this.y + this.z * this.z ) ;
	var rate = this.dotProduct( vector ) / this.getSquaredLength() ;
	return new Vector3D( this.x * rate , this.y * rate , this.z * rate ) ;
} ;



// The "remainder" part of .decompose()
Vector3D.prototype.diffProjectionOf = function( vector ) {
	//var rate = 1 - this.dotProduct( vector ) / this.getSquaredLength() ;
	//return new Vector3D( this.x * rate , this.y * rate , this.z * rate ) ;

	var rate = this.dotProduct( vector ) / this.getSquaredLength() ;
	return new Vector3D( vector.x - this.x * rate , vector.y - this.y * rate , vector.z - this.z * rate ) ;
} ;



// Reciprocal of projectionOf, modify in-place
Vector3D.prototype.projectOn = function( vector ) {
	var rate = vector.dotProduct( this ) / vector.getSquaredLength() ;
	this.x = vector.x * rate ;
	this.y = vector.y * rate ;
	this.z = vector.z * rate ;
	return this ;
} ;



// Reciprocal of diffProjectionOf, modify in-place
Vector3D.prototype.diffProjectOn = function( vector ) {
	var rate = vector.dotProduct( this ) / vector.getSquaredLength() ;
	this.x -= vector.x * rate ;
	this.y -= vector.y * rate ;
	this.z -= vector.z * rate ;
	return this ;
} ;



// Forbid a vector to go against a constraint vector (forbid negative dot-product)
Vector3D.prototype.applyDirectionalConstraint = function( constraintVector ) {
	var dot = this.dotProduct( constraintVector ) ;
	if ( dot >= 0 ) { return this ; }

	// .diffProjectOn() code, avoid computing dot-product twice
	var rate = dot / constraintVector.getSquaredLength() ;

	this.x -= constraintVector.x * rate ;
	this.y -= constraintVector.y * rate ;
	this.z -= constraintVector.z * rate ;

	return this ;
} ;

// Same than .applyDirectionalConstraint(), assuming constraintVector is normalized
Vector3D.prototype.applyDirectionalNormalizedConstraint = function( constraintVector ) {
	var dot = this.dotProduct( constraintVector ) ;
	if ( dot >= 0 ) { return this ; }

	this.x -= constraintVector.x * dot ;
	this.y -= constraintVector.y * dot ;
	this.z -= constraintVector.z * dot ;

	return this ;
} ;



// Decompose a vector along a normal axis, and a tangent plane
Vector3D.prototype.decompose = function( axis ) {
	var projection = axis.projectionOf( this ) ;
	var remainder = this.dup().sub( projection ) ;
	return [ projection , remainder ] ;
} ;



// Same, but assume axis is a normalized vector, and the result is put into arguments object
Vector3D.prototype.fastDecompose = function( axis , alongAxis , perpToAxis ) {
	var dot = axis.dotProduct( this ) ;
	alongAxis.set( dot * axis.x , dot * axis.y , dot * axis.z ) ;
	perpToAxis.set( this.x - alongAxis.x , this.y - alongAxis.y , this.z - alongAxis.z ) ;
} ;



// Apply a transformation matrix, e.g. multiply the matrix by the vector.
// If "into" vector is specified, the transformation result is stored in that object instead affecting self.
Vector3D.prototype.transform = function( matrix , into = this ) {
	REUSABLE_VECTOR_MATRIX.a[ 0 ] = this.x ;
	REUSABLE_VECTOR_MATRIX.a[ 1 ] = this.y ;
	REUSABLE_VECTOR_MATRIX.a[ 2 ] = this.z ;
	matrix.fastMultiplyByMatrix( REUSABLE_VECTOR_MATRIX , REUSABLE_OUTPUT_VECTOR_MATRIX ) ;
	into.x = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 0 ] ;
	into.y = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 1 ] ;
	into.z = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 2 ] ;
	return into ;
} ;



// Like .transform() but for affine matrix, supporting non-linear transformation (=translation)
Vector3D.prototype.affineTransform = function( matrix , into = this ) {
	REUSABLE_VECTOR_MATRIX.a[ 0 ] = this.x ;
	REUSABLE_VECTOR_MATRIX.a[ 1 ] = this.y ;
	REUSABLE_VECTOR_MATRIX.a[ 2 ] = this.z ;
	matrix.fastMultiplyByAffineMatrix( REUSABLE_VECTOR_MATRIX , REUSABLE_OUTPUT_VECTOR_MATRIX ) ;
	into.x = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 0 ] ;
	into.y = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 1 ] ;
	into.z = REUSABLE_OUTPUT_VECTOR_MATRIX.a[ 2 ] ;
	return into ;
} ;



// Transpose a vector 3D to a vector 2D on a plane coordinate defined by an origin, the plane normal and the xAxis
// xAxis and normal should be normalized and orthogonal (i.e. xAxis should belong to the plane)
Vector3D.prototype.transpose2D = function( origin , normal , xAxis ) {
	// This uses the plane intersection algorithm
	// The plane used include the real origin (not the variable, the 0,0,0 point in 3D coordinate)
	// The wanted plane origin is projected and used at the end
	var common = normal.dotProduct( this ) / normal.getSquaredLength() ;

	// Vector projection on the plane
	var x = this.x - ( normal.x * common ) ;
	var y = this.y - ( normal.y * common ) ;
	var z = this.z - ( normal.z * common ) ;

	// Origin projection on the plane
	var ox = origin.x - ( normal.x * common ) ;
	var oy = origin.y - ( normal.y * common ) ;
	var oz = origin.z - ( normal.z * common ) ;

	var yAxis = normal.crossProduct( xAxis ) ;
	//console.log( 'yAxis length:' , yAxis.length ) ;

	// origin 2D coordinate before transposition
	var o2dx = ox * xAxis.x + oy * xAxis.y + oz * xAxis.z ;
	var o2dy = ox * yAxis.x + oy * yAxis.y + oz * yAxis.z ;

	// 2D coordinate of the vector
	return new Vector2D(
		x * xAxis.x + y * xAxis.y + z * xAxis.z - o2dx ,
		x * yAxis.x + y * yAxis.y + z * yAxis.z - o2dy
	) ;
} ;



// Scale the vector along an axis
// Axis should be normalized
// Used by Ellipse3D
Vector3D.prototype.fastScaleAxis = function( axis , scale ) {
	// From .fastDecompose() code:
	var dot = axis.dotProduct( this ) ;

	var alongX = dot * axis.x ;
	var alongY = dot * axis.y ;
	var alongZ = dot * axis.z ;
	var perpX = this.x - alongX ;
	var perpY = this.y - alongY ;
	var perpZ = this.z - alongZ ;

	return this.set(
		alongX * scale + perpX ,
		alongY * scale + perpY ,
		alongZ * scale + perpZ
	) ;
} ;



// Scale the vector along an axis, from an origin point
// Axis should be normalized
// Used by Ellipse3D
Vector3D.prototype.fastScaleAxisFrom = function( origin , axis , scale ) {
	// First transpose the position to the ellipse origin
	var vx = this.x - origin.x ;
	var vy = this.y - origin.y ;
	var vz = this.z - origin.z ;

	// From .fastDecompose() code:
	var dot = axis.x * vx + axis.y * vy + axis.z * vz ;

	var alongX = dot * axis.x ;
	var alongY = dot * axis.y ;
	var alongZ = dot * axis.z ;
	var perpX = vx - alongX ;
	var perpY = vy - alongY ;
	var perpZ = vz - alongZ ;

	return this.set(
		alongX * scale + perpX + origin.x ,
		alongY * scale + perpY + origin.y ,
		alongZ * scale + perpZ + origin.z
	) ;
} ;



// Getters/Setters
Object.defineProperties( Vector3D.prototype , {
	undefined: {
		get: Vector3D.prototype.getUndefined ,
		set: Vector3D.prototype.setUndefined
	} ,
	null: {
		get: Vector3D.prototype.getNull ,
		set: Vector3D.prototype.setNull
	} ,
	length: {
		get: Vector3D.prototype.getLength ,
		set: Vector3D.prototype.setLength
	} ,
	squaredLength: {
		get: Vector3D.prototype.getSquaredLength
	} ,
	norm: {
		get: Vector3D.prototype.getNorm ,
		set: Vector3D.prototype.setNorm
	} ,
	radius: {
		get: Vector3D.prototype.getRadius ,
		set: Vector3D.prototype.setRadius
	} ,
	azimuth: {
		get: Vector3D.prototype.getAzimuth ,
		set: Vector3D.prototype.setAzimuth
	} ,
	azimuthDeg: {
		get: Vector3D.prototype.getAzimuthDeg ,
		set: Vector3D.prototype.setAzimuthDeg
	} ,
	declination: {
		get: Vector3D.prototype.getDeclination ,
		set: Vector3D.prototype.setDeclination
	} ,
	declinationDeg: {
		get: Vector3D.prototype.getDeclinationDeg ,
		set: Vector3D.prototype.setDeclinationDeg
	}
} ) ;

