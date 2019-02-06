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
	This is a circle with a major axis and semi-major and semi-minor length.

	Major axis vector MUST remain normalized!
	All constructors normalize it, but direct access should modify that with great care.

	Semi-major should be greater than semi-minor.
*/

function Ellipse2D( x , y , sx , sy , semiMajor , semiMinor ) {
	this.center = new Vector2D( x , y ) ;
	this.majorAxis = new Vector2D( sx , sy ).normalizeCheck() ;
	this.semiMajor = + semiMajor ;
	this.semiMinor = + semiMinor ;

	// Mostly used to cache the result
	this.focus1 = new Vector2D() ;
	this.focus2 = new Vector2D() ;
	this.c = 0 ;
	this.e = 0 ;

	this.r = null ;

	this.update() ;
}

module.exports = Ellipse2D ;



// Load modules
const Vector2D = require( './Vector2D.js' ) ;
const Circle2D = require( './Circle2D.js' ) ;
//const BoundVector2D = require( './BoundVector2D.js' ) ;



Ellipse2D.fromObject = object => new Ellipse2D(
	object.center.x ,
	object.center.y ,
	object.majorAxis.x ,
	object.majorAxis.y ,
	object.semiMajor ,
	object.semiMinor
) ;



Ellipse2D.prototype.set = function( x , y , sx , sy , semiMajor , semiMinor ) {
	this.center.set( x , y ) ;
	this.majorAxis.set( sx , sy ).normalizeCheck() ;
	this.semiMajor = + semiMajor ;
	this.semiMinor = + semiMinor ;

	return this ;
} ;



Ellipse2D.prototype.setEllipse = function( ellipse ) {
	this.center.setVector( ellipse.center ).normalizeCheck() ;
	this.majorAxis.setVector( ellipse.majorAxis ).normalizeCheck() ;
	this.semiMajor = + ellipse.semiMajor ;
	this.semiMinor = + ellipse.semiMinor ;

	return this ;
} ;



Ellipse2D.prototype.dup = function() {
	return Ellipse2D.fromObject( this ) ;
} ;



// Get the ellipse focal point
Ellipse2D.prototype.update = function() {
	this.c = Math.sqrt( this.semiMajor * this.semiMajor - this.semiMinor * this.semiMinor ) ;

	this.e = this.c / this.semiMajor ;

	this.focus1.set(
		this.center.x + this.majorAxis.x * this.c ,
		this.center.y + this.majorAxis.y * this.c
	) ;

	this.focus2.set(
		this.center.x - this.majorAxis.x * this.c ,
		this.center.y - this.majorAxis.y * this.c
	) ;
} ;



/*
	Test a x,y coordinates with the ellipse equation:
	sqrt( dx1² + dy1² ) + sqrt( dx2² + dy2² ) = 2R
	* zero: it's on the ellipse
	* positive: it's on the outside of the ellipse
	* negative: it's on the inside of the ellipse
*/
Ellipse2D.prototype.test = function( x , y ) {
	return (
		utils.hypot2( x - this.focus1.x , y - this.focus1.y )
		+ utils.hypot2( x - this.focus2.x , y - this.focus2.y )
		- 2 * this.semiMajor
	) ;
} ;



// Same with a vector
Ellipse2D.prototype.testVector = function( vector ) {
	return (
		utils.hypot2( vector.x - this.focus1.x , vector.y - this.focus1.y )
		+ utils.hypot2( vector.x - this.focus2.x , vector.y - this.focus2.y )
		- 2 * this.semiMajor
	) ;
} ;


/*
	Parametric form:
	X(t) = Cx + a cos(t) cos(phi) - b sin(t) sin(phi)
	Y(t) = Cy + a cos(t) sin(phi) + b sin(t) cos(phi)
	phi: the angle between the X-axis and the semi-major axis
*/

// Tracer generator for the ellipse
Ellipse2D.prototype.tracer = function*( pixelSize ) {
	var i , t ,
		// This way it would never yield a position farther than one pixel from the previous one
		steps = Math.ceil( this.semiMajor * Math.PI / pixelSize ) ,
		phi = this.majorAxis.angle ,
		cosPhi = Math.cos( phi ) ,
		sinPhi = Math.sin( phi ) ,
		position = new Vector2D() ;

	for ( i = 0 ; i <= steps ; i ++ ) {
		t = 2 * Math.PI * i / steps ;

		position.x = this.center.x + this.semiMajor * Math.cos( t ) * cosPhi - this.semiMinor * Math.sin( t ) * sinPhi ;
		position.y = this.center.y + this.semiMajor * Math.cos( t ) * sinPhi + this.semiMinor * Math.sin( t ) * cosPhi ;

		yield position ;
	}
} ;



Ellipse2D.prototype.pointProjectionTowardCenter = function( positionVector ) {
	// This is probably not the fastest way to do it, but it will be good enough before a replacement code

	var scale = this.semiMinor / this.semiMajor ;

	// Scale the vector
	positionVector = positionVector.dup().fastScaleAxisFrom( this.center , this.majorAxis , scale ) ;

	// Always set 'r' before calling Circle2D methods
	this.r = this.semiMinor ;
	var point = Circle2D.prototype.pointProjection.call( this , positionVector ) ;

	if ( ! point ) { return null ; }

	// Revert the scaling
	scale = this.semiMajor / this.semiMinor ;

	point.fastScaleAxisFrom( this.center , this.majorAxis , scale ) ;

	return point ;
} ;



Ellipse2D.prototype.pointProjection = function( positionVector ) {
	// _shortestPointToEllipse() works with x-axis aligned major axis, and centered to the origin
	// We re-use the same vector for the transposition and the output, to avoid two object allocation
	var iteration = 50 ;
	var vector = positionVector.dup().transpose( this.center , this.majorAxis ) ;
	Ellipse2D._shortestPointToEllipse( this.semiMajor , this.semiMinor , vector.x , vector.y , iteration , vector ) ;
	vector.untranspose( this.center , this.majorAxis ) ;

	return vector ;
} ;



Ellipse2D.prototype.pointDistance = function( positionVector ) {
	// _shortestPointToEllipse() works with x-axis aligned major axis, and centered to the origin
	// We re-use the same vector for the transposition and the output, to avoid two object allocation
	var iteration = 50 ;
	var vector = positionVector.dup().transpose( this.center , this.majorAxis ) ;
	var x = vector.x ;
	var y = vector.y ;
	Ellipse2D._shortestPointToEllipse( this.semiMajor , this.semiMinor , vector.x , vector.y , iteration , vector ) ;

	// No reason to untranspose for distance computation

	return utils.hypot2( vector.x - x , vector.y - y ) ;
} ;



Ellipse2D.prototype.lineIntersection = function( boundVector ) {
	var scale = this.semiMinor / this.semiMajor ;

	// Scale the vector
	boundVector = boundVector.dup() ;
	boundVector.position.fastScaleAxisFrom( this.center , this.majorAxis , scale ) ;
	boundVector.vector.fastScaleAxis( this.majorAxis , scale ) ;

	// Always set 'r' before calling Circle2D methods
	this.r = this.semiMinor ;
	var points = Circle2D.prototype.lineIntersection.call( this , boundVector ) ;

	if ( ! points ) { return null ; }

	// Revert the scaling
	scale = this.semiMajor / this.semiMinor ;

	points[ 0 ].fastScaleAxisFrom( this.center , this.majorAxis , scale ) ;
	if ( points[ 1 ] ) { points[ 1 ].fastScaleAxisFrom( this.center , this.majorAxis , scale ) ; }

	return points ;
} ;





/* Foreign code */



/*
	Code from:
	https://www.geometrictools.com/Documentation/DistancePointEllipseEllipsoid.pdf

	e0: semiMajorAxis
	e1: semiMinorAxis
	y0: x (first axis) coordinate of the input
	y1: y (second axis) coordinate of the input
	x0: x (first axis) coordinate of the closest point on the ellipse
	x1: y (second axis) coordinate of the closest point on the ellipse

	This was working only for the first quadrant of an axial and centered ellipse.
	This is patched for all 4 quadrants.
*/

Ellipse2D._shortestPointToEllipse = function( e0 , e1 , y0 , y1 , maxIter , vector ) {
	var x0 , x1 ;
	var z0 , z1 , g , r0 , sbar , xde0 , numer0 , denom0 ;
	var xflip = false , yflip = false ;

	// patch: flip the input
	if ( y0 < 0 ) { xflip = true ; y0 = -y0 ; }
	if ( y1 < 0 ) { yflip = true ; y1 = -y1 ; }

	if ( y0 === 0 ) {
		x0 = 0 ;
		x1 = e1 ;
		//distance = Math.abs( y1 - e1 );
	}
	else if ( y1 === 0 ) {
		numer0 = e0 * y0 ;
		denom0 = e0 * e0 - e1 * e1 ;

		if ( numer0 < denom0 ) {
			xde0 = numer0 / denom0 ;
			x0 = e0 * xde0 ;
			x1 = e1 * Math.sqrt( 1 - xde0 * xde0 ) ;
			//distance = utils.hypot2( x0-y0 , x1 );
		}
		else {
			x0 = e0 ;
			x1 = 0 ;
			//distance = Math.abs( y0 - e0 );
		}
	}
	else {
		z0 = y0 / e0 ;
		z1 = y1 / e1 ;
		g = z0 * z0 + z1 * z1 - 1 ;

		if ( g !== 0 ) {
			r0 = ( e0 / e1 ) * ( e0 / e1 ) ;
			sbar = Ellipse2D._shortestPointToEllipse.getRoot( r0 , z0 , z1 , g , maxIter ) ;
			x0 = r0 * y0 / ( sbar + r0 ) ;
			x1 = y1 / ( sbar + 1 ) ;
			//distance = utils.hypot2( x0-y0 , x1-y1 );
		}
		else {
			x0 = y0 ;
			x1 = y1 ;
			//distance = 0;
		}
	}

	// patch: flip the output
	if ( xflip ) { x0 = -x0 ; }
	if ( yflip ) { x1 = -x1 ; }

	vector.set( x0 , x1 ) ;
	//return distance;
} ;

Ellipse2D._shortestPointToEllipse.getRoot = function( r0 , z0 , z1 , g , maxIter ) {
	var i , ratio0 , ratio1 ;
	var n0 = r0 * z0 ;
	var s0 = z1 - 1 ;
	var s1 = ( g < 0 ? 0 : utils.hypot2( n0 , z1 ) - 1 ) ;
	var s = 0 ;

	for ( i = 0 ; i < maxIter ; ++ i ) {
		s = ( s0 + s1 ) / 2 ;
		if ( s === s0 || s === s1 ) { break ; }
		ratio0 = n0 / ( s + r0 ) ;
		ratio1 = z1 / ( s + 1 ) ;
		g = ratio0 * ratio0 + ratio1 * ratio1 - 1 ;
		if ( g > 0 ) { s0 = s ; }
		else if ( g < 0 ) { s1 = s ; }
		else { break ; }
	}
	return s ;
} ;



