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



// Load modules
var Vector3D = require( './Vector3D.js' ) ;



BoundVector3D.fromObject = function fromObject( object )
{
	var self = Object.create( BoundVector3D.prototype ) ;
	
	self.position = Vector3D.fromObject( object.position ) ;
	self.vector = Vector3D.fromObject( object.vector ) ;
	
	return self ;
} ;



BoundVector3D.fromVectors = function fromVectors( position , vector )
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



BoundVector3D.prototype.setVectors = function setVectors( position , vector )
{
	this.position.setVector( position ) ;
	this.vector.setVector( vector ) ;
	
	return this ;
} ;



BoundVector3D.prototype.setBoundVector = function setBoundVector( boundVector )
{
	this.position.setVector( boundVector.position ) ;
	this.vector.setVector( boundVector.vector ) ;
	
	return this ;
} ;



BoundVector3D.prototype.dup = function dup()
{
	return BoundVector3D.fromObject( this ) ;
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



BoundVector3D.prototype.isEqualTo = function isEqualTo( boundVector )
{
	return this.position.isEqualTo( boundVector.position ) && this.vector.isEqualTo( boundVector.vector ) ;
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



BoundVector3D.prototype.isOnLine = function isOnLine( positionVector )
{
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;
	var dz = positionVector.z - this.position.z ;
	
	// The cross-product should be null
	return this.vector.y * dz - this.vector.z * dy === 0 &&
		this.vector.z * dx - this.vector.x * dz === 0 &&
		this.vector.x * dy - this.vector.y * dx === 0 ;
} ;



/*
	Parametric equation:
	
	{ x = Vx t + Px 
	{ y = Vy t + Py
	{ z = Vz t + Pz
	
	<=> t = ( x - Px ) / Vx = ( y - Py ) / Vy = Vz ( z - Pz )
	
	For a segment, t should be between 0 and 1.
*/
BoundVector3D.prototype.isOnLineSegment = BoundVector3D.prototype.isOnSegment = function isOnLineSegment( positionVector )
{
	var t ;
	
	if ( this.vector.x )
	{
		t = ( positionVector.x - this.position.x ) / this.vector.x ;
	}
	else if ( this.vector.y )
	{
		t = ( positionVector.y - this.position.y ) / this.vector.y ;
	}
	else if ( this.vector.z )
	{
		t = ( positionVector.z - this.position.z ) / this.vector.z ;
	}
	else
	{
		// Not sure if this is mathematically true: is this still a line segment?
		return this.position.isEqualTo( positionVector ) ;
	}
	
	return t >= 0 && t <= 1 && this.isOnLine( positionVector ) ;
} ;



BoundVector3D.prototype.isInBounds = function isInBounds( positionVector )
{
	return (
			( this.vector.x >= 0 && positionVector.x >= this.position.x && positionVector.x <= this.position.x + this.vector.x )
			|| ( this.vector.x < 0 && positionVector.x <= this.position.x && positionVector.x >= this.position.x + this.vector.x )
		) && (
			( this.vector.y >= 0 && positionVector.y >= this.position.y && positionVector.y <= this.position.y + this.vector.y )
			|| ( this.vector.y < 0 && positionVector.y <= this.position.y && positionVector.y >= this.position.y + this.vector.y )
		) && (
			( this.vector.z >= 0 && positionVector.z >= this.position.z && positionVector.z <= this.position.z + this.vector.z )
			|| ( this.vector.z < 0 && positionVector.z <= this.position.z && positionVector.z >= this.position.z + this.vector.z )
		) ;
} ;



// Getters/Setters
Object.defineProperties( BoundVector3D.prototype , {
	endPoint: {
		get: BoundVector3D.prototype.getEndPoint ,
		set: BoundVector3D.prototype.setEndPoint
	}
} ) ;


