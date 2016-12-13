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
// A starting point and a vector, i.e. vector applied on a point.
function BoundVector3D( point , vector )
{
	var self = this ;
	
	if ( ! ( self instanceof BoundVector3D ) ) { self = Object.create( BoundVector3D.prototype ) ; }
	
	self.point = Vector3D( point ) ;
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
	return this.point.dup().add( this.vector ) ;
} ;



BoundVector3D.prototype.setEndPoint = function setEndPoint( endPointVector )
{
	this.vector = endPointVector.dup().sub( this.point ) ;
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
	
	var c1 = this.vector.x * this.point.y - this.vector.y * this.point.x ;
	var c2 = boundVector.vector.x * boundVector.point.y - boundVector.vector.y * boundVector.point.x ;
	
	return Vector2D(
		( c1 * boundVector.vector.x  -  c2 * this.vector.x ) / determinant ,
		( c1 * boundVector.vector.y  -  c2 * this.vector.y ) / determinant
	) ;
} ;



BoundVector3D.prototype.projectionOfPoint = function projectionOfPoint( pointVector )
{
	var projectionVector = BoundVector3D( pointVector , this.vector.dup().orthogonal() ) ;
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


