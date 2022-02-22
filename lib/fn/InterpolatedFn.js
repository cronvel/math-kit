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



const CompositeFn = require( './CompositeFn.js' ) ;
const PolynomialFn = require( './PolynomialFn.js' ) ;



/*
	Accept an array of object, having:
	* x: the x value
	* fx: the value of f(x) for this x value

	After init:
	* dfx: the dericative or slope at x
	* intervalDfx: the mean slope for the whole interval
	* midX: the x value cutting the interval in 2
	* midDfx: the slope at the middle of the interval
*/
function InterpolatedFn( controlPoints , params = {} , noInit = false ) {
	CompositeFn.call( this ) ;

	this.controlPoints = controlPoints ;
	this.preserveExtrema = !! params.preserveExtrema ;
	this.atanMeanDfx = !! params.atanMeanDfx ;

	if ( ! noInit ) { this.init() ; }
}

InterpolatedFn.prototype = Object.create( CompositeFn.prototype ) ;
InterpolatedFn.prototype.constructor = InterpolatedFn ;

module.exports = InterpolatedFn ;



InterpolatedFn.prototype.set = function( controlPoints ) {
	this.controlPoints = controlPoints ;
	this.init() ;
} ;



InterpolatedFn.prototype.dup = InterpolatedFn.prototype.clone = function() {
	var clone = new InterpolatedFn( controlPoints.map( cp => Object.assign( {} , cp ) ) , this , true ) ;

	for ( let band of this.bands ) {
		clone.bands.push( { min: band.min , max: band.max , fn: band.fn.dup() } ) ;
	}

	return clone ;
} ;



InterpolatedFn.prototype.init = function() {
	var i , cp , nextCp , previousCp , beginDfx , midDfx , endDfx , a , b , c ,
		cpLen = this.controlPoints.length ;

	// Always remove all bands
	this.bands.length = 0 ;
	
	// First, sort controlPoints in ascending order
	this.controlPoints.sort( ( a_ , b_ ) => a_.x - b_.x ) ;

	// Phase 1: compute median points and mean slope (dfx)

	for ( i = 0 ; i < cpLen - 1 ; i ++ ) {
		cp = this.controlPoints[ i ] ;
		nextCp = this.controlPoints[ i + 1 ] ;

		cp.midX = ( cp.x + nextCp.x ) / 2 ;
		cp.intervalDfx = ( nextCp.fx - cp.fx ) / ( nextCp.x - cp.x ) ;
	}

	// Phase 2: compute controle points slope (dfx)

	if ( typeof this.controlPoints[ 0 ].dfx !== 'number' ) { this.controlPoints[ 0 ].dfx = NaN ; }
	if ( typeof this.controlPoints[ cpLen - 1 ].dfx !== 'number' ) { this.controlPoints[ cpLen - 1 ].dfx = NaN ; }

	for ( i = 1 ; i < cpLen - 1 ; i ++ ) {
		cp = this.controlPoints[ i ] ;
		nextCp = this.controlPoints[ i + 1 ] ;
		previousCp = this.controlPoints[ i - 1 ] ;

		if ( typeof cp.dfx === 'number' ) { continue ; }

		if (
			this.preserveExtrema &&
			(
				( cp.fx >= previousCp.fx && cp.fx >= nextCp.fx )
				|| ( cp.fx <= previousCp.fx && cp.fx <= nextCp.fx )
			)
		) {
			// This is a local extremum: they have a slope of 0
			cp.dfx = 0 ;
		}
		else if ( this.atanMeanDfx ) {
			// The slope will be have an angle of the mean angle of the previous and next interval slope
			cp.dfx = Math.tan( ( Math.atan( previousCp.intervalDfx ) + Math.atan( cp.intervalDfx ) ) / 2 ) ;
		}
		else {
			// The slope will be the mean value of the previous and next interval slope
			cp.dfx = ( previousCp.intervalDfx + cp.intervalDfx ) / 2 ;
		}
	}

	// Phase 3: compute the midDfx

	for ( i = 0 ; i < cpLen - 1 ; i ++ ) {
		cp = this.controlPoints[ i ] ;
		nextCp = this.controlPoints[ i + 1 ] ;

		if ( Number.isNaN( cp.dfx ) ) {
			if ( Number.isNaN( nextCp.dfx ) ) {
				beginDfx = endDfx = midDfx = cp.intervalDfx ;
			}
			else {
				endDfx = nextCp.dfx ;
				midDfx = cp.intervalDfx ;
				beginDfx = 4 * cp.intervalDfx - endDfx - 2 * midDfx ;
			}
		}
		else if ( Number.isNaN( nextCp.dfx ) ) {
			beginDfx = cp.dfx ;
			midDfx = cp.intervalDfx ;
			endDfx = 4 * cp.intervalDfx - beginDfx - 2 * midDfx ;
		}
		else {
			beginDfx = cp.dfx ;
			endDfx = nextCp.dfx ;
			midDfx = ( 4 * cp.intervalDfx - beginDfx - endDfx ) / 2 ;
		}

		// left-side of the interval

		// Derivative: slope of the slope, for the left half of the interval
		a = ( midDfx - beginDfx ) / ( cp.midX - cp.x ) ;
		b = beginDfx - a * cp.x ;

		// Primitives: ax + b -> (a/2)x² + bx
		a = a / 2 ;
		// 'b' does not change
		c = cp.fx - ( a * cp.x * cp.x + b * cp.x ) ;

		this.bands.push( {
			min: cp.x ,
			max: cp.midX ,
			fn: new PolynomialFn( c , b , a )
		} ) ;

		// right-side of the interval

		// Derivative: slope of the slope, for the right half of the interval
		a = ( endDfx - midDfx ) / ( nextCp.x - cp.midX ) ;
		b = endDfx - a * nextCp.x ;

		// Primitives: ax + b -> (a/2)x² + bx
		a = a / 2 ;
		// 'b' does not change
		c = nextCp.fx - ( a * nextCp.x * nextCp.x + b * nextCp.x ) ;

		this.bands.push( {
			min: cp.midX ,
			max: nextCp.x ,
			fn: new PolynomialFn( c , b , a )
		} ) ;
	}
} ;

