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



const Fn = require( './Fn.js' ) ;



/*
	Coefficients arguments are store from the lowest power to the highest power.
*/
function PolynomialFn( ... coefficients ) {
	this.coefficients = coefficients ;
}

PolynomialFn.prototype = Object.create( Fn.prototype ) ;
PolynomialFn.prototype.constructor = PolynomialFn ;

module.exports = PolynomialFn ;



PolynomialFn.prototype.add = function( v ) {
	this.coefficients[ 0 ] += v ;
} ;



PolynomialFn.prototype.fx = function( x ) {
	var power , value = this.coefficients[ 0 ] ;

	for ( power = 1 ; power < this.coefficients.length ; power ++ ) {
		value += this.coefficients[ power ] * ( x ** power ) ;
	}

	return value ;
} ;



// Derivative
PolynomialFn.prototype.dfx = function( x ) {
	var power , value = 0 ;

	for ( power = 1 ; power < this.coefficients.length ; power ++ ) {
		value += this.coefficients[ power ] * power * ( x ** ( power - 1 ) ) ;
	}

	return value ;
} ;



// Return a new derivative function
PolynomialFn.prototype.createDfxFn = function() {
	var power , newCoefficients = [] ;

	for ( power = 1 ; power < this.coefficients.length ; power ++ ) {
		newCoefficients[ power - 1 ] = this.coefficients[ power ] * power ;
	}

	return new PolynomialFn( ... newCoefficients ) ;
} ;



// Integral
PolynomialFn.prototype.sfx = function( x , constant = 0 ) {
	var power , value = constant ;

	for ( power = 0 ; power < this.coefficients.length ; power ++ ) {
		value += this.coefficients[ power ] / ( power + 1 ) * ( x ** ( power + 1 ) ) ;
	}

	return value ;
} ;



// Return a new integral function
PolynomialFn.prototype.createSfxFn = function( constant = 0 ) {
	var power , newCoefficients = [ constant ] ;

	for ( power = 0 ; power < this.coefficients.length ; power ++ ) {
		newCoefficients[ power + 1 ] = this.coefficients[ power ] / ( power + 1 ) ;
	}

	return new PolynomialFn( ... newCoefficients ) ;
} ;

