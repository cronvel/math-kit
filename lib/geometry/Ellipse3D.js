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
	This is a circle with a major axis and semi-major and semi-minor length.
	
	Major axis and plane normal vectors MUST remain normalized!
	All constructors normalize them, but direct access should modify that with great care.
	
	Semi-major should be greater than semi-minor.
*/

function Ellipse3D( x , y , z , nx , ny , nz , sx , sy , sz , semiMajor , semiMinor )
{
	var self = Object.create( Ellipse3D.prototype ) ;
	
	self.x = + x ;
	self.y = + y ;
	self.z = + z ;
	
	self.planeNormal = Vector3D( nx , ny , nz ).normalizeCheck() ;
	self.majorAxis = Vector3D( sx , sy , sz ).normalizeCheck() ;
	
	self.semiMajor = + semiMajor ;
	self.semiMinor = + semiMinor ;
	
	// Mostly used to cache the result
	self.focus1 = Vector3D() ;
	self.focus2 = Vector3D() ;
	self.c = 0 ;
	self.e = 0 ;
	
	self.r = null ;
	
	self.update() ;
	
	return self ;
}

module.exports = Ellipse3D ;



// Load modules
var Vector2D = require( './Vector2D.js' ) ;
var Vector3D = require( './Vector3D.js' ) ;
var Ellipse2D = require( './Ellipse2D.js' ) ;
//var Circle2D = require( './Circle2D.js' ) ;
//var BoundVector2D = require( './BoundVector2D.js' ) ;



//Ellipse3D.prototype = Object.create( Ellipse2D.prototype ) ;
//Ellipse3D.prototype.constructor = Ellipse3D ;



Ellipse3D.fromObject = function fromObject( ellipse )
{
	var self = Object.create( Ellipse3D.prototype ) ;
	
	self.x = + ellipse.x ;
	self.y = + ellipse.y ;
	self.z = + ellipse.z ;

	self.planeNormal = Vector3D( ellipse.planeNormal.x , ellipse.planeNormal.y , ellipse.planeNormal.z ).normalizeCheck() ;
	self.majorAxis = Vector3D( ellipse.majorAxis.x , ellipse.majorAxis.y , ellipse.majorAxis.z ).normalizeCheck() ;
	self.semiMajor = + ellipse.semiMajor ;
	self.semiMinor = + ellipse.semiMinor ;
	
	self.focus1 = Vector3D() ;
	self.focus2 = Vector3D() ;
	self.c = 0 ;
	self.e = 0 ;
	
	self.r = null ;
	
	self.update() ;
	
	return self ;
} ;



Ellipse3D.fromVectorsAxis = function fromVectorsAxis( origin , planeNormal , majorAxis , semiMajor , semiMinor )
{
	var self = Object.create( Ellipse3D.prototype ) ;
	
	self.x = + origin.x ;
	self.y = + origin.y ;
	self.z = + origin.z ;
	
	self.planeNormal = Vector3D.fromObject( planeNormal ).normalizeCheck() ;
	self.majorAxis = Vector3D.fromObject( majorAxis ).normalizeCheck() ;
	self.semiMajor = + semiMajor ;
	self.semiMinor = + semiMinor ;
	
	self.focus1 = Vector3D() ;
	self.focus2 = Vector3D() ;
	self.c = 0 ;
	self.e = 0 ;
	
	self.r = null ;
	
	self.update() ;
	
	return self ;
} ;



Ellipse3D.prototype.set = function set( x , y , z , nx , ny , nz , sx , sy , sz , semiMajor , semiMinor )
{
	this.x = + x ;
	this.y = + y ;
	this.z = + z ;

	this.planeNormal.setVector( nx , ny , nz ).normalizeCheck() ;
	this.majorAxis.setVector( sx , sy , sz ).normalizeCheck() ;
	this.semiMajor = + semiMajor ;
	this.semiMinor = + semiMinor ;
	
	return this ;
} ;



Ellipse3D.prototype.setEllipse = function setEllipse( ellipse )
{
	this.x = + ellipse.x ;
	this.y = + ellipse.y ;
	this.z = + ellipse.z ;
	
	this.planeNormal.setVector( ellipse.planeNormal ).normalizeCheck() ;
	this.majorAxis.setVector( ellipse.majorAxis ).normalizeCheck() ;
	this.semiMajor = + ellipse.semiMajor ;
	this.semiMinor = + ellipse.semiMinor ;
	
	return this ;
} ;



Ellipse3D.prototype.setVectorsAxis = function setVectorAxis( origin , planeNormal , majorAxis , semiMajor , semiMinor )
{
	this.x = + origin.x ;
	this.y = + origin.y ;
	this.z = + origin.z ;
	
	this.planeNormal.setVector( planeNormal ).normalizeCheck() ;
	this.majorAxis.setVector( majorAxis ).normalizeCheck() ;
	this.semiMajor = + semiMajor ;
	this.semiMinor = + semiMinor ;
	
	return this ;
} ;



Ellipse3D.prototype.dup = function dup()
{
	return Ellipse3D.fromObject( this ) ;
} ;



// Get the ellipse focal point
Ellipse3D.prototype.update = function update()
{
	this.c = Math.sqrt( this.semiMajor * this.semiMajor - this.semiMinor * this.semiMinor ) ;
	
	this.e = this.c / this.semiMajor ;
	
	this.focus1.set(
		this.x + this.majorAxis.x * this.c ,
		this.y + this.majorAxis.y * this.c ,
		this.z + this.majorAxis.z * this.c
	) ;
	
	this.focus2.set(
		this.x - this.majorAxis.x * this.c ,
		this.y - this.majorAxis.y * this.c ,
		this.z - this.majorAxis.z * this.c
	) ;
} ;



// First project on the ellipse plane, then find the closest point
Ellipse3D.prototype.pointProjection = function pointProjection( positionVector )
{
	// _shortestPointToEllipse() works with x-axis aligned major axis, and centered to the origin
	// We re-use the same vector for the transposition and the output, to avoid two object allocation
	var iteration = 50 ;
	var vector = positionVector.transpose2D( this , this.planeNormal , this.majorAxis ) ;
	Ellipse2D._shortestPointToEllipse( this.semiMajor , this.semiMinor , vector.x , vector.y , iteration , vector ) ;
	return vector.transpose3D( this , this.planeNormal , this.majorAxis ) ;
} ;


