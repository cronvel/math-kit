/*
	The Cedric's Swiss Knife (CSK) - CSK math toolbox test suit

	Copyright (c) 2015 Cédric Ronvel 
	
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



var math = require( '../lib/math.js' ) ;
var geo = math.geometry ;
var Vector2D = geo.Vector2D ;
var Vector3D = geo.Vector3D ;
var BoundVector2D = geo.BoundVector2D ;
var BoundVector3D = geo.BoundVector3D ;
var expect = require( 'expect.js' ) ;





			/* Helper */



function expectCirca( value , circa )
{
	var precision = 0.000000000001 ;
	expect( value ).to.be.within( circa - precision , circa + precision ) ;
}





			/* Tests */



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
		expect( v1.dup().add( v2 , v3 ) ).to.eql( { x: 10 , y: 12 } ) ;
	} ) ;
	
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
	
	it( "get/set length" , function() {
		var v1 = Vector2D( 3 , 4 ) ;
		expect( v1.length ).to.be( 5 ) ;
		
		v1.length = 10 ;
		expect( v1 ).to.eql( { x: 6 , y: 8 } ) ;
		
		v1.length = -10 ;
		expect( v1 ).to.eql( { x: 6 , y: 8 } ) ;
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
} ) ;



describe( "BoundVector2D" , function() {
	
	it( "constructor" , function() {
		expect( BoundVector2D( { x: 3 , y: 4 } , { x: 5 , y: 2 } ) ).to.eql( { point: { x: 3 , y: 4 } , vector: { x: 5 , y: 2 } } ) ;
	} ) ;
	
	it( "from/to constructor" , function() {
		expect( BoundVector2D.fromTo( Vector2D( 3 , 4 ) , Vector2D( 8 , 2 ) ) ).to.eql( { point: { x: 3 , y: 4 } , vector: { x: 5 , y: -2 } } ) ;
	} ) ;
	
	it( "get/set endPoint" , function() {
		v = BoundVector2D.fromTo( Vector2D( 3 , 4 ) , Vector2D( 8 , 2 ) ) ;
		expect( v ).to.eql( { point: { x: 3 , y: 4 } , vector: { x: 5 , y: -2 } } ) ;
		expect( v.endPoint ).to.eql( { x: 8 , y: 2 } ) ;
		expect( v.setEndPoint( Vector2D( -4 , 1 ) ) ).to.eql( { point: { x: 3 , y: 4 } , vector: { x: -7 , y: -3 } } ) ;
		expect( v.endPoint ).to.eql( { x: -4 , y: 1 } ) ;
	} ) ;
	
	it( "intersection" , function() {
		bv1 = BoundVector2D( { x: 2 , y: 1 } , { x: 2 , y: 1 } ) ;
		bv2 = BoundVector2D( { x: 4 , y: 6 } , { x: 2 , y: -3 } ) ;
		vi = bv1.intersection( bv2 ) ;
		expect( vi ).to.be.an( Vector2D ) ;
		expect( vi ).to.eql( { x: 6 , y: 3 } ) ;
	} ) ;
	
	it( "projection of a point" , function() {
		bv1 = BoundVector2D( { x: 2 , y: 1 } , { x: 2 , y: 1 } ) ;
		v2 = Vector2D( 3 , 9 ) ;
		vi = bv1.projectionOfPoint( v2 ) ;
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
		expect( v1.dup().add( v2 , v3 ) ).to.eql( { x: 10 , y: 12 , z: 7 } ) ;
	} ) ;
	
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
	
	it( "get/set length" , function() {
		var v1 = Vector3D( 3 , 4 , 5 ) ;
		expect( v1.length ).to.be( 7.0710678118654755 ) ;
		
		v1.length = 10 ;
		expect( v1 ).to.eql( { x: 4.242640687119285 , y: 5.65685424949238 , z: 7.071067811865475 } ) ;
		
		v1.length = -10 ;
		expect( v1 ).to.eql( { x: 4.242640687119285 , y: 5.65685424949238 , z: 7.071067811865475 } ) ;
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
} ) ;



describe( "BoundVector3D" , function() {
	
	it( "constructor" , function() {
		expect( BoundVector3D( { x: 3 , y: 4 , z: 5 } , { x: 5 , y: 2 , z: -1 } ) )
			.to.eql( { point: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: 2 , z: -1 } } ) ;
	} ) ;
	
	it( "from/to constructor" , function() {
		expect( BoundVector3D.fromTo( Vector3D( 3 , 4 , 5 ) , Vector3D( 8 , 2 , 7 ) ) )
			.to.eql( { point: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: -2 , z: 2 } } ) ;
	} ) ;
	
	it( "get/set endPoint" , function() {
		v = BoundVector3D.fromTo( Vector3D( 3 , 4 , 5 ) , Vector3D( 8 , 2 , 7 ) ) ;
		expect( v ).to.eql( { point: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: -2 , z: 2 } } ) ;
		expect( v.endPoint ).to.eql( { x: 8 , y: 2 , z: 7 } ) ;
		expect( v.setEndPoint( Vector3D( -4 , 1 , 11 ) ) ).to.eql( { point: { x: 3 , y: 4 , z: 5 } , vector: { x: -7 , y: -3 , z: 6 } } ) ;
		expect( v.endPoint ).to.eql( { x: -4 , y: 1 , z: 11 } ) ;
	} ) ;
	
	/*
	it( "intersection" , function() {
		bv1 = BoundVector3D( { x: 2 , y: 1 } , { x: 2 , y: 1 } ) ;
		bv2 = BoundVector3D( { x: 4 , y: 6 } , { x: 2 , y: -3 } ) ;
		vi = bv1.intersection( bv2 ) ;
		expect( vi ).to.be.an( Vector3D ) ;
		expect( vi ).to.eql( { x: 6 , y: 3 } ) ;
	} ) ;
	
	it( "projection of a point" , function() {
		bv1 = BoundVector3D( { x: 2 , y: 1 } , { x: 2 , y: 1 } ) ;
		v2 = Vector3D( 3 , 9 ) ;
		vi = bv1.projectionOfPoint( v2 ) ;
		expect( vi ).to.be.an( Vector3D ) ;
		expect( vi ).to.eql( { x: 6 , y: 3 } ) ;
	} ) ;
	*/
} ) ;



