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



function Quaternion( w , x , y , z ) {
	this.w = + w ;
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
}

module.exports = Quaternion ;


// Create a new vector from another vector or an object featuring x,y,z properties
Quaternion.fromObject = object => new Quaternion( object.w , object.x , object.y , object.z ) ;



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



Quaternion.prototype.normalize = Quaternion.prototype.unit = function() {
	var length = utils.hypot4( thiw.w , this.x , this.y , this.z ) ;

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

