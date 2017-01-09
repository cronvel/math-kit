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
function BoundVector3D( position , vector )
{
	var self = this ;
	
	if ( ! ( self instanceof BoundVector3D ) ) { self = Object.create( BoundVector3D.prototype ) ; }
	
	self.position = Vector3D( position ) ;
	self.vector = Vector3D( vector ) ;
	
	return self ;
}

module.exports = BoundVector3D ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundVector3D.fromTo = function fromTo( fromVector , toVector )
{
	return BoundVector3D( fromVector , toVector.dup().sub( fromVector ) ) ;
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



// Apply an acceleration vector for a given time: modifying .vector and .position
BoundVector3D.prototype.applyAcceleration = function applyAcceleration( vector , w )
{
	this.position.apply( this.vector.apply( vector , w ) , w ) ;
	return this ;
} ;



/*
BoundVector3D.prototype.intersection = function intersection( boundVector )
{
	var determinant = Vector2D.determinant( this.vector , boundVector.vector ) ;
	
	if ( determinant === 0 )
	{
		return Vector2D() ;
	}
	
	// This is the equation of a line having a vector on it:
	// vy * X - vx * Y + C = 0  
	// where C = vx py - vy px 
	
	var c1 = this.vector.x * this.position.y - this.vector.y * this.position.x ;
	var c2 = boundVector.vector.x * boundVector.position.y - boundVector.vector.y * boundVector.position.x ;
	
	return Vector2D(
		( c1 * boundVector.vector.x  -  c2 * this.vector.x ) / determinant ,
		( c1 * boundVector.vector.y  -  c2 * this.vector.y ) / determinant
	) ;
} ;



BoundVector3D.prototype.projectionOfPoint = function projectionOfPoint( positionVector )
{
	var projectionVector = BoundVector3D( positionVector , this.vector.dup().orthogonal() ) ;
	return this.intersection( projectionVector ) ;
} ;
*/



// Getters/Setters
Object.defineProperties( BoundVector3D.prototype , {
	endPoint: {
		get: BoundVector3D.prototype.getEndPoint ,
		set: BoundVector3D.prototype.setEndPoint
	}
} ) ;


