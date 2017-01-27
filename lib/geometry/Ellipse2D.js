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



//var utils = require( './utils.js' ) ;



/*
	This is the equation:
	2r = sqrt( (X - x1)² + (Y - y1)² ) + sqrt( (X - x2)² + (Y - y2)² ) 
*/

function Ellipse2D( x1 , y1 , x2 , y2 , r )
{
	var self = Object.create( Ellipse2D.prototype ) ;
	
	self.focus1 = Vector2D( x1 , y1 ) ;
	self.focus2 = Vector2D( x2 , y2 ) ;
	self.r = + r ;
	
	return self ;
}

module.exports = Ellipse2D ;



// Load modules
var Vector2D = require( './Vector2D.js' ) ;
//var BoundVector2D = require( './BoundVector2D.js' ) ;



Ellipse2D.fromObject = function fromObject( ellipse )
{
	var self = Object.create( BoundVector3D.prototype ) ;
	
	self.focus1 = Vector3D.fromObject( ellipse.focus1 ) ;
	self.focus2 = Vector3D.fromObject( ellipse.focus2 ) ;
	self.r = ellipse.r ;
	
	return self ;
} ;



Ellipse2D.prototype.set = function set( x1 , y1 , x2 , y2 , r )
{
	this.focus1.set( x1 , y1 ) ;
	this.focus2.set( x2 , y2 ) ;
	this.r = + r ;
	return this ;
} ;



Ellipse2D.prototype.setR = function setR( r )
{
	this.r = + r ;
	return this ;
} ;



Ellipse2D.prototype.setEllipse = function setEllipse( ellipse )
{
	this.focus1.setVector( ellipse.focus1 ) ;
	this.focus2.setVector( ellipse.focus2 ) ;
	this.r = + r ;
	return this ;
} ;



Ellipse2D.prototype.dup = function dup()
{
	return Ellipse2D.fromObject( this ) ;
} ;



/*
	Test a x,y coordinates with the ellipse equation: (x - px)² + (y - py)² - r² = 0
	* zero: it's on the ellipse
	* positive: it's on the outside of the ellipse
	* negative: it's on the inside of the ellipse
*/
Ellipse2D.prototype.test = function test( x , y )
{
	return (
		Math.hypot( x - this.focus1.x , y - this.focus1.y )
		+ Math.hypot( x - this.focus2.x , y - this.focus2.y )
		- 2 * this.r
	) ;
} ;



// Same with a vector
Ellipse2D.prototype.testVector = function testVector( vector )
{
	return (
		Math.hypot( vector.x - this.focus1.x , vector.y - this.focus1.y )
		+ Math.hypot( vector.x - this.focus2.x , vector.y - this.focus2.y )
		- 2 * this.r
	) ;
} ;



/*
	Test a x,y coordinates with the ellipse equation: sqrt( (x - px)² + (y - py)² ) - r = 0
*/
Ellipse2D.prototype.pointDistance = function pointDistance( positionVector )
{
	var dx = positionVector.x - this.x ,
		dy = positionVector.y - this.y ;
	
	return Math.abs( Math.sqrt( dx * dx + dy * dy ) - this.r ) ;
} ;



Ellipse2D.prototype.intersection = function intersection( boundVector )
{
	// http://mathworld.wolfram.com/Ellipse-LineIntersection.html
	
	// Act as if the center of the ellipse was at 0,0
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



Ellipse2D.prototype.pointProjection = function pointProjection( positionVector )
{
	return Vector2D.fromTo( this , positionVector ).setLength( this.r ).add( this ) ;
} ;


