/*
	Math Kit

	Copyright (c) 2014 - 2019 Cédric Ronvel

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
	* planeNormal is the normal vector of the Plane3D.
*/

function Circle3D( x , y , z , nx , ny , nz , r ) {
	var self = Object.create( Circle3D.prototype ) ;

	self.center = Vector3D( x , y , z ) ;
	self.r = + r ;
	self.planeNormal = Vector3D( nx , ny , nz ).normalizeCheck() ;

	return self ;
}

module.exports = Circle3D ;



// Load modules
var Sphere3D = require( './Sphere3D.js' ) ;
var Vector3D = require( './Vector3D.js' ) ;
var Circle2D = require( './Circle2D.js' ) ;
var Ellipse3D = require( './Ellipse3D.js' ) ;
var BoundVector3D = require( './BoundVector3D.js' ) ;



Circle3D.prototype = Object.create( Sphere3D.prototype ) ;
Circle3D.prototype.constructor = Circle3D ;



Circle3D.fromObject = function fromObject( circle ) {
	var self = Object.create( Circle3D.prototype ) ;

	self.center = Vector3D.fromObject( circle.center ) ;
	self.r = + circle.r ;
	self.planeNormal = Vector3D.fromObject( circle.planeNormal ).normalizeCheck() ;

	return self ;
} ;



Circle3D.fromVectorsRadius = function fromVectorsRadius( position , planeNormal , r ) {
	var self = Object.create( Circle3D.prototype ) ;

	self.center = Vector3D.fromObject( position ) ;
	self.r = + r ;
	self.planeNormal = Vector3D.fromObject( planeNormal ).normalizeCheck() ;

	return self ;
} ;



// Since InfiniteCylinder3D share EXACTLY the same type of data, but with a different hierarchy...
Circle3D.fromCylinder = function fromCylinder( cylinder ) {
	var self = Object.create( Circle3D.prototype ) ;

	self.center.setVector( cylinder.axis.position ) ;
	self.r = + cylinder.r ;
	self.planeNormal.setVector( cylinder.axis.vector ).normalizeCheck() ;

	return self ;
} ;



Circle3D.prototype.set = function set( x , y , z , nx , ny , nz , r ) {
	this.center.set( x , y , z ) ;
	this.r = + r ;
	this.planeNormal.set( nx , ny , nz ).normalizeCheck() ;

	return this ;
} ;



Circle3D.prototype.setCircle = function setCircle( circle ) {
	this.center.setVector( circle.center ) ;
	this.r = + circle.r ;
	this.planeNormal.setVector( circle.planeNormal ).normalizeCheck() ;

	return this ;
} ;



// Since InfiniteCylinder3D share EXACTLY the same type of data, but with a different hierarchy...
Circle3D.prototype.setCylinder = function setCylinder( cylinder ) {
	this.center.setVector( cylinder.axis.position ) ;
	this.r = + cylinder.r ;
	this.planeNormal.setVector( cylinder.axis.vector ).normalizeCheck() ;

	return this ;
} ;



Circle3D.prototype.setVectorsRadius = function setVectorsRadius( position , planeNormal , r ) {
	this.center.setVector( position ) ;
	this.r = + r ;
	this.planeNormal.setVector( planeNormal ).normalizeCheck() ;

	return this ;
} ;



Circle3D.prototype.dup = function dup() {
	return Circle3D.fromObject( this ) ;
} ;



Circle3D.prototype.isOnCircle = function isOnCircle( positionVector ) {
	// To be on the circle, the point should be on the sphere and on the plane

	return (
		// Check for the sphere
		utils.eeq( Sphere3D.prototype.testVector.call( this , positionVector ) , 0 )
		// Check for the plane
		&& utils.eeq(
			this.planeNormal.x * positionVector.x + this.planeNormal.y * positionVector.y + this.planeNormal.z * positionVector.z
			//- this.center.x * this.planeNormal.x - this.center.y * this.planeNormal.y - this.center.z * this.planeNormal.z ,	// <-- This is plane's D value
			- this.center.dot( this.planeNormal ) ,	// <-- This is plane's D value
			0 )
	) ;
} ;



Circle3D.prototype.isInsideCircle =
Circle3D.prototype.isOnDisc = function isOnDisc( positionVector ) {
	// To be on the disc, the point should be on/inside the sphere and on the plane

	return (
		// Check for the sphere
		utils.elte( Sphere3D.prototype.testVector.call( this , positionVector ) , 0 )
		// Check for the plane
		&& utils.eeq(
			this.planeNormal.x * positionVector.x + this.planeNormal.y * positionVector.y + this.planeNormal.z * positionVector.z
			//- this.center.x * this.planeNormal.x - this.center.y * this.planeNormal.y - this.center.z * this.planeNormal.z ,	// <-- This is plane's D value
			- this.center.dot( this.planeNormal ) ,	// <-- This is plane's D value
			0 )
	) ;
} ;



// This projects the point on the plane, then on the circle
Circle3D.prototype.pointProjection = function pointProjection( positionVector ) {
	// This is a copy of Plane3D.prototype.pointProjection, adapted for the current structure
	var dot = this.planeNormal.dotProduct( this.planeNormal ) ;

	// Should never be null
	//if ( ! dot ) { return null ; }

	// Plane's D
	//var d = - this.center.x * this.planeNormal.x - this.center.y * this.planeNormal.y - this.center.z * this.planeNormal.z ;
	var d = -this.center.dot( this.planeNormal ) ;

	var common = ( this.planeNormal.dotProduct( positionVector ) + d ) / dot ;

	var dx = positionVector.x - ( this.planeNormal.x * common ) - this.center.x ;
	var dy = positionVector.y - ( this.planeNormal.y * common ) - this.center.y ;
	var dz = positionVector.z - ( this.planeNormal.z * common ) - this.center.z ;
	var rate = this.r / utils.hypot3( dx , dy , dz ) ;

	dx *= rate ;
	dy *= rate ;
	dz *= rate ;

	return Vector3D(
		this.center.x + dx ,
		this.center.y + dy ,
		this.center.z + dz
	) ;
} ;


