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



/*
	This is the equation:
	(X - x)² + (Y - y)² = r²
*/

function Circle2D( x , y , r ) {
	this.center = new Vector2D( x , y ) ;
	this.r = + r ;
}

module.exports = Circle2D ;

const Vector2D = require( './Vector2D.js' ) ;
//const BoundVector2D = require( './BoundVector2D.js' ) ;



Circle2D.fromObject = object => new Circle2D( object.center.x , object.center.y , object.r ) ;



Circle2D.prototype.set = function( x , y , r ) {
	this.center.set( x , y ) ;
	this.r = + r ;
	return this ;
} ;



Circle2D.prototype.setR = function( r ) {
	this.r = + r ;
	return this ;
} ;



Circle2D.prototype.setCircle = function( circle ) {
	this.center.setVector( circle.center ) ;
	this.r = + circle.r ;
	return this ;
} ;



Circle2D.prototype.dup = Circle2D.prototype.clone = function() {
	return Circle2D.fromObject( this ) ;
} ;



/*
	Test a x,y coordinates with the circle equation: (x - px)² + (y - py)² - r² = 0
	* zero: it's on the circle
	* positive: it's on the outside of the circle
	* negative: it's on the inside of the circle
*/
Circle2D.prototype.test = function( x , y ) {
	var dx = x - this.center.x ,
		dy = y - this.center.y ;

	return dx * dx + dy * dy - this.r * this.r ;
} ;



// Same with a vector
Circle2D.prototype.testVector = function( vector ) {
	var dx = vector.x - this.center.x ,
		dy = vector.y - this.center.y ;

	return dx * dx + dy * dy - this.r * this.r ;
} ;



// Like test, but the result is the distance outside (positive) or inside (negative)
Circle2D.prototype.normalizedTest = function( x , y ) {
	return utils.hypot2( x - this.center.x , y - this.center.y ) - this.r ;
} ;



// Same with a vector
Circle2D.prototype.normalizedTestVector = function( vector ) {
	return utils.hypot2( vector.x - this.center.x , vector.y - this.center.y ) - this.r ;
} ;



// Normalize a test value that was produced by .test() or .testVector()
Circle2D.prototype.normalizeTest = function( testValue ) {
	return Math.sqrt( testValue + this.r * this.r ) - this.r ;
} ;



Circle2D.prototype.pointDistance = function( positionVector ) {
	return Math.abs( utils.hypot2( positionVector.x - this.center.x , positionVector.y - this.center.y ) - this.r ) ;
} ;



Circle2D.prototype.lineIntersection = function( boundVector , offset = 0 ) {
	// http://mathworld.wolfram.com/Circle-LineIntersection.html

	// Act as if the center of the circle was at 0,0
	// So translate the line accordingly.

	var r = this.r + offset ;
	var dx = boundVector.vector.x ;
	var dy = boundVector.vector.y ;
	var dr2 = dx * dx + dy * dy ;
	var det = ( boundVector.position.x - this.center.x ) * ( boundVector.position.y + dy - this.center.y )
		- ( boundVector.position.y - this.center.y ) * ( boundVector.position.x + dx - this.center.x ) ;

	// The discriminant
	var delta = r * r * dr2 - det * det ;

	if ( delta < 0 ) {
		return null ;
	}
	else if ( delta === 0 ) {
		return [ new Vector2D(  this.center.x + det * dy / dr2  ,  this.center.y - det * dx / dr2  ) ] ;
	}

	var sqrtDelta = Math.sqrt( delta ) ;

	return [
		new Vector2D(  this.center.x + ( det * dy + dx * sqrtDelta ) / dr2  ,  this.center.y + ( -det * dx + dy * sqrtDelta ) / dr2  ) ,
		new Vector2D(  this.center.x + ( det * dy - dx * sqrtDelta ) / dr2  ,  this.center.y + ( -det * dx - dy * sqrtDelta ) / dr2  )
	] ;

} ;



// Like .lineIntersection(), but add a 't' property containing the parametric t value for the collision
Circle2D.prototype.lineIntersectionT = function( boundVector , offset ) {
	var intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }
	intersection[ 0 ].t = boundVector.positionT( intersection[ 0 ] ) ;
	if ( intersection[ 1 ] ) { intersection[ 1 ].t = boundVector.positionT( intersection[ 1 ] ) ; }
	return intersection ;
} ;



// A trace is like a segment, collision should happen between 0 and 1,
// when there are two intersections, only the one with the smallest 't' is returned
Circle2D.prototype.traceIntersection = function( boundVector , offset , maxT = 1 , _3lte = utils._3lte ) {
	var t , altT , intersection = this.lineIntersection( boundVector , offset ) ;
	if ( intersection === null ) { return null ; }

	maxT = maxT || 1 ;

	t = boundVector.positionT( intersection[ 0 ] ) ;

	if ( ! _3lte( 0 , t , maxT ) ) {
		// First intersection is out of range
		if ( intersection.length === 1 ) { return null ; }

		altT = boundVector.positionT( intersection[ 1 ] ) ;
		if ( ! _3lte( 0 , altT , maxT ) ) { return null ; }

		intersection[ 1 ].t = altT ;
		return intersection[ 1 ] ;
	}
	else if ( intersection.length === 1 ) {
		// First intersection is in range, and there is no other intersection
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}

	// Two intersections, the first is valid, check the second one

	altT = boundVector.positionT( intersection[ 1 ] ) ;
	if ( altT > t || ! _3lte( 0 , altT , maxT ) ) {
		// Second intersection is out of range, or happens after the first, return the first
		intersection[ 0 ].t = t ;
		return intersection[ 0 ] ;
	}

	intersection[ 1 ].t = altT ;
	return intersection[ 1 ] ;
} ;

Circle2D.prototype.epsilonTraceIntersection = function( boundVector , offset , maxT = 1 ) {
	return this.traceIntersection( boundVector , offset , maxT , utils.e3lte ) ;
} ;



Circle2D.prototype.pointProjection = function( positionVector ) {
	return this.center.dup().moveToward( positionVector , this.r ) ;
} ;



// Tracer generator for the circle
Circle2D.prototype.tracer = function*( params ) {
	var i , t ,
		// This way it would never yield a position farther than one pixel from the previous one
		steps = Math.ceil( this.r * Math.PI / Math.min( params.incX , params.incY ) ) ;

	for ( i = 0 ; i <= steps ; i ++ ) {
		t = 2 * Math.PI * i / steps ;

		yield {
			x: this.center.x + this.r * Math.cos( t ) ,
			y: this.center.y + this.r * Math.sin( t )
		} ;
	}
} ;

