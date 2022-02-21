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

"use strict" ;



//const utils = require( './utils.js' ) ;



/*
	This is a circle with a major axis and semi-major and semi-minor length.

	Major axis and plane normal vectors MUST remain normalized!
	All constructors normalize them, but direct access should modify that with great care.

	Semi-major should be greater than semi-minor.
*/

function Ellipse3D( x , y , z , nx , ny , nz , sx , sy , sz , semiMajor , semiMinor ) {
	this.center = new Vector3D( x , y , z ) ;
	this.planeNormal = new Vector3D( nx , ny , nz ).normalizeCheck() ;
	this.majorAxis = new Vector3D( sx , sy , sz ).normalizeCheck() ;

	this.semiMajor = + semiMajor ;
	this.semiMinor = + semiMinor ;

	// Mostly used to cache the result
	this.focus1 = new Vector3D() ;
	this.focus2 = new Vector3D() ;
	this.c = 0 ;
	this.e = 0 ;

	this.r = null ;

	this.update() ;
}

module.exports = Ellipse3D ;



//const Vector2D = require( './Vector2D.js' ) ;
const Vector3D = require( './Vector3D.js' ) ;
const Ellipse2D = require( './Ellipse2D.js' ) ;
const Circle3D = require( './Circle3D.js' ) ;
//const Circle2D = require( './Circle2D.js' ) ;
//const BoundVector2D = require( './BoundVector2D.js' ) ;



Ellipse3D.fromObject = object => new Ellipse3D(
	object.center.x ,
	object.center.y ,
	object.center.z ,
	object.planeNormal.x ,
	object.planeNormal.y ,
	object.planeNormal.z ,
	object.majorAxis.x ,
	object.majorAxis.y ,
	object.majorAxis.z ,
	object.semiMajor ,
	object.semiMinor
) ;

Ellipse3D.fromVectorsAxis = ( center , planeNormal , majorAxis , semiMajor , semiMinor ) => new Ellipse3D(
	center.x ,
	center.y ,
	center.z ,
	planeNormal.x ,
	planeNormal.y ,
	planeNormal.z ,
	majorAxis.x ,
	majorAxis.y ,
	majorAxis.z ,
	semiMajor ,
	semiMinor
) ;



Ellipse3D.prototype.set = function( x , y , z , nx , ny , nz , sx , sy , sz , semiMajor , semiMinor ) {
	this.center.set( x , y , z ) ;
	this.planeNormal.set( nx , ny , nz ).normalizeCheck() ;
	this.majorAxis.set( sx , sy , sz ).normalizeCheck() ;
	this.semiMajor = + semiMajor ;
	this.semiMinor = + semiMinor ;

	return this ;
} ;



Ellipse3D.prototype.setEllipse = function( ellipse ) {
	this.center.setVector( ellipse.center ) ;
	this.planeNormal.setVector( ellipse.planeNormal ).normalizeCheck() ;
	this.majorAxis.setVector( ellipse.majorAxis ).normalizeCheck() ;
	this.semiMajor = + ellipse.semiMajor ;
	this.semiMinor = + ellipse.semiMinor ;

	return this ;
} ;



Ellipse3D.prototype.setVectorsAxis = function( center , planeNormal , majorAxis , semiMajor , semiMinor ) {
	this.center.setVector( center ) ;
	this.planeNormal.setVector( planeNormal ).normalizeCheck() ;
	this.majorAxis.setVector( majorAxis ).normalizeCheck() ;
	this.semiMajor = + semiMajor ;
	this.semiMinor = + semiMinor ;

	return this ;
} ;



Ellipse3D.prototype.dup = function() {
	return Ellipse3D.fromObject( this ) ;
} ;



// Get the ellipse focal point
Ellipse3D.prototype.update = function() {
	this.c = Math.sqrt( this.semiMajor * this.semiMajor - this.semiMinor * this.semiMinor ) ;

	this.e = this.c / this.semiMajor ;

	this.focus1.set(
		this.center.x + this.majorAxis.x * this.c ,
		this.center.y + this.majorAxis.y * this.c ,
		this.center.z + this.majorAxis.z * this.c
	) ;

	this.focus2.set(
		this.center.x - this.majorAxis.x * this.c ,
		this.center.y - this.majorAxis.y * this.c ,
		this.center.z - this.majorAxis.z * this.c
	) ;
} ;



// First project on the ellipse plane, then project toward the center
Ellipse3D.prototype.pointProjectionTowardCenter = function( positionVector ) {
	// This is probably not the fastest way to do it, but it will be good enough before a replacement code

	var scale = this.semiMinor / this.semiMajor ;

	// Scale the vector
	positionVector = positionVector.dup().fastScaleAxisFrom( this.center , this.majorAxis , scale ) ;

	// Always set 'r' before calling Circle2D methods
	this.r = this.semiMinor ;
	var point = Circle3D.prototype.pointProjection.call( this , positionVector ) ;

	if ( ! point ) { return null ; }

	// Revert the scaling
	scale = this.semiMajor / this.semiMinor ;

	point.fastScaleAxisFrom( this.center , this.majorAxis , scale ) ;

	return point ;
} ;



// First project on the ellipse plane, then find the closest point
Ellipse3D.prototype.pointProjection = function( positionVector ) {
	// _shortestPointToEllipse() works with x-axis aligned major axis, and centered to the origin
	// We re-use the same vector for the transposition and the output, to avoid two object allocation
	var iteration = 50 ;
	var vector = positionVector.transpose2D( this.center , this.planeNormal , this.majorAxis ) ;
	Ellipse2D._shortestPointToEllipse( this.semiMajor , this.semiMinor , vector.x , vector.y , iteration , vector ) ;
	return vector.transpose3D( this.center , this.planeNormal , this.majorAxis ) ;
} ;


