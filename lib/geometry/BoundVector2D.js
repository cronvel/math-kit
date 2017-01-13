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



// "Vecteur lié"
// A starting point/position and a vector, i.e. vector applied on a point/position.
function BoundVector2D( px , py , vx , vy )
{
	var self = Object.create( BoundVector2D.prototype ) ;
	
	self.position = Vector2D( px , py ) ;
	self.vector = Vector2D( vx , vy ) ;
	
	return self ;
}

module.exports = BoundVector2D ;



// Load modules
var Vector2D = require( './Vector2D.js' ) ;



BoundVector2D.fromObject = function fromObject( position , vector )
{
	var self = Object.create( BoundVector2D.prototype ) ;
	
	self.position = Vector2D.fromObject( position ) ;
	self.vector = Vector2D.fromObject( vector ) ;
	
	return self ;
} ;



// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundVector2D.fromTo = function fromTo( fromVector , toVector )
{
	var self = Object.create( BoundVector2D.prototype ) ;
	
	self.position = fromVector.dup() ;
	self.vector = toVector.dup().sub( fromVector ) ;
	
	return self ;
} ;



BoundVector2D.prototype.getEndPoint = function getEndPoint()
{
	return this.position.dup().add( this.vector ) ;
} ;



BoundVector2D.prototype.dup = function dup()
{
	return this.position.dup().add( this.vector ) ;
} ;



BoundVector2D.prototype.setEndPoint = function setEndPoint( endPointVector )
{
	this.vector = endPointVector.dup().sub( this.position ) ;
	return this ;
} ;



// Apply the vector to the position with a rate/weight/time, useful for physics (update position with speed vector)
BoundVector2D.prototype.apply = function apply( w )
{
	this.position.apply( this.vector , w ) ;
	return this ;
} ;



// Apply an acceleration vector for a given time: modifying .vector and .position
BoundVector2D.prototype.applyAcceleration = function applyAcceleration( vector , w )
{
	this.position.apply( this.vector.apply( vector , w ) , w ) ;
	return this ;
} ;



/*
    Test a x,y coordinates with the line equation: ax + by + c
    * zero: it's on the line
    * positive: it's on the left-side of the vector of the line
    * negative: it's on the right-side of the vector of the line
	
	The normal is on the left side of the vector, the way it works for axis
	- vy * X + vx * Y + C = 0  
	where C = - vx * py + vy * px 
*/
BoundVector2D.prototype.test = function test( x , y )
{
	return - this.vector.y * x + this.vector.x * y - this.vector.x * this.position.y + this.vector.y * this.position.x ;
} ;



BoundVector2D.prototype.testVector = function testVector( vector )
{
	return - this.vector.y * vector.x + this.vector.x * vector.y - this.vector.x * this.position.y + this.vector.y * this.position.x ;
} ;



/*
	This is the equation of the line of the bound vector:
	vy * X - vx * Y + C = 0  
	where C = vx * py - vy * px 
*/
BoundVector2D.prototype.intersection = function intersection( boundVector )
{
	var determinant = Vector2D.determinant( this.vector , boundVector.vector ) ;
	
	if ( determinant === 0 ) { return Vector2D() ; }
	
	var c1 = this.vector.x * this.position.y - this.vector.y * this.position.x ;
	var c2 = boundVector.vector.x * boundVector.position.y - boundVector.vector.y * boundVector.position.x ;
	
	return Vector2D(
		( c1 * boundVector.vector.x  -  c2 * this.vector.x ) / determinant ,
		( c1 * boundVector.vector.y  -  c2 * this.vector.y ) / determinant
	) ;
} ;



BoundVector2D.prototype.pointProjection = function pointProjection( positionVector )
{
	var projectionVector = BoundVector2D.fromObject( positionVector , this.vector.dup().orthogonal() ) ;
	return this.intersection( projectionVector ) ;
} ;



// Getters/Setters
Object.defineProperties( BoundVector2D.prototype , {
	endPoint: {
		get: BoundVector2D.prototype.getEndPoint ,
		set: BoundVector2D.prototype.setEndPoint
	}
} ) ;


