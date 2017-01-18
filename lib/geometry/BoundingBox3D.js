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

"use strict" ;



var utils = require( './utils.js' ) ;



// "Vecteur lié"
// A starting point/position and a vector, i.e. vector applied on a point/position.
function BoundingBox3D( xMin , xMax , yMin , yMax , zMin , zMax )
{
	var self = Object.create( BoundingBox3D.prototype ) ;
	
	self.min = Vector3D( xMin , yMin , zMin ) ;
	self.max = Vector3D( xMax , yMax , zMax ) ;
	
	return self ;
}

module.exports = BoundingBox3D ;



// Load modules
var Vector3D = require( './Vector3D.js' ) ;



BoundingBox3D.fromObject = function fromObject( object )
{
	var self = Object.create( BoundingBox3D.prototype ) ;
	
	self.min = Vector3D.fromObject( object.min ) ;
	self.max = Vector3D.fromObject( object.max ) ;
	
	return self ;
} ;



BoundingBox3D.fromMinMaxVectors = function fromMinMaxVectors( min , max )
{
	var self = Object.create( BoundingBox3D.prototype ) ;
	
	self.min = Vector3D.fromObject( min ) ;
	self.max = Vector3D.fromObject( max ) ;
	
	return self ;
} ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundingBox3D.fromTo = function fromTo( fromVector , toVector )
{
    var self = Object.create( BoundingBox3D.prototype ) ;
    
	self.min = Object.create( Vector3D.prototype ) ;
	self.max = Object.create( Vector3D.prototype ) ;
	
	self.setFromTo( fromVector , toVector ) ;
	
	return self ;
} ;



BoundingBox3D.prototype.setMinMaxVectors = function setMinMaxVectors( min , max )
{
	this.min.setVector( min ) ;
	this.max.setVector( max ) ;
	
	return this ;
} ;



BoundingBox3D.prototype.setBoundingBox = function setBoundingBox( boundingBox )
{
	this.min.setVector( boundingBox.min ) ;
	this.max.setVector( boundingBox.max ) ;
	
	return this ;
} ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundingBox3D.prototype.setFromTo = function setFromTo( fromVector , toVector )
{
	if ( fromVector.x < toVector.x ) { this.min.x = fromVector.x ; this.max.x = toVector.x ; }
	else { this.min.x = toVector.x ; this.max.x = fromVector.x ; }
	
	if ( fromVector.y < toVector.y ) { this.min.y = fromVector.y ; this.max.y = toVector.y ; }
	else { this.min.y = toVector.y ; this.max.y = fromVector.y ; }
	
	if ( fromVector.z < toVector.z ) { this.min.z = fromVector.z ; this.max.z = toVector.z ; }
	else { this.min.z = toVector.z ; this.max.z = fromVector.z ; }
	
	return this ;
} ;



BoundingBox3D.prototype.dup = function dup()
{
	return BoundingBox3D.fromObject( this ) ;
} ;



BoundingBox3D.prototype.add = function add( bbox )
{
	this.min.add( bbox.min ) ;
	this.max.add( bbox.max ) ;
	
	return this ;
} ;



BoundingBox3D.prototype.boundingBoxIntersection = function boundingBoxIntersection( withBbox )
{
	return (
		utils.egte( this.max.x , withBbox.min.x ) &&
		utils.elte( this.min.x , withBbox.max.x ) &&
		utils.egte( this.max.y , withBbox.min.y ) &&
		utils.elte( this.min.y , withBbox.max.y ) &&
		utils.egte( this.max.z , withBbox.min.z ) &&
		utils.elte( this.min.z , withBbox.max.z )
	) ;
} ;



BoundingBox3D.prototype.translatedBoundingBoxesIntersection = function translatedBoundingBoxesIntersection(
	position ,
	withBbox , withBboxPosition )
{
	return (
		utils.egte( this.max.x + position.x , withBbox.min.x + withBboxPosition.x ) &&
		utils.elte( this.min.x + position.x , withBbox.max.x + withBboxPosition.x ) &&
		utils.egte( this.max.y + position.y , withBbox.min.y + withBboxPosition.y ) &&
		utils.elte( this.min.y + position.y , withBbox.max.y + withBboxPosition.y ) &&
		utils.egte( this.max.z + position.z , withBbox.min.z + withBboxPosition.z ) &&
		utils.elte( this.min.z + position.z , withBbox.max.z + withBboxPosition.z )
	) ;
} ;


