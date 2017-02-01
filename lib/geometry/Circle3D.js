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
	
	Circle3D are also used to describe infinite cylinder, extending toward the plane normal.
	
	* x,y,z and r are like in Sphere3D.
	* planeNormal is the normal vector of the Plane3D.
*/

function Circle3D( x , y , z , nx , ny , nz , r )
{
	var self = Object.create( Circle3D.prototype ) ;
	
	self.x = + x ;
	self.y = + y ;
	self.z = + z ;
	self.r = + r ;
	self.planeNormal = Vector3D( nx , ny , nz ).normalize() ;
	
	return self ;
}

module.exports = Circle3D ;



// Load modules
var Sphere3D = require( './Sphere3D.js' ) ;
var Vector3D = require( './Vector3D.js' ) ;
var Circle2D = require( './Circle2D.js' ) ;
var BoundVector3D = require( './BoundVector3D.js' ) ;



Circle3D.prototype = Object.create( Sphere3D.prototype ) ;
Circle3D.prototype.constructor = Circle3D ;



Circle3D.fromObject = function fromObject( circle )
{
	var self = Object.create( Circle3D.prototype ) ;
	
	self.x = + circle.x ;
	self.y = + circle.y ;
	self.z = + circle.z ;
	self.r = + circle.r ;
	self.planeNormal = Vector3D.fromObject( circle.planeNormal ).normalize() ;
	
	return self ;
} ;



Circle3D.fromVectorsRadius = function fromVectorsRadius( position , planeNormal , r )
{
	var self = Object.create( Circle3D.prototype ) ;
	
	self.x = + position.x ;
	self.y = + position.y ;
	self.z = + position.z ;
	self.r = + r ;
	self.planeNormal = Vector3D.fromObject( planeNormal ).normalize() ;
	
	return self ;
} ;



Circle3D.prototype.set = function set( x , y , z , nx , ny , nz , r )
{
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;
	this.r = + r ;
	this.planeNormal.set( nx , ny , nz ) ;
	return this ;
} ;



Circle3D.prototype.setCircle = function setCircle( circle )
{
	this.x = + circle.x ;
	this.y = + circle.y ;
	this.z = + circle.z ;
	this.r = + circle.r ;
	this.planeNormal.setVector( circle.planeNormal ) ;
	return this ;
} ;



Circle3D.prototype.setVectorsRadius = function setVectorsRadius( position , planeNormal , r )
{
	this.x = + position.x ;
	this.y = + position.y ;
	this.z = + position.z ;
	this.r = + r ;
	this.planeNormal.setVector( planeNormal ) ;
	
	return this ;
} ;



Circle3D.prototype.dup = function dup()
{
	return Circle3D.fromObject( this ) ;
} ;



// Test if a position is inside the infinite cylinder area
Circle3D.prototype.test = function test( x , y , z )
{
	// Using BoundVector3D#pointProjection() code again:
	var dx = x - this.x ;
	var dy = y - this.y ;
	var dz = z - this.z ;
	
	// dot products...
	var t = ( dx * this.planeNormal.x + dy * this.planeNormal.y + dz * this.planeNormal.z ) /
		( this.planeNormal.x * this.planeNormal.x + this.planeNormal.y * this.planeNormal.y + this.planeNormal.z * this.planeNormal.z ) ;
	
	dx = this.planeNormal.x * t - dx ;
	dy = this.planeNormal.y * t - dy ;
	dz = this.planeNormal.z * t - dz ;
	
	return dx * dx + dy * dy + dz * dz - this.r * this.r ;
} ;



// Same with a vector
Circle3D.prototype.testVector = function testVector( positionVector )
{
	return this.test( positionVector.x , positionVector.y , positionVector.z ) ;
} ;



Circle3D.prototype.normalizedTest = function normalizedTest( x , y , z )
{
	// Using BoundVector3D#pointProjection() code again:
	var dx = x - this.x ;
	var dy = y - this.y ;
	var dz = z - this.z ;
	
	// dot products...
	var t = ( dx * this.planeNormal.x + dy * this.planeNormal.y + dz * this.planeNormal.z ) /
		( this.planeNormal.x * this.planeNormal.x + this.planeNormal.y * this.planeNormal.y + this.planeNormal.z * this.planeNormal.z ) ;
	
	dx = this.planeNormal.x * t - dx ;
	dy = this.planeNormal.y * t - dy ;
	dz = this.planeNormal.z * t - dz ;
	
	return utils.hypot3( dx , dy , dz ) - this.r ;
} ;



// Same with a vector
Circle3D.prototype.normalizedTestVector = function normalizedTestVector( positionVector )
{
	return this.normalizedTest( positionVector.x , positionVector.y , positionVector.z ) ;
} ;



// Normalize a test value that was produced by .test() or .testVector()
Circle3D.prototype.normalizeTest = function normalizeTest( testValue )
{
	return Math.sqrt( testValue + this.r * this.r ) - this.r ;
} ;



Circle3D.prototype.isOnCircle = function isOnCircle( positionVector )
{
	// To be on the circle, the point should be on the sphere and on the plane
	
	return (
		// Check for the sphere
		utils.eeq( Sphere3D.prototype.testVector.call( this , positionVector ) , 0 )
		// Check for the plane
		&& utils.eeq(
			this.planeNormal.x * positionVector.x + this.planeNormal.y * positionVector.y + this.planeNormal.z * positionVector.z
			- this.x * this.planeNormal.x - this.y * this.planeNormal.y - this.z * this.planeNormal.z ,	// <-- This is plane's D value
		0 )
	) ;
} ;



Circle3D.prototype.isInsideCircle =
Circle3D.prototype.isOnDisc = function isOnDisc( positionVector )
{
	// To be on the disc, the point should be on/inside the sphere and on the plane
	
	return (
		// Check for the sphere
		utils.elte( Sphere3D.prototype.testVector.call( this , positionVector ) , 0 )
		// Check for the plane
		&& utils.eeq(
			this.planeNormal.x * positionVector.x + this.planeNormal.y * positionVector.y + this.planeNormal.z * positionVector.z
			- this.x * this.planeNormal.x - this.y * this.planeNormal.y - this.z * this.planeNormal.z ,	// <-- This is plane's D value
		0 )
	) ;
} ;



Circle3D.prototype.isOnCylinder = function isOnCylinder( positionVector )
{
	return utils.eeq( this.testVector( positionVector ) , 0 ) ;
} ;



Circle3D.prototype.isInsideCylinder = function isInsideCylinder( positionVector )
{
	return utils.elte( this.testVector( positionVector ) , 0 ) ;
} ;



// This projects the point on the plane, then on the circle
Circle3D.prototype.pointProjection = function pointProjection( positionVector )
{
	// This is a copy of Plane3D.prototype.pointProjection, adapted for the current structure
	var dot = this.planeNormal.dotProduct( this.planeNormal ) ;
	
	// Should never be null
	//if ( ! dot ) { return null ; }
	
	// Plane's D
	var d = - this.x * this.planeNormal.x - this.y * this.planeNormal.y - this.z * this.planeNormal.z ;
	
	var common = ( this.planeNormal.dotProduct( positionVector ) + d ) / dot ;
	
	var dx = positionVector.x - ( this.planeNormal.x * common ) - this.x ;
	var dy = positionVector.y - ( this.planeNormal.y * common ) - this.y ;
	var dz = positionVector.z - ( this.planeNormal.z * common ) - this.z ;
	var rate = this.r / utils.hypot3( dx , dy , dz ) ;
	
	dx *= rate ;
	dy *= rate ;
	dz *= rate ;
	
	return Vector3D(
		this.x + dx ,
		this.y + dy ,
		this.z + dz
	) ;
} ;



Circle3D.prototype.pointProjectionToCylinder = function pointProjectionToCylinder( positionVector )
{
	// First project on the 3D line...
	var projected = BoundVector3D.fromVectors( this , this.planeNormal ).pointProjection( positionVector ) ;
	
	// Then move it toward the given position, at the correct distance
	return projected.moveToward( positionVector , this.r ) ;
} ;



Circle3D.prototype.intersectionToCylinder = function intersectionToCylinder( boundVector )
{
	// planeNormal MUST be normalized
	
	// Create a vector that is orthogonal to the normal
	var xAxis = this.planeNormal.getAnyOrthogonal().normalize() ;
	
	// Transpose to 2D, find the intersection times:
	// the t value at intersection for the transposed parametric boundVector
	var boundVector2D = boundVector.transpose2D( this , this.planeNormal , xAxis ) ;
	var circle2D = Circle2D( 0 , 0 , this.r ) ;
	var points = circle2D.intersectionT( boundVector2D ) ;
	
	if ( ! points ) { return null ; }
	
	// If there are some points, then use the t values and apply them to the original 3D vector
	points[ 0 ] = boundVector.tPosition( points[ 0 ].t ) ;
	if ( points[ 1 ] ) { points[ 1 ] = boundVector.tPosition( points[ 1 ].t ) ; }
	
	return points ;
} ;


