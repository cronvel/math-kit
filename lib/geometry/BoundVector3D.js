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



var utils = require( './utils.js' ) ;



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
var BoundVector2D = require( './BoundVector2D.js' ) ;
var Plane3D = require( './Plane3D.js' ) ;

var nullVector = Vector3D( 0 , 0 , 0 ) ;



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



BoundVector3D.prototype.set = function set( px , py , pz , vx , vy , vz )
{
	this.position.set( px , py , pz ) ;
	this.vector.set( vx , vy , vz ) ;
	
	return this ;
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



// Parametric position for t
BoundVector3D.prototype.tPosition = function tPosition( t )
{
	return Vector3D(
		this.position.x + this.vector.x * t ,
		this.position.y + this.vector.y * t ,
		this.position.z + this.vector.z * t
	) ;
} ;



// Parametric t for position, assume that position is on the line
BoundVector3D.prototype.positionT = function positionT( positionVector )
{
	var xabs , yabs ;
	
	// Use the greatest axis distance for better precision
	if ( ( xabs = Math.abs( this.vector.x ) ) > ( yabs = Math.abs( this.vector.y ) ) )
	{
		if ( xabs > Math.abs( this.vector.z ) )
		{
			return ( positionVector.x - this.position.x ) / this.vector.x ;
		}
		else
		{
			return ( positionVector.z - this.position.z ) / this.vector.z ;
		}
	}
	else if ( yabs > Math.abs( this.vector.z ) )
	{
		return ( positionVector.y - this.position.y ) / this.vector.y ;
	}
	else
	{
		return ( positionVector.z - this.position.z ) / this.vector.z ;
	}
} ;



BoundVector3D.prototype.normalize = function normalize()
{
	this.vector.normalize() ;
	return this ;
} ;



BoundVector3D.prototype.normalizeCheck = function normalizeCheck()
{
	this.vector.normalizeCheck() ;
	return this ;
} ;



BoundVector3D.prototype.transpose2D = function transpose2D( origin , normal , xAxis )
{
	return BoundVector2D.fromVectors(
		this.position.transpose2D( origin , normal , xAxis ) ,
		this.vector.transpose2D( nullVector , normal , xAxis )
	) ;
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
	return utils.eeq( this.vector.y * dz - this.vector.z * dy , 0 ) &&
		utils.eeq( this.vector.z * dx - this.vector.x * dz , 0 ) &&
		utils.eeq( this.vector.x * dy - this.vector.y * dx , 0 ) ;
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
	var t = this.positionT( positionVector ) ;
	return utils.egte( t , 0 ) && utils.elte( t , 1 ) && this.isOnLine( positionVector ) ;
} ;



BoundVector3D.prototype.isInBounds = function isInBounds( positionVector )
{
	return (
			( this.vector.x >= 0 && utils.egte( positionVector.x , this.position.x ) && utils.elte( positionVector.x , this.position.x + this.vector.x ) )
			|| ( this.vector.x < 0 && utils.elte( positionVector.x , this.position.x ) && utils.egte( positionVector.x , this.position.x + this.vector.x ) )
		) && (
			( this.vector.y >= 0 && utils.egte( positionVector.y , this.position.y ) && utils.elte( positionVector.y , this.position.y + this.vector.y ) )
			|| ( this.vector.y < 0 && utils.elte( positionVector.y , this.position.y ) && utils.egte( positionVector.y , this.position.y + this.vector.y ) )
		) && (
			( this.vector.z >= 0 && utils.egte( positionVector.z , this.position.z ) && utils.elte( positionVector.z , this.position.z + this.vector.z ) )
			|| ( this.vector.z < 0 && utils.elte( positionVector.z , this.position.z ) && utils.egte( positionVector.z , this.position.z + this.vector.z ) )
		) ;
} ;



BoundVector3D.prototype.isInExclusiveBounds = function isInExclusiveBounds( positionVector )
{
	return this.isInBounds( positionVector ) &&
		! positionVector.isEqualTo( this.position ) &&
		(
			utils.eneq( positionVector.x , this.position.x + this.vector.x ) ||
			utils.eneq( positionVector.y , this.position.y + this.vector.y ) ||
			utils.eneq( positionVector.z , this.position.z + this.vector.z )
		) ;
} ;



BoundVector3D.prototype.pointProjection = function pointProjection( positionVector )
{
	// Faster:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;
	var dz = positionVector.z - this.position.z ;
	
	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y + dz * this.vector.z ) / this.vector.dot( this.vector ) ;
	
	return Vector3D(
		this.position.x + this.vector.x * t ,
		this.position.y + this.vector.y * t ,
		this.position.z + this.vector.z * t
	) ;
} ;



// Return the shortest orthogonal vector moving the point (argument) to the line of the bound vector
BoundVector3D.prototype.pointToLineVector = function pointToLineVector( positionVector )
{
	// Faster, using .pointProjection() code:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;
	var dz = positionVector.z - this.position.z ;
	
	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y + dz * this.vector.z ) / this.vector.dot( this.vector ) ;
	
	return Vector3D(
		this.vector.x * t - dx ,
		this.vector.y * t - dy ,
		this.vector.z * t - dz
	) ;
} ;



// Produce the inverse vector of .pointToLineVector()
BoundVector3D.prototype.lineToPointVector = function lineToPointVector( positionVector )
{
	// Faster, using .pointProjection() code:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;
	var dz = positionVector.z - this.position.z ;
	
	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y + dz * this.vector.z ) / this.vector.dot( this.vector ) ;
	
	return Vector3D(
		dx - this.vector.x * t ,
		dy - this.vector.y * t ,
		dz - this.vector.z * t
	) ;
} ;



// Distance of a point to the line
BoundVector3D.prototype.pointDistance = function pointDistance( positionVector )
{
	// Faster, using .pointProjection() code:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;
	var dz = positionVector.z - this.position.z ;
	
	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y + dz * this.vector.z ) / this.vector.dot( this.vector ) ;
	
	dx = this.vector.x * t - dx ;
	dy = this.vector.y * t - dy ;
	dz = this.vector.z * t - dz ;
	
	return utils.hypot3( dx , dy , dz ) ;
} ;



// Squared distance of a point to the line
BoundVector3D.prototype.pointSquaredDistance = function pointSquaredDistance( positionVector )
{
	// Using .pointProjection() code again:
	var dx = positionVector.x - this.position.x ;
	var dy = positionVector.y - this.position.y ;
	var dz = positionVector.z - this.position.z ;
	
	// dot products...
	var t = ( dx * this.vector.x + dy * this.vector.y + dz * this.vector.z ) / this.vector.dot( this.vector ) ;
	
	dx = this.vector.x * t - dx ;
	dy = this.vector.y * t - dy ;
	dz = this.vector.z * t - dz ;
	
	return dx * dx + dy * dy + dz * dz ;
} ;



// Return the shortest segment, as a boundVector.
// The boundVector.position is on 'this', and it points to the line passed as argument.
BoundVector3D.prototype.shortestSegmentToLine = function shortestSegmentToLine( line2 )
{
	// Well, this is a bit cryptic, but it was based upon the article and C code found:
	// http://paulbourke.net/geometry/pointlineplane/
	// http://paulbourke.net/geometry/pointlineplane/lineline.c
	
	var line1 = this ;
	
	if ( line1.vector.isNull() || line2.vector.isNull() ) { return null ; }
	
	if ( line1.vector.isCollinearTo( line2.vector ) )
	{
		// Parallel line case, we are using .pointToLineVector() code
		var dx = line1.position.x - line2.position.x ;
		var dy = line1.position.y - line2.position.y ;
		var dz = line1.position.z - line2.position.z ;
		
		// dot products...
		var t = ( dx * line2.vector.x + dy * line2.vector.y + dz * line2.vector.z ) / line2.vector.dot( line2.vector ) ;
		
		return BoundVector3D(
			line1.position.x ,
			line1.position.y ,
			line1.position.z ,
			line2.vector.x * t - dx ,
			line2.vector.y * t - dy ,
			line2.vector.z * t - dz
		) ;
	}
	
	var diff = Vector3D.fromTo( line2.position , line1.position ) ;
	
	/*
	var dotd2 = diff.x * line2.vector.x + diff.y * line2.vector.y + diff.z * line2.vector.z ;
	var dot21 = line2.vector.x * line1.vector.x + line2.vector.y * line1.vector.y + line2.vector.z * line1.vector.z;
	var dotd1 = diff.x * line1.vector.x + diff.y * line1.vector.y + diff.z * line1.vector.z;
	var dot22 = line2.vector.x * line2.vector.x + line2.vector.y * line2.vector.y + line2.vector.z * line2.vector.z;
	var dot11 = line1.vector.x * line1.vector.x + line1.vector.y * line1.vector.y + line1.vector.z * line1.vector.z;
	var denominator = dot11 * dot22 - dot21 * dot21;
	//*/
	
	//*
	var dotd2 = diff.dot( line2.vector ) ;
	var dot21 = line2.vector.dot( line1.vector ) ;
	var dotd1 = diff.dot( line1.vector ) ;
	var dot22 = line2.vector.dot( line2.vector ) ;
	var dot11 = line1.vector.dot( line1.vector ) ;
	var denominator = dot11 * dot22 - dot21 * dot21;
	//*/
	
	if ( denominator === 0 ) { return null ; }
	
	var numerator = dotd2 * dot21 - dotd1 * dot22;
	var t1 = numerator / denominator ;
	var t2 = ( dotd2 + dot21 * t1 ) / dot22 ;
	
	return BoundVector3D.fromTo( line1.tPosition( t1 ) , line2.tPosition( t2 ) ) ;
} ;



// Getters/Setters
Object.defineProperties( BoundVector3D.prototype , {
	endPoint: {
		get: BoundVector3D.prototype.getEndPoint ,
		set: BoundVector3D.prototype.setEndPoint
	}
} ) ;


