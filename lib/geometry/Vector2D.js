/*
	The Cedric's Swiss Knife (CSK) - CSK math toolbox

	Copyright (c) 2015 - 2016 Cédric Ronvel 
	
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



function Vector2D( vx , vy )
{
	var self = this ;
	
	if ( self.constructor !== Vector2D ) { self = Object.create( Vector2D.prototype ) ; }
	
	self.vx = vx ;
	self.vy = vy ;
	
	return self ;
}

module.exports = Vector2D ;



Vector2D.prototype.dup = function dup()
{
	return new Vector2D( this.vx , this.vy ) ;
} ;



Vector2D.prototype.add = function add()
{
	for ( var i = 0 , l = arguments.length ; i < l ; i ++ )
	{
		this.vx += arguments[ i ].vx ;
		this.vy += arguments[ i ].vy ;
	}
	
	return this ;
} ;



Vector2D.prototype.sub = function sub( vector )
{
	this.vx -= vector.vx ;
	this.vy -= vector.vy ;
	
	return this ;
} ;



Vector2D.prototype.mul = function mul( v )
{
	this.vx *= v ;
	this.vy *= v ;
	
	return this ;
} ;



Vector2D.prototype.div = function div( v )
{
	this.vx /= v ;
	this.vy /= v ;
	
	return this ;
} ;



Vector2D.prototype.inverse = function inverse()
{
	this.vx = - this.vx ;
	this.vy = - this.vy ;
	
	return this ;
} ;



Vector2D.prototype.length = function length()
{
	return Math.hypot( this.vx , this.vy ) ;
} ;


