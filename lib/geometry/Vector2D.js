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



function Vector2D( x , y )
{
	var self = this ;
	
	if ( ! ( self instanceof Vector2D ) ) { self = Object.create( Vector2D.prototype ) ; }
	
	self.x = x ;
	self.y = y ;
	
	return self ;
}

module.exports = Vector2D ;



var rad2deg = 360 / ( 2 * Math.PI ) ;



Vector2D.prototype.set = function set( x , y )
{
	this.x = x ;
	this.y = y ;
	return this ;
} ;



Vector2D.prototype.setVector = function setVector( vector )
{
	this.x = vector.x ;
	this.y = vector.y ;
	return this ;
} ;



Vector2D.prototype.dup = function dup()
{
	return new Vector2D( this.x , this.y ) ;
} ;



Vector2D.prototype.add = function add()
{
	for ( var i = 0 , l = arguments.length ; i < l ; i ++ )
	{
		this.x += arguments[ i ].x ;
		this.y += arguments[ i ].y ;
	}
	
	return this ;
} ;



Vector2D.prototype.sub = function sub( vector )
{
	this.x -= vector.x ;
	this.y -= vector.y ;
	
	return this ;
} ;



Vector2D.prototype.mul = function mul( v )
{
	this.x *= v ;
	this.y *= v ;
	
	return this ;
} ;



Vector2D.prototype.div = function div( v )
{
	this.x /= v ;
	this.y /= v ;
	
	return this ;
} ;



Vector2D.prototype.inv = function inv()
{
	this.x = - this.x ;
	this.y = - this.y ;
	
	return this ;
} ;



Vector2D.prototype.orthogonal = function orthogonal()
{
	this.x = - this.y ;
	this.y = this.x ;
	
	return this ;
} ;



Vector2D.prototype.getLength = function getLength( length )
{
	return Math.hypot( this.x , this.y ) ;
} ;



Vector2D.prototype.setLength = function setLength( length )
{
	var rate = Math.abs( length ) / Math.hypot( this.x , this.y ) ;
	this.x *= rate ;
	this.y *= rate ;
	
	return this ;
} ;



Vector2D.prototype.setRelativeLength = function setRelativeLength( length )
{
	var rate = length / Math.hypot( this.x , this.y ) ;
	this.x *= rate ;
	this.y *= rate ;
	
	return this ;
} ;



Vector2D.prototype.normalize = Vector2D.prototype.unit = function normalize()
{
	this.setLength( 1 ) ;
	return this ;
} ;



Vector2D.prototype.getAngle = function getAngle()
{
	return Math.atan2( this.y , this.x ) ;
} ;



Vector2D.prototype.setAngle = function setAngle( angle )
{
	var length = Math.hypot( this.x , this.y ) ;
	this.x = length * Math.cos( angle ) ;
	this.y = length * Math.sin( angle ) ;
	
	return this ;
} ;



Vector2D.prototype.getAngleDeg = function getAngleDeg()
{
	return rad2deg * Math.atan2( this.y , this.x ) ;
} ;



Vector2D.prototype.setAngleDeg = function setAngleDeg( angle )
{
	var length = Math.hypot( this.x , this.y ) ;
	angle /= rad2deg ;
	this.x = length * Math.cos( angle ) ;
	this.y = length * Math.sin( angle ) ;
	
	return this ;
} ;



Vector2D.prototype.rotate = function rotate( angle )
{
	this.setAngle( this.getAngle() + angle ) ;
	return this ;
} ;



Vector2D.prototype.rotateDeg = function rotateDeg( angle )
{
	this.setAngle( this.getAngle() + angle / rad2deg ) ;
	return this ;
} ;



// "Produit Scalaire"
Vector2D.prototype.dot = Vector2D.prototype.dotProduct = function dotProduct( vector )
{
	return ( this.x * vector.x ) + ( this.y * vector.y );
} ;



// "Produit Vectoriel"
Vector2D.prototype.cross = Vector2D.prototype.crossProduct = function crossProduct( vector )
{
	return ( this.x * vector.y ) - ( this.y * vector.x );
} ;



// Length of the current vector after being projected on the vector argument
Vector2D.prototype.projectionLength = function projectionLength( vector )
{
	return Math.abs( this.dotProduct( vector ) / vector.getLength() ) ;
} ;



// Same than projectionLength(), but the result can be negative
Vector2D.prototype.relativeProjectionLength = function relativeProjectionLength( vector )
{
	return this.dotProduct( vector ) / vector.getLength() ;
} ;



// Projection of the vector on the argument vector
Vector2D.prototype.projection = function projection( vector )
{
	this.setVector( vector.dup().setRelativeLength( this.relativeProjectionLength( vector ) ) ) ;
	return this ;
} ;



// Getters/Setters
Object.defineProperties( Vector2D.prototype , {
	length: {
		get: Vector2D.prototype.getLength ,
		set: Vector2D.prototype.setLength
	} ,
	angle: {
		get: Vector2D.prototype.getAngle ,
		set: Vector2D.prototype.setAngle
	} ,
	angleDeg: {
		get: Vector2D.prototype.getAngleDeg ,
		set: Vector2D.prototype.setAngleDeg
	}
} ) ;


