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

/* jshint -W064, -W014 */

"use strict" ;



var Vector2D = require( './geometry/Vector2D.js' ) ;



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
Fn.create = function create( array , params )
{
	params = params || {} ;
	
	var self = Object.create( Fn.prototype , {
		controlePoints: { value: array , writable: true , enumerable: true } ,
		preserveExtrema: { value: !! params.preserveExtrema , writable: true , enumerable: true } ,
		atanMeanSlope: { value: !! params.atanMeanSlope , writable: true , enumerable: true } ,
	} ) ;
	
	self.init() ;
	
	return self ;
} ;



Fn.prototype.init = function init()
{
	var i , cpLen = this.controlePoints.length , beginSlope , midSlope , endSlope , da , db , a , b , c ;
	
	// First, sort controlePoints in ascending order
	this.controlePoints.sort( ( a , b ) => a.x - b.x ) ;
	
	// Phase 1: compute median points and mean slope
	
	for ( i = 0 ; i < cpLen - 1 ; i ++ )
	{
		this.controlePoints[ i ].midX = ( this.controlePoints[ i ].x + this.controlePoints[ i + 1 ].x ) / 2 ;
		this.controlePoints[ i ].intervalSlope =
			( this.controlePoints[ i + 1 ].fx - this.controlePoints[ i ].fx ) /
			( this.controlePoints[ i + 1 ].x - this.controlePoints[ i ].x ) ;
	}
	
	// Phase 2: compute controle points slope
	
	if ( typeof this.controlePoints[ 0 ].slope !== 'number' ) { this.controlePoints[ 0 ].slope = NaN ; }
	if ( typeof this.controlePoints[ cpLen - 1 ].slope !== 'number' ) { this.controlePoints[ cpLen - 1 ].slope = NaN ; }
	
	for ( i = 1 ; i < cpLen - 1 ; i ++ )
	{
		if ( typeof this.controlePoints[ i ].slope === 'number' ) { continue ; }
		
		if (
			this.preserveExtrema &&
			(
				(
					this.controlePoints[ i ].fx >= this.controlePoints[ i - 1 ].fx &&
					this.controlePoints[ i ].fx >= this.controlePoints[ i + 1 ].fx
				) || (
					this.controlePoints[ i ].fx <= this.controlePoints[ i - 1 ].fx &&
					this.controlePoints[ i ].fx <= this.controlePoints[ i + 1 ].fx 
				)
			)
		)
		{
			// This is a local extremum: they have a slope of 0
			this.controlePoints[ i ].slope = 0 ;
		}
		else if ( this.atanMeanSlope )
		{
			// The slope will be have an angle of the mean angle of the previous and next interval slope
			this.controlePoints[ i ].slope = Math.tan(
				(
					Math.atan( this.controlePoints[ i - 1 ].intervalSlope )
					+ Math.atan( this.controlePoints[ i ].intervalSlope )
				) / 2
			) ;
		}
		else
		{
			// The slope will be the mean value of the previous and next interval slope
			this.controlePoints[ i ].slope =
				( this.controlePoints[ i - 1 ].intervalSlope + this.controlePoints[ i ].intervalSlope ) / 2 ;
		}
	}
	
	// Phase 3: compute the midSlope
	
	for ( i = 0 ; i < cpLen - 1 ; i ++ )
	{
		if ( Number.isNaN( this.controlePoints[ i ].slope ) )
		{
			if ( Number.isNaN( this.controlePoints[ i + 1 ].slope ) )
			{
				beginSlope = endSlope = midSlope = this.controlePoints[ i ].intervalSlope ;
			}
			else
			{
				endSlope = this.controlePoints[ i + 1 ].slope ;
				midSlope = this.controlePoints[ i ].intervalSlope ;
				beginSlope = 4 * this.controlePoints[ i ].intervalSlope - endSlope - 2 * midSlope ;
			}
		}
		else if ( Number.isNaN( this.controlePoints[ i + 1 ].slope ) )
		{
			beginSlope = this.controlePoints[ i ].slope ;
			midSlope = this.controlePoints[ i ].intervalSlope ;
			endSlope = 4 * this.controlePoints[ i ].intervalSlope - beginSlope - 2 * midSlope ;
		}
		else
		{
			beginSlope = this.controlePoints[ i ].slope ;
			endSlope = this.controlePoints[ i + 1 ].slope ;
			midSlope = ( 4 * this.controlePoints[ i ].intervalSlope - beginSlope - endSlope ) / 2 ;
		}
		
		// Useful to keep track of that?
		this.controlePoints[ i ].beginSlope = beginSlope ;
		this.controlePoints[ i ].midSlope = midSlope ;
		this.controlePoints[ i ].endSlope = endSlope ;
		
		// left-side of the interval
		
		// Derivative: slope of the slope, for the left half of the interval
		a = ( midSlope - beginSlope ) / ( this.controlePoints[ i ].midX - this.controlePoints[ i ].x ) ;
		b = beginSlope - a * this.controlePoints[ i ].x ;
		
		// Primitives: ax + b -> (a/2)x² + bx
		a = a / 2 ;
		// 'b' does not change
		c = this.controlePoints[ i ].fx - ( a * this.controlePoints[ i ].x * this.controlePoints[ i ].x + b * this.controlePoints[ i ].x ) ;
		
		this.controlePoints[ i ].leftA = a ;
		this.controlePoints[ i ].leftB = b ;
		this.controlePoints[ i ].leftC = c ;
		
		// right-side of the interval
		
		// Derivative: slope of the slope, for the right half of the interval
		a = ( endSlope - midSlope ) / ( this.controlePoints[ i + 1 ].x - this.controlePoints[ i ].midX ) ;
		b = endSlope - a * this.controlePoints[ i + 1 ].x ;
		
		// Primitives: ax + b -> (a/2)x² + bx
		a = a / 2 ;
		// 'b' does not change
		c = this.controlePoints[ i + 1 ].fx - ( a * this.controlePoints[ i + 1 ].x * this.controlePoints[ i + 1 ].x + b * this.controlePoints[ i + 1 ].x ) ;
		
		this.controlePoints[ i ].rightA = a ;
		this.controlePoints[ i ].rightB = b ;
		this.controlePoints[ i ].rightC = c ;
	}
} ;



Fn.prototype.fx = function fx( x )
{
	// Naive algorithm, for instance.
	// Should be better to divide and conquer, particularly for big samples...
	
	var i , cp ;
	
	if ( x < this.controlePoints[ 0 ].x || x > this.controlePoints[ this.controlePoints.length - 1 ].x )
	{
		// Out of bounds
		return NaN ;
	}
	
	for ( var i = this.controlePoints.length - 1 ; i >= 0 ; i -- )
	{
		cp = this.controlePoints[ i ] ;
		
		// Exact match
		if ( x === cp.x )
		{
			return cp.fx ;
		}
		else if ( x > cp.x )
		{
			if ( x < cp.midX )
			{
				return cp.leftA * x * x + cp.leftB * x + cp.leftC ;
			}
			else
			{
				return cp.rightA * x * x + cp.rightB * x + cp.rightC ;
			}
		}
	}
} ;



// Tracer generator for the fn
Fn.prototype.tracer = function* tracer( pixelSize , xmin , xmax )
{
	var x , position = Vector2D() ;
	
	for ( x = xmin ; x <= xmax ; x += pixelSize ) 
	{
		position.x = x ;
		position.y = this.fx( x ) ;
		
		yield position ;
	}
} ;

