/*
	Math Kit
	
	Copyright (c) 2014 - 2017 Cédric Ronvel
	
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



exports.setEpsilon = function setEpsilon( e )
{
	EPSILON = e ;
	INVERSE_EPSILON = Math.round( 1 / e ) ;
} ;



exports.getEpsilon = function getEpsilon()
{
	return EPSILON ;
} ;



exports.epsilonRound = function epsilonRound( v )
{
	// INVERSE_EPSILON is an integer and works WAY BETTER than EPSILON.
	// It is important to always use it, even if it involves divisions.
	return Math.round( v * INVERSE_EPSILON ) / INVERSE_EPSILON ;
} ;



exports.epsilonZero = function epsilonZero( v )
{
	return v <= EPSILON && v >= - EPSILON ? 0 : v ;
} ;



exports.epsilonCompare = function epsilonCompare( a , b )
{
	var diff = a - b ;
	return diff <= EPSILON && diff >= - EPSILON ? 0 : diff ;
} ;



exports.epsilonEquals = exports.epsilonEq = exports.eeq = function epsilonEquals( a , b )
{
	var diff = a - b ;
	return diff <= EPSILON && diff >= - EPSILON ;
} ;



exports.epsilonGt = exports.egt = function epsilonGt( a , b )
{
	return a > b + EPSILON ;
} ;



exports.epsilonGte = exports.egte = function epsilonGte( a , b )
{
	return a >= b - EPSILON ;
} ;



exports.epsilonLt = exports.elt = function epsilonLt( a , b )
{
	return a < b - EPSILON ;
} ;



exports.epsilonLte = exports.elte = function epsilonLt( a , b )
{
	return a <= b + EPSILON ;
} ;

