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



const utils = require( './utils.js' ) ;



// A starting point/position and a vector, i.e. vector applied on a point/position.
function BoundingBox3D( xMin , yMin , zMin , xMax , yMax , zMax ) {
	this.min = new Vector3D( xMin , yMin , zMin ) ;
	this.max = new Vector3D( xMax , yMax , zMax ) ;
}

module.exports = BoundingBox3D ;

const Vector3D = require( './Vector3D.js' ) ;



BoundingBox3D.fromObject = object => new BoundingBox3D(
	object.min.x ,
	object.min.y ,
	object.min.z ,
	object.max.x ,
	object.max.y ,
	object.max.z
) ;

BoundingBox3D.fromMinMaxVectors = ( min , max ) => new BoundingBox3D(
	min.x ,
	min.y ,
	min.z ,
	max.x ,
	max.y ,
	max.z
) ;

// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundingBox3D.fromTo = ( fromVector , toVector ) => new BoundingBox3D().setFromTo( fromVector , toVector ) ;



BoundingBox3D.fromPointCloud = points => {
	var xMin = Infinity ,
		yMin = Infinity ,
		zMin = Infinity ,
		xMax = -Infinity ,
		yMax = -Infinity ,
		zMax = -Infinity ;

	points.forEach( point => {
		if ( point.x < xMin ) { xMin = point.x ; }
		if ( point.x > xMax ) { xMax = point.x ; }
		if ( point.y < yMin ) { yMin = point.y ; }
		if ( point.y > yMax ) { yMax = point.y ; }
		if ( point.z < zMin ) { zMin = point.z ; }
		if ( point.z > zMax ) { zMax = point.z ; }
	} ) ;

	return new BoundingBox3D( xMin , yMin , zMin , xMax , yMax , zMax ) ;
} ;



BoundingBox3D.prototype.setMinMaxVectors = function( min , max ) {
	this.min.setVector( min ) ;
	this.max.setVector( max ) ;

	return this ;
} ;



BoundingBox3D.prototype.setBoundingBox = function( boundingBox ) {
	this.min.setVector( boundingBox.min ) ;
	this.max.setVector( boundingBox.max ) ;

	return this ;
} ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundingBox3D.prototype.setFromTo = function( fromVector , toVector ) {
	if ( fromVector.x < toVector.x ) { this.min.x = fromVector.x ; this.max.x = toVector.x ; }
	else { this.min.x = toVector.x ; this.max.x = fromVector.x ; }

	if ( fromVector.y < toVector.y ) { this.min.y = fromVector.y ; this.max.y = toVector.y ; }
	else { this.min.y = toVector.y ; this.max.y = fromVector.y ; }

	if ( fromVector.z < toVector.z ) { this.min.z = fromVector.z ; this.max.z = toVector.z ; }
	else { this.min.z = toVector.z ; this.max.z = fromVector.z ; }

	return this ;
} ;



BoundingBox3D.prototype.dup = BoundingBox3D.prototype.clone = function() {
	return BoundingBox3D.fromObject( this ) ;
} ;



BoundingBox3D.prototype.add = function( bbox ) {
	this.min.add( bbox.min ) ;
	this.max.add( bbox.max ) ;

	return this ;
} ;



BoundingBox3D.prototype.boundingBoxIntersection = function( withBbox ) {
	return (
		utils.egte( this.max.x , withBbox.min.x ) &&
		utils.elte( this.min.x , withBbox.max.x ) &&
		utils.egte( this.max.y , withBbox.min.y ) &&
		utils.elte( this.min.y , withBbox.max.y ) &&
		utils.egte( this.max.z , withBbox.min.z ) &&
		utils.elte( this.min.z , withBbox.max.z )
	) ;
} ;



BoundingBox3D.prototype.translatedBoundingBoxesIntersection = function( position , withBbox , withBboxPosition ) {
	return (
		utils.egte( this.max.x + position.x , withBbox.min.x + withBboxPosition.x ) &&
		utils.elte( this.min.x + position.x , withBbox.max.x + withBboxPosition.x ) &&
		utils.egte( this.max.y + position.y , withBbox.min.y + withBboxPosition.y ) &&
		utils.elte( this.min.y + position.y , withBbox.max.y + withBboxPosition.y ) &&
		utils.egte( this.max.z + position.z , withBbox.min.z + withBboxPosition.z ) &&
		utils.elte( this.min.z + position.z , withBbox.max.z + withBboxPosition.z )
	) ;
} ;



// Same with moving (sweeping) BBoxes
BoundingBox3D.prototype.sweepingBoundingBoxesIntersection = function( boundVector , withBbox , withBboxBoundVector ) {
	var dx = Math.abs( boundVector.vector.x - withBboxBoundVector.x ) ;
	var dy = Math.abs( boundVector.vector.y - withBboxBoundVector.y ) ;
	var dz = Math.abs( boundVector.vector.z - withBboxBoundVector.z ) ;

	return (
		utils.egte( this.max.x + boundVector.position.x + dx , withBbox.min.x + withBboxBoundVector.position.x ) &&
		utils.elte( this.min.x + boundVector.position.x - dx , withBbox.max.x + withBboxBoundVector.position.x ) &&
		utils.egte( this.max.y + boundVector.position.y + dy , withBbox.min.y + withBboxBoundVector.position.y ) &&
		utils.elte( this.min.y + boundVector.position.y - dy , withBbox.max.y + withBboxBoundVector.position.y ) &&
		utils.egte( this.max.z + boundVector.position.z + dz , withBbox.min.z + withBboxBoundVector.position.z ) &&
		utils.elte( this.min.z + boundVector.position.z - dz , withBbox.max.z + withBboxBoundVector.position.z )
	) ;
} ;



// Same with from/to position instead of boundVector
BoundingBox3D.prototype.sweepingBoundingBoxesFromToIntersection = function( from , to , withBbox , withBboxFrom , withBboxTo ) {
	var dx = Math.abs( to.x - from.x + withBboxTo.x - withBboxFrom.x ) ;
	var dy = Math.abs( to.y - from.y + withBboxTo.y - withBboxFrom.y ) ;
	var dz = Math.abs( to.z - from.z + withBboxTo.z - withBboxFrom.z ) ;

	return (
		utils.egte( this.max.x + from.x + dx , withBbox.min.x + withBboxFrom.x ) &&
		utils.elte( this.min.x + from.x - dx , withBbox.max.x + withBboxFrom.x ) &&
		utils.egte( this.max.y + from.y + dy , withBbox.min.y + withBboxFrom.y ) &&
		utils.elte( this.min.y + from.y - dy , withBbox.max.y + withBboxFrom.y ) &&
		utils.egte( this.max.z + from.z + dz , withBbox.min.z + withBboxFrom.z ) &&
		utils.elte( this.min.z + from.z - dz , withBbox.max.z + withBboxFrom.z )
	) ;
} ;


