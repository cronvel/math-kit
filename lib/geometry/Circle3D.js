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
	A Circle3D is the intersection of a Plane3D and a Sphere3D.
	The center of the sphere is on the plane.
	* x,y,z and r are like in Sphere3D.
	* normal is the normal vector of the Plane3D.
*/

function Circle3D( x , y , z , nx , ny , nz , r )
{
	var self = Object.create( Circle3D.prototype ) ;
	
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	this.r = + r ;
	this.normal = Vector3D( nx , ny , nz ) ;
	
	return self ;
}

module.exports = Circle3D ;



// Load modules
var Sphere3D = require( './Sphere3D.js' ) ;
var Vector3D = require( './Vector3D.js' ) ;
//var BoundVector3D = require( './BoundVector3D.js' ) ;



Circle3D.prototype = Object.create( Sphere3D.prototype ) ;
Circle3D.prototype.constructor = Circle3D ;



Circle3D.fromObject = function fromObject( circle )
{
	var self = Object.create( Circle3D.prototype ) ;
	
	self.x = + circle.x ;
	self.y = + circle.y ;
	self.z = + circle.z ;
	self.r = + circle.r ;
	self.normal = Vector3D.fromObject( circle.normal ) ;
	
	return self ;
} ;



Circle3D.fromVectorsRadius = function fromVectorsRadius( position , normal , r )
{
	var self = Object.create( Circle3D.prototype ) ;
	
	self.x = + position.x ;
	self.y = + position.y ;
	self.z = + position.z ;
	self.r = + r ;
	self.normal = Vector3D.fromObject( normal ) ;
	
	return self ;
} ;



Circle3D.prototype.set = function set( x , y , z , nx , ny , nz , r )
{
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	this.r = + r ;
	this.normal.set( nx , ny , nz ) ;
	return this ;
} ;



Circle3D.prototype.setCircle = function setCircle( circle )
{
	this.x = + circle.x ;
	this.y = + circle.y ;
	this.z = + circle.z ;
	this.r = + circle.r ;
	this.normal.setVector( circle.normal ) ;
	return this ;
} ;



Circle3D.prototype.setVectorsRadius = function setVectorsRadius( position , normal , r )
{
	this.x = + position.x ;
	this.y = + position.y ;
	this.z = + position.z ;
	this.r = + r ;
	this.normal.setVector( normal ) ;
	
	return this ;
} ;



Circle3D.prototype.dup = function dup()
{
	return Circle3D.fromObject( this ) ;
} ;



Circle3D.prototype.isOnCircle = function isOnCircle( positionVector )
{
	// To be on the circle, the point should be on the sphere and on the plane
	
	return (
		// Check for the sphere
		utils.eeq( Sphere3D.prototype.testVector.call( this , positionVector ) , 0 )
		// Check for the plane
		&& utils.eeq(
			this.normal.x * positionVector.x + this.normal.y * positionVector.y + this.normal.z * positionVector.z
			- this.x * this.normal.x - this.y * this.normal.y - this.z * this.normal.z ,	// <-- This is plane's D value
		0 )
	) ;
} ;



Circle3D.prototype.isOnDisc = function isOnDisc( positionVector )
{
	// To be on the disc, the point should be on/inside the sphere and on the plane
	
	return (
		// Check for the sphere
		utils.elte( Sphere3D.prototype.testVector.call( this , positionVector ) , 0 )
		// Check for the plane
		&& utils.eeq(
			this.normal.x * positionVector.x + this.normal.y * positionVector.y + this.normal.z * positionVector.z
			- this.x * this.normal.x - this.y * this.normal.y - this.z * this.normal.z ,	// <-- This is plane's D value
		0 )
	) ;
} ;



// This projects the point on the plane, then on the circle
Circle3D.prototype.pointProjection = function pointProjection( positionVector )
{
	// This is a copy of Plane3D.prototype.pointProjection, adapted for the current structure
	var dot = this.dotProduct( this.normal ) ;
	
	// Should never be null
	//if ( ! dot ) { return null ; }
	
	var common = ( this.dotProduct( positionVector ) + this.d ) / dot ;
	
	/*
	var projection = Vector3D(
		positionVector.x - ( this.normal.x * common ) ,
		positionVector.y - ( this.normal.y * common ) ,
		positionVector.z - ( this.normal.z * common )
	) ;
	*/
	
	var dx = positionVector.x - ( this.normal.x * common ) - this.x ;
	var dy = positionVector.y - ( this.normal.y * common ) - this.y ;
	var dz = positionVector.z - ( this.normal.z * common ) - this.z ;
	
	var rate = this.r / Math.hypot( dx , dy , dz ) ;
	
	dx *= rate ;
	dy *= rate ;
	dz *= rate ;
	
	return Vector3D(
		this.r + dx ,
		this.r + dy ,
		this.r + dz
	) ;
} ;


