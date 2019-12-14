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



const RAD_TO_DEG = 180 / Math.PI ;
const DEG_TO_RAD = Math.PI / 180 ;



function Complex( re , im ) {
	this.re = + re ;
	this.im = + im ;
}

module.exports = Complex ;



Complex.fromObject = object => new Complex( object.re , object.im ) ;



Complex.prototype.set = function( re , im ) {
	this.re = + re ;
	this.im = + im ;
	return this ;
} ;



Complex.prototype.setReal =
Complex.prototype.setRe = function( re ) {
	this.re = + re ;
	return this ;
} ;



Complex.prototype.setImaginary =
Complex.prototype.setIm = function( im ) {
	this.im = + im ;
	return this ;
} ;



Complex.prototype.setComplex = function( complex ) {
	this.re = + complex.re ;
	this.im = + complex.im ;
	return this ;
} ;



Complex.prototype.dup = function() {
	return Complex.fromObject( this ) ;
} ;



Complex.prototype.isUndefined = Complex.prototype.getUndefined = function() {
	return Number.isNaN( this.re ) || Number.isNaN( this.im ) ;
} ;



Complex.prototype.setUndefined = function() {
	this.re = this.im = NaN ;
	return this ;
} ;



Complex.prototype.isNull = Complex.prototype.getNull = function() {
	return this.re === 0 && this.im === 0 ;
} ;



Complex.prototype.setNull = function() {
	this.re = this.im = 0 ;
	return this ;
} ;



Complex.prototype.isEqualTo = function( complex ) {
	return this.re === complex.re && this.im === complex.im ;
} ;



Complex.prototype.inv = function() {
	this.re = -this.re ;
	this.im = -this.im ;

	return this ;
} ;



Complex.prototype.add = function( complex ) {
	this.re += complex.re ;
	this.im += complex.im ;

	return this ;
} ;



Complex.prototype.sub = function( complex ) {
	this.re -= complex.re ;
	this.im -= complex.im ;

	return this ;
} ;



Complex.prototype.mul = function( complex ) {
	this.set(
		this.re * complex.re - this.im * complex.im ,
		this.re * complex.im + this.im * complex.re
	) ;

	return this ;
} ;



Complex.prototype.intPow = function( n ) {
	var r = Math.pow( this.getNorm() , n ) ;
	var phi = this.getAngle() ;

	this.re = r * Math.cos( n * phi ) ;
	this.im = r * Math.sin( n * phi ) ;

	return this ;
} ;



Complex.prototype.getNorm = function() {
	return Math.hypot( this.re , this.im ) ;
} ;



Complex.prototype.setNorm = function( length ) {
	if ( ! this.re && ! this.im ) { return this ; }

	var rate = Math.abs( length ) / Math.hypot( this.re , this.im ) ;

	this.re *= rate ;
	this.im *= rate ;

	return this ;
} ;



Complex.prototype.getSquareNorm = function() {
	return this.re * this.re + this.im * this.im ;
} ;



Complex.prototype.getAngle = function() {
	return Math.atan2( this.im , this.re ) ;
} ;



Complex.prototype.setAngle = function( angle ) {
	var length = Math.hypot( this.re , this.im ) ;
	this.re = length * Math.cos( angle ) ;
	this.im = length * Math.sin( angle ) ;

	return this ;
} ;



Complex.prototype.getAngleDeg = function() {
	return RAD_TO_DEG * Math.atan2( this.im , this.re ) ;
} ;



Complex.prototype.setAngleDeg = function( angle ) {
	var length = Math.hypot( this.re , this.im ) ;
	angle *= DEG_TO_RAD ;
	this.re = length * Math.cos( angle ) ;
	this.im = length * Math.sin( angle ) ;

	return this ;
} ;



Complex.prototype.rotate = function( angle ) {
	this.setAngle( this.getAngle() + angle ) ;
	return this ;
} ;



Complex.prototype.rotateDeg = function( angle ) {
	this.setAngle( this.getAngle() + angle * DEG_TO_RAD ) ;
	return this ;
} ;



// Getters/Setters
Object.defineProperties( Complex.prototype , {
	undefined: {
		get: Complex.prototype.getUndefined ,
		set: Complex.prototype.setUndefined
	} ,
	null: {
		get: Complex.prototype.getNull ,
		set: Complex.prototype.setNull
	} ,
	norm: {
		get: Complex.prototype.getNorm ,
		set: Complex.prototype.setNorm
	} ,
	angle: {
		get: Complex.prototype.getAngle ,
		set: Complex.prototype.setAngle
	} ,
	angleDeg: {
		get: Complex.prototype.getAngleDeg ,
		set: Complex.prototype.setAngleDeg
	}
} ) ;


