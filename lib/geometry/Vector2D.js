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
	
	if ( ! ( self instanceof Vector2D ) ) { self = Object.create( Vector2D.prototype ) ; }
	
	self.vx = vx ;
	self.vy = vy ;
	
	return self ;
}

module.exports = Vector2D ;

var rad2deg = 360 / ( 2 * Math.PI ) ;



Vector2D.prototype.set = function set( vx , vy )
{
	this.vx = vx ;
	this.vy = vy ;
	return this ;
} ;



Vector2D.prototype.setVector = function setVector( vector )
{
	this.vx = vector.vx ;
	this.vy = vector.vy ;
	return this ;
} ;



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



Vector2D.prototype.inv = function inv()
{
	this.vx = - this.vx ;
	this.vy = - this.vy ;
	
	return this ;
} ;



Vector2D.prototype.orthogonal = function orthogonal()
{
	this.vx = - this.vy ;
	this.vy = this.vx ;
	
	return this ;
} ;



Vector2D.prototype.getLength = function getLength( length )
{
	return Math.hypot( this.vx , this.vy ) ;
} ;



Vector2D.prototype.setLength = function setLength( length )
{
	var rate = Math.abs( length ) / Math.hypot( this.vx , this.vy ) ;
	this.vx *= rate ;
	this.vy *= rate ;
	
	return this ;
} ;



Vector2D.prototype.unit = function unit()
{
	this.setLength( 1 ) ;
	return this ;
} ;



Vector2D.prototype.getAngle = function getAngle()
{
	return Math.atan2( this.vy , this.vx ) ;
} ;



Vector2D.prototype.setAngle = function setAngle( angle )
{
	var length = Math.hypot( this.vx , this.vy ) ;
	this.vx = length * Math.cos( angle ) ;
	this.vy = length * Math.sin( angle ) ;
	
	return this ;
} ;



Vector2D.prototype.getAngleDeg = function getAngleDeg()
{
	return rad2deg * Math.atan2( this.vy , this.vx ) ;
} ;



Vector2D.prototype.setAngleDeg = function setAngleDeg( angle )
{
	var length = Math.hypot( this.vx , this.vy ) ;
	angle /= rad2deg ;
	this.vx = length * Math.cos( angle ) ;
	this.vy = length * Math.sin( angle ) ;
	
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
	return ( this.vx * vector.vx ) + ( this.vy * vector.vy );
} ;



// "Produit Vectoriel"
Vector2D.prototype.cross = Vector2D.prototype.crossProduct = function crossProduct( vector )
{
	return ( this.vx * vector.vy ) - ( this.vy * vector.vx );
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
	this.setVector( vector.dup().setLength( this.relativeProjectionLength( vector ) ) ) ;
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
