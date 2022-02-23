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
function PiecewiseFn( ... intervals ) {
	this.intervals = intervals ;
}

PiecewiseFn.prototype = Object.create( Fn.prototype ) ;
PiecewiseFn.prototype.constructor = PiecewiseFn ;

module.exports = PiecewiseFn ;



PiecewiseFn.prototype.set = function( ... intervals ) {
	this.intervals = intervals ;
} ;



PiecewiseFn.prototype.dup = PiecewiseFn.prototype.clone = function() {
	return new PiecewiseFn( ... this.intervals.map( band => ( { min: band.min , max: band.max , fn: band.fn.dup() } ) ) ) ;
} ;



PiecewiseFn.prototype.add = function( v ) {
	for ( let band of this.intervals ) {
		band.fn.add( v ) ;
	}
} ;



PiecewiseFn.prototype.sub = function( v ) {
	for ( let band of this.intervals ) {
		band.fn.sub( v ) ;
	}
} ;



PiecewiseFn.prototype.solveFor = PiecewiseFn.prototype.solve = function( y = 0 ) {
	var band , bandSolutions , oneSolution ,
		solutions = [] ;

	for ( band of this.intervals ) {
		bandSolutions = band.fn.solveFor( y ) ;

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



PiecewiseFn.prototype.findBand = function( x ) {
	// Naive algorithm, for instance.
	// Should be better to divide and conquer, particularly for big samples...
	for ( let band of this.intervals ) {
		if ( x >= band.min && x <= band.max ) { return band ; }
	}

	return null ;
} ;



PiecewiseFn.prototype.fx = function( x ) {
	var band = this.findBand( x ) ;
	if ( ! band ) { return NaN ; }
	return band.fn.fx( x ) ;
} ;



// Derivative
PiecewiseFn.prototype.dfx = function( x ) {
	var band = this.findBand( x ) ;
	if ( ! band ) { return NaN ; }
	return band.fn.dfx( x ) ;
} ;



// Return a new derivative function
PiecewiseFn.prototype.createDfxFn = function() {
	return new PiecewiseFn( ... this.intervals.map( band => ( { min: band.min , max: band.max , fn: band.fn.createDfxFn() } ) ) ) ;
} ;



// Integral
PiecewiseFn.prototype.sfx = function( x , constant = 0 ) {
	var band = this.findBand( x ) ;
	if ( ! band ) { return NaN ; }
	return band.fn.sfx( x , constant ) ;
} ;



// Return a new integral function
// This is a bit more complicated since we have to make integral function continuous
PiecewiseFn.prototype.createSfxFn = function( constant = 0 ) {
	var i , band , sfxFn ,
		lastSfx = NaN ,
		sfxBands = [] ;

	for ( i = 0 ; i < this.intervals.length ; i ++ ) {
		band = this.intervals[ i ] ;
		sfxFn = band.fn.createSfxFn( constant ) ;

		if ( Number.isFinite( lastSfx ) ) {
			sfxFn.add( lastSfx - sfxFn.fx( band.min ) ) ;
		}

		sfxBands[ i ] = { min: band.min , max: band.max , fn: sfxFn } ;
		lastSfx = sfxFn.fx( band.max ) ;
	}

	return new PiecewiseFn( ... sfxBands ) ;
} ;

