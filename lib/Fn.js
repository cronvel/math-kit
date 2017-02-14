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
Fn.create = function create( array )
{
	var self = Object.create( Fn.prototype , {
		controlePoints: { value: array , writable: true , enumerable: true } ,
	} ) ;
	
	self.init() ;
	
	return self ;
} ;



Fn.prototype.init = function init()
{
	var i , cpLen = this.controlePoints.length , a , midSlope ;
	
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
			(
				this.controlePoints[ i ].fx > this.controlePoints[ i - 1 ].fx &&
				this.controlePoints[ i ].fx > this.controlePoints[ i + 1 ].fx
			) || (
				this.controlePoints[ i ].fx < this.controlePoints[ i - 1 ].fx &&
				this.controlePoints[ i ].fx < this.controlePoints[ i + 1 ].fx 
			)
		)
		{
			// This is a local extremum: they have a slope of 0
			this.controlePoints[ i ].slope = 0 ;
		}
		else
		{
			// This is normal point, its slope will be the mean value of the previous and next interval slope
			this.controlePoints[ i ].slope = ( this.controlePoints[ i - 1 ].intervalSlope + this.controlePoints[ i ].intervalSlope ) / 2 ;
		}
	}
	
	// Phase 3: compute the midSlope
	
	for ( i = 0 ; i < cpLen - 1 ; i ++ )
	{
		if ( Number.isNaN( this.controlePoints[ i ].slope ) )
		{
			if ( Number.isNaN( this.controlePoints[ i + 1 ].slope ) )
			{
			}
			else
			{
			}
		}
		else if ( Number.isNaN( this.controlePoints[ i + 1 ].slope ) )
		{
		}
		else
		{
			midSlope = 3 * this.controlePoints[ i ].intervalSlope
				- this.controlePoints[ i ].slope
				- this.controlePoints[ i + 1 ].slope ;
		}
		
		// Useful to keep track of that?
		this.controlePoints[ i ].midSlope = midSlope ;
		
		a = 
			// Derivative: slope of the slope, for the left half of the interval
			(
				( this.controlePoints[ i ].midSlope - this.controlePoints[ i ].slope ) /
				( this.controlePoints[ i ].midX - this.controlePoints[ i ].x )
			) / 2 ;
		
		// Primitives: ax -> (a/2)x²
		this.controlePoints[ i ].leftA = a ;
		this.controlePoints[ i ].leftB = - 2 * a * this.controlePoints[ i ].x ;
		this.controlePoints[ i ].leftC = this.controlePoints[ i ].x * this.controlePoints[ i ].x + this.controlePoints[ i ].fx ;
		
		a = 
			// Derivative: slope of the slope, for the right half of the interval
			(
				( this.controlePoints[ i + 1 ].slope - this.controlePoints[ i ].midSlope ) /
				( this.controlePoints[ i + 1 ].x - this.controlePoints[ i ].midX )
			) / 2 ;
		
		// Primitives: ax -> (a/2)x²
		this.controlePoints[ i ].leftA = a ;
		this.controlePoints[ i ].leftB = - 2 * a * this.controlePoints[ i + 1 ].x ;
		this.controlePoints[ i ].leftC = this.controlePoints[ i + 1 ].x * this.controlePoints[ i + 1 ].x + this.controlePoints[ i + 1 ].fx ;
	}
} ;



Fn.prototype.fx = function fx( x )
{
	return x ;
} ;


/*
// Tracer generator for the circle
Fn.prototype.tracer = function* tracer( pixelSize )
{
	var i , t ,
		// This way it would never yield a position farther than one pixel from the previous one
		steps = Math.ceil( this.r * Math.PI / pixelSize ) ,
		position = Vector2D() ;
	
	for ( i = 0 ; i <= steps ; i ++ ) 
	{
		t = 2 * Math.PI * i / steps ;
		position.x = this.center.x + this.r * Math.cos( t ) ;
		position.y = this.center.y + this.r * Math.sin( t ) ;
		
		yield position ;
	}
} ;
*/

