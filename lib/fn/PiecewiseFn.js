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
	* min: the lowest x value for this interval
	* max: the highest x value for this interval
	* fn: the f(x) function associated to this interval
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
	return new PiecewiseFn( ... this.intervals.map( interval => ( { min: interval.min , max: interval.max , fn: interval.fn.dup() } ) ) ) ;
} ;



PiecewiseFn.prototype.add = function( v ) {
	for ( let interval of this.intervals ) {
		interval.fn.add( v ) ;
	}
} ;



PiecewiseFn.prototype.sub = function( v ) {
	for ( let interval of this.intervals ) {
		interval.fn.sub( v ) ;
	}
} ;



PiecewiseFn.prototype.solveFor = PiecewiseFn.prototype.solve = function( y = 0 ) {
	var interval , intervalSolutions , oneSolution ,
		solutions = [] ;

	for ( interval of this.intervals ) {
		intervalSolutions = interval.fn.solveFor( y ) ;

		if ( solutions ) {
			for ( oneSolution of intervalSolutions ) {
				if ( oneSolution >= interval.min && oneSolution <= interval.max ) {
					solutions.push( oneSolution ) ;
				}
			}
		}
	}

	return solutions.length ? solutions : null ;
} ;



PiecewiseFn.prototype.findInterval = function( x ) {
	// Naive algorithm, for instance.
	// Should be better to divide and conquer, particularly for big samples...
	for ( let interval of this.intervals ) {
		if ( x >= interval.min && x <= interval.max ) { return interval ; }
	}

	return null ;
} ;



PiecewiseFn.prototype.fx = function( x ) {
	var interval = this.findInterval( x ) ;
	if ( ! interval ) { return NaN ; }
	return interval.fn.fx( x ) ;
} ;



// Derivative
PiecewiseFn.prototype.dfx = function( x ) {
	var interval = this.findInterval( x ) ;
	if ( ! interval ) { return NaN ; }
	return interval.fn.dfx( x ) ;
} ;



// Return a new derivative function
PiecewiseFn.prototype.createDfxFn = function() {
	return new PiecewiseFn( ... this.intervals.map( interval => ( { min: interval.min , max: interval.max , fn: interval.fn.createDfxFn() } ) ) ) ;
} ;



// Integral
PiecewiseFn.prototype.sfx = function( x , constant = 0 ) {
	var interval = this.findInterval( x ) ;
	if ( ! interval ) { return NaN ; }
	return interval.fn.sfx( x , constant ) ;
} ;



// Return a new integral function
// This is a bit more complicated since we have to make integral function continuous
PiecewiseFn.prototype.createSfxFn = function( constant = 0 ) {
	var i , interval , sfxFn ,
		lastSfx = NaN ,
		sfxIntervals = [] ;

	for ( i = 0 ; i < this.intervals.length ; i ++ ) {
		interval = this.intervals[ i ] ;
		sfxFn = interval.fn.createSfxFn( constant ) ;

		if ( Number.isFinite( lastSfx ) ) {
			sfxFn.add( lastSfx - sfxFn.fx( interval.min ) ) ;
		}

		sfxIntervals[ i ] = { min: interval.min , max: interval.max , fn: sfxFn } ;
		lastSfx = sfxFn.fx( interval.max ) ;
	}

	return new PiecewiseFn( ... sfxIntervals ) ;
} ;

