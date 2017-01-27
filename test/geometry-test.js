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

"use strict" ;



/* jshint -W064 */
/* global describe, it */



var math = require( '../lib/math.js' ) ;
var geo = math.geometry ;
var Vector2D = geo.Vector2D ;
var Vector3D = geo.Vector3D ;
var BoundVector2D = geo.BoundVector2D ;
var BoundVector3D = geo.BoundVector3D ;
var Circle2D = geo.Circle2D ;
var Sphere3D = geo.Sphere3D ;
var Plane3D = geo.Plane3D ;
var Circle3D = geo.Circle3D ;
var expect = require( 'expect.js' ) ;





			/* Helper */



function expectCirca( value , circa )
{
	var precision = 0.000000000001 ;
	expect( value ).to.be.within( circa - precision , circa + precision ) ;
}





			/* Tests */



describe( "Geometry" , function() {

	describe( "Vector2D" , function() {
		
		it( "constructor" , function() {
			expect( Vector2D( 3 , 4 ) ).to.eql( { x: 3 , y: 4 } ) ;
			expect( Number.isNaN( Vector2D().x ) ).to.be( true ) ;
			expect( Number.isNaN( Vector2D().y ) ).to.be( true ) ;
		} ) ;
		
		it( "from/to constructor" , function() {
			expect( Vector2D.fromTo( Vector2D( 3 , 4 ) , Vector2D( 8 , 2 ) ) ).to.eql( { x: 5 , y: -2 } ) ;
		} ) ;
		
		it( "undefined vector" , function() {
			expect( Vector2D().undefined ).to.be( true ) ;
			expect( Vector2D( NaN , NaN ).undefined ).to.be( true ) ;
			expect( Vector2D( undefined , 4 ).undefined ).to.be( true ) ;
			expect( Vector2D( 3 , undefined ).undefined ).to.be( true ) ;
			expect( Vector2D( 3 , 4 ).undefined ).to.be( false ) ;
			
			var v1 = Vector2D( 3 , 4 ) ;
			v1.undefined = true ;
			expect( Number.isNaN( v1.x ) ).to.be( true ) ;
			expect( Number.isNaN( v1.y ) ).to.be( true ) ;
		} ) ;
		
		it( "duplicate" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			expect( v1.dup() ).not.to.be( v1 ) ;
			expect( v1.dup() ).to.eql( { x: 3 , y: 4 } ) ;
		} ) ;
		
		it( "addition" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			var v2 = Vector2D( 5 , 7 ) ;
			var v3 = Vector2D( 2 , 1 ) ;
			expect( v1.dup().add( v2 ) ).to.eql( { x: 8 , y: 11 } ) ;
			expect( v1.dup().addMulti( v2 , v3 ) ).to.eql( { x: 10 , y: 12 } ) ;
		} ) ;
		
		it( "apply" ) ;
		
		it( "substract" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			var v2 = Vector2D( 2 , 1 ) ;
			expect( v1.dup().sub( v2 ) ).to.eql( { x: 1 , y: 3 } ) ;
		} ) ;
		
		it( "multiply" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			expect( v1.dup().mul( 3 ) ).to.eql( { x: 9 , y: 12 } ) ;
			expect( v1.dup().mul( -3 ) ).to.eql( { x: -9 , y: -12 } ) ;
			expect( v1.dup().mul( 0 ) ).to.eql( { x: 0 , y: 0 } ) ;
		} ) ;
		
		it( "divide" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			expect( v1.dup().div( 4 ) ).to.eql( { x: 0.75 , y: 1 } ) ;
			expect( v1.dup().div( -4 ) ).to.eql( { x: -0.75 , y: -1 } ) ;
			expect( v1.dup().div( 0 ) ).to.eql( { x: Infinity , y: Infinity } ) ;
			//expect( v1.dup().div( 0 ).undefined ).to.be( true ) ;
		} ) ;
		
		it( "inverse" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			expect( v1.dup().inv() ).to.eql( { x: -3 , y: -4 } ) ;
		} ) ;
		
		it( "get/set length, value" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			expect( v1.length ).to.be( 5 ) ;
			
			v1.length = 10 ;
			expect( v1 ).to.eql( { x: 6 , y: 8 } ) ;
			
			v1.length = -10 ;
			expect( v1 ).to.eql( { x: 6 , y: 8 } ) ;
			
			v1.setValue( -10 ) ;
			expect( v1 ).to.eql( { x: -6 , y: -8 } ) ;
		} ) ;
		
		it( "normalize/unit" , function() {
			var v1 = Vector2D( 3 , 4 ) ;
			v1.normalize() ;
			expectCirca( v1.x , 0.6 ) ;
			expectCirca( v1.y , 0.8 ) ;
		} ) ;
		
		it( "get/set/rotate angle" , function() {
			var v1 = Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , Math.PI / 3 ) ;
			expectCirca( v1.inv().angle , - Math.PI + Math.PI / 3 ) ;
			
			v1 = Vector2D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , 2 * Math.PI / 3 ) ;
			
			v1 = Vector2D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , - Math.PI / 3 ) ;
			
			v1 = Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			v1.angle = Math.PI / 6 ;
			expectCirca( v1.x , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.y , 5 ) ;
			
			v1.rotate( Math.PI / 6 ) ;
			expectCirca( v1.angle , Math.PI / 3 ) ;
			expectCirca( v1.x , 5 ) ;
			expectCirca( v1.y , 10 * Math.sqrt( 3 ) / 2 ) ;
		} ) ;
		
		it( "get/set/rotate angle in degree" , function() {
			var v1 = Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , 60 ) ;
			expectCirca( v1.inv().angleDeg , -120 ) ;
			
			v1 = Vector2D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , 120 ) ;
			
			v1 = Vector2D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , -60 ) ;
			
			v1 = Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			v1.angleDeg = 30 ;
			expectCirca( v1.x , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.y , 5 ) ;
			
			v1.rotateDeg( 30 ) ;
			expectCirca( v1.angleDeg , 60 ) ;
			expectCirca( v1.x , 5 ) ;
			expectCirca( v1.y , 10 * Math.sqrt( 3 ) / 2 ) ;
		} ) ;
		
		it( "dot product" , function() {
			expect( Vector2D( 3 , 4 ).dot( Vector2D( 5 , 2 ) ) ).to.be( 23 ) ;
			expect( Vector2D( 3 , 4 ).dot( Vector2D( -5 , 2 ) ) ).to.be( -7 ) ;
		} ) ;
		
		it( "cross product" , function() {
			expect( Vector2D( 3 , 4 ).cross( Vector2D( 5 , 2 ) ) ).to.be( -14 ) ;
			expect( Vector2D( 3 , 4 ).cross( Vector2D( -5 , 2 ) ) ).to.be( 26 ) ;
		} ) ;
		
		it( "collinear" , function() {
			expect( Vector2D( 3 , 4 ).isCollinearTo( Vector2D( 4 , 3 ) ) ).to.be( false ) ;
			expect( Vector2D( 3 , 4 ).isCollinearTo( Vector2D( 3 , 4 ) ) ).to.be( true ) ;
			expect( Vector2D( 3 , 4 ).isCollinearTo( Vector2D( 1 , 4/3 ) ) ).to.be( true ) ;
			expect( Vector2D( 3 , 4 ).isCollinearTo( Vector2D( 6 , 8 ) ) ).to.be( true ) ;
			expect( Vector2D( 3 , 4 ).isCollinearTo( Vector2D( -3 , -4 ) ) ).to.be( true ) ;
		} ) ;
		
		it( "orthogonal" , function() {
			expect( Vector2D( 3 , 4 ).isOrthogonalTo( Vector2D( 4 , 3 ) ) ).to.be( false ) ;
			expect( Vector2D( 3 , 4 ).isOrthogonalTo( Vector2D( 3 , 4 ) ) ).to.be( false ) ;
			expect( Vector2D( 3 , 4 ).isOrthogonalTo( Vector2D( 4 , -3 ) ) ).to.be( true ) ;
			expect( Vector2D( 3 , 4 ).isOrthogonalTo( Vector2D( 2 , -1.5 ) ) ).to.be( true ) ;
			expect( Vector2D( 3 , 4 ).isOrthogonalTo( Vector2D( -4 , 3 ) ) ).to.be( true ) ;
		} ) ;
		
		it( "projections" , function() {
			var v1 = Vector2D( 4 , 3 ) ;
			var v2 = Vector2D( 3 , 4 ) ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 4.8 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( 4.8 ) ;
			expect( v1.projectionOf( v2 ) ).to.eql( { x: 3.84 , y: 2.88 } ) ;
			
			v2.inv() ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 4.8 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( -4.8 ) ;
			expect( v1.projectionOf( v2 ) ).to.eql( { x: -3.84 , y: -2.88 } ) ;
		} ) ;
		
		it( "decompose" , function() {
			var v , decomp ;
			
			v = Vector2D( 4 , 3 ) ;
			
			expect( v.decompose( Vector2D( 1 , 0 ) ) ).to.eql( [ { x: 4 , y: 0 } , { x: 0 , y: 3 } ] ) ;
			expect( v.decompose( Vector2D( 5 , 0 ) ) ).to.eql( [ { x: 4 , y: 0 } , { x: 0 , y: 3 } ] ) ;
			expect( v.decompose( Vector2D( 0 , 1 ) ) ).to.eql( [ { x: 0 , y: 3 } , { x: 4 , y: 0 } ] ) ;
			expect( v.decompose( Vector2D( -5 , 0 ) ) ).to.eql( [ { x: 4 , y: 0 } , { x: 0 , y: 3 } ] ) ;
			
			decomp = v.decompose( Vector2D( 1 , 1 ) ) ;
			expectCirca( decomp[0].x , 3.5 ) ;
			expectCirca( decomp[0].y , 3.5 ) ;
			expectCirca( decomp[1].x , 0.5 ) ;
			expectCirca( decomp[1].y , -0.5 ) ;
			
			decomp = v.decompose( Vector2D( 1 , 2 ) ) ;
			expectCirca( decomp[0].x , 2 ) ;
			expectCirca( decomp[0].y , 4 ) ;
			expectCirca( decomp[1].x , 2 ) ;
			expectCirca( decomp[1].y , -1 ) ;
		} ) ;
	} ) ;



	describe( "BoundVector2D" , function() {
		
		it( "constructor" , function() {
			expect( BoundVector2D( 3 , 4 , 5 , 2 ) ).to.eql( { position: { x: 3 , y: 4 } , vector: { x: 5 , y: 2 } } ) ;
		} ) ;
		
		it( "from/to constructor" , function() {
			expect( BoundVector2D.fromTo( Vector2D( 3 , 4 ) , Vector2D( 8 , 2 ) ) ).to.eql( { position: { x: 3 , y: 4 } , vector: { x: 5 , y: -2 } } ) ;
		} ) ;
		
		it( "get/set endPoint" , function() {
			var v = BoundVector2D.fromTo( Vector2D( 3 , 4 ) , Vector2D( 8 , 2 ) ) ;
			expect( v ).to.eql( { position: { x: 3 , y: 4 } , vector: { x: 5 , y: -2 } } ) ;
			expect( v.endPoint ).to.eql( { x: 8 , y: 2 } ) ;
			expect( v.setEndPoint( Vector2D( -4 , 1 ) ) ).to.eql( { position: { x: 3 , y: 4 } , vector: { x: -7 , y: -3 } } ) ;
			expect( v.endPoint ).to.eql( { x: -4 , y: 1 } ) ;
		} ) ;
		
		it( "apply" ) ;
		
		it( "apply acceleration" ) ;
		
		it( "test if a point is on the line" , function() {
			var line ;
			
			line = BoundVector2D( 2 , 3 , 2 , 1 ) ;
			expect( line.isOnLine( Vector2D( 2 , 3 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLine( Vector2D( 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( 3 , 3.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( 2.5 , 3.25 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( 2.25 , 3.25 ) ) ).to.be( false ) ;
			expect( line.isOnLine( Vector2D( 5 , 4.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( 0 , 2 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( -1 , 1.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( -1.5 , 1.25 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector2D( -1.4 , 1.25 ) ) ).to.be( false ) ;
		} ) ;
		
		it( "test if a point is on the line segment" , function() {
			var line ;
			
			line = BoundVector2D( 2 , 3 , 2 , 1 ) ;
			expect( line.isOnLineSegment( Vector2D( 2 , 3 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector2D( 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector2D( 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector2D( 3 , 3.5 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector2D( 2.5 , 3.25 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector2D( 2.25 , 3.25 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector2D( 5 , 4.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector2D( 0 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector2D( -1 , 1.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector2D( -1.5 , 1.25 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector2D( -1.4 , 1.25 ) ) ).to.be( false ) ;
		} ) ;
		
		it( "test side of a coordinate/position relative to the line of a bound vector" , function() {
			var line ;
			
			line = BoundVector2D( 0 , 0 , 0 , 1 ) ;
			expect( line.test( 0 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 3 ) ).to.be( 0 ) ;
			expect( line.test( 3 , 0 ) ).to.be( -3 ) ;
			expect( line.test( 3 , 54 ) ).to.be( -3 ) ;
			expect( line.test( 3 , -17 ) ).to.be( -3 ) ;
			expect( line.test( -7 , 0 ) ).to.be( 7 ) ;
			expect( line.test( -7 , 99 ) ).to.be( 7 ) ;
			
			line = BoundVector2D( 0 , 0 , 1 , 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 3 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 3 ) ).to.be( 3 ) ;
			expect( line.test( 0 , -3 ) ).to.be( -3 ) ;
			
			line = BoundVector2D( 0 , 5 , 1 , 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( -5 ) ;
			expect( line.test( 3 , 0 ) ).to.be( -5 ) ;
			expect( line.test( 0 , 3 ) ).to.be( -2 ) ;
			expect( line.test( 0 , -3 ) ).to.be( -8 ) ;
			expect( line.test( 0 , 8 ) ).to.be( 3 ) ;
			
			line = BoundVector2D( 4 , 2 , 1 , 2 ) ;
			expect( line.test( 4 , 2 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( 6 ) ;
			expect( line.test( 3 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 4 , 4 ) ).to.be( 2 ) ;
			expect( line.test( 6 , 4 ) ).to.be( -2 ) ;
			
			line = BoundVector2D( 4 , 2 , -1 , -2 ) ;
			expect( line.test( 4 , 2 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( -6 ) ;
			expect( line.test( 3 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 4 , 4 ) ).to.be( -2 ) ;
			expect( line.test( 6 , 4 ) ).to.be( 2 ) ;
			expect( line.testVector( Vector2D( 6 , 4 ) ) ).to.be( 2 ) ;
		} ) ;
		
		it( "point distance to the line of a bound vector" , function() {
			var line ;
			
			line = BoundVector2D( 4 , 2 , -1 , -2 ) ;
			expectCirca( line.pointDistance( Vector2D( 4 , 2 ) ) , 0 ) ;
			expectCirca( line.pointDistance( Vector2D( 0 , -1 ) ) , Math.sqrt( 5 ) ) ;
			expectCirca( line.pointDistance( Vector2D( -2 , 0 ) ) , 2 * Math.sqrt( 5 ) ) ;
			expectCirca( line.pointDistance( Vector2D( 6 , 1 ) ) , Math.sqrt( 5 ) ) ;
		} ) ;
		
		it( "intersection" , function() {
			var bv1 = BoundVector2D( 2 , 1 , 2 , 1 ) ;
			var bv2 = BoundVector2D( 4 , 6 , 2 , -3 ) ;
			var vi = bv1.intersection( bv2 ) ;
			expect( vi ).to.be.an( Vector2D ) ;
			expect( vi ).to.eql( { x: 6 , y: 3 } ) ;
		} ) ;
		
		it( "projection of a point" , function() {
			var bv1 = BoundVector2D( 2 , 1 , 2 , 1 ) ;
			var v2 = Vector2D( 3 , 9 ) ;
			var vi = bv1.pointProjection( v2 ) ;
			expect( vi ).to.be.an( Vector2D ) ;
			expect( vi ).to.eql( { x: 6 , y: 3 } ) ;
		} ) ;
	} ) ;



	describe( "Vector3D" , function() {
		
		it( "constructor" , function() {
			expect( Vector3D( 3 , 4 , 5 ) ).to.eql( { x: 3 , y: 4 , z: 5 } ) ;
			expect( Number.isNaN( Vector3D().x ) ).to.be( true ) ;
			expect( Number.isNaN( Vector3D().y ) ).to.be( true ) ;
			expect( Number.isNaN( Vector3D().z ) ).to.be( true ) ;
		} ) ;
		
		it( "from/to constructor" , function() {
			expect( Vector3D.fromTo( Vector3D( 3 , 4 , 5 ) , Vector3D( 8 , 2 , -4 ) ) ).to.eql( { x: 5 , y: -2 , z: -9 } ) ;
		} ) ;
		
		it( "undefined vector" , function() {
			expect( Vector3D().undefined ).to.be( true ) ;
			expect( Vector3D( NaN , NaN , NaN ).undefined ).to.be( true ) ;
			expect( Vector3D( undefined , 4 , 5 ).undefined ).to.be( true ) ;
			expect( Vector3D( 3 , undefined , 5 ).undefined ).to.be( true ) ;
			expect( Vector3D( 3 , 4 , undefined ).undefined ).to.be( true ) ;
			expect( Vector3D( 3 , 4 , 5 ).undefined ).to.be( false ) ;
			
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			v1.undefined = true ;
			expect( Number.isNaN( v1.x ) ).to.be( true ) ;
			expect( Number.isNaN( v1.y ) ).to.be( true ) ;
			expect( Number.isNaN( v1.z ) ).to.be( true ) ;
		} ) ;
		
		it( "duplicate" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			expect( v1.dup() ).not.to.be( v1 ) ;
			expect( v1.dup() ).to.eql( { x: 3 , y: 4 , z: 5 } ) ;
		} ) ;
		
		it( "addition" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			var v2 = Vector3D( 5 , 7 , -1 ) ;
			var v3 = Vector3D( 2 , 1 , 3 ) ;
			expect( v1.dup().add( v2 ) ).to.eql( { x: 8 , y: 11 , z: 4 } ) ;
			expect( v1.dup().addMulti( v2 , v3 ) ).to.eql( { x: 10 , y: 12 , z: 7 } ) ;
		} ) ;
		
		it( "apply" ) ;
		
		it( "substract" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			var v2 = Vector3D( 2 , 1 , 8 ) ;
			expect( v1.dup().sub( v2 ) ).to.eql( { x: 1 , y: 3 , z: -3 } ) ;
		} ) ;
		
		it( "multiply" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			expect( v1.dup().mul( 3 ) ).to.eql( { x: 9 , y: 12 , z: 15 } ) ;
			expect( v1.dup().mul( -3 ) ).to.eql( { x: -9 , y: -12 , z: -15 } ) ;
			expect( v1.dup().mul( 0 ) ).to.eql( { x: 0 , y: 0 , z: 0 } ) ;
		} ) ;
		
		it( "divide" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			expect( v1.dup().div( 4 ) ).to.eql( { x: 0.75 , y: 1 , z: 1.25 } ) ;
			expect( v1.dup().div( -4 ) ).to.eql( { x: -0.75 , y: -1 , z: -1.25 } ) ;
			expect( v1.dup().div( 0 ) ).to.eql( { x: Infinity , y: Infinity , z: Infinity } ) ;
			//expect( v1.dup().div( 0 ).undefined ).to.be( true ) ;
		} ) ;
		
		it( "inverse" , function() {
			var v1 = Vector3D( 3 , 4 , -5 ) ;
			expect( v1.dup().inv() ).to.eql( { x: -3 , y: -4 , z: 5 } ) ;
		} ) ;
		
		it( "get/set length, value" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			expect( v1.length ).to.be( 7.0710678118654755 ) ;
			
			v1.length = 10 ;
			expect( v1 ).to.eql( { x: 4.242640687119285 , y: 5.65685424949238 , z: 7.071067811865475 } ) ;
			
			v1.length = -10 ;
			expect( v1 ).to.eql( { x: 4.242640687119285 , y: 5.65685424949238 , z: 7.071067811865475 } ) ;
			
			v1.setValue( -10 ) ;
			expect( v1 ).to.eql( { x: -4.242640687119285 , y: -5.65685424949238 , z: -7.071067811865475 } ) ;
		} ) ;
		
		it( "normalize/unit" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			v1.normalize() ;
			expect( v1 ).to.eql( { x: 0.4242640687119285 , y: 0.565685424949238 , z: 0.7071067811865475 } ) ;
		} ) ;
		
		/*
		it( "get/set/rotate angle" , function() {
			var v1 = Vector3D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , Math.PI / 3 ) ;
			expectCirca( v1.inv().angle , - Math.PI + Math.PI / 3 ) ;
			
			v1 = Vector3D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , 2 * Math.PI / 3 ) ;
			
			v1 = Vector3D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , - Math.PI / 3 ) ;
			
			v1 = Vector3D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			v1.angle = Math.PI / 6 ;
			expectCirca( v1.x , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.y , 5 ) ;
			
			v1.rotate( Math.PI / 6 ) ;
			expectCirca( v1.angle , Math.PI / 3 ) ;
			expectCirca( v1.x , 5 ) ;
			expectCirca( v1.y , 10 * Math.sqrt( 3 ) / 2 ) ;
		} ) ;
		
		it( "get/set/rotate angle in degree" , function() {
			var v1 = Vector3D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , 60 ) ;
			expectCirca( v1.inv().angleDeg , -120 ) ;
			
			v1 = Vector3D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , 120 ) ;
			
			v1 = Vector3D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , -60 ) ;
			
			v1 = Vector3D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			v1.angleDeg = 30 ;
			expectCirca( v1.x , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.y , 5 ) ;
			
			v1.rotateDeg( 30 ) ;
			expectCirca( v1.angleDeg , 60 ) ;
			expectCirca( v1.x , 5 ) ;
			expectCirca( v1.y , 10 * Math.sqrt( 3 ) / 2 ) ;
		} ) ;
		*/
		
		it( "dot product" , function() {
			expect( Vector3D( 3 , 4 , 5 ).dot( Vector3D( 5 , 2 , 1 ) ) ).to.be( 28 ) ;
			expect( Vector3D( 3 , 4 , 5 ).dot( Vector3D( -5 , 2 , -3 ) ) ).to.be( -22 ) ;
		} ) ;
		
		it( "cross product" , function() {
			expect( Vector3D( 3 , 4 , 5 ).cross( Vector3D( 5 , 2 , 1 ) ) ).to.eql( { x: -6, y: 22, z: -14 } ) ;
			expect( Vector3D( 3 , 4 , 5 ).cross( Vector3D( -5 , 2 , -3 ) ) ).to.eql( { x: -22, y: -16, z: 26 } ) ;
		} ) ;
		
		it( "collinear" , function() {
			expect( Vector3D( 3 , 4 , 5 ).isCollinearTo( Vector3D( 4 , 3 , 5 ) ) ).to.be( false ) ;
			expect( Vector3D( 3 , 4 , 5 ).isCollinearTo( Vector3D( 3 , 4 , 5 ) ) ).to.be( true ) ;
			expect( Vector3D( 3 , 4 , 5 ).isCollinearTo( Vector3D( 1.5 , 2 , 2.5 ) ) ).to.be( true ) ;
			expect( Vector3D( 3 , 4 , 5 ).isCollinearTo( Vector3D( 6 , 8 , 10 ) ) ).to.be( true ) ;
			expect( Vector3D( 3 , 4 , 5 ).isCollinearTo( Vector3D( -3 , -4 , -5 ) ) ).to.be( true ) ;
		} ) ;
		
		it( "orthogonal" , function() {
			expect( Vector3D( 3 , 4 , 5 ).isOrthogonalTo( Vector3D( 4 , 3 , 5 ) ) ).to.be( false ) ;
			expect( Vector3D( 3 , 4 , 5 ).isOrthogonalTo( Vector3D( 3 , 4 , 5 ) ) ).to.be( false ) ;
			expect( Vector3D( 3 , 4 , 0 ).isOrthogonalTo( Vector3D( 0 , 0 , -1 ) ) ).to.be( true ) ;
			expect( Vector3D( 3 , 4 , 0 ).isOrthogonalTo( Vector3D( 4 , -3 , 0 ) ) ).to.be( true ) ;
			expect( Vector3D( 3 , 4 , 2 ).isOrthogonalTo( Vector3D( 4 , -4 , 2 ) ) ).to.be( true ) ;
		} ) ;
		
		
		it( "projections" , function() {
			var v1 = Vector3D( 3 , 4 , 5 ) ;
			var v2 = Vector3D( 4 , 3 , -2 ) ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 1.979898987322333 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( 1.979898987322333 ) ;
			expect( v1.projectionOf( v2 ) ).to.eql( { x: 0.8399999999999999 , y: 1.1199999999999999 , z: 1.4 } ) ;
			
			v2.inv() ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 1.979898987322333 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( -1.979898987322333 ) ;
			expect( v1.projectionOf( v2 ) ).to.eql( { x: -0.8399999999999999 , y: -1.1199999999999999 , z: -1.4 } ) ;
		} ) ;
		
		it( "decompose" , function() {
			var v , decomp ;
			
			v = Vector3D( 4 , 3 , 5 ) ;
			
			expect( v.decompose( Vector3D( 1 , 0 , 0 ) ) ).to.eql( [ { x: 4 , y: 0 , z: 0 } , { x: 0 , y: 3 , z: 5 } ] ) ;
			expect( v.decompose( Vector3D( 5 , 0 , 0 ) ) ).to.eql( [ { x: 4 , y: 0 , z: 0 } , { x: 0 , y: 3 , z: 5 } ] ) ;
			expect( v.decompose( Vector3D( 0 , 1 , 0 ) ) ).to.eql( [ { x: 0 , y: 3 , z: 0 } , { x: 4 , y: 0 , z: 5 } ] ) ;
			expect( v.decompose( Vector3D( -5 , 0 , 0 ) ) ).to.eql( [ { x: 4 , y: 0 , z: 0 } , { x: 0 , y: 3 , z: 5 } ] ) ;
			
			decomp = v.decompose( Vector3D( 1 , 1 , 1 ) ) ;
			expectCirca( decomp[0].x , 4 ) ;
			expectCirca( decomp[0].y , 4 ) ;
			expectCirca( decomp[0].z , 4 ) ;
			expectCirca( decomp[1].x , 0 ) ;
			expectCirca( decomp[1].y , -1 ) ;
			expectCirca( decomp[1].z , 1 ) ;
			
			decomp = v.decompose( Vector3D( 1 , 2 , 0 ) ) ;
			expectCirca( decomp[0].x , 2 ) ;
			expectCirca( decomp[0].y , 4 ) ;
			expectCirca( decomp[0].z , 0 ) ;
			expectCirca( decomp[1].x , 2 ) ;
			expectCirca( decomp[1].y , -1 ) ;
			expectCirca( decomp[1].z , 5 ) ;
			
			decomp = v.decompose( Vector3D( 1 , 2 , 3 ) ) ;
			expectCirca( decomp[0].x , 1.785714285714286 ) ;
			expectCirca( decomp[0].y , 3.571428571428572 ) ;
			expectCirca( decomp[0].z , 5.357142857142858 ) ;
			expectCirca( decomp[1].x , 2.214285714285714 ) ;
			expectCirca( decomp[1].y , -0.5714285714285721 ) ;
			expectCirca( decomp[1].z , -0.35714285714285765 ) ;
		} ) ;
	} ) ;



	describe( "BoundVector3D" , function() {
		
		it( "constructor" , function() {
			expect( BoundVector3D( 3 , 4 , 5 , 5 , 2 , -1 ) )
				.to.eql( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: 2 , z: -1 } } ) ;
		} ) ;
		
		it( "from/to constructor" , function() {
			expect( BoundVector3D.fromTo( Vector3D( 3 , 4 , 5 ) , Vector3D( 8 , 2 , 7 ) ) )
				.to.eql( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: -2 , z: 2 } } ) ;
		} ) ;
		
		it( "get/set endPoint" , function() {
			var v = BoundVector3D.fromTo( Vector3D( 3 , 4 , 5 ) , Vector3D( 8 , 2 , 7 ) ) ;
			expect( v ).to.eql( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: -2 , z: 2 } } ) ;
			expect( v.endPoint ).to.eql( { x: 8 , y: 2 , z: 7 } ) ;
			expect( v.setEndPoint( Vector3D( -4 , 1 , 11 ) ) ).to.eql( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: -7 , y: -3 , z: 6 } } ) ;
			expect( v.endPoint ).to.eql( { x: -4 , y: 1 , z: 11 } ) ;
		} ) ;
		
		it( "apply" ) ;
		
		it( "apply acceleration" ) ;
		
		it( "test if a point is on the line" , function() {
			var line ;
			
			line = BoundVector3D( 2 , 3 , 5 , 2 , 1 , -1 ) ;
			expect( line.isOnLine( Vector3D( 2 , 3 , 5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( 2 , 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLine( Vector3D( 4 , 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( 3 , 3.5 , 4.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( 2.5 , 3.25 , 4.75 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( 2.25 , 3.25 , 4.75 ) ) ).to.be( false ) ;
			expect( line.isOnLine( Vector3D( 5 , 4.5 , 3.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( 0 , 2 , 6 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( -1 , 1.5 , 6.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( -1.5 , 1.25 , 6.75 ) ) ).to.be( true ) ;
			expect( line.isOnLine( Vector3D( -1.5 , 1.25 , 6.5 ) ) ).to.be( false ) ;
			expect( line.isOnLine( Vector3D( -1.4 , 1.25 , 6.75 ) ) ).to.be( false ) ;
		} ) ;
		
		it( "test if a point is on the line segment" , function() {
			var line ;
			
			line = BoundVector3D( 2 , 3 , 5 , 2 , 1 , -1 ) ;
			expect( line.isOnLineSegment( Vector3D( 2 , 3 , 5 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector3D( 2 , 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector3D( 4 , 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector3D( 3 , 3.5 , 4.5 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector3D( 2.5 , 3.25 , 4.75 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( Vector3D( 2.25 , 3.25 , 4.75 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector3D( 5 , 4.5 , 3.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector3D( 0 , 2 , 6 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector3D( -1 , 1.5 , 6.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector3D( -1.5 , 1.25 , 6.75 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector3D( -1.5 , 1.25 , 6.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( Vector3D( -1.4 , 1.25 , 6.75 ) ) ).to.be( false ) ;
		} ) ;
		
		it( "projection of a point on a 3D line" , function() {
			var bv1 = BoundVector3D( 2 , 1 , 0 , 2 , 1 , 0 ) ;
			var v2 = Vector3D( 3 , 9 , 0 ) ;
			var vi = bv1.pointProjection( v2 ) ;
			expect( vi ).to.be.an( Vector3D ) ;
			expect( vi ).to.eql( { x: 6 , y: 3 , z: 0 } ) ;
		} ) ;
		
		it( "distance of a point to a 3D line" , function() {
			var line , point ;
			
			line = BoundVector3D( 0 , 0 , 0 , 1 , 0 , 0 ) ;
			point = Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;
			
			line = BoundVector3D( 0 , 0 , 0 , 10 , 0 , 0 ) ;
			point = Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;
			
			line = BoundVector3D( 0 , 0 , 0 , -10 , 0 , 0 ) ;
			point = Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;
			
			line = BoundVector3D( -7 , 0 , 0 , -10 , 0 , 0 ) ;
			point = Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;
			
			line = BoundVector3D( 0 , 0 , 0 , 1 , 1 , 1 ) ;
			point = Vector3D( 0 , 2 , 1 ) ;
			expectCirca( line.pointDistance( point ) , Math.sqrt( 2 ) ) ;
			
			line = BoundVector3D( 0 , 0 , 0 , 10 , 10 , 10 ) ;
			point = Vector3D( 0 , 2 , 1 ) ;
			expectCirca( line.pointDistance( point ) , Math.sqrt( 2 ) ) ;
		} ) ;
		
		it( "shortest segment between two 3D lines" , function() {
			var line1 , line2 ;
			
			line1 = BoundVector3D( -1 , 0 , 0 , 0 , 1 , 1 ) ;
			line2 = BoundVector3D( 1 , 0 , 0 , 0 , -1 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.eql( { position: { x: -1, y: 0, z: 0 } , vector: { x: 2, y: 0, z: 0 } } ) ;
			line1.apply( 7 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.eql( { position: { x: -1, y: 0, z: 0 } , vector: { x: 2, y: 0, z: 0 } } ) ;
			line2.apply( -2.5 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.eql( { position: { x: -1, y: 0, z: 0 } , vector: { x: 2, y: 0, z: 0 } } ) ;
			
			line1 = BoundVector3D( -1 , 0 , 0 , 0 , 1 , 12 ) ;
			line2 = BoundVector3D( 1 , 0 , 0 , 0 , -3 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.eql( { position: { x: -1, y: 0, z: 0 } , vector: { x: 2, y: 0, z: 0 } } ) ;
			
			line1 = BoundVector3D( -1 , 0 , 0 , 0 , 1 , 1 ) ;
			line2 = BoundVector3D( 2 , 0 , 0 , 1 , -1 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.eql( { position: { x: -1, y: 0, z: 0 } , vector: { x: 2, y: 1, z: -1 } } ) ;
			
			line1 = BoundVector3D( -1 , 0 , 0 , 0 , 1 , 1 ) ;
			line2 = BoundVector3D( 2 , 0 , 0 , 1 , -1 , 3 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.eql( { position: { x: -1, y: -1/3, z: -1/3 } , vector: { x: 2+2/3+Number.EPSILON, y: 2/3, z: -2/3-Number.EPSILON/2 } } ) ;
			
			line1 = BoundVector3D( -2 , 0 , 0 , 1 , 1 , 1 ) ;
			line2 = BoundVector3D( 1 , 0 , 0 , 0 , -1 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.eql( { position: { x: -1, y: 1, z: 1 } , vector: { x: 2, y: -1, z: -1 } } ) ;
		} ) ;
	} ) ;



	describe( "Plane3D" , function() {
		
		it( "create a plane from 3 points" , function() {
			var plane ;
			
			plane = Plane3D.fromThreePoints(
				Vector3D( 0 , 0 , 2 ) ,
				Vector3D( 2 , 1 , 2 ) ,
				Vector3D( 1 , 2 , 2 )
			) ;
			expect( plane ).to.eql( { x: 0 , y: 0 , z: 3 , d: -6 } ) ;
			expect( plane.normalize() ).to.eql( { x: 0 , y: 0 , z: 1 , d: -2 } ) ;
			
			plane = Plane3D.fromThreePoints(
				Vector3D( 0 , 0 , 2 ) ,
				Vector3D( 1 , 2 , 2 ) ,
				Vector3D( 2 , 1 , 2 )
			) ;
			expect( plane ).to.eql( { x: 0 , y: 0 , z: -3 , d: 6 } ) ;
			expect( plane.normalize() ).to.eql( { x: 0 , y: 0 , z: -1 , d: 2 } ) ;
			
			plane = Plane3D.fromThreePoints(
				Vector3D( 1 , 0 , 0 ) ,
				Vector3D( 0 , 1 , 0 ) ,
				Vector3D( 0 , 0 , 1 )
			) ;
			expect( plane ).to.eql( { x: 1 , y: 1 , z: 1 , d: -1 } ) ;
			expect( plane.normalize() ).to.eql( { x: 0.5773502691896258, y: 0.5773502691896258, z: 0.5773502691896258, d: -0.5773502691896258 } ) ;
			
			plane = Plane3D.fromThreePoints(
				Vector3D( 1 , 0 , 0 ) ,
				Vector3D( 0 , 0 , 1 ) ,
				Vector3D( 0 , 1 , 0 ) 
			) ;
			expect( plane ).to.eql( { x: -1 , y: -1 , z: -1 , d: 1 } ) ;
			expect( plane.normalize() ).to.eql( { x: -0.5773502691896258, y: -0.5773502691896258, z: -0.5773502691896258, d: 0.5773502691896258 } ) ;
		} ) ;
		
		it( "intersection of plane and line" , function() {
			var plane , line , point ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = BoundVector3D( 0 , 0 , 5 , 0 , 0 , 3 ) ;
			point = plane.intersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.eql( { x: 0 , y: 0 , z: 0 } ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = BoundVector3D( 0 , 0 , 2 , 1 , 0 , 2 ) ;
			point = plane.intersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.eql( { x: -1 , y: 0 , z: 0 } ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = BoundVector3D( 0 , 0 , 2 , 1 , 4 , 2 ) ;
			point = plane.intersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.eql( { x: -1 , y: -4 , z: 0 } ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = BoundVector3D( 0 , 0 , 1 , 1 , 4 , 2 ) ;
			point = plane.intersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.eql( { x: -0.5 , y: -2 , z: 0 } ) ;
			
			plane = Plane3D.fromNormal( 5 , -18 , 0 , 0 , 0 , 4 ) ;
			line = BoundVector3D( 0 , 0 , 1 , 1 , 4 , 2 ) ;
			point = plane.intersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.eql( { x: -0.5 , y: -2 , z: 0 } ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 0 , 2 ) ;
			line = BoundVector3D( 0 , 0 , 2 , 1 , 0 , 0 ) ;
			point = plane.intersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.eql( { x: -4 , y: 0 , z: 2 } ) ;
			
			plane = Plane3D.fromNormal( -3 , 5 , 0 , 1 , 0 , 2 ) ;
			line = BoundVector3D( 0 , 0 , 2 , 1 , 0 , 0 ) ;
			point = plane.intersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.eql( { x: -7 , y: 0 , z: 2 } ) ;
		} ) ;
		
		it( "projection of a point on a plane" , function() {
			var plane , point , projected ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.eql( { x: 0 , y: 0 , z: 0 } ) ;
			
			plane = Plane3D.fromNormal( 777 , 111 , 0 , 0 , 0 , 4 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.eql( { x: 0 , y: 0 , z: 0 } ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , -4 , 0 , 0 , 4 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.eql( { x: 0 , y: 0 , z: -4 } ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 0 , 1 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.eql( { x: -2.5 , y: 0 , z: 2.5 } ) ;
		} ) ;
		
		it( "distance of a point to a plane" , function() {
			var plane , point ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			expect( plane.pointDistance( point ) ).to.be( 5 ) ;
			
			plane = Plane3D.fromNormal( 777 , 111 , 0 , 0 , 0 , 4 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			expect( plane.pointDistance( point ) ).to.be( 5 ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , -4 , 0 , 0 , 4 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			expect( plane.pointDistance( point ) ).to.be( 9 ) ;
			
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 0 , 1 ) ;
			point = Vector3D( 0 , 0 , 5 ) ;
			expectCirca( plane.pointDistance( point ) , Math.hypot( 2.5 , 2.5 ) ) ;
		} ) ;
		
		it( "intersection of 2 planes" , function() {
			var plane1 , plane2 , line ;
			
			// x
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: 0, y: 0, z: 0 }, vector: { x: -16, y: 0, z: 0 } } ) ;
			
			plane1 = Plane3D.fromNormal( -10 , 2 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 14 , 0 , -4 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: 0, y: 0, z: 0 }, vector: { x: -16, y: 0, z: 0 } } ) ;
			
			plane1 = Plane3D.fromNormal( 0 , 0 , 3 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , -1 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: 0, y: -1, z: 3 }, vector: { x: -16, y: 0, z: 0 } } ) ;
			
			// y
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 4 , 0 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: 0, y: 0, z: 0 }, vector: { x: 0, y: 16, z: 0 } } ) ;
			
			plane1 = Plane3D.fromNormal( 0 , 0 , 18 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( -21 , 0 , 0 , 4 , 0 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: -21, y: 0, z: 18 }, vector: { x: 0, y: 16, z: 0 } } ) ;
			
			// z
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 4 , 0 , 0 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: 0, y: 0, z: 0 }, vector: { x: 0, y: 0, z: 16 } } ) ;
			
			plane1 = Plane3D.fromNormal( 2 , 0 , 0 , 4 , 0 , 0 ) ;
			plane2 = Plane3D.fromNormal( 0 , -1 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: 2, y: -1, z: 0 }, vector: { x: 0, y: 0, z: 16 } } ) ;
			
			// non-axial
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 1 , 0 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 1 , 1 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.eql( { position: { x: 0, y: 0, z: 0 }, vector: { x: 1, y: -1, z: 0 } } ) ;
			
			plane1 = Plane3D.fromNormal( 2 , 0 , 0 , 1 , 1 , 0 ) ;
			plane2 = Plane3D.fromNormal( 0 , 4 , 0 , 1 , 1 , 1 ) ;
			/*
			var time = Date.now() ;
			for ( var i = 0 ; i < 10000000 ; i ++ ) { line = plane1.planeIntersection( plane2 ) ; }
			time = Date.now() - time ;
			console.log( 'Time:' , time , 'ms' ) ;
			//*/
			line = plane1.planeIntersection( plane2 ) ;
			//console.log( line , plane1.testVector( line.position ) , plane2.testVector( line.position ) ) ;
			//expect( line ).to.eql( { position: { x: 2, y: 0, z: 2 }, vector: { x: 1, y: -1, z: 0 } } ) ;
			expect( line.vector ).to.eql( { x: 1, y: -1, z: 0 } ) ;
			expect( plane1.testVector( line.position ) ).to.be( 0 ) ; 
			expect( plane2.testVector( line.position ) ).to.be( 0 ) ; 
		} ) ;
		
		it( "intersection of 3 planes" , function() {
			var plane1 , plane2 , plane3 , point ;
			
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 4 , 0 ) ;
			plane3 = Plane3D.fromNormal( 0 , 0 , 0 , -1 , 4 , 0 ) ;
			expect( plane1.threePlanesIntersection( plane2 , plane3 ) ).to.eql( { x: 0, y: 0, z: 0 } ) ;
			
			// It's easier to test with the same position for all 3 bound vectors.
			// It may looks like cheating but since those points does not exist inside a Plane3D instance (converted into .d),
			// it's perfectly legit.
			plane1 = Plane3D.fromNormal( 3 , 4 , 5 , 5 , 2 , 1 ) ;
			plane2 = Plane3D.fromNormal( 3 , 4 , 5 , 0 , 2 , -4 ) ;
			plane3 = Plane3D.fromNormal( 3 , 4 , 5 , 18 , -3 , 8 ) ;
			expect( plane1.threePlanesIntersection( plane2 , plane3 ) ).to.eql( { x: 3, y: 4, z: 5 } ) ;
		} ) ;
	} ) ;
	
	
	
	describe( "Circle2D" , function() {
		
		it( "projection of a point on a circle" , function() {
			var circle , point , projected ;
			
			circle = Circle2D( 0 , 0 , 2 ) ;
			point = Vector2D( 0 , 1 ) ;
			projected = circle.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector2D ) ;
			expect( projected ).to.eql( { x: 0 , y: 2 } ) ;
			
			circle = Circle2D( 0 , 0 , 2 ) ;
			point = Vector2D( 1 , 1 ) ;
			projected = circle.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector2D ) ;
			expectCirca( projected.x , Math.sqrt( 2 ) ) ;
			expectCirca( projected.y , Math.sqrt( 2 ) ) ;
			
			circle = Circle2D( 0 , 0 , 2 ) ;
			point = Vector2D( 10 , 10 ) ;
			projected = circle.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector2D ) ;
			expectCirca( projected.x , Math.sqrt( 2 ) ) ;
			expectCirca( projected.y , Math.sqrt( 2 ) ) ;
		} ) ;
		
		it( "intersection of circle and a line" , function() {
			var circle , line , points ;
			
			circle = Circle2D( 0 , 0 , 2 ) ;
			line = BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.eql( [ { x: Math.sqrt( 3 ) , y: 1 } , { x: - Math.sqrt( 3 ) , y: 1 } ] ) ;
			
			circle = Circle2D( 0 , 1 , 2 ) ;
			line = BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.eql( [ { x: 2 , y: 1 } , { x: -2 , y: 1 } ] ) ;
			
			circle = Circle2D( 0 , -1 , 2 ) ;
			line = BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.eql( [ { x: 0 , y: 1 } ] ) ;
			
			circle = Circle2D( 0 , -1.1 , 2 ) ;
			line = BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.intersection( line ) ;
			expect( points ).to.be( null ) ;
			
			circle = Circle2D( 1 , 1 , 2 ) ;
			line = BoundVector2D( 2 , 2 , 1 , -1 ) ;
			points = circle.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.eql( [ { x: 1 , y: 1 } , { x: 3 , y: 3 } ] ) ;
		} ) ;
	} ) ;

	
	
	describe( "Sphere3D" , function() {
		
		it( "projection of a point on a sphere" , function() {
			var sphere , point , projected ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 2 ) ;
			point = Vector3D( 0 , 1 , 0 ) ;
			projected = sphere.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector3D ) ;
			expect( projected ).to.eql( { x: 0 , y: 2 , z: 0 } ) ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 3 ) ;
			point = Vector3D( 1 , 1 , 1 ) ;
			projected = sphere.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector3D ) ;
			expectCirca( projected.x , Math.sqrt( 3 ) ) ;
			expectCirca( projected.y , Math.sqrt( 3 ) ) ;
			expectCirca( projected.z , Math.sqrt( 3 ) ) ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 3 ) ;
			point = Vector3D( 10 , 10 , 10 ) ;
			projected = sphere.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector3D ) ;
			expectCirca( projected.x , Math.sqrt( 3 ) ) ;
			expectCirca( projected.y , Math.sqrt( 3 ) ) ;
			expectCirca( projected.z , Math.sqrt( 3 ) ) ;
		} ) ;
		
		it( "intersection of sphere and a line" , function() {
			var sphere , line , points ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 2 ) ;
			line = BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.eql( [ { x: Math.sqrt( 3 ) , y: 1 , z: 0 } , { x: - Math.sqrt( 3 ) , y: 1 , z: 0 } ] ) ;
			
			sphere = Sphere3D( 0 , 1 , 0 , 2 ) ;
			line = BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.eql( [ { x: 2 , y: 1 , z: 0 } , { x: -2 , y: 1 , z: 0 } ] ) ;
			
			sphere = Sphere3D( 0 , -1 , 0 , 2 ) ;
			line = BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.eql( [ { x: 0 , y: 1 , z: 0 } ] ) ;
			
			sphere = Sphere3D( 0 , -1.1 , 0 , 2 ) ;
			line = BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.intersection( line ) ;
			expect( points ).to.be( null ) ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 3 ) ;
			line = BoundVector3D( 1 , 1 , 1 , 1 , 1 , 1 ) ;
			points = sphere.intersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expectCirca( points[0].x , Math.sqrt( 3 ) ) ;
			expectCirca( points[0].y , Math.sqrt( 3 ) ) ;
			expectCirca( points[0].z , Math.sqrt( 3 ) ) ;
			expectCirca( points[1].x , -Math.sqrt( 3 ) ) ;
			expectCirca( points[1].y , -Math.sqrt( 3 ) ) ;
			expectCirca( points[1].z , -Math.sqrt( 3 ) ) ;
		} ) ;
		
		it( "intersection of sphere and a plane" , function() {
			var sphere , plane , circle ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 2 ) ;
			plane = Plane3D.fromNormal( 0 , 0 , 1 , 0 , 0 , 1 ) ;
			circle = sphere.planeIntersection( plane ) ;
			expect( circle ).to.be.a( Circle3D ) ;
			expect( circle ).to.eql( { x: 0, y: 0, z: 1, r: 1.7320508075688772, normal: { x: 0, y: 0, z: 1 } } ) ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 2 ) ;
			plane = Plane3D.fromNormal( 0 , 0 , 1 , 1 , 0 , 1 ) ;
			circle = sphere.planeIntersection( plane ) ;
			expect( circle ).to.eql( { x: 0.5, y: 0, z: 0.5, r: 1.8708286933869707, normal: { x: 1, y: 0, z: 1 } } ) ;
			
			sphere = Sphere3D( 0 , 0 , 0 , 2 ) ;
			plane = Plane3D.fromNormal( 0 , 5 , 5 , 1 , 0 , 1 ) ;
			circle = sphere.planeIntersection( plane ) ;
			expect( circle ).to.be( null ) ;
		} ) ;
	} ) ;
	
	
	
	describe( "Circle3D" , function() {
		
		it( "projection of a point on a 3D circle" , function() {
			var circle , point ;
			
			circle = Circle3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			point = Vector3D( 0 , 0 , 0 ) ;
			expect( circle.pointProjection( point ).isUndefined() ).to.be( true ) ;
			
			circle = Circle3D( 0 , 0 , 0 , 0 , 0 , 5 , 1 ) ;
			point = Vector3D( 5 , 0 , 0 ) ;
			expect( circle.pointProjection( point ) ).to.eql( { x: 1 , y: 0 , z: 0 } ) ;
			
			circle = Circle3D( 3 , 0 , 0 , 0 , 0 , 5 , 1 ) ;
			point = Vector3D( 5 , 0 , 0 ) ;
			expect( circle.pointProjection( point ) ).to.eql( { x: 4 , y: 0 , z: 0 } ) ;
			
			circle = Circle3D( 0 , 0 , 2 , 1 , 0 , 1 , 2 * Math.sqrt( 2 ) ) ;
			point = Vector3D( 3 , 0 , 1 ) ;
			expect( circle.pointProjection( point ) ).to.eql( { x: 2 , y: 0 , z: 0 } ) ;
			
			circle = Circle3D( 0 , 0 , 2 , 1 , 0 , 1 , 1 ) ;
			point = Vector3D( 3 , 0 , 1 ) ;
			expect( circle.pointProjection( point ) ).to.eql( { x: 0.7071067811865475 , y: 0 , z: 1.2928932188134525 } ) ;
		} ) ;
	} ) ;
	
	
	
	describe( "Epsilon" , function() {
		
		it( "Vector2D collinearity epsilon" , function() {
			expect( Vector2D( 0.3 , 0.4 ).isCollinearTo( Vector2D( 0.3 , 0.4 ) ) ).to.be( true ) ;
			expect( Vector2D( 0.3 , 0.4 ).isCollinearTo( Vector2D( 0.3 + Number.EPSILON , 0.4 ) ) ).to.be( true ) ;
			expect( Vector2D( 0.3 , 0.4 ).isCollinearTo( Vector2D( 0.3 + Number.EPSILON , 0.4 + Number.EPSILON ) ) ).to.be( true ) ;
			expect( Vector2D( 0.3 , 0.4 ).isCollinearTo( Vector2D( 0.3 + Number.EPSILON , 0.4 - Number.EPSILON ) ) ).to.be( true ) ;
		} ) ;
		
		it( "Vector3D collinearity epsilon" , function() {
			expect( Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( Vector3D( 0.3 , 0.4 , 0.5 ) ) ).to.be( true ) ;
			expect( Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( Vector3D( 0.3 + Number.EPSILON , 0.4 , 0.5 ) ) ).to.be( true ) ;
			expect( Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( Vector3D( 0.3 + Number.EPSILON , 0.4 + Number.EPSILON , 0.5 + Number.EPSILON ) ) ).to.be( true ) ;
			expect( Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( Vector3D( 0.3 + Number.EPSILON , 0.4 - Number.EPSILON , 0.5 ) ) ).to.be( true ) ;
		} ) ;
	} ) ;
		
} ) ;


