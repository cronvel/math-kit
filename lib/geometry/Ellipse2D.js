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
	This is a circle with a major axis and semi-major and semi-minor length.
	
	Major axis vector MUST remain normalized!
	All constructors normalize it, but direct access should modify that with great care.
	
	Semi-major should be greater than semi-minor.
*/

function Ellipse2D( x , y , sx , sy , r , semiMinor )
{
	var self = Object.create( Ellipse2D.prototype ) ;
	
	self.x = + x ;
	self.y = + y ;
	self.r = + r ;
	
	self.majorAxis = Vector2D( sx , sy ).normalize() ;
	self.semiMinor = + semiMinor ;
	
	// Mostly used to cache the result
	self.focus1 = Vector2D() ;
	self.focus2 = Vector2D() ;
	self.e = 0 ;
	
	self.update() ;
	
	return self ;
}

module.exports = Ellipse2D ;



// Load modules
var Vector2D = require( './Vector2D.js' ) ;
var Circle2D = require( './Circle2D.js' ) ;
//var BoundVector2D = require( './BoundVector2D.js' ) ;



//Ellipse2D.prototype = Object.create( Circle2D.prototype ) ;
//Ellipse2D.prototype.constructor = Ellipse2D ;



Ellipse2D.fromObject = function fromObject( ellipse )
{
	var self = Object.create( Ellipse2D.prototype ) ;
	
	self.x = + ellipse.x ;
	self.y = + ellipse.y ;
	self.r = + ellipse.r ;

	self.majorAxis = Vector2D( ellipse.majorAxis.x , ellipse.majorAxis.y ).normalize() ;
	self.semiMinor = + ellipse.semiMinor ;
	
	self.focus1 = Vector2D() ;
	self.focus2 = Vector2D() ;
	self.e = 0 ;
	
	self.update() ;
	
	return self ;
} ;



Ellipse2D.prototype.set = function set( x , y , sx , sy , r , semiMinor )
{
	this.x = + x ;
	this.y = + y ;
	this.r = + r ;

	this.majorAxis.setVector( sx , sy ).normalize() ;
	this.semiMinor = + semiMinor ;
	
	return this ;
} ;



Ellipse2D.prototype.setEllipse = function setEllipse( ellipse )
{
	this.x = + ellipse.x ;
	this.y = + ellipse.y ;
	this.r = + ellipse.r ;

	this.majorAxis.setVector( ellipse.majorAxis ).normalize() ;
	this.semiMinor = + ellipse.semiMinor ;
	
	return this ;
} ;



Ellipse2D.prototype.dup = function dup()
{
	return Ellipse2D.fromObject( this ) ;
} ;



// Get the ellipse focal point
Ellipse2D.prototype.update = function update()
{
	var centerToFocus = Math.sqrt( this.r * this.r - this.semiMinor * this.semiMinor ) ;
	
	this.e = centerToFocus / this.r ;
	
	this.focus1.set(
		this.x + this.majorAxis.x * centerToFocus ,
		this.y + this.majorAxis.y * centerToFocus
	) ;
	
	this.focus2.set(
		this.x - this.majorAxis.x * centerToFocus ,
		this.y - this.majorAxis.y * centerToFocus
	) ;
} ;



/*
	Test a x,y coordinates with the ellipse equation:
	sqrt( dx1² + dy1² ) + sqrt( dx2² + dy2² ) = 2R
	* zero: it's on the ellipse
	* positive: it's on the outside of the ellipse
	* negative: it's on the inside of the ellipse
*/
Ellipse2D.prototype.test = function test( x , y )
{
	var dx1 = x - this.focus1.x ,
		dy1 = y - this.focus1.y ,
		dx2 = x - this.focus2.x ,
		dy2 = y - this.focus2.y ;
	
	return Math.hypot( dx1 , dy1 ) + Math.hypot( dx2 , dy2 ) - 2 * this.r ;
} ;



// Same with a vector
Ellipse2D.prototype.testVector = function testVector( vector )
{
	var dx1 = vector.x - this.focus1.x ,
		dy1 = vector.y - this.focus1.y ,
		dx2 = vector.x - this.focus2.x ,
		dy2 = vector.y - this.focus2.y ;
	
	return Math.hypot( dx1 , dy1 ) + Math.hypot( dx2 , dy2 ) - 2 * this.r ;
} ;



// Getters/Setters
Object.defineProperties( Vector2D.prototype , {
	semiMajor: {
		get: function() { return this.r ; } ,
		set: function( v ) { this.r = v ; }
	}
} ) ;



