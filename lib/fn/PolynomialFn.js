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



PolynomialFn.prototype.mul = function( v ) {
	if ( typeof v === 'number' ) {
		for ( let i = 0 ; i < this.coefficients.length ; i ++ ) {
			this.coefficients[ i ] *= v ;
		}
	}
	else if ( v instanceof PolynomialFn ) {
		throw new Error( "Not supported!" ) ;
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



PolynomialFn.prototype.solveFor = PolynomialFn.prototype.solve = function( y = 0 ) {
	switch ( this.coefficients.length - 1 ) {
		case 0 : return null ;
		case 1 : return [ ( y - this.coefficients[ 0 ] ) / this.coefficients[ 1 ] ] ;
		case 2 : return PolynomialFn.solveQuadratic( this.coefficients[ 2 ] , this.coefficients[ 1 ] , this.coefficients[ 0 ] - y ) ;
		case 3 : return PolynomialFn.solveCubic( this.coefficients[ 3 ] , this.coefficients[ 2 ] , this.coefficients[ 1 ] , this.coefficients[ 0 ] - y ) ;
		default : throw new Error( "Not supported!" ) ;
	}
} ;



PolynomialFn.solveQuadratic = function( a , b , c ) {
	var discriminant = b * b - 4 * a * c ;

	if ( discriminant < 0 ) { return null ; }
	if ( discriminant === 0 ) { return [ -b / ( 2 * a ) ] ; }

	var sqrtDiscriminant = Math.sqrt( discriminant ) ;

	return [
		( -b - sqrtDiscriminant ) / ( 2 * a ) ,
		( -b + sqrtDiscriminant ) / ( 2 * a )
	] ;
} ;



const CUBIC_EPSILON = 0.0000000001 ;

// https://en.wikipedia.org/wiki/Cubic_equation
// https://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically#27176424
PolynomialFn.solveCubic = function( a , b , c , d ) {
	// Quadratic case ?
	if ( Math.abs( a ) < CUBIC_EPSILON ) { return PolynomialFn.solveQuadratic( b , c , d ) ; }

	var p , q , delta , roots ;

	// disccriminant = 18abcd - 4b³d + b²c² - 4ac³ - 27a²d²
	// ... but there isn't much use for it...
	//discriminant = 18 * a * b * c * d  -  4 * b * b * b * d  +  b * b * c * c  -  4 * a * c * c * c  -  27 * a * a * d * d ;

	// Convert to depressed cubic  t³ + pt + q = 0  using substitution  x = t - b / 3a
	p = ( 3 * a * c - b * b ) / ( 3 * a * a ) ;
	q = ( 2 * b * b * b - 9 * a * b * c + 27 * a * a * d ) / ( 27 * a * a * a ) ;

	if ( Math.abs( p ) < CUBIC_EPSILON ) {
		// p = 0 -> t³ = -q -> t = -q^1/3
		roots = [ Math.cbrt( -q ) ] ;
	}
	else if ( Math.abs( q ) < CUBIC_EPSILON ) {
		// q = 0 -> t³ + pt = 0 -> t ( t² + p ) = 0
		if ( p > 0 ) {
			roots = [ 0 ] ;
		}
		else {
			roots = [ 0 , Math.sqrt( -p ) , -Math.sqrt( -p ) ] ;
		}
	}
	else {
		delta = q * q / 4 + p * p * p / 27 ;

		if ( Math.abs( delta ) < CUBIC_EPSILON ) {
			// delta = 0 -> two roots
			roots = [ -1.5 * q / p , 3 * q / p ] ;
		}
		else if ( delta > 0 ) {
			// Only one real root
			let u = Math.cbrt( -q / 2 - Math.sqrt( delta ) ) ;
			roots = [ u - p / ( 3 * u ) ] ;
		}
		else {
			// delta < 0, three roots, but needs to use complex numbers/trigonometric solution
			let u = 2 * Math.sqrt( -p / 3 ) ;
			let t = Math.acos( 3 * q / p / u ) / 3 ;  // delta < 0 implies p < 0 and acos argument in [-1..1]
			let k = 2 * Math.PI / 3 ;
			roots = [ u * Math.cos( t ) , u * Math.cos( t - k ) , u * Math.cos( t - 2 * k ) ] ;
		}
	}

	// Convert back from depressed cubic
	for ( let i = 0 ; i < roots.length ; i ++ ) {
		roots[ i ] -= b / ( 3 * a ) ;
	}

	return roots ;
} ;

