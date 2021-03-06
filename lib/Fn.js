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



const Vector2D = require( './geometry/Vector2D.js' ) ;



function Fn( array ) { return Fn.create( array ) ; }

module.exports = Fn ;



/*
	Accept an array of object, having:
	* x: the x value
	* fx: the value of f(x) for this x value

	After init:
	* slope: the slope value (derivative) for at x
	* intervalSlope: the mean slope for the whole interval
	* midX: the x value cutting the interval in 2
	* midSlope: the slope at the middle of the interval
*/
Fn.create = function( array , params ) {
	params = params || {} ;

	var self = Object.create( Fn.prototype , {
		controlPoints: { value: array , writable: true , enumerable: true } ,
		preserveExtrema: { value: !! params.preserveExtrema , writable: true , enumerable: true } ,
		atanMeanSlope: { value: !! params.atanMeanSlope , writable: true , enumerable: true }
	} ) ;

	self.init() ;

	return self ;
} ;



Fn.prototype.init = function() {
	var i , cpLen = this.controlPoints.length , beginSlope , midSlope , endSlope , a , b , c ;

	// First, sort controlPoints in ascending order
	this.controlPoints.sort( ( a_ , b_ ) => a_.x - b_.x ) ;

	// Phase 1: compute median points and mean slope

	for ( i = 0 ; i < cpLen - 1 ; i ++ ) {
		this.controlPoints[ i ].midX = ( this.controlPoints[ i ].x + this.controlPoints[ i + 1 ].x ) / 2 ;
		this.controlPoints[ i ].intervalSlope =
			( this.controlPoints[ i + 1 ].fx - this.controlPoints[ i ].fx ) /
			( this.controlPoints[ i + 1 ].x - this.controlPoints[ i ].x ) ;
	}

	// Phase 2: compute controle points slope

	if ( typeof this.controlPoints[ 0 ].slope !== 'number' ) { this.controlPoints[ 0 ].slope = NaN ; }
	if ( typeof this.controlPoints[ cpLen - 1 ].slope !== 'number' ) { this.controlPoints[ cpLen - 1 ].slope = NaN ; }

	for ( i = 1 ; i < cpLen - 1 ; i ++ ) {
		if ( typeof this.controlPoints[ i ].slope === 'number' ) { continue ; }

		if (
			this.preserveExtrema &&
			(
				(
					this.controlPoints[ i ].fx >= this.controlPoints[ i - 1 ].fx &&
					this.controlPoints[ i ].fx >= this.controlPoints[ i + 1 ].fx
				) || (
					this.controlPoints[ i ].fx <= this.controlPoints[ i - 1 ].fx &&
					this.controlPoints[ i ].fx <= this.controlPoints[ i + 1 ].fx
				)
			)
		) {
			// This is a local extremum: they have a slope of 0
			this.controlPoints[ i ].slope = 0 ;
		}
		else if ( this.atanMeanSlope ) {
			// The slope will be have an angle of the mean angle of the previous and next interval slope
			this.controlPoints[ i ].slope = Math.tan(
				(
					Math.atan( this.controlPoints[ i - 1 ].intervalSlope )
					+ Math.atan( this.controlPoints[ i ].intervalSlope )
				) / 2
			) ;
		}
		else {
			// The slope will be the mean value of the previous and next interval slope
			this.controlPoints[ i ].slope =
				( this.controlPoints[ i - 1 ].intervalSlope + this.controlPoints[ i ].intervalSlope ) / 2 ;
		}
	}

	// Phase 3: compute the midSlope

	for ( i = 0 ; i < cpLen - 1 ; i ++ ) {
		if ( Number.isNaN( this.controlPoints[ i ].slope ) ) {
			if ( Number.isNaN( this.controlPoints[ i + 1 ].slope ) ) {
				beginSlope = endSlope = midSlope = this.controlPoints[ i ].intervalSlope ;
			}
			else {
				endSlope = this.controlPoints[ i + 1 ].slope ;
				midSlope = this.controlPoints[ i ].intervalSlope ;
				beginSlope = 4 * this.controlPoints[ i ].intervalSlope - endSlope - 2 * midSlope ;
			}
		}
		else if ( Number.isNaN( this.controlPoints[ i + 1 ].slope ) ) {
			beginSlope = this.controlPoints[ i ].slope ;
			midSlope = this.controlPoints[ i ].intervalSlope ;
			endSlope = 4 * this.controlPoints[ i ].intervalSlope - beginSlope - 2 * midSlope ;
		}
		else {
			beginSlope = this.controlPoints[ i ].slope ;
			endSlope = this.controlPoints[ i + 1 ].slope ;
			midSlope = ( 4 * this.controlPoints[ i ].intervalSlope - beginSlope - endSlope ) / 2 ;
		}

		// Useful to keep track of that?
		this.controlPoints[ i ].beginSlope = beginSlope ;
		this.controlPoints[ i ].midSlope = midSlope ;
		this.controlPoints[ i ].endSlope = endSlope ;

		// left-side of the interval

		// Derivative: slope of the slope, for the left half of the interval
		a = ( midSlope - beginSlope ) / ( this.controlPoints[ i ].midX - this.controlPoints[ i ].x ) ;
		b = beginSlope - a * this.controlPoints[ i ].x ;

		// Primitives: ax + b -> (a/2)x² + bx
		a = a / 2 ;
		// 'b' does not change
		c = this.controlPoints[ i ].fx - ( a * this.controlPoints[ i ].x * this.controlPoints[ i ].x + b * this.controlPoints[ i ].x ) ;

		this.controlPoints[ i ].leftA = a ;
		this.controlPoints[ i ].leftB = b ;
		this.controlPoints[ i ].leftC = c ;

		// right-side of the interval

		// Derivative: slope of the slope, for the right half of the interval
		a = ( endSlope - midSlope ) / ( this.controlPoints[ i + 1 ].x - this.controlPoints[ i ].midX ) ;
		b = endSlope - a * this.controlPoints[ i + 1 ].x ;

		// Primitives: ax + b -> (a/2)x² + bx
		a = a / 2 ;
		// 'b' does not change
		c = this.controlPoints[ i + 1 ].fx - ( a * this.controlPoints[ i + 1 ].x * this.controlPoints[ i + 1 ].x + b * this.controlPoints[ i + 1 ].x ) ;

		this.controlPoints[ i ].rightA = a ;
		this.controlPoints[ i ].rightB = b ;
		this.controlPoints[ i ].rightC = c ;
	}
} ;



Fn.prototype.fx = function( x ) {
	// Naive algorithm, for instance.
	// Should be better to divide and conquer, particularly for big samples...

	var i , cp ;

	if ( x < this.controlPoints[ 0 ].x || x > this.controlPoints[ this.controlPoints.length - 1 ].x ) {
		// Out of bounds
		return NaN ;
	}

	for ( i = this.controlPoints.length - 1 ; i >= 0 ; i -- ) {
		cp = this.controlPoints[ i ] ;

		// Exact match
		if ( x === cp.x ) {
			return cp.fx ;
		}
		else if ( x > cp.x ) {
			if ( x < cp.midX ) {
				return cp.leftA * x * x + cp.leftB * x + cp.leftC ;
			}

			return cp.rightA * x * x + cp.rightB * x + cp.rightC ;

		}
	}
} ;



// Tracer generator for the fn
Fn.prototype.tracer = function*( pixelSize , xmin , xmax ) {
	var x , position = Vector2D() ;

	for ( x = xmin ; x <= xmax ; x += pixelSize ) {
		position.x = x ;
		position.y = this.fx( x ) ;

		yield position ;
	}
} ;

