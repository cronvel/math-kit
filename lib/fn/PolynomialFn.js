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
	this.cleanUp() ;
}

PolynomialFn.prototype = Object.create( Fn.prototype ) ;
PolynomialFn.prototype.constructor = PolynomialFn ;

module.exports = PolynomialFn ;



PolynomialFn.prototype.set = function( ... coefficients ) {
	this.coefficients = coefficients ;
	this.cleanUp() ;
} ;



PolynomialFn.prototype.cleanUp = function() {
	if ( ! this.coefficients.length ) { this.coefficients[ 0 ] = 0 ; }

	while ( this.coefficients.length > 1 && ! this.coefficients[ this.coefficients.length - 1 ] ) {
		this.coefficients.length -- ;
	}
} ;



PolynomialFn.prototype.dup = PolynomialFn.prototype.clone = function() {
	return new PolynomialFn( ... this.coefficients ) ;
} ;



PolynomialFn.prototype.add = function( v ) {
	if ( typeof v === 'number' ) {
		this.coefficients[ 0 ] += v ;
	}
	else if ( v instanceof PolynomialFn ) {
		for ( let i = 0 , iMax = Math.max( this.coefficients.length , v.coefficients.length ) ; i < iMax ; i ++ ) {
			this.coefficients[ i ] = ( this.coefficients[ i ] ?? 0 ) + ( v.coefficients[ i ] ?? 0 ) ;
		}
	}
	else {
		throw new Error( "Not supported!" ) ;
	}
} ;



PolynomialFn.prototype.sub = function( v ) {
	if ( typeof v === 'number' ) {
		this.coefficients[ 0 ] -= v ;
	}
	else if ( v instanceof PolynomialFn ) {
		for ( let i = 0 , iMax = Math.max( this.coefficients.length , v.coefficients.length ) ; i < iMax ; i ++ ) {
			this.coefficients[ i ] = ( this.coefficients[ i ] ?? 0 ) - ( v.coefficients[ i ] ?? 0 ) ;
		}
	}
	else {
		throw new Error( "Not supported!" ) ;
	}
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



PolynomialFn.prototype.solveFor = PolynomialFn.prototype.solve = function( v = 0 ) {
	switch ( this.coefficients.length - 1 ) {
		case 0 : return null ;
		case 1 : return [ ( v - this.coefficients[ 0 ] ) / this.coefficients[ 1 ] ] ;
		case 2 : return this.solveQuadratic( v ) ;
		case 2 : return this.solveCubic( v ) ;
		default : throw new Error( "Not supported!" ) ;
	}
} ;



PolynomialFn.prototype.solveQuadratic = function( v = 0 ) {
	var discriminant , sqrtDiscriminant ,
		a = this.coefficients[ 2 ] ,
		b = this.coefficients[ 1 ] ,
		c = this.coefficients[ 0 ] - v ;

	discriminant = b * b - 4 * a * c ;
	
	if ( discriminant < 0 ) { return null ; }
	if ( discriminant === 0 ) { return [ -b / ( 2 * a ) ] ; }
	
	sqrtDiscriminant = Math.sqrt( discriminant ) ;
	
	return [
		( -b - sqrtDiscriminant ) / ( 2 * a ) ,
		( -b + sqrtDiscriminant ) / ( 2 * a )
	] ;
} ;



PolynomialFn.prototype.solveCubic = function( v = 0 ) {
	var discriminant , 
		a = this.coefficients[ 3 ] ,
		b = this.coefficients[ 2 ] ,
		c = this.coefficients[ 1 ] ,
		d = this.coefficients[ 0 ] - v ;
	
	// = 18abcd - 4b³d + b²c² - 4ac³ - 27a²d²  
	discriminant = 18 * a * b * c * d  -  4 * b*b*b * d  +  b*b * c*c  -  4 * a * c*c*c  -  27 * a*a * d*d ;
	
	if ( discriminant < 0 ) { return null ; }
	if ( discriminant === 0 ) { return [ -b / ( 2 * a ) ] ; }
	
	discriminant = Math.sqrt( discriminant ) ;
	
	return [
		( -b - discriminant ) / ( 2 * a ) ,
		( -b + discriminant ) / ( 2 * a )
	] ;
} ;

