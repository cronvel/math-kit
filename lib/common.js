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



const commonMath = {} ;
module.exports = commonMath ;



// Just return the value in bounds
commonMath.range = ( value , min , max ) => {
	if ( min > max ) { let swap = min ; min = max ; max = swap ; }

	value = + value ;

	if ( value < min ) { return min ; }
	if ( value > max ) { return max ; }

	return value ;
} ;



// It is a trivial formula, but I always forget how to do it...
commonMath.baseLog = ( x , y ) => Math.log( y ) / Math.log( x ) ;



// Compute the average of its arguments
commonMath.average = commonMath.avg = ( ... args ) => {
	var i , length = args.length , sum = 0 ;
	for ( i = 0 ; i < length ; i ++ ) { sum += args[ i ] ; }
	return sum / length ;
} ;



// For instance, geometry has its own EPSILON

commonMath.EPSILON = 0.0000000001 ;
commonMath.INVERSE_EPSILON = Math.round( 1 / commonMath.EPSILON ) ;

commonMath.epsilonRound = commonMath.eround = v => Math.round( v * commonMath.INVERSE_EPSILON ) / commonMath.INVERSE_EPSILON ;



// Round with precision
commonMath.round = ( v , step ) => {
	if ( step === undefined ) { return Math.round( v ) ; }
	// use: v * ( 1 / step )
	// not: v / step
	// reason: epsilon rounding errors
	return commonMath.epsilonRound( step * Math.round( v * ( 1 / step ) ) ) ;
} ;



// Floor with precision
commonMath.floor = ( v , step ) => {
	if ( step === undefined ) { return Math.floor( v ) ; }
	// use: v * ( 1 / step )
	// not: v / step
	// reason: epsilon rounding errors
	return commonMath.epsilonRound( step * Math.floor( v * ( 1 / step ) ) ) ;
} ;



// Ceil with precision
commonMath.ceil = ( v , step ) => {
	if ( step === undefined ) { return Math.ceil( v ) ; }
	// use: v * ( 1 / step )
	// not: v / step
	// reason: epsilon rounding errors
	return commonMath.epsilonRound( step * Math.ceil( v * ( 1 / step ) ) ) ;
} ;



// Trunc with precision
commonMath.trunc = ( v , step ) => {
	if ( step === undefined ) { return Math.trunc( v ) ; }
	// use: v * ( 1 / step )
	// not: v / step
	// reason: epsilon rounding errors
	return step * Math.trunc( v * ( 1 / step ) ) ;
} ;



// Integer division
commonMath.intDiv = commonMath.intdiv = ( a , b ) => Math.trunc( a / b ) ;



// Floored integer division
commonMath.flooredIntDiv = ( a , b ) => Math.floor( a / b ) ;



// Positive modulo, even when the result of the division would be negative, works in pair with .flooredIntDiv()
commonMath.positiveModulo = ( a , b ) => {
	var v = a % b ;
	if ( v < 0 ) { v += b ; }
	return v ;
} ;



// True exclusive logical XOR
commonMath.xor = ( ... args ) => {
	var i = 0 , iMax = args.length , trueCount = 0 ;
	for ( ; trueCount <= 1 && i < iMax ; i ++ ) { trueCount += args[ i ] && 1 || 0 ; }
	return trueCount === 1 ;
} ;



function toValue( value ) {
	if ( typeof value === 'string' ) { value = parseFloat( value ) ; }
	if ( typeof value !== 'number' ) { return 0 ; }
	return value ;
}



// Return true if the arguments are all in an ascendant order.
// Each arguments can be an array, so it works with versions-like numbers.
commonMath.isOrdered = ( ... args ) => {
	var i , j ;

	for ( i = 0 ; i < args.length ; i ++ ) {
		if ( ! Array.isArray( args[ i ] ) ) { args[ i ] = [ args[ i ] ] ; }

		if ( i === 0 ) { continue ; }

		for ( j = 0 ; j < args[ i - 1 ].length || j < args[ i ].length ; j ++ ) {
			args[ i - 1 ][ j ] = toValue( args[ i - 1 ][ j ] ) ;
			args[ i ][ j ] = toValue( args[ i ][ j ] ) ;

			if ( args[ i - 1 ][ j ] > args[ i ][ j ] ) { return false ; }
			else if ( args[ i - 1 ][ j ] < args[ i ][ j ] ) { break ; }
		}
	}

	return true ;
} ;



// Return true if the 'a' is greater than 'b'.
// Each arguments can be an array, so it works with versions-like numbers.
commonMath.isGreater = ( a , b , orEquals ) => {
	var i ;

	if ( ! Array.isArray( a ) ) { a = [ a ] ; }
	if ( ! Array.isArray( b ) ) { b = [ b ] ; }

	for ( i = 0 ; i < a.length || i < b.length ; i ++ ) {
		a[ i ] = toValue( a[ i ] ) ;
		b[ i ] = toValue( b[ i ] ) ;

		if ( a[ i ] < b[ i ] ) { return false ; }
		else if ( a[ i ] > b[ i ] ) { return true ; }
	}

	return !! orEquals ;
} ;

// Shorthand
commonMath.isGreaterOrEquals = ( a , b ) => commonMath.isGreater( a , b , true ) ;
commonMath.isLesser = ( a , b ) => commonMath.isGreater( b , a ) ;
commonMath.isLesserOrEquals = ( a , b ) => commonMath.isGreater( b , a , true ) ;

