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



var utils = require( './utils.js' ) ;



/*
	This is the equation:
	(X - x)² + (Y - y)² = r²
*/

function Circle2D( x , y , r )
{
	return Object.create( Circle2D.prototype ).set( x , y , r ) ;
}

module.exports = Circle2D ;



// Load modules
var Vector2D = require( './Vector2D.js' ) ;
//var BoundVector2D = require( './BoundVector2D.js' ) ;



Circle2D.prototype = Object.create( Vector2D.prototype ) ;
Circle2D.prototype.constructor = Circle2D ;



Circle2D.fromObject = function fromObject( circle )
{
	return Object.create( Circle2D.prototype ).setCircle( circle ) ;
} ;



Circle2D.prototype.set = function set( x , y , r )
{
	this.x = + x ;
	this.y = + y ;
	this.r = + r ;
	return this ;
} ;



Circle2D.prototype.setR = function setR( r )
{
	this.r = + r ;
	return this ;
} ;



Circle2D.prototype.setCircle = function setCircle( circle )
{
	this.x = + circle.x ;
	this.y = + circle.y ;
	this.d = + circle.d ;
	return this ;
} ;



Circle2D.prototype.dup = function dup()
{
	return Circle2D.fromObject( this ) ;
} ;



/*
	Test a x,y coordinates with the circle equation: (x - px)² + (y - py)² - r² = 0
	* zero: it's on the circle
	* positive: it's on the outside of the circle
	* negative: it's on the inside of the circle
*/
Circle2D.prototype.test = function test( x , y )
{
	var dx = x - this.x ,
		dy = y - this.y ;
	
	return dx * dx + dy * dy - this.r * this.r ;
} ;



// Same with a vector
Circle2D.prototype.testVector = function testVector( vector )
{
	var dx = vector.x - this.x ,
		dy = vector.y - this.y ;
	
	return dx * dx + dy * dy - this.r * this.r ;
} ;



// Like test, but the result is the distance outside (positive) or inside (negative)
Circle2D.prototype.normalizedTest = function normalizedTest( x , y )
{
	return utils.hypot2( x - this.x , y - this.y ) - this.r ;
} ;



// Same with a vector
Circle2D.prototype.normalizedTestVector = function normalizedTestVector( vector )
{
	return utils.hypot2( vector.x - this.x , vector.y - this.y ) - this.r ;
} ;



// Normalize a test value that was produced by .test() or .testVector()
Circle2D.prototype.normalizeTest = function normalizeTest( testValue )
{
	return Math.sqrt( testValue + this.r * this.r ) - this.r ;
} ;



// Tracer generator for the circle
Circle2D.prototype.tracer = function* tracer( pixelSize )
{
	var i , t ,
		// This way it would never yield a position farther than one pixel from the previous one
		steps = Math.ceil( this.r * Math.PI / pixelSize ) ,
		position = Vector2D() ;
	
	for ( i = 0 ; i <= steps ; i ++ ) 
	{
		t = 2 * Math.PI * i / steps ;
		position.x = this.x + this.r * Math.cos( t ) ;
		position.y = this.y + this.r * Math.sin( t ) ;
		
		yield position ;
	}
} ;



/*
	Test a x,y coordinates with the circle equation: sqrt( (x - px)² + (y - py)² ) - r = 0
*/
Circle2D.prototype.pointDistance = function pointDistance( positionVector )
{
	var dx = positionVector.x - this.x ,
		dy = positionVector.y - this.y ;
	
	return Math.abs( Math.sqrt( dx * dx + dy * dy ) - this.r ) ;
} ;



Circle2D.prototype.intersection = function intersection( boundVector )
{
	// http://mathworld.wolfram.com/Circle-LineIntersection.html
	
	// Act as if the center of the circle was at 0,0
	// So translate the line accordingly.
	
	var dx = boundVector.vector.x ;
	var dy = boundVector.vector.y ;
	var dr2 = dx * dx + dy * dy ;
	var det = ( boundVector.position.x - this.x ) * ( boundVector.position.y + dy - this.y )
		- ( boundVector.position.y - this.y ) * ( boundVector.position.x + dx - this.x ) ;
	
	// The discriminant
	var delta = this.r * this.r * dr2 - det * det ;
	
	if ( delta < 0 )
	{
		return null ;
	}
	else if ( delta === 0 )
	{
		return [ Vector2D(  this.x + det * dy / dr2  ,  this.y - det * dx / dr2  ) ] ;
	}
	else
	{
		var sqrtDelta = Math.sqrt( delta ) ;
		
		if ( dy >= 0 )
		{
			return [
				Vector2D(  this.x + ( det * dy + dx * sqrtDelta ) / dr2  ,  this.y + ( - det * dx + dy * sqrtDelta ) / dr2  ) ,
				Vector2D(  this.x + ( det * dy - dx * sqrtDelta ) / dr2  ,  this.y + ( - det * dx - dy * sqrtDelta ) / dr2  )
			] ;
		}
		else
		{
			return [
				Vector2D(  this.x + ( det * dy - dx * sqrtDelta ) / dr2  ,  this.y + ( - det * dx + dy * sqrtDelta ) / dr2  ) ,
				Vector2D(  this.x + ( det * dy + dx * sqrtDelta ) / dr2  ,  this.y + ( - det * dx - dy * sqrtDelta ) / dr2  )
			] ;
		}
	}
} ;



Circle2D.prototype.pointProjection = function pointProjection( positionVector )
{
	return Vector2D.fromTo( this , positionVector ).setLength( this.r ).add( this ) ;
} ;


