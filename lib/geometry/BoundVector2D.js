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



// "Vecteur lié"
// A starting point/position and a vector, i.e. vector applied on a point/position.
function BoundVector2D( px , py , vx , vy ) {
	this.position = new Vector2D( px , py ) ;
	this.vector = new Vector2D( vx , vy ) ;
}

module.exports = BoundVector2D ;



// Load modules
const Vector2D = require( './Vector2D.js' ) ;
const BoundVector3D = require( './BoundVector3D.js' ) ;

const nullVector = new Vector2D( 0 , 0 ) ;



BoundVector2D.fromObject = object => new BoundVector2D( object.position.x , object.position.y , object.vector.x , object.vector.y ) ;
BoundVector2D.fromVectors = ( position , vector ) => new BoundVector2D( position.x , position.y , vector.x , vector.y ) ;

// Create a new bound vector, starting from positional vector1 and pointing to the positional vector2
BoundVector2D.fromTo = ( fromVector , toVector ) => new BoundVector2D(
	fromVector.x ,
	fromVector.y ,
	toVector.x - fromVector.x ,
	toVector.y - fromVector.y
) ;



BoundVector2D.prototype.set = function( px , py , vx , vy ) {
	this.position.set( px , py ) ;
	this.vector.set( vx , vy ) ;

	return this ;
} ;



BoundVector2D.prototype.setVectors = function( position , vector ) {
	this.position.setVector( position ) ;
	this.vector.setVector( vector ) ;

	return this ;
} ;



BoundVector2D.prototype.setBoundVector = function( boundVector ) {
	this.position.setVector( boundVector.position ) ;
	this.vector.setVector( boundVector.vector ) ;

	return this ;
} ;



BoundVector2D.prototype.dup = function() {
	return BoundVector2D.fromObject( this ) ;
} ;



BoundVector2D.prototype.getEndPoint = function() {
	return this.position.dup().add( this.vector ) ;
} ;



BoundVector2D.prototype.setEndPoint = function( endPointVector ) {
	this.vector = endPointVector.dup().sub( this.position ) ;
	return this ;
} ;



BoundVector2D.prototype.isEqualTo = function( boundVector ) {
	return this.position.isEqualTo( boundVector.position ) && this.vector.isEqualTo( boundVector.vector ) ;
} ;



BoundVector2D.prototype.isCollinearTo = BoundVector2D.prototype.isColinearTo = function( boundVector ) {
	return this.vector.isCollinearTo( boundVector.vector ) ;
} ;



// Apply the vector to the position with a rate/weight/time, useful for physics (update position with speed vector)
BoundVector2D.prototype.apply = function( w ) {
	this.position.apply( this.vector , w ) ;
	return this ;
} ;



// Parametric position for t
BoundVector2D.prototype.tPosition = function( t ) {
	return new Vector2D(
		this.position.x + this.vector.x * t ,
		this.position.y + this.vector.y * t
	) ;
} ;



// Parametric t for position, assume that position is on the line
BoundVector2D.prototype.positionT = function( positionVector ) {
	// Use the greatest axis distance for better precision
	if ( Math.abs( this.vector.x ) > Math.abs( this.vector.y ) ) {
		return ( positionVector.x - this.position.x ) / this.vector.x ;
	}

	return ( positionVector.y - this.position.y ) / this.vector.y ;

} ;



// Apply an acceleration vector for a given time: modifying .vector and .position
BoundVector2D.prototype.applyAcceleration = function( vector , w ) {
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
BoundVector2D.prototype.test = function( x , y ) {
	return -this.vector.y * x + this.vector.x * y - this.vector.x * this.position.y + this.vector.y * this.position.x ;
} ;



BoundVector2D.prototype.testVector = function( vector ) {
	return -this.vector.y * vector.x + this.vector.x * vector.y - this.vector.x * this.position.y + this.vector.y * this.position.x ;
} ;



BoundVector2D.prototype.normalize = function() {
	this.vector.normalize() ;
	return this ;
} ;



BoundVector2D.prototype.normalizeCheck = function() {
	this.vector.normalizeCheck() ;
	return this ;
} ;



BoundVector2D.prototype.transpose = function( origin , xAxis ) {
	this.position.transpose( origin , xAxis ) ;
	this.vector.transpose( nullVector , xAxis ) ;
	return this ;
} ;



BoundVector2D.prototype.untranspose = function( origin , xAxis ) {
	this.position.untranspose( origin , xAxis ) ;
	this.vector.untranspose( nullVector , xAxis ) ;
	return this ;
} ;



BoundVector2D.prototype.transpose3D = function( origin , normal , xAxis ) {
	return BoundVector3D.fromVectors(
		this.position.transpose3D( origin , normal , xAxis ) ,
		this.vector.transpose3D( nullVector , normal , xAxis )
	) ;
} ;



/*
	Parametric equation:

	{ x = Vx t + Px
	{ y = Vy t + Py

	<=> t = ( x - Px ) / Vx = ( y - Py ) / Vy
	<=> Vy ( x - Px ) = Vx ( y - Py )

	For a segment, t should be between 0 and 1.
*/
BoundVector2D.prototype.isOnLine = function( positionVector ) {
	return utils.eeq(
		this.vector.y * ( positionVector.x - this.position.x ) ,
		this.vector.x * ( positionVector.y - this.position.y )
	) ;
} ;



BoundVector2D.prototype.isOnLineSegment = BoundVector2D.prototype.isOnSegment = function( positionVector ) {
	var t = this.positionT( positionVector ) ;
	return utils.egte( t , 0 ) && utils.elte( t , 1 ) && this.isOnLine( positionVector ) ;
} ;



// Check if a point is in the axial square defined by the position and the vector
BoundVector2D.prototype.isInBounds = function( positionVector ) {
	return (
		( this.vector.x >= 0 && utils.egte( positionVector.x , this.position.x ) && utils.elte( positionVector.x , this.position.x + this.vector.x ) )
			|| ( this.vector.x < 0 && utils.elte( positionVector.x , this.position.x ) && utils.egte( positionVector.x , this.position.x + this.vector.x ) )
	) && (
		( this.vector.y >= 0 && utils.egte( positionVector.y , this.position.y ) && utils.elte( positionVector.y , this.position.y + this.vector.y ) )
			|| ( this.vector.y < 0 && utils.elte( positionVector.y , this.position.y ) && utils.egte( positionVector.y , this.position.y + this.vector.y ) )
	) ;
} ;



// Same, but excluding bounds
BoundVector2D.prototype.isInExclusiveBounds = function( positionVector ) {
	return this.isInBounds( positionVector ) &&
		! positionVector.isEqualTo( this.position ) &&
		(
			utils.eneq( positionVector.x , this.position.x + this.vector.x ) ||
			utils.eneq( positionVector.y , this.position.y + this.vector.y )
		) ;
} ;



BoundVector2D.prototype.pointProjection = function( positionVector ) {
	// Faster:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;

	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y ) / this.vector.dot( this.vector ) ;

	return new Vector2D(
		this.position.x + this.vector.x * t ,
		this.position.y + this.vector.y * t
	) ;
} ;



// Return the shortest orthogonal vector moving the point (argument) to the line of the bound vector
BoundVector2D.prototype.pointToLineVector = function( positionVector ) {
	// Faster, using .pointProjection() code:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;

	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y ) / this.vector.dot( this.vector ) ;

	return new Vector2D(
		this.vector.x * t - dx ,
		this.vector.y * t - dy
	) ;
} ;



// Produce the inverse vector of .pointToLineVector()
BoundVector2D.prototype.lineToPointVector = function( positionVector ) {
	// Faster, using .pointProjection() code:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;

	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y ) / this.vector.dot( this.vector ) ;

	return new Vector2D(
		dx - this.vector.x * t ,
		dy - this.vector.y * t
	) ;
} ;



BoundVector2D.prototype.pointDistance = function( positionVector ) {
	return Math.abs(
		-this.vector.y * positionVector.x + this.vector.x * positionVector.y
			- this.vector.x * this.position.y + this.vector.y * this.position.x
	) / utils.hypot2( this.vector.x , this.vector.y ) ;
} ;



BoundVector2D.prototype.pointSquaredDistance = function( positionVector ) {
	return Math.abs(
		-this.vector.y * positionVector.x + this.vector.x * positionVector.y
			- this.vector.x * this.position.y + this.vector.y * this.position.x
	) / ( this.vector.x * this.vector.x , this.vector.y * this.vector.y ) ;
} ;



/*
	This is the equation of the line of the bound vector:
	vy * X - vx * Y + C = 0
	where C = vx * py - vy * px
*/
BoundVector2D.prototype.lineIntersection = function( boundVector , offset = 0 ) {
	var determinant = Vector2D.determinant( this.vector , boundVector.vector ) ;

	if ( determinant === 0 ) { return null ; }

	// Compute offset
	var px = this.position.x - this.vector.y * offset ;
	var py = this.position.y + this.vector.x * offset ;

	var c1 = this.vector.x * py - this.vector.y * px ;
	var c2 = boundVector.vector.x * boundVector.position.y - boundVector.vector.y * boundVector.position.x ;

	return new Vector2D(
		( c1 * boundVector.vector.x  -  c2 * this.vector.x ) / determinant ,
		( c1 * boundVector.vector.y  -  c2 * this.vector.y ) / determinant
	) ;
} ;



// Like .lineIntersection(), but add a 't' property containing the parametric t value for the collision
BoundVector2D.prototype.lineIntersectionT = function( boundVector , offset ) {
	var intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }
	intersection.t = boundVector.positionT( intersection ) ;
	return intersection ;
} ;



// A trace is like a segment, collision should happen between 0 and 1
BoundVector2D.prototype.traceIntersection = function( boundVector , offset , maxT = 1 ) {
	var intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }

	var t = boundVector.positionT( intersection ) ;

	//if ( ! utils.e3lte( 0 , t , maxT || 1 ) ) { return null ; }
	if ( t < 0 || t > maxT ) { return null ; }

	intersection.t = t ;
	return intersection ;
} ;



// Getters/Setters
Object.defineProperties( BoundVector2D.prototype , {
	endPoint: {
		get: BoundVector2D.prototype.getEndPoint ,
		set: BoundVector2D.prototype.setEndPoint
	}
} ) ;


