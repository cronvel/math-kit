/*
	Math Kit
	
	Copyright (c) 2014 - 2016 Cédric Ronvel
	
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



var rad2deg = 360 / ( 2 * Math.PI ) ;



// Interesting functions: https://github.com/mrdoob/three.js/blob/master/src/math/Vector2.js

function Vector2D( x , y )
{
	var self = this ;
	
	if ( ! ( self instanceof Vector2D ) ) { self = Object.create( Vector2D.prototype ) ; }
	
	if ( x && typeof x === 'object' )
	{
		self.setVector( x ) ;
	}
	else
	{
		self.set( x , y ) ;
	}
	
	return self ;
}

module.exports = Vector2D ;



// Create a new vector, starting from positional vector1 and pointing to the positional vector2
Vector2D.fromTo = function fromTo( fromVector , toVector )
{
	return toVector.dup().sub( fromVector ) ;
} ;



Vector2D.prototype.set = function set( x , y )
{
	this.x = + x ;
	this.y = + y ;
	return this ;
} ;



Vector2D.prototype.setX = function setX( x )
{
	this.x = + x ;
	return this ;
} ;



Vector2D.prototype.setY = function setY( y )
{
	this.y = + y ;
	return this ;
} ;



Vector2D.prototype.setVector = function setVector( vector )
{
	this.x = + vector.x ;
	this.y = + vector.y ;
	return this ;
} ;



Vector2D.prototype.dup = function dup()
{
	return new Vector2D( this.x , this.y ) ;
} ;



Vector2D.prototype.getUndefined = Vector2D.prototype.isUndefined = function isUndefined()
{
	return Number.isNaN( this.x ) || Number.isNaN( this.y ) ;
} ;



Vector2D.prototype.setUndefined = function setUndefined( val )
{
	if ( val ) { this.x = this.y = NaN ; }
	return this ;
} ;



Vector2D.prototype.getNull = Vector2D.prototype.isNull = function isNull()
{
	return this.x === 0 && this.y === 0 ;
} ;



Vector2D.prototype.setNull = function setNull( val )
{
	if ( val ) { this.x = this.y = 0 ; }
	return this ;
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



// Apply another vector with a rate/weight/time, useful for physics (apply a force)
Vector2D.prototype.apply = function apply( vector , w )
{
	this.x += vector.x * w ;
	this.y += vector.y * w ;
	
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
	var x = this.x ;
	this.x = - this.y ;
	this.y = x ;
	
	return this ;
} ;



Vector2D.prototype.getLength = function getLength()
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



Vector2D.prototype.setValue = function setValue( length )
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
	return this.x * vector.x  +  this.y * vector.y ;
} ;



// "Produit Vectoriel"
Vector2D.prototype.cross = Vector2D.prototype.crossProduct = function crossProduct( vector )
{
	return this.x * vector.y  -  this.y * vector.x ;
} ;



Vector2D.determinant = function determinant( v1 , v2 )
{
	return v1.x * v2.y  -  v1.y * v2.x ;
} ;



Vector2D.prototype.isColinearTo = Vector2D.prototype.isCollinearTo = function( vector )
{
	return Vector2D.determinant( this , vector ) === 0 ;
} ;



Vector2D.prototype.isOrthogonalTo = function( vector )
{
	return ! this.isNull() && ! vector.isNull() && this.dot( vector ) === 0 ;
} ;



// Length of the argument vector after being projected on *this* vector
Vector2D.prototype.projectionLengthOf = function projectionLengthOf( vector )
{
	return Math.abs( this.dotProduct( vector ) / this.getLength() ) ;
} ;



// Same than projectionLengthOf(), but the result can be negative
Vector2D.prototype.projectionValueOf = function projectionValueOf( vector )
{
	return this.dotProduct( vector ) / this.getLength() ;
} ;



// Projection of the argument vector on *this* vector
Vector2D.prototype.projectionOf = function projectionOf( vector )
{
	return this.dup().setValue( this.projectionValueOf( vector ) ) ;
} ;



// Getters/Setters
Object.defineProperties( Vector2D.prototype , {
	undefined: {
		get: Vector2D.prototype.getUndefined ,
		set: Vector2D.prototype.setUndefined
	} ,
	null: {
		get: Vector2D.prototype.getNull ,
		set: Vector2D.prototype.setNull
	} ,
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


