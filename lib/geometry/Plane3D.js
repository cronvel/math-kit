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



/*
	This is the equation using the normal:
	vx * X + vy * Y + vz * Z + D = 0
	where D = - px * vx - py * vy - pz * vz
*/

function Plane3D( a , b , c , d )
{
	return Object.create( Plane3D.prototype ).set( a , b , c , d ) ;
}

module.exports = Plane3D ;



// Load modules
var Vector3D = require( './Vector3D.js' ) ;
var BoundVector3D = require( './BoundVector3D.js' ) ;



Plane3D.prototype = Object.create( Vector3D.prototype ) ;
Plane3D.prototype.constructor = Plane3D ;



Plane3D.fromObject = function fromObject( plane )
{
	return Object.create( Plane3D.prototype ).setPlane( plane ) ;
} ;



Plane3D.fromNormal = function fromNormal( px , py , pz , vx , vy , vz )
{
	return Object.create( Plane3D.prototype ).setNormal( px , py , pz , vx , vy , vz ) ;
} ;



Plane3D.fromNormalBoundVector = function fromNormalBoundVector( boundVector )
{
	return Object.create( Plane3D.prototype ).setNormalBoundVector( boundVector ) ;
} ;



Plane3D.prototype.set = function set( a , b , c , d )
{
	this.x = + a ;
	this.y = + b ;
	this.z = + c ;
	this.d = + d ;
	return this ;
} ;



Plane3D.prototype.setA = function setA( a )
{
	this.x = + a ;
	return this ;
} ;



Plane3D.prototype.setB = function setB( b )
{
	this.y = + b ;
	return this ;
} ;



Plane3D.prototype.setC = function setC( c )
{
	this.z = + c ;
	return this ;
} ;



Plane3D.prototype.setD = function setD( d )
{
	this.d = + d ;
	return this ;
} ;



/*
	ax + by + cz + d = 0
	x,y = 0,0 => cz + d = 0 => cz = -d => z = -d/c
*/
Plane3D.prototype.getNormalBoundVector = function getNormalBoundVector()
{
	return ( this.z && BoundVector3D( 0 , 0 , - this.d / this.z , this.x , this.y , this.z ) ) ||
		( this.y && BoundVector3D( 0 , - this.d / this.y , 0 , this.x , this.y , this.z ) ) ||
		( this.x && BoundVector3D( - this.d / this.x , 0 , 0 , this.x , this.y , this.z ) ) ;
} ;



Plane3D.prototype.setNormalBoundVector = function setNormalBoundVector( normal )
{
	this.x = normal.vector.x ;
	this.y = normal.vector.y ;
	this.z = normal.vector.z ;
	this.d = - normal.position.x * normal.vector.x - normal.position.y * normal.vector.y - normal.position.z * normal.vector.z ;
	return this ;
} ;



// Same than setNormalBoundVector() but use an argument list instead of a BoundVector3D
Plane3D.prototype.setNormal = function setNormal( px , py , pz , vx , vy , vz )
{
	this.x = vx ;
	this.y = vy ;
	this.z = vz ;
	this.d = - px * vx - py * vy - pz * vz ;
	return this ;
} ;



Plane3D.prototype.getNormalVector = function getNormalVector()
{
	return Vector3D.fromObject( this ) ;
} ;



// This will not move the plane along the original position, since that position has already been lost
Plane3D.prototype.setNormalVector = Vector3D.prototype.setVector ;



Plane3D.prototype.setPlane = function setPlane( plane )
{
	this.x = + plane.x ;
	this.y = + plane.y ;
	this.z = + plane.z ;
	this.d = + plane.d ;
	return this ;
} ;



Plane3D.prototype.dup = function dup()
{
	return Plane3D.fromObject( this ) ;
} ;



Plane3D.prototype.intersection = function intersection( boundVector )
{
	// First check if the bound vector is collinear/coplanar
	// The dot product should not be zero
	var dot = this.dotProduct( boundVector.vector ) ;
	
	if ( ! dot ) { return Vector3D() ; }
	
	var common = this.dotProduct( boundVector.position ) + this.d ;
	
	return Vector3D(
		boundVector.position.x - ( boundVector.vector.x * common / dot ) ,
		boundVector.position.y - ( boundVector.vector.y * common / dot ) ,
		boundVector.position.z - ( boundVector.vector.z * common / dot )
	) ;
} ;



Plane3D.prototype.pointProjection = function pointProjection( positionVector )
{
	var projectionVector = BoundVector3D.fromObject( positionVector , this ) ;
	return this.intersection( projectionVector ) ;
} ;



Plane3D.prototype.pointDistance = function pointDistance( positionVector )
{
	return (
			this.x * positionVector.x +
			this.y * positionVector.y +
			this.z * positionVector.z +
			this.d
		) / Math.hypot( this.x , this.y , this.z ) ;
} ;



// Getters/Setters
Object.defineProperties( BoundVector3D.prototype , {
	a: {
		get: function() { return this.x ; } ,
		set: Plane3D.prototype.setA
	} ,
	b: {
		get: function() { return this.y ; } ,
		set: Plane3D.prototype.setB
	} ,
	c: {
		get: function() { return this.z ; } ,
		set: Plane3D.prototype.setC
	} ,
} ) ;


