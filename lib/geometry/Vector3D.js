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

/* jshint -W064 */

"use strict" ;



var utils = require( './utils.js' ) ;
var rad2deg = 360 / ( 2 * Math.PI ) ;



// Interesting functions: https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js

function Vector3D( x , y , z )
{
	return Object.create( Vector3D.prototype ).set( x , y , z ) ;
}

module.exports = Vector3D ;



// Load modules
var Vector2D = require( './Vector2D.js' ) ;



// Create a new vector from another vector or an object featuring x,y,z properties
Vector3D.fromObject = function fromObject( object )
{
	return Object.create( Vector3D.prototype ).setVector( object ) ;
} ;



// Create a new vector, starting from positional vector1 and pointing to the positional vector2
Vector3D.fromTo = function fromTo( fromVector , toVector )
{
	return Object.create( Vector3D.prototype ).setFromTo( fromVector , toVector ) ;
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



Vector3D.prototype.setInvVector = function setInvVector( vector )
{
	this.x = - vector.x ;
	this.y = - vector.y ;
	this.z = - vector.z ;
	return this ;
} ;



Vector3D.prototype.setFromTo = function setFromTo( fromVector , toVector )
{
	this.x = + toVector.x - fromVector.x ;
	this.y = + toVector.y - fromVector.y ;
	this.z = + toVector.z - fromVector.z ;
	return this ;
} ;



Vector3D.prototype.set3Vectors = function set3Vectors( vector , addVector , subVector )
{
	this.x = + vector.x + addVector.x - subVector.x ;
	this.y = + vector.y + addVector.y - subVector.y ;
	this.z = + vector.z + addVector.z - subVector.z ;
	return this ;
} ;



Vector3D.prototype.dup = function dup()
{
	return Vector3D.fromObject( this ) ;
} ;



Vector3D.prototype.isUndefined = Vector3D.prototype.getUndefined = function isUndefined()
{
	return Number.isNaN( this.x ) || Number.isNaN( this.y ) || Number.isNaN( this.z ) ;
} ;



Vector3D.prototype.setUndefined = function setUndefined()
{
	this.x = this.y = this.z = NaN ;
	return this ;
} ;



Vector3D.prototype.isNull = Vector3D.prototype.getNull = function isNull()
{
	return this.x === 0 && this.y === 0 && this.z === 0 ;
} ;



Vector3D.prototype.isEpsilonNull = function isEpsilonNull()
{
	return utils.eeq( this.x , 0 ) && utils.eeq( this.y , 0 ) && utils.eeq( this.z , 0 ) ;
} ;



Vector3D.prototype.setNull = function setNull()
{
	this.x = this.y = this.z = 0 ;
	return this ;
} ;



Vector3D.prototype.isEqualTo = function isEqualTo( vector )
{
	return utils.eeq( this.x , vector.x ) && utils.eeq( this.y , vector.y ) && utils.eeq( this.z , vector.z ) ;
} ;



Vector3D.prototype.isInverseOf = function isInverseOf( vector )
{
	return utils.eeq( this.x , - vector.x ) && utils.eeq( this.y , - vector.y ) && utils.eeq( this.z , - vector.z ) ;
} ;



Vector3D.prototype.test = function test( x , y , z )
{
	return Math.abs( this.x - x ) + Math.abs( this.y - y ) + Math.abs( this.z - z ) ;
} ;



Vector3D.prototype.testVector = function testVector( vector )
{
	return Math.abs( this.x - vector.x ) + Math.abs( this.y - vector.y ) + Math.abs( this.z - vector.z ) ;
} ;



Vector3D.prototype.add = function add( vector )
{
	this.x += vector.x ;
	this.y += vector.y ;
	this.z += vector.z ;
	
	return this ;
} ;



// addMulti( vector1 , [vector2] , [...] )
Vector3D.prototype.addMulti = function addMulti()
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



// Move along the vector for that distance
Vector3D.prototype.moveAlong = function moveAlong( vector , distance )
{
	var rate = distance / utils.hypot3( vector.x , vector.y , vector.z ) ;
	this.x += vector.x * rate ;
	this.y += vector.y * rate ;
	this.z += vector.z * rate ;
	return this ;
} ;



// Move toward a position.
// Like moveAlong() but given a position rather than a vector.
// Reciprocal of moveAtDistanceOf.
Vector3D.prototype.moveToward = function moveToward( positionVector , distance )
{
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;
	var dz = positionVector.z - this.z ;
	
	var rate = distance / utils.hypot3( dx , dy , dz ) ;
	
	this.x += dx * rate ;
	this.y += dy * rate ;
	this.z += dz * rate ;
	
	return this ;
} ;



// Move a position at the distance of positionVector, along the line formed by both
Vector3D.prototype.moveAtDistanceOf = function moveAtDistanceOf( positionVector , distance )
{
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;
	var dz = positionVector.z - this.z ;
	
	var rate = 1 - distance / utils.hypot3( dx , dy , dz ) ;
	
	this.x += dx * rate ;
	this.y += dy * rate ;
	this.z += dz * rate ;
	
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



// produce a vector that is orthogonal, do not preserve length
Vector3D.prototype.getAnyOrthogonal = function getAnyOrthogonal()
{
	var xabs , yabs ;
	
	// Nullify the smallest axis distance for better precision
	if ( ( xabs = Math.abs( this.x ) ) < ( yabs = Math.abs( this.y ) ) )
	{
		if ( xabs < Math.abs( this.z ) )
		{
			return Vector3D( 0 , - this.z , this.y ) ;
		}
		else
		{
			return Vector3D( - this.y , this.x , 0 ) ;
		}
	}
	else if ( yabs < Math.abs( this.z ) )
	{
		return Vector3D( this.z , 0 , - this.x ) ;
	}
	else
	{
		return Vector3D( - this.y , this.x , 0 ) ;
	}
} ;



Vector3D.prototype.getLength = function getLength()
{
	return utils.hypot3( this.x , this.y , this.z ) ;
} ;



Vector3D.prototype.setLength = function setLength( length )
{
	if ( ! this.x && ! this.y && ! this.z ) { return this ; }
	
	var rate = Math.abs( length ) / utils.hypot3( this.x , this.y , this.z ) ;
	
	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;
	
	return this ;
} ;



Vector3D.prototype.setValue = function setValue( length )
{
	if ( ! this.x && ! this.y && ! this.z ) { return this ; }
	
	var rate = length / utils.hypot3( this.x , this.y , this.z ) ;
	
	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;
	
	return this ;
} ;



// E.g.: apply an absolute static friction
Vector3D.prototype.reduceLength = function reduceLength( value )
{
	if ( ! this.x && ! this.y && ! this.z ) { return this ; }
	
	var length = utils.hypot3( this.x , this.y , this.z ) ;
	var rate = Math.max( 0 , length - value ) / length ;
	this.x *= rate ;
	this.y *= rate ;
	this.z *= rate ;
	
	return this ;
} ;



Vector3D.prototype.normalize = Vector3D.prototype.unit = function normalize()
{
	var length = utils.hypot3( this.x , this.y , this.z ) ;
	
	if ( length )
	{
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
	}
	
	return this ;
} ;



// Normalize only if it is needed: perform an extra check to avoid hypot() or sqrt()
Vector3D.prototype.normalizeCheck = function normalizeCheck()
{
	var length = this.x * this.x + this.y * this.y + this.z * this.z ;
	
	if ( length && utils.eneq( length , 1 ) )
	{
		length = utils.sqHypot3( length , this.x , this.y , this.z ) ;
		this.x /= length ;
		this.y /= length ;
		this.z /= length ;
	}
	
	return this ;
} ;



Vector3D.prototype.pointDistance = function pointDistance( positionVector )
{
	return utils.hypot3( positionVector.x - this.x , positionVector.y - this.y , positionVector.z - this.z ) ;
} ;



Vector3D.prototype.pointSquaredDistance = function pointSquaredDistance( positionVector )
{
	var dx = positionVector.x - this.x ;
	var dy = positionVector.y - this.y ;
	var dz = positionVector.z - this.z ;
	return dx * dx + dy * dy + dz * dz ;
} ;



/*
Vector3D.prototype.getAngle = function getAngle()
{
	return Math.atan2( this.y , this.x ) ;
} ;



Vector3D.prototype.setAngle = function setAngle( angle )
{
	var length = utils.hypot3( this.x , this.y ) ;
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
	var length = utils.hypot3( this.x , this.y ) ;
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



Vector3D.prototype.isCollinearTo = Vector3D.prototype.isColinearTo = function isCollinearTo( vector )
{
	// We are using cross product, but avoid creating a vector for nothing
	//return this.cross( vector ).isEpsilonNull() ;
	return utils.eeq( this.y * vector.z  -  this.z * vector.y , 0 ) &&
		utils.eeq( this.z * vector.x  -  this.x * vector.z , 0 ) &&
		utils.eeq( this.x * vector.y  -  this.y * vector.x , 0 ) ;
} ;



Vector3D.prototype.isOrthogonalTo = function( vector )
{
	return ! this.isNull() && ! vector.isNull() && utils.eeq( this.dot( vector ) , 0 ) ;
} ;



// Get the angle between 2 vectors
Vector2D.prototype.angleTo = function angleTo( vector )
{
	return Math.acos( this.dot( vector ) / ( this.getLength() * vector.getLength() ) ) ;
} ;



// Get the angle between 2 normalized vectors (faster)
Vector2D.prototype.normalizedAngleTo = function normalizedAngleTo( vector )
{
	return Math.acos( this.dot( vector ) ) ;
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
	//var rate = this.dotProduct( vector ) / ( this.x * this.x + this.y * this.y + this.z * this.z ) ;
	var rate = this.dotProduct( vector ) / this.dotProduct( this ) ;
	return Vector3D( this.x * rate , this.y * rate , this.z * rate ) ;
} ;



// The "remainder" part of .decompose()
Vector3D.prototype.diffProjectionOf = function diffProjectionOf( vector )
{
	//var rate = 1 - this.dotProduct( vector ) / this.dotProduct( this ) ;
	//return Vector3D( this.x * rate , this.y * rate , this.z * rate ) ;
	
	var rate = this.dotProduct( vector ) / this.dotProduct( this ) ;
	return Vector3D( vector.x - this.x * rate , vector.y - this.y * rate , vector.z - this.z * rate ) ;
} ;



// Reciprocal of projectionOf, modify in-place
Vector3D.prototype.projectOn = function projectOn( vector )
{
	var rate = vector.dotProduct( this ) / vector.dotProduct( vector ) ;
	this.x = vector.x * rate ;
	this.y = vector.y * rate ;
	this.z = vector.z * rate ;
	return this ;
} ;



// Reciprocal of diffProjectionOf, modify in-place
Vector3D.prototype.diffProjectOn = function diffProjectOn( vector )
{
	var rate = vector.dotProduct( this ) / vector.dotProduct( vector ) ;
	this.x -= vector.x * rate ;
	this.y -= vector.y * rate ;
	this.z -= vector.z * rate ;
	return this ;
} ;



// Decompose a vector along a normal axis, and a tangent plane
Vector3D.prototype.decompose = function decompose( axis )
{
	var projection = axis.projectionOf( this ) ;
	var remainder = this.dup().sub( projection ) ;
	return [ projection , remainder ] ;
} ;



// Same, but assume axis is a normalized vector, and the result is put into arguments object
Vector3D.prototype.fastDecompose = function fastDecompose( axis , alongAxis , perpToAxis )
{
	var dot = axis.dotProduct( this ) ;
	alongAxis.set( dot * axis.x , dot * axis.y , dot * axis.z ) ;
	perpToAxis.set( this.x - alongAxis.x , this.y - alongAxis.y , this.z - alongAxis.z ) ;
} ;



// Transpose a vector 3D to a vector 2D on a plane coordinate defined by an origin, the plane normal and the xAxis
// xAxis and normal should be normalized and orthogonal (i.e. xAxis should belong to the plane)
Vector3D.prototype.transpose2D = function transpose2D( origin , normal , xAxis )
{
	// This uses the plane intersection algorithm
	// The plane used include the real origin (not the variable, the 0,0,0 point in 3D coordinate)
	// The wanted plane origin is projected and used at the end
	var common = normal.dotProduct( this ) / normal.dotProduct( normal ) ;
	
	// Vector projection on the plane
	var x = this.x - ( normal.x * common ) ;
	var y = this.y - ( normal.y * common ) ;
	var z = this.z - ( normal.z * common ) ;
	
	// Origin projection on the plane
	var ox = origin.x - ( normal.x * common ) ;
	var oy = origin.y - ( normal.y * common ) ;
	var oz = origin.z - ( normal.z * common ) ;
	
	var yAxis = normal.crossProduct( xAxis ) ;
	//console.log( 'yAxis length:' , yAxis.length ) ;
	
	// origin 2D coordinate before transposition
	var o2dx = ox * xAxis.x + oy * xAxis.y + oz * xAxis.z ;
	var o2dy = ox * yAxis.x + oy * yAxis.y + oz * yAxis.z ;
	
	// 2D coordinate of the vector
	return Vector2D(
		x * xAxis.x + y * xAxis.y + z * xAxis.z - o2dx ,
		x * yAxis.x + y * yAxis.y + z * yAxis.z - o2dy
	) ;
} ;



// Scale the vector along an axis
// Axis should be normalized
// Used by Ellipse3D
Vector3D.prototype.fastScaleAxis = function fastScaleAxis( axis , scale )
{
	// From .fastDecompose() code:
	var dot = axis.dotProduct( this ) ;
	
	var alongX = dot * axis.x ;
	var alongY = dot * axis.y ;
	var alongZ = dot * axis.z ;
	var perpX = this.x - alongX ;
	var perpY = this.y - alongY ;
	var perpZ = this.z - alongZ ;
	
	return this.set(
		alongX * scale + perpX ,
		alongY * scale + perpY ,
		alongZ * scale + perpZ
	) ;
} ;



// Scale the vector along an axis, from an origin point
// Axis should be normalized
// Used by Ellipse3D
Vector3D.prototype.fastScaleAxisFrom = function fastScaleAxisFrom( origin , axis , scale )
{
	// First transpose the position to the ellipse origin
	var vx = this.x - origin.x ;
	var vy = this.y - origin.y ;
	var vz = this.z - origin.z ;
	
	// From .fastDecompose() code:
	var dot = axis.x * vx + axis.y * vy + axis.z * vz ;
	
	var alongX = dot * axis.x ;
	var alongY = dot * axis.y ;
	var alongZ = dot * axis.z ;
	var perpX = vx - alongX ;
	var perpY = vy - alongY ;
	var perpZ = vz - alongZ ;
	
	return this.set(
		alongX * scale + perpX + origin.x ,
		alongY * scale + perpY + origin.y ,
		alongZ * scale + perpZ + origin.z
	) ;
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


