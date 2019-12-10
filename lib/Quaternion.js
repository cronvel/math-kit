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
const Vector3D = require( './geometry/Vector3D.js' ) ;



function Quaternion( w , x , y , z ) {
	this.w = + w ;
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
}

module.exports = Quaternion ;



// Create a new vector from another vector or an object featuring x,y,z properties
Quaternion.fromObject = object => new Quaternion( object.w , object.x , object.y , object.z ) ;
Quaternion.fromRotationVector = ( angle , vector ) => ( new Quaternion() ).setRotationVector( angle , vector ) ;
Quaternion.fromRotationVectorDeg = ( angle , vector ) => ( new Quaternion() ).setRotationVector( angle * utils.DEG_TO_RAD , vector ) ;
Quaternion.fromEuler = ( yaw = 0 , pitch = 0 , roll = 0 ) => ( new Quaternion() ).setEuler( yaw , pitch , roll ) ;
Quaternion.fromEulerDeg = ( yaw = 0 , pitch = 0 , roll = 0 ) => ( new Quaternion() ).setEuler( yaw * utils.DEG_TO_RAD , pitch * utils.DEG_TO_RAD , roll * utils.DEG_TO_RAD ) ;



Quaternion.prototype.set = function( w , x , y , z ) {
	this.w = + w ;
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	return this ;
} ;



Quaternion.prototype.setW = function( w ) {
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



Quaternion.prototype.setQuaternion = function( quaternion ) {
	this.w = + quaternion.w ;
	this.x = + quaternion.x ;
	this.y = + quaternion.y ;
	this.z = + quaternion.z ;
	return this ;
} ;



// Quaternion can be thought of a vector(x,y,z) and an angle(w).
// In fact, this is the easier way to understand them.
Quaternion.prototype.setRotationVector = function( angle , vector ) {
	var sin = Math.sin( angle / 2 ) ;

	this.w = Math.cos( angle / 2 ) ;
	this.x = vector.x * sin ;
	this.y = vector.y * sin ;
	this.z = vector.z * sin ;

	return this ;
} ;

Quaternion.prototype.setRotationVectorDeg = function( angle , vector ) { return this.setRotationVector( angle * utils.DEG_TO_RAD , vector ) ; }



Quaternion.prototype.getRotationVector = function() {
	var angle = 2 * utils.epsilonAcos( this.w ) ,
		sin = Math.sin( angle / 2 ) ;
	
	var vector = new Vector3D(
		this.x / sin ,
		this.y / sin ,
		this.z / sin
	) ;

	return { angle , vector } ;
} ;

Quaternion.prototype.getRotationVectorDeg = function() {
	var object = this.getRotationVector() ;
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

	this.w = cy * cp * cr + sy * sp * sr ;
	this.x = cy * cp * sr - sy * sp * cr ;
	this.y = sy * cp * sr + cy * sp * cr ;
	this.z = sy * cp * cr - cy * sp * sr ;

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
Quaternion.prototype.toEuler = function() {
	var angles = { yaw: 0 , pitch: 0 , roll: 0 } ;

	// roll (x-axis rotation)
	var sinr_cosp = 2 * ( this.w * this.x + this.y * this.z ) ;
	var cosr_cosp = 1 - 2 * ( this.x * this.x + this.y * this.y ) ;
	angles.roll = Math.atan2( sinr_cosp , cosr_cosp ) ;

	// pitch (y-axis rotation)
	var sinp = 2 * ( this.w * this.y - this.z * this.x ) ;
	angles.pitch = utils.epsilonAsin( sinp ) ;
	
	// yaw (z-axis rotation)
	var siny_cosp = 2 * ( this.w * this.z + this.x * this.y ) ;
	var cosy_cosp = 1 - 2 * ( this.y * this.y + this.z * this.z ) ;
	angles.yaw = Math.atan2( siny_cosp , cosy_cosp ) ;

	return angles ;
} ;



Quaternion.prototype.toEulerDeg = function() {
	var angles = this.toEuler() ;
	angles.yaw *= utils.RAD_TO_DEG ;
	angles.pitch *= utils.RAD_TO_DEG ;
	angles.roll *= utils.RAD_TO_DEG ;
	return angles ;
} ;



Quaternion.prototype.dup = function() {
	return Quaternion.fromObject( this ) ;
} ;



Quaternion.prototype.setUndefined = function() {
	this.w = this.x = this.y = this.z = NaN ;
	return this ;
} ;



Quaternion.prototype.isNull = Quaternion.prototype.getNull = function() {
	return this.w === 0 && this.x === 0 && this.y === 0 && this.z === 0 ;
} ;



Quaternion.prototype.isEpsilonNull = function() {
	return utils.eeq( this.w , 0 ) && utils.eeq( this.x , 0 ) && utils.eeq( this.y , 0 ) && utils.eeq( this.z , 0 ) ;
} ;



Quaternion.prototype.setNull = function() {
	this.w = this.x = this.y = this.z = 0 ;
	return this ;
} ;



Quaternion.prototype.isEqualTo = function( quaternion ) {
	return utils.eeq( this.w , quaternion.w ) && utils.eeq( this.x , quaternion.x ) && utils.eeq( this.y , quaternion.y ) && utils.eeq( this.z , quaternion.z ) ;
} ;



Quaternion.prototype.getNorm = function() {
	return utils.hypot4( this.w , this.x , this.y , this.z ) ;
} ;



Quaternion.prototype.setNorm = function( length ) {
	if ( ! this.w && ! this.x && ! this.y && ! this.z ) { return this ; }

	var rate = Math.abs( length ) / utils.hypot4( this.w , this.x , this.y , this.z ) ;

	this.w *= rate ;
	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;

	return this ;
} ;



Quaternion.prototype.normalize = Quaternion.prototype.unit = function() {
	var length = utils.hypot4( this.w , this.x , this.y , this.z ) ;

	if ( length ) {
		this.w /= length ;
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
	}

	return this ;
} ;



Quaternion.prototype.add = function( quaternion , outputQuaternion = null ) {
	if ( ! outputQuaternion ) { outputQuaternion = new Quaternion() ; }
	
	outputQuaternion.w = this.w + quaternion.w ;
	outputQuaternion.x = this.x + quaternion.x ;
	outputQuaternion.y = this.y + quaternion.y ;
	outputQuaternion.z = this.z + quaternion.z ;

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
	
	outputQuaternion.w = scalar * this.w ;
	outputQuaternion.x = scalar * this.x ;
	outputQuaternion.y = scalar * this.y ;
	outputQuaternion.z = scalar * this.z ;

	return outputQuaternion ;
} ;



Quaternion.prototype.multiplyByQuaternion = function( quaternion , outputQuaternion = null ) {
	if ( ! outputQuaternion ) { outputQuaternion = new Quaternion() ; }
	
	outputQuaternion.w = this.w * quaternion.w - this.x * quaternion.x - this.y * quaternion.y - this.z * quaternion.z ;
	outputQuaternion.x = this.w * quaternion.x + this.x * quaternion.w + this.y * quaternion.z - this.z * quaternion.y ;
	outputQuaternion.y = this.w * quaternion.y - this.x * quaternion.z + this.y * quaternion.w + this.z * quaternion.x ;
	outputQuaternion.z = this.w * quaternion.z + this.x * quaternion.y - this.y * quaternion.x + this.z * quaternion.w ;
	
	return outputQuaternion ;
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

