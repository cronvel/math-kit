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



// A starting point/position and a vector, i.e. vector applied on a point/position.
function BoundingBox2D( xMin , xMax , yMin , yMax )
{
	var self = Object.create( BoundingBox2D.prototype ) ;
	
	self.min = Vector2D( xMin , yMin ) ;
	self.max = Vector2D( xMax , yMax ) ;
	
	return self ;
}

module.exports = BoundingBox2D ;



// Load modules
var Vector2D = require( './Vector2D.js' ) ;



BoundingBox2D.fromObject = function fromObject( object )
{
	var self = Object.create( BoundingBox2D.prototype ) ;
	
	self.min = Vector2D.fromObject( object.min ) ;
	self.max = Vector2D.fromObject( object.max ) ;
	
	return self ;
} ;



BoundingBox2D.fromMinMaxVectors = function fromMinMaxVectors( min , max )
{
	var self = Object.create( BoundingBox2D.prototype ) ;
	
	self.min = Vector2D.fromObject( min ) ;
	self.max = Vector2D.fromObject( max ) ;
	
	return self ;
} ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundingBox2D.fromTo = function fromTo( fromVector , toVector )
{
    var self = Object.create( BoundingBox2D.prototype ) ;
    
	self.min = Object.create( Vector2D.prototype ) ;
	self.max = Object.create( Vector2D.prototype ) ;
	
	self.setFromTo( fromVector , toVector ) ;
	
	return self ;
} ;



BoundingBox2D.prototype.setMinMaxVectors = function setMinMaxVectors( min , max )
{
	this.min.setVector( min ) ;
	this.max.setVector( max ) ;
	
	return this ;
} ;



BoundingBox2D.prototype.setBoundingBox = function setBoundingBox( boundingBox )
{
	this.min.setVector( boundingBox.min ) ;
	this.max.setVector( boundingBox.max ) ;
	
	return this ;
} ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundingBox2D.prototype.setFromTo = function setFromTo( fromVector , toVector )
{
	if ( fromVector.x < toVector.x ) { this.min.x = fromVector.x ; this.max.x = toVector.x ; }
	else { this.min.x = toVector.x ; this.max.x = fromVector.x ; }
	
	if ( fromVector.y < toVector.y ) { this.min.y = fromVector.y ; this.max.y = toVector.y ; }
	else { this.min.y = toVector.y ; this.max.y = fromVector.y ; }
	
	return this ;
} ;



BoundingBox2D.prototype.dup = function dup()
{
	return BoundingBox2D.fromObject( this ) ;
} ;



BoundingBox2D.prototype.add = function add( bbox )
{
	this.min.add( bbox.min ) ;
	this.max.add( bbox.max ) ;
	
	return this ;
} ;



BoundingBox2D.prototype.boundingBoxIntersection = function boundingBoxIntersection( withBbox )
{
	return (
		utils.egte( this.max.x , withBbox.min.x ) &&
		utils.elte( this.min.x , withBbox.max.x ) &&
		utils.egte( this.max.y , withBbox.min.y ) &&
		utils.elte( this.min.y , withBbox.max.y )
	) ;
} ;



BoundingBox2D.prototype.translatedBoundingBoxesIntersection = function translatedBoundingBoxesIntersection(
	position ,
	withBbox , withBboxPosition )
{
	return (
		utils.egte( this.max.x + position.x , withBbox.min.x + withBboxPosition.x ) &&
		utils.elte( this.min.x + position.x , withBbox.max.x + withBboxPosition.x ) &&
		utils.egte( this.max.y + position.y , withBbox.min.y + withBboxPosition.y ) &&
		utils.elte( this.min.y + position.y , withBbox.max.y + withBboxPosition.y )
	) ;
} ;



// Same with moving (sweeping) BBoxes
BoundingBox2D.prototype.sweepingBoundingBoxesIntersection = function sweepingBoundingBoxesIntersection(
	boundVector ,
	withBbox , withBboxBoundVector )
{
	var dx = Math.abs( boundVector.vector.x - withBboxBoundVector.x ) ;
	var dy = Math.abs( boundVector.vector.y - withBboxBoundVector.y ) ;
	
	return (
		utils.egte( this.max.x + boundVector.position.x + dx , withBbox.min.x + withBboxBoundVector.position.x ) &&
		utils.elte( this.min.x + boundVector.position.x - dx , withBbox.max.x + withBboxBoundVector.position.x ) &&
		utils.egte( this.max.y + boundVector.position.y + dy , withBbox.min.y + withBboxBoundVector.position.y ) &&
		utils.elte( this.min.y + boundVector.position.y - dy , withBbox.max.y + withBboxBoundVector.position.y )
	) ;
} ;


