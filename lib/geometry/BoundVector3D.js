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



// Load modules
var Vector3D = require( './Vector3D.js' ) ;



// "Vecteur lié"
// A starting point/position and a vector, i.e. vector applied on a point/position.
function BoundVector3D( px , py , pz , vx , vy , vz )
{
	var self = Object.create( BoundVector3D.prototype ) ;
	
	self.position = Vector3D( px , py , pz ) ;
	self.vector = Vector3D( vx , vy , vz ) ;
	
	return self ;
}

module.exports = BoundVector3D ;



BoundVector3D.fromObject = function fromObject( position , vector )
{
	var self = Object.create( BoundVector3D.prototype ) ;
	
	self.position = Vector3D.fromObject( position ) ;
	self.vector = Vector3D.fromObject( vector ) ;
	
	return self ;
} ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundVector3D.fromTo = function fromTo( fromVector , toVector )
{
    var self = Object.create( BoundVector3D.prototype ) ;
    
    self.position = fromVector.dup() ;
    self.vector = toVector.dup().sub( fromVector ) ;
    
    return self ;
} ;



BoundVector3D.prototype.getEndPoint = function getEndPoint()
{
	return this.position.dup().add( this.vector ) ;
} ;



BoundVector3D.prototype.setEndPoint = function setEndPoint( endPointVector )
{
	this.vector = endPointVector.dup().sub( this.position ) ;
	return this ;
} ;



// Apply the vector to the position with a rate/weight/time, useful for physics (update position with speed vector)
BoundVector3D.prototype.apply = function apply( w )
{
	this.position.apply( this.vector , w ) ;
	return this ;
} ;



// Apply an acceleration vector for a given time: modifying .vector and .position
BoundVector3D.prototype.applyAcceleration = function applyAcceleration( vector , w )
{
	this.position.apply( this.vector.apply( vector , w ) , w ) ;
	return this ;
} ;

/*
	3D lines
	
	
*/

/*
	3D Planes
	
	The bound vector is a normal of the plane.
	
	This is the equation using that normal:
	vx * X + vy * Y + vz * Z + C = 0
	where C = - px * vx - py * vy - pz * vz
*/

BoundVector3D.prototype.asPlaneIntersectionOfLine = function asPlaneIntersectionOfLine( boundVector )
{
	// First check if the of the bound vector is collinear/coplanar
	// The dot product should not be zero
	var dot = this.vector.dotProduct( boundVector.vector ) ;
	
	if ( ! dot )
	{
		return Vector3D() ;
	}
	
	var common =
		this.vector.dotProduct( boundVector.position )
		- this.position.x * this.vector.x - this.position.y * this.vector.y - this.position.z * this.vector.z ;
	
	return Vector3D(
		boundVector.position.x - ( boundVector.vector.x * common / dot ) ,
		boundVector.position.y - ( boundVector.vector.y * common / dot ) ,
		boundVector.position.z - ( boundVector.vector.z * common / dot )
	) ;
} ;



BoundVector3D.prototype.asPlaneProjectionOfPoint = function asPlaneProjectionOfPoint( positionVector )
{
	var projectionVector = BoundVector3D.fromObject( positionVector , this.vector ) ;
	return this.asPlaneIntersectionOfLine( projectionVector ) ;
} ;



BoundVector3D.prototype.asPlaneDistanceOfPoint = function asPlaneDistanceOfPoint( positionVector )
{
	return (
			this.vector.x * positionVector.x + this.vector.y * positionVector.y + this.vector.z * positionVector.z
			- this.position.x * this.vector.x - this.position.y * this.vector.y - this.position.z * this.vector.z
		) / Math.hypot( this.vector.x , this.vector.y , this.vector.z ) ;
} ;



// Getters/Setters
Object.defineProperties( BoundVector3D.prototype , {
	endPoint: {
		get: BoundVector3D.prototype.getEndPoint ,
		set: BoundVector3D.prototype.setEndPoint
	}
} ) ;


