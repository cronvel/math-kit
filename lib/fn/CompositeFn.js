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
	Accept a list of object, having:
	* min: the lowest x value for this band
	* max: the highest x value for this band
	* fn: the f(x) function associated to this band
*/
function CompositeFn( ... bands ) {
	this.bands = bands ;
}

CompositeFn.prototype = Object.create( Fn.prototype ) ;
CompositeFn.prototype.constructor = CompositeFn ;

module.exports = CompositeFn ;



CompositeFn.prototype.set = function( ... bands ) {
	this.bands = bands ;
} ;



CompositeFn.prototype.dup = CompositeFn.prototype.clone = function() {
	return new CompositeFn( ... this.bands.map( band => ( { min: band.min , max: band.max , fn: band.fn.dup() } ) ) ) ;
} ;



CompositeFn.prototype.add = function( v ) {
	for ( let band of this.bands ) {
		band.fn.add( v ) ;
	}
} ;



CompositeFn.prototype.sub = function( v ) {
	for ( let band of this.bands ) {
		band.fn.sub( v ) ;
	}
} ;



CompositeFn.prototype.solveFor = CompositeFn.prototype.solve = function( v = 0 ) {
	var band , bandSolutions , oneSolution ,
		solutions = [] ;

	for ( band of this.bands ) {
		bandSolutions = band.fn.solveFor( v ) ;

		if ( solutions ) {
			for ( oneSolution of bandSolutions ) {
				if ( oneSolution >= band.min && oneSolution <= band.max ) {
					solutions.push( oneSolution ) ;
				}
			}
		}
	}

	return solutions.length ? solutions : null ;
} ;



CompositeFn.prototype.findBand = function( x ) {
	// Naive algorithm, for instance.
	// Should be better to divide and conquer, particularly for big samples...
	for ( let band of this.bands ) {
		if ( x >= band.min && x <= band.max ) { return band ; }
	}

	return null ;
} ;



CompositeFn.prototype.fx = function( x ) {
	var band = this.findBand( x ) ;
	if ( ! band ) { return NaN ; }
	return band.fn.fx( x ) ;
} ;



// Derivative
CompositeFn.prototype.dfx = function( x ) {
	var band = this.findBand( x ) ;
	if ( ! band ) { return NaN ; }
	return band.fn.dfx( x ) ;
} ;



// Return a new derivative function
CompositeFn.prototype.createDfxFn = function() {
	return new CompositeFn( ... this.bands.map( band => ( { min: band.min , max: band.max , fn: band.fn.createDfxFn() } ) ) ) ;
} ;



// Integral
CompositeFn.prototype.sfx = function( x , constant = 0 ) {
	var band = this.findBand( x ) ;
	if ( ! band ) { return NaN ; }
	return band.fn.sfx( x , constant ) ;
} ;



// Return a new integral function
// This is a bit more complicated since we have to make integral function continuous
CompositeFn.prototype.createSfxFn = function( constant = 0 ) {
	var i , band , sfxFn ,
		lastSfx = NaN ,
		sfxBands = [] ;

	for ( i = 0 ; i < this.bands.length ; i ++ ) {
		band = this.bands[ i ] ;
		sfxFn = band.fn.createSfxFn( constant ) ;

		if ( Number.isFinite( lastSfx ) ) {
			sfxFn.add( lastSfx - sfxFn.fx( band.min ) ) ;
		}

		sfxBands[ i ] = { min: band.min , max: band.max , fn: sfxFn } ;
		lastSfx = sfxFn.fx( band.max ) ;
	}

	return new CompositeFn( ... sfxBands ) ;
} ;

