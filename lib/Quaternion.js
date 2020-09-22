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



// We need geometry's utils here
const utils = require( './geometry/utils.js' ) ;



function Quaternion( x , y , z , w ) {
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	this.w = + w ;
}

module.exports = Quaternion ;



const Vector3D = require( './geometry/Vector3D.js' ) ;


// For faster computing, we re-use some quaternion
const REUSABLE_QUATERNION = new Quaternion() ;
const REUSABLE_INVERSE_QUATERNION = new Quaternion() ;
const REUSABLE_CONJUGATE_QUATERNION = new Quaternion() ;



// Create a new vector from another vector or an object featuring x,y,z properties
Quaternion.fromObject = object => new Quaternion( object.x , object.y , object.z , object.w ) ;
Quaternion.fromVectorAngle = ( vector , angle ) => ( new Quaternion() ).setVectorAngle( vector , angle ) ;
Quaternion.fromVectorAngleDeg = ( vector , angle ) => ( new Quaternion() ).setVectorAngle( vector , angle * utils.DEG_TO_RAD ) ;
Quaternion.fromEuler = ( yaw = 0 , pitch = 0 , roll = 0 ) => ( new Quaternion() ).setEuler( yaw , pitch , roll ) ;
Quaternion.fromEulerDeg = ( yaw = 0 , pitch = 0 , roll = 0 ) => ( new Quaternion() ).setEuler( yaw * utils.DEG_TO_RAD , pitch * utils.DEG_TO_RAD , roll * utils.DEG_TO_RAD ) ;



Quaternion.prototype.set = function( x , y , z , w ) {
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	this.w = + w ;
	return this ;
} ;



Quaternion.prototype.setX = function( x ) {
	this.x = + x ;
	return this ;
} ;



Quaternion.prototype.setY = function( y ) {
	this.y = + y ;
	return this ;
} ;



Quaternion.prototype.setZ = function( z ) {
	this.z = + z ;
	return this ;
} ;



Quaternion.prototype.setW = function( w ) {
	this.w = + w ;
	return this ;
} ;



Quaternion.prototype.setQuaternion = function( quaternion ) {
	this.x = + quaternion.x ;
	this.y = + quaternion.y ;
	this.z = + quaternion.z ;
	this.w = + quaternion.w ;
	return this ;
} ;



Quaternion.prototype.setObject = function( object ) {
	if ( object.x !== undefined ) { this.x = + object.x ; }
	if ( object.y !== undefined ) { this.y = + object.y ; }
	if ( object.z !== undefined ) { this.z = + object.z ; }
	if ( object.w !== undefined ) { this.w = + object.w ; }
	return this ;
} ;



// Quaternion can be thought of a vector(x,y,z) and an angle(w).
// In fact, this is the easiest way to understand them.
Quaternion.prototype.setVectorAngle = function( vector , angle ) {
	var sin = Math.sin( angle / 2 ) ;

	this.x = vector.x * sin ;
	this.y = vector.y * sin ;
	this.z = vector.z * sin ;
	this.w = Math.cos( angle / 2 ) ;

	return this ;
} ;

Quaternion.prototype.setVectorAngleDeg = function( vector , angle ) { return this.setVectorAngle( vector , angle * utils.DEG_TO_RAD ) ; } ;



Quaternion.prototype.getVectorAngle = function() {
	var angle = 2 * utils.epsilonAcos( this.w ) ,
		sin = Math.sin( angle / 2 ) ;

	var vector = new Vector3D(
		this.x / sin ,
		this.y / sin ,
		this.z / sin
	) ;

	return { vector , angle } ;
} ;

// Fast version: do not create a new vector, reuse the one provided as argument, return only the angle (avoid creating any object)
Quaternion.prototype.fastGetVectorAngle = function( vector ) {
	var angle = 2 * utils.epsilonAcos( this.w ) ,
		sin = Math.sin( angle / 2 ) ;

	vector.x = this.x / sin ;
	vector.y = this.y / sin ;
	vector.z = this.z / sin ;

	return angle ;
} ;

Quaternion.prototype.getVectorAngleDeg = function() {
	var object = this.getVectorAngle() ;
	object.angle *= utils.RAD_TO_DEG ;
	return object ;
} ;



// From: https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
// yaw (Z), pitch (Y), roll (X), where X is forward, Y is left, Z is up
Quaternion.prototype.setEuler = function( yaw = 0 , pitch = 0 , roll = 0 ) {
	// Abbreviations for the various angular functions
	var cy = Math.cos( yaw * 0.5 ) ,
		sy = Math.sin( yaw * 0.5 ) ,
		cp = Math.cos( pitch * 0.5 ) ,
		sp = Math.sin( pitch * 0.5 ) ,
		cr = Math.cos( roll * 0.5 ) ,
		sr = Math.sin( roll * 0.5 ) ;

	this.x = cy * cp * sr - sy * sp * cr ;
	this.y = sy * cp * sr + cy * sp * cr ;
	this.z = sy * cp * cr - cy * sp * sr ;
	this.w = cy * cp * cr + sy * sp * sr ;

	return this ;
} ;



Quaternion.prototype.setEulerDeg = function( yaw = 0 , pitch = 0 , roll = 0 ) {
	return this.setEuler(
		yaw * utils.DEG_TO_RAD ,
		pitch * utils.DEG_TO_RAD ,
		roll * utils.DEG_TO_RAD
	) ;
} ;



// From: https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
// yaw (Z), pitch (Y), roll (X), where X is forward, Y is left, Z is up
Quaternion.prototype.getEuler = function() {
	var angles = { yaw: 0 , pitch: 0 , roll: 0 } ;

	// roll (x-axis rotation)
	var sinRCosP = 2 * ( this.w * this.x + this.y * this.z ) ;
	var cosRCosP = 1 - 2 * ( this.x * this.x + this.y * this.y ) ;
	angles.roll = Math.atan2( sinRCosP , cosRCosP ) ;

	// pitch (y-axis rotation)
	var sinP = 2 * ( this.w * this.y - this.z * this.x ) ;
	angles.pitch = utils.epsilonAsin( sinP ) ;

	// yaw (z-axis rotation)
	var sinYCosP = 2 * ( this.w * this.z + this.x * this.y ) ;
	var cosYCosP = 1 - 2 * ( this.y * this.y + this.z * this.z ) ;
	angles.yaw = Math.atan2( sinYCosP , cosYCosP ) ;

	return angles ;
} ;



Quaternion.prototype.getEulerDeg = function() {
	var angles = this.getEuler() ;
	angles.yaw *= utils.RAD_TO_DEG ;
	angles.pitch *= utils.RAD_TO_DEG ;
	angles.roll *= utils.RAD_TO_DEG ;
	return angles ;
} ;



Quaternion.prototype.dup = function() {
	return Quaternion.fromObject( this ) ;
} ;



Quaternion.prototype.setUndefined = function() {
	this.x = this.y = this.z = this.w = NaN ;
	return this ;
} ;



Quaternion.prototype.isNull = Quaternion.prototype.getNull = function() {
	return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0 ;
} ;



Quaternion.prototype.isEpsilonNull = function() {
	return utils.eeq( this.x , 0 ) && utils.eeq( this.y , 0 ) && utils.eeq( this.z , 0 ) && utils.eeq( this.w , 0 ) ;
} ;



Quaternion.prototype.setNull = function() {
	this.x = this.y = this.z = this.w = 0 ;
	return this ;
} ;



Quaternion.prototype.isEqualTo = function( quaternion ) {
	return utils.eeq( this.x , quaternion.x ) && utils.eeq( this.y , quaternion.y ) && utils.eeq( this.z , quaternion.z ) && utils.eeq( this.w , quaternion.w ) ;
} ;



Quaternion.prototype.getNorm = function() {
	return utils.hypot4( this.x , this.y , this.z , this.w ) ;
} ;



Quaternion.prototype.setNorm = function( length ) {
	if ( ! this.x && ! this.y && ! this.z && ! this.w ) { return this ; }

	var rate = Math.abs( length ) / utils.hypot4( this.x , this.y , this.z , this.w ) ;

	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;
	this.w *= rate ;

	return this ;
} ;



Quaternion.prototype.normalize = Quaternion.prototype.unit = function() {
	var length = utils.hypot4( this.x , this.y , this.z , this.w ) ;

	if ( length ) {
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
		this.w /= length ;
	}

	return this ;
} ;



// For a quaternion q, its conjugation is denoted q*
Quaternion.prototype.conjugated = function( outputQuaternion = null ) {
	if ( ! outputQuaternion ) {
		// w is unchanged
		return new Quaternion(
			-this.x ,
			-this.y ,
			-this.z ,
			this.w
		) ;
	}

	// w is unchanged
	outputQuaternion.x = -this.x ;
	outputQuaternion.y = -this.y ;
	outputQuaternion.z = -this.z ;
	outputQuaternion.w = this.w ;

	return outputQuaternion ;
} ;



// Reciprocal of a quaternion q, denoted q^-1
Quaternion.prototype.reciprocal =
Quaternion.prototype.invert =
Quaternion.prototype.inverse = function( outputQuaternion = null ) {
	var squareNorm = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w ;

	if ( ! outputQuaternion ) {
		return new Quaternion(
			-this.x / squareNorm ,
			-this.y / squareNorm ,
			-this.z / squareNorm ,
			this.w / squareNorm
		) ;
	}

	outputQuaternion.x = -this.x / squareNorm ;
	outputQuaternion.y = -this.y / squareNorm ;
	outputQuaternion.z = -this.z / squareNorm ;
	outputQuaternion.w = this.w / squareNorm ;

	return outputQuaternion ;
} ;



Quaternion.prototype.add = function( quaternion , outputQuaternion = null ) {
	if ( ! outputQuaternion ) { outputQuaternion = new Quaternion() ; }

	outputQuaternion.x = this.x + quaternion.x ;
	outputQuaternion.y = this.y + quaternion.y ;
	outputQuaternion.z = this.z + quaternion.z ;
	outputQuaternion.w = this.w + quaternion.w ;

	return outputQuaternion ;
} ;



// The argument outputMatrix can help re-using existing objects
Quaternion.prototype.mul =
Quaternion.prototype.multiply = function( by , outputQuaternion = null ) {
	if ( typeof by === 'number' ) { return this.multiplyByScalar( by , outputQuaternion ) ; }
	return this.multiplyByQuaternion( by , outputQuaternion ) ;
} ;



Quaternion.prototype.multiplyByScalar = function( scalar , outputQuaternion = null ) {
	if ( ! outputQuaternion ) { outputQuaternion = new Quaternion() ; }

	outputQuaternion.x = scalar * this.x ;
	outputQuaternion.y = scalar * this.y ;
	outputQuaternion.z = scalar * this.z ;
	outputQuaternion.w = scalar * this.w ;

	return outputQuaternion ;
} ;



Quaternion.prototype.multiplyByQuaternion = function( quaternion , outputQuaternion = null ) {
	if ( ! outputQuaternion ) { outputQuaternion = new Quaternion() ; }

	outputQuaternion.x = this.w * quaternion.x + this.x * quaternion.w + this.y * quaternion.z - this.z * quaternion.y ;
	outputQuaternion.y = this.w * quaternion.y - this.x * quaternion.z + this.y * quaternion.w + this.z * quaternion.x ;
	outputQuaternion.z = this.w * quaternion.z + this.x * quaternion.y - this.y * quaternion.x + this.z * quaternion.w ;
	outputQuaternion.w = this.w * quaternion.w - this.x * quaternion.x - this.y * quaternion.y - this.z * quaternion.z ;

	return outputQuaternion ;
} ;



// Avoid creating a conjugate quaternion for multiplying to it afterhand
Quaternion.prototype.multiplyByConjugatedQuaternion = function( quaternion , outputQuaternion = null ) {
	if ( ! outputQuaternion ) { outputQuaternion = new Quaternion() ; }

	outputQuaternion.x = this.w * ( -quaternion.x ) + this.x * quaternion.w + this.y * ( -quaternion.z ) - this.z * ( -quaternion.y ) ;
	outputQuaternion.y = this.w * ( -quaternion.y ) - this.x * ( -quaternion.z ) + this.y * quaternion.w + this.z * ( -quaternion.x ) ;
	outputQuaternion.z = this.w * ( -quaternion.z ) + this.x * ( -quaternion.y ) - this.y * ( -quaternion.x ) + this.z * quaternion.w ;
	outputQuaternion.w = this.w * quaternion.w - this.x * ( -quaternion.x ) - this.y * ( -quaternion.y ) - this.z * ( -quaternion.z ) ;

	return outputQuaternion ;
} ;



Quaternion.prototype.conjugate =
Quaternion.prototype.rotateQuaternion = function( rotatingQuaternion , outputQuaternion = null ) {
	if ( ! outputQuaternion ) { outputQuaternion = new Quaternion() ; }

	return this.multiplyByQuaternion( rotatingQuaternion , REUSABLE_QUATERNION )
		.multiplyByQuaternion( this.inverse( REUSABLE_INVERSE_QUATERNION ) , outputQuaternion ) ;
} ;



// Assume a normalized quaternion and that outputQuaternion is set
Quaternion.prototype.fastConjugate =
Quaternion.prototype.fastRotateQuaternion = function( rotatingQuaternion , outputQuaternion ) {
	return this.multiplyByQuaternion( rotatingQuaternion , REUSABLE_QUATERNION )
		.multiplyByConjugatedQuaternion( this , outputQuaternion ) ;
} ;



// Getters/Setters
Object.defineProperties( Quaternion.prototype , {
	undefined: {
		get: Quaternion.prototype.getUndefined ,
		set: Quaternion.prototype.setUndefined
	} ,
	null: {
		get: Quaternion.prototype.getNull ,
		set: Quaternion.prototype.setNull
	} ,
	norm: {
		get: Quaternion.prototype.getNorm ,
		set: Quaternion.prototype.setNorm
	}
} ) ;

