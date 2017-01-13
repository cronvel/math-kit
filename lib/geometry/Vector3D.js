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



// Interesting functions: https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js

function Vector3D( x , y , z )
{
	return Object.create( Vector3D.prototype ).set( x , y , z ) ;
}

module.exports = Vector3D ;



// Create a new vector from another vector or an object featuring x,y,z properties
Vector3D.fromObject = function fromObject( object )
{
	return Object.create( Vector3D.prototype ).setVector( object ) ;
} ;



// Create a new vector, starting from positional vector1 and pointing to the positional vector2
Vector3D.fromTo = function fromTo( fromVector , toVector )
{
	return toVector.dup().sub( fromVector ) ;
} ;



Vector3D.prototype.set = function set( x , y , z )
{
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	return this ;
} ;



Vector3D.prototype.setX = function setX( x )
{
	this.x = + x ;
	return this ;
} ;



Vector3D.prototype.setY = function setY( y )
{
	this.y = + y ;
	return this ;
} ;



Vector3D.prototype.setZ = function setZ( z )
{
	this.z = + z ;
	return this ;
} ;



Vector3D.prototype.setVector = function setVector( vector )
{
	this.x = + vector.x ;
	this.y = + vector.y ;
	this.z = + vector.z ;
	return this ;
} ;



Vector3D.prototype.dup = function dup()
{
	return Vector3D.fromObject( this ) ;
} ;



Vector3D.prototype.getUndefined = Vector3D.prototype.isUndefined = function isUndefined()
{
	return Number.isNaN( this.x ) || Number.isNaN( this.y ) || Number.isNaN( this.z ) ;
} ;



Vector3D.prototype.setUndefined = function setUndefined()
{
	this.x = this.y = this.z = NaN ;
	return this ;
} ;



Vector3D.prototype.getNull = Vector3D.prototype.isNull = function isNull()
{
	return this.x === 0 && this.y === 0 && this.z === 0 ;
} ;



Vector3D.prototype.setNull = function setNull()
{
	this.x = this.y = this.z = 0 ;
	return this ;
} ;



// add( vector1 , [vector2] , [...] )
Vector3D.prototype.add = function add()
{
	for ( var i = 0 , l = arguments.length ; i < l ; i ++ )
	{
		this.x += arguments[ i ].x ;
		this.y += arguments[ i ].y ;
		this.z += arguments[ i ].z ;
	}
	
	return this ;
} ;



// Apply another vector with a rate/weight/time, useful for physics (apply a force)
Vector3D.prototype.apply = function apply( vector , w )
{
	this.x += vector.x * w ;
	this.y += vector.y * w ;
	this.z += vector.z * w ;
	
	return this ;
} ;



Vector3D.prototype.sub = function sub( vector )
{
	this.x -= vector.x ;
	this.y -= vector.y ;
	this.z -= vector.z ;
	
	return this ;
} ;



Vector3D.prototype.mul = function mul( v )
{
	this.x *= v ;
	this.y *= v ;
	this.z *= v ;
	
	return this ;
} ;



Vector3D.prototype.div = function div( v )
{
	this.x /= v ;
	this.y /= v ;
	this.z /= v ;
	
	return this ;
} ;



Vector3D.prototype.inv = function inv()
{
	this.x = - this.x ;
	this.y = - this.y ;
	this.z = - this.z ;
	
	return this ;
} ;



Vector3D.prototype.getLength = function getLength()
{
	return Math.hypot( this.x , this.y , this.z ) ;
} ;



Vector3D.prototype.setLength = function setLength( length )
{
	var rate = Math.abs( length ) / Math.hypot( this.x , this.y , this.z ) ;
	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;
	
	return this ;
} ;



Vector3D.prototype.setValue = function setValue( length )
{
	var rate = length / Math.hypot( this.x , this.y , this.z ) ;
	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;
	
	return this ;
} ;



Vector3D.prototype.normalize = Vector3D.prototype.unit = function normalize()
{
	this.setLength( 1 ) ;
	return this ;
} ;



/*
Vector3D.prototype.getAngle = function getAngle()
{
	return Math.atan2( this.y , this.x ) ;
} ;



Vector3D.prototype.setAngle = function setAngle( angle )
{
	var length = Math.hypot( this.x , this.y ) ;
	this.x = length * Math.cos( angle ) ;
	this.y = length * Math.sin( angle ) ;
	
	return this ;
} ;



Vector3D.prototype.getAngleDeg = function getAngleDeg()
{
	return rad2deg * Math.atan2( this.y , this.x ) ;
} ;



Vector3D.prototype.setAngleDeg = function setAngleDeg( angle )
{
	var length = Math.hypot( this.x , this.y ) ;
	angle /= rad2deg ;
	this.x = length * Math.cos( angle ) ;
	this.y = length * Math.sin( angle ) ;
	
	return this ;
} ;



Vector3D.prototype.rotate = function rotate( angle )
{
	this.setAngle( this.getAngle() + angle ) ;
	return this ;
} ;



Vector3D.prototype.rotateDeg = function rotateDeg( angle )
{
	this.setAngle( this.getAngle() + angle / rad2deg ) ;
	return this ;
} ;
*/


// "Produit Scalaire"
Vector3D.prototype.dot = Vector3D.prototype.dotProduct = function dotProduct( vector )
{
	return this.x * vector.x  +  this.y * vector.y  +  this.z * vector.z ;
} ;



// "Produit Vectoriel"
Vector3D.prototype.cross = Vector3D.prototype.crossProduct = function crossProduct( vector )
{
	return Vector3D(
		this.y * vector.z  -  this.z * vector.y ,
		this.z * vector.x  -  this.x * vector.z ,
		this.x * vector.y  -  this.y * vector.x
	) ;
} ;



Vector3D.determinant = function determinant( u , v , w )
{
	return u.x * v.y * w.z  +  v.x * w.y * u.z  +  w.x * u.y * v.z  -  u.z * v.y * w.x  -  v.z * w.y * u.x  -  w.z * u.y * v.x ;
} ;



Vector3D.prototype.isColinearTo = Vector3D.prototype.isCollinearTo = function( vector )
{
	return this.cross( vector ).isNull() ;
} ;



Vector3D.prototype.isOrthogonalTo = function( vector )
{
	return ! this.isNull() && ! vector.isNull() && this.dot( vector ) === 0 ;
} ;



// Length of the argument vector after being projected on *this* vector
Vector3D.prototype.projectionLengthOf = function projectionLengthOf( vector )
{
	return Math.abs( this.dotProduct( vector ) / this.getLength() ) ;
} ;



// Same than projectionLengthOf(), but the result can be negative
Vector3D.prototype.projectionValueOf = function projectionValueOf( vector )
{
	return this.dotProduct( vector ) / this.getLength() ;
} ;



// Projection of the argument vector on *this* vector
Vector3D.prototype.projectionOf = function projectionOf( vector )
{
	return this.dup().setValue( this.projectionValueOf( vector ) ) ;
} ;



// Getters/Setters
Object.defineProperties( Vector3D.prototype , {
	undefined: {
		get: Vector3D.prototype.getUndefined ,
		set: Vector3D.prototype.setUndefined
	} ,
	null: {
		get: Vector3D.prototype.getNull ,
		set: Vector3D.prototype.setNull
	} ,
	length: {
		get: Vector3D.prototype.getLength ,
		set: Vector3D.prototype.setLength
	} ,
	/*
	angle: {
		get: Vector3D.prototype.getAngle ,
		set: Vector3D.prototype.setAngle
	} ,
	angleDeg: {
		get: Vector3D.prototype.getAngleDeg ,
		set: Vector3D.prototype.setAngleDeg
	}
	*/
} ) ;


