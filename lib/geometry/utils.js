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



// Fixed (absolute) epsilon (not relative to the exposant, because it's faster to compute)
// EPSILON and INVERSE_EPSILON are private

var EPSILON = 0.0000000001 ;
var INVERSE_EPSILON = Math.round( 1 / EPSILON ) ;



exports.setEpsilon = function( e ) {
	EPSILON = e ;
	INVERSE_EPSILON = Math.round( 1 / e ) ;
} ;



exports.getEpsilon = function() {
	return EPSILON ;
} ;



exports.epsilonRound = function( v ) {
	// INVERSE_EPSILON is an integer and works WAY BETTER than EPSILON.
	// It is important to always use it, even if it involves divisions.
	return Math.round( v * INVERSE_EPSILON ) / INVERSE_EPSILON ;
} ;



exports.epsilonZero = function( v ) {
	return v <= EPSILON && v >= -EPSILON ? 0 : v ;
} ;



exports.epsilonCompare = function( a , b ) {
	var diff = a - b ;
	return diff <= EPSILON && diff >= -EPSILON ? 0 : diff ;
} ;



exports.epsilonEquals = exports.epsilonEq = exports.eeq = function( a , b ) {
	var diff = a - b ;
	return diff <= EPSILON && diff >= -EPSILON ;
} ;



exports.epsilonNotEquals = exports.epsilonNotEq = exports.eneq = function( a , b ) {
	var diff = a - b ;
	return diff > EPSILON || diff < -EPSILON ;
} ;



exports.epsilonGt = exports.egt = function( a , b ) {
	return a > b + EPSILON ;
} ;



exports.epsilonGte = exports.egte = function( a , b ) {
	return a >= b - EPSILON ;
} ;



exports.epsilonLt = exports.elt = function( a , b ) {
	return a < b - EPSILON ;
} ;



exports.epsilonLte = exports.elte = function( a , b ) {
	return a <= b + EPSILON ;
} ;



// a < b < c
exports.epsilon3Lt = exports.e3lt = function( a , b , c ) {
	return a < b - EPSILON && b < c - EPSILON ;
} ;



// a <= b <= c
exports.epsilon3Lte = exports.e3lte = function( a , b , c ) {
	return a <= b + EPSILON && b <= c + EPSILON ;
} ;



// Fast/precision alternatives



exports.fastHypot2 = function( dx , dy ) {
	return Math.sqrt( dx * dx + dy * dy ) ;
} ;



exports.fastHypot3 = function( dx , dy , dz ) {
	return Math.sqrt( dx * dx + dy * dy + dz * dz ) ;
} ;



// We have already computed x²+y²[+z²], either return sqrt of that squared length or the precise hypot
exports.fastSqHypot2 = function( sq , dx , dy ) { return Math.sqrt( sq ) ; } ;
exports.fastSqHypot3 = function( sq , dx , dy , dz ) { return Math.sqrt( sq ) ; } ;
function sqHypot2( sq , dx , dy ) { return Math.hypot( dx , dy ) ; }
function sqHypot3( sq , dx , dy , dz ) { return Math.hypot( dx , dy , dz ) ; }



exports.setFastMode = function( v ) {
	if ( v ) {
		exports.hypot2 = exports.fastHypot2 ;
		exports.hypot3 = exports.fastHypot3 ;
		exports.sqHypot2 = exports.fastSqHypot2 ;
		exports.sqHypot3 = exports.fastSqHypot3 ;
	}
	else {
		exports.hypot2 = Math.hypot ;
		exports.hypot3 = Math.hypot ;
		exports.sqHypot2 = sqHypot2 ;
		exports.sqHypot3 = sqHypot3 ;
	}
} ;

// Default to false: precision
exports.setFastMode( false ) ;



