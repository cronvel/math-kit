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

/* global expect, describe, it */

"use strict" ;



const math = require( '../lib/math.js' ) ;
const geo = math.geometry ;
const Vector2D = geo.Vector2D ;
const Vector3D = geo.Vector3D ;
const BoundVector2D = geo.BoundVector2D ;
const BoundVector3D = geo.BoundVector3D ;
const Circle2D = geo.Circle2D ;
const Ellipse2D = geo.Ellipse2D ;
const Sphere3D = geo.Sphere3D ;
const Plane3D = geo.Plane3D ;
const Circle3D = geo.Circle3D ;
const Ellipse3D = geo.Ellipse3D ;
const InfiniteCylinder3D = geo.InfiniteCylinder3D ;
//geo.setFastMode( true ) ;

const Matrix = math.Matrix ;
const Quaternion = math.Quaternion ;



function expectCirca( value , circa ) {
	var precision = 0.000000000001 ;
	expect( value ).to.be.within( circa - precision , circa + precision ) ;
}



describe( "Geometry" , () => {

	describe( "Vector2D" , () => {

		it( "constructor" , () => {
			expect( new Vector2D( 3 , 4 ) ).to.be.like( { x: 3 , y: 4 } ) ;
			expect( Number.isNaN( new Vector2D().x ) ).to.be( true ) ;
			expect( Number.isNaN( new Vector2D().y ) ).to.be( true ) ;
		} ) ;

		it( "from/to constructor" , () => {
			expect( Vector2D.fromTo( new Vector2D( 3 , 4 ) , new Vector2D( 8 , 2 ) ) ).to.be.like( { x: 5 , y: -2 } ) ;
		} ) ;

		it( "undefined vector" , () => {
			expect( new Vector2D().undefined ).to.be( true ) ;
			expect( new Vector2D( NaN , NaN ).undefined ).to.be( true ) ;
			expect( new Vector2D( undefined , 4 ).undefined ).to.be( true ) ;
			expect( new Vector2D( 3 , undefined ).undefined ).to.be( true ) ;
			expect( new Vector2D( 3 , 4 ).undefined ).to.be( false ) ;

			var v1 = new Vector2D( 3 , 4 ) ;
			v1.undefined = true ;
			expect( Number.isNaN( v1.x ) ).to.be( true ) ;
			expect( Number.isNaN( v1.y ) ).to.be( true ) ;
		} ) ;

		it( "duplicate" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			expect( v1.dup() ).not.to.be( v1 ) ;
			expect( v1.dup() ).to.be.like( { x: 3 , y: 4 } ) ;
		} ) ;

		it( "addition" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			var v2 = new Vector2D( 5 , 7 ) ;
			var v3 = new Vector2D( 2 , 1 ) ;
			expect( v1.dup().add( v2 ) ).to.be.like( { x: 8 , y: 11 } ) ;
			expect( v1.dup().addMulti( v2 , v3 ) ).to.be.like( { x: 10 , y: 12 } ) ;
		} ) ;

		it( "apply" ) ;

		it( "substract" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			var v2 = new Vector2D( 2 , 1 ) ;
			expect( v1.dup().sub( v2 ) ).to.be.like( { x: 1 , y: 3 } ) ;
		} ) ;

		it( "multiply" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			expect( v1.dup().mul( 3 ) ).to.be.like( { x: 9 , y: 12 } ) ;
			expect( v1.dup().mul( -3 ) ).to.be.like( { x: -9 , y: -12 } ) ;
			expect( v1.dup().mul( 0 ) ).to.be.like( { x: 0 , y: 0 } ) ;
		} ) ;

		it( "divide" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			expect( v1.dup().div( 4 ) ).to.be.like( { x: 0.75 , y: 1 } ) ;
			expect( v1.dup().div( -4 ) ).to.be.like( { x: -0.75 , y: -1 } ) ;
			expect( v1.dup().div( 0 ) ).to.be.like( { x: Infinity , y: Infinity } ) ;
			//expect( v1.dup().div( 0 ).undefined ).to.be( true ) ;
		} ) ;

		it( "inverse" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			expect( v1.dup().inv() ).to.be.like( { x: -3 , y: -4 } ) ;
		} ) ;

		it( "get/set length, value" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			expect( v1.length ).to.be( 5 ) ;

			v1.length = 10 ;
			expect( v1 ).to.be.like( { x: 6 , y: 8 } ) ;

			v1.length = -10 ;
			expect( v1 ).to.be.like( { x: 6 , y: 8 } ) ;

			v1.setValue( -10 ) ;
			expect( v1 ).to.be.like( { x: -6 , y: -8 } ) ;
		} ) ;

		it( "normalize/unit" , () => {
			var v1 = new Vector2D( 3 , 4 ) ;
			v1.normalize() ;
			expectCirca( v1.x , 0.6 ) ;
			expectCirca( v1.y , 0.8 ) ;
		} ) ;

		it( "get/set/rotate angle" , () => {
			var v1 = new Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , Math.PI / 3 ) ;
			expectCirca( v1.inv().angle , -Math.PI + Math.PI / 3 ) ;

			v1 = new Vector2D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , 2 * Math.PI / 3 ) ;

			v1 = new Vector2D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angle , -Math.PI / 3 ) ;

			v1 = new Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			v1.angle = Math.PI / 6 ;
			expectCirca( v1.x , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.y , 5 ) ;

			v1.rotate( Math.PI / 6 ) ;
			expectCirca( v1.angle , Math.PI / 3 ) ;
			expectCirca( v1.x , 5 ) ;
			expectCirca( v1.y , 10 * Math.sqrt( 3 ) / 2 ) ;
		} ) ;

		it( "zzz get/set/rotate angle in degree" , () => {
			var v1 = new Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , 60 ) ;
			expectCirca( v1.inv().angleDeg , -120 ) ;

			v1 = new Vector2D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , 120 ) ;

			v1 = new Vector2D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.angleDeg , -60 ) ;

			v1 = new Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
			v1.angleDeg = 30 ;
			expectCirca( v1.x , 10 * Math.sqrt( 3 ) / 2 ) ;
			expectCirca( v1.y , 5 ) ;

			v1.rotateDeg( 30 ) ;
			expectCirca( v1.angleDeg , 60 ) ;
			expectCirca( v1.x , 5 ) ;
			expectCirca( v1.y , 10 * Math.sqrt( 3 ) / 2 ) ;

			v1.setRadiusAngleDeg( 1 , 60 ) ;
			expect( v1.radius ).to.be.around( 1 ) ;
			expect( v1.angleDeg ).to.be.around( 60 ) ;
			expect( v1.x ).to.be.around( 0.5 ) ;
			expect( v1.y ).to.be.around( Math.sqrt( 3 ) / 2 ) ;
		} ) ;

		it( "dot product" , () => {
			expect( new Vector2D( 3 , 4 ).dot( new Vector2D( 5 , 2 ) ) ).to.be( 23 ) ;
			expect( new Vector2D( 3 , 4 ).dot( new Vector2D( -5 , 2 ) ) ).to.be( -7 ) ;
		} ) ;

		it( "cross product" , () => {
			expect( new Vector2D( 3 , 4 ).cross( new Vector2D( 5 , 2 ) ) ).to.be( -14 ) ;
			expect( new Vector2D( 3 , 4 ).cross( new Vector2D( -5 , 2 ) ) ).to.be( 26 ) ;
		} ) ;

		it( "collinear" , () => {
			expect( new Vector2D( 3 , 4 ).isCollinearTo( new Vector2D( 4 , 3 ) ) ).to.be( false ) ;
			expect( new Vector2D( 3 , 4 ).isCollinearTo( new Vector2D( 3 , 4 ) ) ).to.be( true ) ;
			expect( new Vector2D( 3 , 4 ).isCollinearTo( new Vector2D( 1 , 4 / 3 ) ) ).to.be( true ) ;
			expect( new Vector2D( 3 , 4 ).isCollinearTo( new Vector2D( 6 , 8 ) ) ).to.be( true ) ;
			expect( new Vector2D( 3 , 4 ).isCollinearTo( new Vector2D( -3 , -4 ) ) ).to.be( true ) ;
		} ) ;

		it( "orthogonal" , () => {
			expect( new Vector2D( 3 , 4 ).isOrthogonalTo( new Vector2D( 4 , 3 ) ) ).to.be( false ) ;
			expect( new Vector2D( 3 , 4 ).isOrthogonalTo( new Vector2D( 3 , 4 ) ) ).to.be( false ) ;
			expect( new Vector2D( 3 , 4 ).isOrthogonalTo( new Vector2D( 4 , -3 ) ) ).to.be( true ) ;
			expect( new Vector2D( 3 , 4 ).isOrthogonalTo( new Vector2D( 2 , -1.5 ) ) ).to.be( true ) ;
			expect( new Vector2D( 3 , 4 ).isOrthogonalTo( new Vector2D( -4 , 3 ) ) ).to.be( true ) ;
		} ) ;

		it( "projections" , () => {
			var v1 = new Vector2D( 4 , 3 ) ;
			var v2 = new Vector2D( 3 , 4 ) ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 4.8 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( 4.8 ) ;
			expect( v1.projectionOf( v2 ) ).to.be.like( { x: 3.84 , y: 2.88 } ) ;

			v2.inv() ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 4.8 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( -4.8 ) ;
			expect( v1.projectionOf( v2 ) ).to.be.like( { x: -3.84 , y: -2.88 } ) ;
		} ) ;

		it( "decompose" , () => {
			var v , decomp ;

			v = new Vector2D( 4 , 3 ) ;

			expect( v.decompose( new Vector2D( 1 , 0 ) ) ).to.be.like( [ { x: 4 , y: 0 } , { x: 0 , y: 3 } ] ) ;
			expect( v.decompose( new Vector2D( 5 , 0 ) ) ).to.be.like( [ { x: 4 , y: 0 } , { x: 0 , y: 3 } ] ) ;
			expect( v.decompose( new Vector2D( 0 , 1 ) ) ).to.be.like( [ { x: 0 , y: 3 } , { x: 4 , y: 0 } ] ) ;
			expect( v.decompose( new Vector2D( -5 , 0 ) ) ).to.be.like( [ { x: 4 , y: 0 } , { x: 0 , y: 3 } ] ) ;

			decomp = v.decompose( new Vector2D( 1 , 1 ) ) ;
			expectCirca( decomp[0].x , 3.5 ) ;
			expectCirca( decomp[0].y , 3.5 ) ;
			expectCirca( decomp[1].x , 0.5 ) ;
			expectCirca( decomp[1].y , -0.5 ) ;

			decomp = v.decompose( new Vector2D( 1 , 2 ) ) ;
			expectCirca( decomp[0].x , 2 ) ;
			expectCirca( decomp[0].y , 4 ) ;
			expectCirca( decomp[1].x , 2 ) ;
			expectCirca( decomp[1].y , -1 ) ;
		} ) ;

		it( "fast decompose" , () => {
			var v , decomp , alongAxis = new Vector2D() , perpToAxis = new Vector2D() ;

			v = new Vector2D( 4 , 3 ) ;

			v.fastDecompose( new Vector2D( 1 , 0 ) , alongAxis , perpToAxis ) ;
			expect( alongAxis ).to.be.like( { x: 4 , y: 0 } ) ;
			expect( perpToAxis ).to.be.like( { x: 0 , y: 3 } ) ;

			v.fastDecompose( new Vector2D( 0 , 1 ) , alongAxis , perpToAxis ) ;
			expect( alongAxis ).to.be.like( { x: 0 , y: 3 } ) ;
			expect( perpToAxis ).to.be.like( { x: 4 , y: 0 } ) ;

			v.fastDecompose( new Vector2D( 1 , 1 ).normalize() , alongAxis , perpToAxis ) ;
			expectCirca( alongAxis.x , 3.5 ) ;
			expectCirca( alongAxis.y , 3.5 ) ;
			expectCirca( perpToAxis.x , 0.5 ) ;
			expectCirca( perpToAxis.y , -0.5 ) ;

			v.fastDecompose( new Vector2D( 1 , 2 ).normalize() , alongAxis , perpToAxis ) ;
			expectCirca( alongAxis.x , 2 ) ;
			expectCirca( alongAxis.y , 4 ) ;
			expectCirca( perpToAxis.x , 2 ) ;
			expectCirca( perpToAxis.y , -1 ) ;
		} ) ;

		it( "fast scale axis" , () => {
			var scale , scaleAxis , vector , transposed ;

			scaleAxis = new Vector2D( 0 , 1 ) ;
			scale = 2 ;
			vector = new Vector2D( 3 , 4 ) ;
			transposed = vector.fastScaleAxis( scaleAxis , scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 8 } ) ;
			transposed = transposed.fastScaleAxis( scaleAxis , 1 / scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 4 } ) ;

			scaleAxis = new Vector2D( 1 , 1 ).normalize() ;
			scale = 2 ;
			vector = new Vector2D( 3 , 4 ) ;
			transposed = vector.fastScaleAxis( scaleAxis , scale ) ;
			expect( transposed ).to.be.like( { x: 6.499999999999999 , y: 7.499999999999999 } ) ;
			transposed = transposed.fastScaleAxis( scaleAxis , 1 / scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 4 } ) ;
		} ) ;

		it( "fast scale axis from origin" , () => {
			var scale , scaleAxis , origin , vector , transposed ;

			origin = new Vector2D( 0 , 0 ) ;
			scaleAxis = new Vector2D( 0 , 1 ) ;
			scale = 2 ;
			vector = new Vector2D( 3 , 4 ) ;
			transposed = vector.fastScaleAxisFrom( origin , scaleAxis , scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 8 } ) ;
			transposed = transposed.fastScaleAxisFrom( origin , scaleAxis , 1 / scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 4 } ) ;

			origin = new Vector2D( 0 , 0 ) ;
			scaleAxis = new Vector2D( 1 , 1 ).normalize() ;
			scale = 2 ;
			vector = new Vector2D( 3 , 4 ) ;
			transposed = vector.fastScaleAxisFrom( origin , scaleAxis , scale ) ;
			expect( transposed ).to.be.like( { x: 6.499999999999999 , y: 7.499999999999999 } ) ;
			transposed = transposed.fastScaleAxisFrom( origin , scaleAxis , 1 / scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 4 } ) ;

			origin = new Vector2D( 0 , 2 ) ;
			scaleAxis = new Vector2D( 0 , 1 ) ;
			scale = 2 ;
			vector = new Vector2D( 3 , 4 ) ;
			transposed = vector.fastScaleAxisFrom( origin , scaleAxis , scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 6 } ) ;
			transposed = transposed.fastScaleAxisFrom( origin , scaleAxis , 1 / scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 4 } ) ;

			origin = new Vector2D( -1 , 0 ) ;
			scaleAxis = new Vector2D( 1 , 1 ).normalize() ;
			scale = 2 ;
			vector = new Vector2D( 3 , 4 ) ;
			transposed = vector.fastScaleAxisFrom( origin , scaleAxis , scale ) ;
			expectCirca( transposed.x , 7 ) ;
			expectCirca( transposed.y , 8 ) ;
			transposed = transposed.fastScaleAxisFrom( origin , scaleAxis , 1 / scale ) ;
			expect( transposed ).to.be.like( { x: 3 , y: 4 } ) ;
		} ) ;

		it( "xxx using a transformation matrix" , () => {
			var vector , xVector , yVector , matrix , reciprocalMatrix ;
			
			vector = new Vector2D( 1 , 2 ) ;
			xVector = new Vector2D( 2 , 1 ) ;
			yVector = new Vector2D( -1 , 1 ) ;
			
			matrix = Matrix.identity( 2 , 2 ).changeOfBasis2D( xVector , yVector ) ;
			expect( matrix ).to.be.like( { h: 2 , w: 2 , a: [ 1/3 , 1/3 , -1/3 , 2/3 ] } ) ;
			
			// Check with the reciprocal syntax
			matrix = Matrix.identity( 2 , 2 ).changeOfBasis2D( xVector , yVector , reciprocalMatrix = new Matrix() ) ;
			expect( matrix ).to.be.like( { h: 2 , w: 2 , a: [ 1/3 , 1/3 , -1/3 , 2/3 ] } ) ;
			expect( reciprocalMatrix ).to.be.like( { h: 2 , w: 2 , a: [ 2 , -1 , 1 , 1 ] } ) ;
			
			vector.transform( matrix ) ;
			expect( vector ).to.be.like( { x: 1 , y: 1 } ) ;

			vector.transform( reciprocalMatrix ) ;
			expect( vector ).to.be.like( { x: 1 , y: 2 } ) ;

			
			vector = new Vector2D( -1 , 4 ) ;
			xVector = new Vector2D( 2 , -3 ) ;
			yVector = new Vector2D( -1 , 2 ) ;
			
			matrix = Matrix.identity( 2 , 2 ).changeOfBasis2D( xVector , yVector , reciprocalMatrix = new Matrix() ) ;
			
			vector.transform( matrix ) ;
			expect( vector ).to.be.like( { x: 2 , y: 5 } ) ;

			vector.transform( reciprocalMatrix ) ;
			expect( vector ).to.be.like( { x: -1 , y: 4 } ) ;
		} ) ;
		
		it( "xxx using an affine transformation matrix" , () => {
			var vector , tVector , oVector , xVector , yVector , matrix , reciprocalMatrix ;
			
			vector = new Vector2D( 1 , 2 ) ;
			tVector = new Vector2D( 3 , -5 ) ;
			
			matrix = Matrix.identity( 3 , 3 ).translation2D( tVector ) ;
			expect( matrix ).to.be.like( { h: 3 , w: 3 , a: [
				1, 0, 3,
				0, 1, -5,
				0, 0, 1
			] } ) ;
			
			vector.affineTransform( matrix ) ;
			expect( vector ).to.be.like( { x: 4 , y: -3 } ) ;


			// Change of origin
			vector = new Vector2D( 1 , 2 ) ;
			oVector = new Vector2D( 3 , 4 ) ;
			
			matrix = Matrix.identity( 3 , 3 ).changeOfOrigin2D( oVector ) ;
			expect( matrix ).to.be.like( { h: 3 , w: 3 , a: [
				1, 0, -3,
				0, 1, -4,
				0, 0, 1
			] } ) ;
			
			vector.affineTransform( matrix ) ;
			expect( vector ).to.be.like( { x: -2 , y: -2 } ) ;


			// Change both the basis and the origin with 2 transformations matrix
			vector = new Vector2D( 1 , 2 ) ;
			oVector = new Vector2D( -2 , -1 ) ;
			xVector = new Vector2D( 2 , 1 ) ;
			yVector = new Vector2D( -1 , 1 ) ;
			
			// The change of origin comes first, but in matrix computing it should be on the right-side of the multiplication
			matrix = Matrix.identity( 3 , 3 ).changeOfBasis2D( xVector , yVector ).multiplyByMatrix(
				Matrix.identity( 3 , 3 ).changeOfOrigin2D( oVector )
			) ;
			
			expect( matrix ).to.be.like( { h: 3 , w: 3 , a: [
				1/3,  1/3, 1,
				-1/3, 2/3, 0,
				0,    0,   1
			] } ) ;
			
			vector.affineTransform( matrix ) ;
			expect( vector ).to.be.like( { x: 2 , y: 1 } ) ;


			// Change both the basis and the origin using only one transformation matrix
			vector = new Vector2D( 1 , 2 ) ;
			oVector = new Vector2D( -2 , -1 ) ;
			xVector = new Vector2D( 2 , 1 ) ;
			yVector = new Vector2D( -1 , 1 ) ;
			
			// The change of origin comes first, but in matrix computing it should be on the right-side of the multiplication
			matrix = Matrix.identity( 3 , 3 ).changeOfOriginAndBasis2D( oVector , xVector , yVector ) ;
			expect( matrix ).to.be.like( { h: 3 , w: 3 , a: [
				1/3,  1/3, 1,
				-1/3, 2/3, 0,
				0,    0,   1
			] } ) ;
			
			matrix = Matrix.identity( 3 , 3 ).changeOfOriginAndBasis2D( oVector , xVector , yVector , reciprocalMatrix = new Matrix() ) ;
			expect( matrix ).to.be.like( { h: 3 , w: 3 , a: [
				1/3,  1/3, 1,
				-1/3, 2/3, 0,
				0,    0,   1
			] } ) ;
			expect( reciprocalMatrix ).to.be.like( { h: 3 , w: 3 , a: [
				2, -1, -2,
				1, 1,  -1,
				0, 0,  1
			] } ) ;
			
			vector.affineTransform( matrix ) ;
			expect( vector ).to.be.like( { x: 2 , y: 1 } ) ;
		} ) ;
		
		it( "transpose" , () => {
			var vector , transposeOrigin , transposeXAxis ;

			transposeOrigin = new Vector2D( 0 , 0 ) ;
			transposeXAxis = new Vector2D( 1 , 0 ).normalize() ;
			vector = new Vector2D( 1 , 2 ) ;
			vector.transpose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expect( vector ).to.be.like( { x: 1 , y: 2 } ) ;
			vector.untranspose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expect( vector ).to.be.like( { x: 1 , y: 2 } ) ;

			transposeOrigin = new Vector2D( 3 , 4 ) ;
			transposeXAxis = new Vector2D( 1 , 0 ).normalize() ;
			vector = new Vector2D( 1 , 2 ) ;
			vector.transpose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expect( vector ).to.be.like( { x: -2 , y: -2 } ) ;
			vector.untranspose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expect( vector ).to.be.like( { x: 1 , y: 2 } ) ;

			transposeOrigin = new Vector2D( -3 , -4 ) ;
			transposeXAxis = new Vector2D( 1 , 0 ).normalize() ;
			vector = new Vector2D( 1 , 2 ) ;
			vector.transpose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expect( vector ).to.be.like( { x: 4 , y: 6 } ) ;
			vector.untranspose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expect( vector ).to.be.like( { x: 1 , y: 2 } ) ;

			transposeOrigin = new Vector2D( 0 , 0 ) ;
			transposeXAxis = new Vector2D( 1 , 1 ).normalize() ;
			vector = new Vector2D( 1 , 2 ) ;
			vector.transpose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , Math.SQRT1_2 * 3 ) ;
			expectCirca( vector.y , Math.SQRT1_2 ) ;
			vector.untranspose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , 1 ) ;
			expectCirca( vector.y , 2 ) ;

			transposeOrigin = new Vector2D( 0 , 0 ) ;
			transposeXAxis = new Vector2D( -1 , 1 ).normalize() ;
			vector = new Vector2D( 1 , 2 ) ;
			vector.transpose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , Math.SQRT1_2 ) ;
			expectCirca( vector.y , -Math.SQRT1_2 * 3 ) ;
			vector.untranspose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , 1 ) ;
			expectCirca( vector.y , 2 ) ;

			transposeOrigin = new Vector2D( 1 , 2 ) ;
			transposeXAxis = new Vector2D( -1 , 1 ).normalize() ;
			vector = new Vector2D( 1 , 2 ) ;
			vector.transpose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , 0 ) ;
			expectCirca( vector.y , 0 ) ;
			vector.untranspose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , 1 ) ;
			expectCirca( vector.y , 2 ) ;

			transposeOrigin = new Vector2D( 1 , -2 ) ;
			transposeXAxis = new Vector2D( -1 , 1 ).normalize() ;
			vector = new Vector2D( 1 , 2 ) ;
			vector.transpose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , Math.SQRT2 * 2 ) ;
			expectCirca( vector.y , -Math.SQRT2 * 2 ) ;
			vector.untranspose( transposeOrigin , transposeXAxis ) ;
			//console.log( vector ) ;
			expectCirca( vector.x , 1 ) ;
			expectCirca( vector.y , 2 ) ;
		} ) ;

		it( "transpose 3D" , () => {
			var v , transposed , origin , normal , xAxis ;

			v = new Vector2D( 1 , 3 ) ;
			origin = new Vector3D( 0 , 0 , 1 ) ;
			normal = new Vector3D( 1 , 0 , 1 ).normalize() ;
			xAxis = new Vector3D( 1 , 0 , -1 ).normalize() ;
			transposed = v.transpose3D( origin , normal , xAxis ) ;
			//console.log( transposed ) ;
			expectCirca( transposed.x , Math.SQRT1_2 ) ;
			expectCirca( transposed.y , 3 ) ;
			expectCirca( transposed.z , 1 - Math.SQRT1_2 ) ;

			v = new Vector2D( 1 , 3 ) ;
			origin = new Vector3D( 1 , 0 , 0 ) ;
			normal = new Vector3D( 1 , 0 , 1 ).normalize() ;
			xAxis = new Vector3D( 1 , 0 , -1 ).normalize() ;
			transposed = v.transpose3D( origin , normal , xAxis ) ;
			//console.log( transposed ) ;
			expectCirca( transposed.x , 1 + Math.SQRT1_2 ) ;
			expectCirca( transposed.y , 3 ) ;
			expectCirca( transposed.z , -Math.SQRT1_2 ) ;

			v = new Vector2D( -1 , 3 ) ;
			origin = new Vector3D( 0 , 0 , 1 ) ;
			normal = new Vector3D( 1 , 0 , 1 ).normalize() ;
			xAxis = new Vector3D( 1 , 0 , -1 ).normalize() ;
			transposed = v.transpose3D( origin , normal , xAxis ) ;
			//console.log( transposed ) ;
			expectCirca( transposed.x , -Math.SQRT1_2 ) ;
			expectCirca( transposed.y , 3 ) ;
			expectCirca( transposed.z , 1 + Math.SQRT1_2 ) ;
		} ) ;
	} ) ;



	describe( "BoundVector2D" , () => {

		it( "constructor" , () => {
			expect( new BoundVector2D( 3 , 4 , 5 , 2 ) ).to.be.like( { position: { x: 3 , y: 4 } , vector: { x: 5 , y: 2 } } ) ;
		} ) ;

		it( "from/to constructor" , () => {
			expect( BoundVector2D.fromTo( new Vector2D( 3 , 4 ) , new Vector2D( 8 , 2 ) ) ).to.be.like( { position: { x: 3 , y: 4 } , vector: { x: 5 , y: -2 } } ) ;
		} ) ;

		it( "get/set endPoint" , () => {
			var v = BoundVector2D.fromTo( new Vector2D( 3 , 4 ) , new Vector2D( 8 , 2 ) ) ;
			expect( v ).to.be.like( { position: { x: 3 , y: 4 } , vector: { x: 5 , y: -2 } } ) ;
			expect( v.endPoint ).to.be.like( { x: 8 , y: 2 } ) ;
			expect( v.setEndPoint( new Vector2D( -4 , 1 ) ) ).to.be.like( { position: { x: 3 , y: 4 } , vector: { x: -7 , y: -3 } } ) ;
			expect( v.endPoint ).to.be.like( { x: -4 , y: 1 } ) ;
		} ) ;

		it( "apply" ) ;

		it( "apply acceleration" ) ;

		it( "test if a point is on the line" , () => {
			var line ;

			line = new BoundVector2D( 2 , 3 , 2 , 1 ) ;
			expect( line.isOnLine( new Vector2D( 2 , 3 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLine( new Vector2D( 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( 3 , 3.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( 2.5 , 3.25 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( 2.25 , 3.25 ) ) ).to.be( false ) ;
			expect( line.isOnLine( new Vector2D( 5 , 4.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( 0 , 2 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( -1 , 1.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( -1.5 , 1.25 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector2D( -1.4 , 1.25 ) ) ).to.be( false ) ;
		} ) ;

		it( "test if a point is on the line segment" , () => {
			var line ;

			line = new BoundVector2D( 2 , 3 , 2 , 1 ) ;
			expect( line.isOnLineSegment( new Vector2D( 2 , 3 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector2D( 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector2D( 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector2D( 3 , 3.5 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector2D( 2.5 , 3.25 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector2D( 2.25 , 3.25 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector2D( 5 , 4.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector2D( 0 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector2D( -1 , 1.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector2D( -1.5 , 1.25 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector2D( -1.4 , 1.25 ) ) ).to.be( false ) ;
		} ) ;

		it( "test side of a coordinate/position relative to the line of a bound vector" , () => {
			var line ;

			line = new BoundVector2D( 0 , 0 , 0 , 1 ) ;
			expect( line.test( 0 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 3 ) ).to.be( 0 ) ;
			expect( line.test( 3 , 0 ) ).to.be( -3 ) ;
			expect( line.test( 3 , 54 ) ).to.be( -3 ) ;
			expect( line.test( 3 , -17 ) ).to.be( -3 ) ;
			expect( line.test( -7 , 0 ) ).to.be( 7 ) ;
			expect( line.test( -7 , 99 ) ).to.be( 7 ) ;

			line = new BoundVector2D( 0 , 0 , 1 , 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 3 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 3 ) ).to.be( 3 ) ;
			expect( line.test( 0 , -3 ) ).to.be( -3 ) ;

			line = new BoundVector2D( 0 , 5 , 1 , 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( -5 ) ;
			expect( line.test( 3 , 0 ) ).to.be( -5 ) ;
			expect( line.test( 0 , 3 ) ).to.be( -2 ) ;
			expect( line.test( 0 , -3 ) ).to.be( -8 ) ;
			expect( line.test( 0 , 8 ) ).to.be( 3 ) ;

			line = new BoundVector2D( 4 , 2 , 1 , 2 ) ;
			expect( line.test( 4 , 2 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( 6 ) ;
			expect( line.test( 3 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 4 , 4 ) ).to.be( 2 ) ;
			expect( line.test( 6 , 4 ) ).to.be( -2 ) ;

			line = new BoundVector2D( 4 , 2 , -1 , -2 ) ;
			expect( line.test( 4 , 2 ) ).to.be( 0 ) ;
			expect( line.test( 0 , 0 ) ).to.be( -6 ) ;
			expect( line.test( 3 , 0 ) ).to.be( 0 ) ;
			expect( line.test( 4 , 4 ) ).to.be( -2 ) ;
			expect( line.test( 6 , 4 ) ).to.be( 2 ) ;
			expect( line.testVector( new Vector2D( 6 , 4 ) ) ).to.be( 2 ) ;
		} ) ;

		it( "point distance to the line of a bound vector" , () => {
			var line ;

			line = new BoundVector2D( 4 , 2 , -1 , -2 ) ;
			expectCirca( line.pointDistance( new Vector2D( 4 , 2 ) ) , 0 ) ;
			expectCirca( line.pointDistance( new Vector2D( 0 , -1 ) ) , Math.sqrt( 5 ) ) ;
			expectCirca( line.pointDistance( new Vector2D( -2 , 0 ) ) , 2 * Math.sqrt( 5 ) ) ;
			expectCirca( line.pointDistance( new Vector2D( 6 , 1 ) ) , Math.sqrt( 5 ) ) ;
		} ) ;

		it( "intersection" , () => {
			var bv1 = new BoundVector2D( 2 , 1 , 2 , 1 ) ;
			var bv2 = new BoundVector2D( 4 , 6 , 2 , -3 ) ;
			var vi = bv1.lineIntersection( bv2 ) ;
			expect( vi ).to.be.an( Vector2D ) ;
			expect( vi ).to.be.like( { x: 6 , y: 3 } ) ;

			bv1 = new BoundVector2D( 2 , 1 , 0 , 2 ) ;
			bv2 = new BoundVector2D( 4 , 6 , 1 , 0 ) ;
			//vi = bv1.dup().normalize().lineIntersection( bv2 , 1 ) ;
			vi = bv1.lineIntersection( bv2 ) ;
			expect( vi ).to.be.like( { x: 2 , y: 6 } ) ;

			bv1 = new BoundVector2D( 2 , 1 , 0 , 2 ) ;
			bv2 = new BoundVector2D( 4 , 6 , 1 , 0 ) ;
			vi = bv1.dup().normalize()
				.lineIntersection( bv2 , 1 ) ;
			expect( vi ).to.be.like( { x: 1 , y: 6 } ) ;
		} ) ;

		it( "projection of a point" , () => {
			var bv1 = new BoundVector2D( 2 , 1 , 2 , 1 ) ;
			var v2 = new Vector2D( 3 , 9 ) ;
			var vi = bv1.pointProjection( v2 ) ;
			expect( vi ).to.be.an( Vector2D ) ;
			expect( vi ).to.be.like( { x: 6 , y: 3 } ) ;
		} ) ;
	} ) ;



	describe( "Vector3D" , () => {

		it( "constructor" , () => {
			expect( new Vector3D( 3 , 4 , 5 ) ).to.be.like( { x: 3 , y: 4 , z: 5 } ) ;
			expect( Number.isNaN( new Vector3D().x ) ).to.be( true ) ;
			expect( Number.isNaN( new Vector3D().y ) ).to.be( true ) ;
			expect( Number.isNaN( new Vector3D().z ) ).to.be( true ) ;
		} ) ;

		it( "from/to constructor" , () => {
			expect( Vector3D.fromTo( new Vector3D( 3 , 4 , 5 ) , new Vector3D( 8 , 2 , -4 ) ) ).to.be.like( { x: 5 , y: -2 , z: -9 } ) ;
		} ) ;

		it( "undefined vector" , () => {
			expect( new Vector3D().undefined ).to.be( true ) ;
			expect( new Vector3D( NaN , NaN , NaN ).undefined ).to.be( true ) ;
			expect( new Vector3D( undefined , 4 , 5 ).undefined ).to.be( true ) ;
			expect( new Vector3D( 3 , undefined , 5 ).undefined ).to.be( true ) ;
			expect( new Vector3D( 3 , 4 , undefined ).undefined ).to.be( true ) ;
			expect( new Vector3D( 3 , 4 , 5 ).undefined ).to.be( false ) ;

			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			v1.undefined = true ;
			expect( Number.isNaN( v1.x ) ).to.be( true ) ;
			expect( Number.isNaN( v1.y ) ).to.be( true ) ;
			expect( Number.isNaN( v1.z ) ).to.be( true ) ;
		} ) ;

		it( "duplicate" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			expect( v1.dup() ).not.to.be( v1 ) ;
			expect( v1.dup() ).to.be.like( { x: 3 , y: 4 , z: 5 } ) ;
		} ) ;

		it( "addition" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			var v2 = new Vector3D( 5 , 7 , -1 ) ;
			var v3 = new Vector3D( 2 , 1 , 3 ) ;
			expect( v1.dup().add( v2 ) ).to.be.like( { x: 8 , y: 11 , z: 4 } ) ;
			expect( v1.dup().addMulti( v2 , v3 ) ).to.be.like( { x: 10 , y: 12 , z: 7 } ) ;
		} ) ;

		it( "apply" ) ;

		it( "substract" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			var v2 = new Vector3D( 2 , 1 , 8 ) ;
			expect( v1.dup().sub( v2 ) ).to.be.like( { x: 1 , y: 3 , z: -3 } ) ;
		} ) ;

		it( "multiply" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			expect( v1.dup().mul( 3 ) ).to.be.like( { x: 9 , y: 12 , z: 15 } ) ;
			expect( v1.dup().mul( -3 ) ).to.be.like( { x: -9 , y: -12 , z: -15 } ) ;
			expect( v1.dup().mul( 0 ) ).to.be.like( { x: 0 , y: 0 , z: 0 } ) ;
		} ) ;

		it( "divide" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			expect( v1.dup().div( 4 ) ).to.be.like( { x: 0.75 , y: 1 , z: 1.25 } ) ;
			expect( v1.dup().div( -4 ) ).to.be.like( { x: -0.75 , y: -1 , z: -1.25 } ) ;
			expect( v1.dup().div( 0 ) ).to.be.like( { x: Infinity , y: Infinity , z: Infinity } ) ;
			//expect( v1.dup().div( 0 ).undefined ).to.be( true ) ;
		} ) ;

		it( "inverse" , () => {
			var v1 = new Vector3D( 3 , 4 , -5 ) ;
			expect( v1.dup().inv() ).to.be.like( { x: -3 , y: -4 , z: 5 } ) ;
		} ) ;

		it( "get/set length, value" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			expect( v1.length ).to.be( 7.0710678118654755 ) ;

			v1.length = 10 ;
			expect( v1 ).to.be.like( { x: 4.242640687119285 , y: 5.65685424949238 , z: 7.071067811865475 } ) ;

			v1.length = -10 ;
			expect( v1 ).to.be.like( { x: 4.242640687119285 , y: 5.65685424949238 , z: 7.071067811865475 } ) ;

			v1.setValue( -10 ) ;
			expect( v1 ).to.be.like( { x: -4.242640687119285 , y: -5.65685424949238 , z: -7.071067811865475 } ) ;
		} ) ;

		it( "normalize/unit" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			v1.normalize() ;
			expect( v1 ).to.be.like( { x: 0.4242640687119285 , y: 0.565685424949238 , z: 0.7071067811865475 } ) ;
		} ) ;

		it( "zzz get/set spherical angle: azimuth and declination" , () => {
			var v1 ;

			v1 = new Vector3D( 3 , 3 , 3 * Math.SQRT2 ) ;
			expect( v1.azimuthDeg ).to.be( 45 ) ;
			expect( v1.declinationDeg ).to.be.around( 45 ) ;

			v1 = new Vector3D( 0 , 0 , 1 ) ;
			expect( v1.azimuthDeg ).to.be( 0 ) ;
			expect( v1.declinationDeg ).to.be.around( 90 ) ;

			v1 = new Vector3D( 0 , 0 , -1 ) ;
			expect( v1.azimuthDeg ).to.be( 0 ) ;
			expect( v1.declinationDeg ).to.be.around( -90 ) ;

			v1.setRadiusAzimuthDeclinationDeg( 1 , 45 , 45 ) ;
			expect( v1.radius ).to.be.around( 1 ) ;
			expect( v1.azimuthDeg ).to.be.around( 45 ) ;
			expect( v1.declinationDeg ).to.be.around( 45 ) ;
			expect( v1 ).to.be.like( {
				x: 0.5000000000000001 ,
				y: 0.5 ,
				z: 0.7071067811865475
			} ) ;
		} ) ;

		it( "dot product" , () => {
			expect( new Vector3D( 3 , 4 , 5 ).dot( new Vector3D( 5 , 2 , 1 ) ) ).to.be( 28 ) ;
			expect( new Vector3D( 3 , 4 , 5 ).dot( new Vector3D( -5 , 2 , -3 ) ) ).to.be( -22 ) ;
		} ) ;

		it( "cross product" , () => {
			expect( new Vector3D( 3 , 4 , 5 ).cross( new Vector3D( 5 , 2 , 1 ) ) ).to.be.like( { x: -6 , y: 22 , z: -14 } ) ;
			expect( new Vector3D( 3 , 4 , 5 ).cross( new Vector3D( -5 , 2 , -3 ) ) ).to.be.like( { x: -22 , y: -16 , z: 26 } ) ;
		} ) ;

		it( "collinear" , () => {
			expect( new Vector3D( 3 , 4 , 5 ).isCollinearTo( new Vector3D( 4 , 3 , 5 ) ) ).to.be( false ) ;
			expect( new Vector3D( 3 , 4 , 5 ).isCollinearTo( new Vector3D( 3 , 4 , 5 ) ) ).to.be( true ) ;
			expect( new Vector3D( 3 , 4 , 5 ).isCollinearTo( new Vector3D( 1.5 , 2 , 2.5 ) ) ).to.be( true ) ;
			expect( new Vector3D( 3 , 4 , 5 ).isCollinearTo( new Vector3D( 6 , 8 , 10 ) ) ).to.be( true ) ;
			expect( new Vector3D( 3 , 4 , 5 ).isCollinearTo( new Vector3D( -3 , -4 , -5 ) ) ).to.be( true ) ;
		} ) ;

		it( "orthogonal" , () => {
			expect( new Vector3D( 3 , 4 , 5 ).isOrthogonalTo( new Vector3D( 4 , 3 , 5 ) ) ).to.be( false ) ;
			expect( new Vector3D( 3 , 4 , 5 ).isOrthogonalTo( new Vector3D( 3 , 4 , 5 ) ) ).to.be( false ) ;
			expect( new Vector3D( 3 , 4 , 0 ).isOrthogonalTo( new Vector3D( 0 , 0 , -1 ) ) ).to.be( true ) ;
			expect( new Vector3D( 3 , 4 , 0 ).isOrthogonalTo( new Vector3D( 4 , -3 , 0 ) ) ).to.be( true ) ;
			expect( new Vector3D( 3 , 4 , 2 ).isOrthogonalTo( new Vector3D( 4 , -4 , 2 ) ) ).to.be( true ) ;
		} ) ;

		it( "angle between 2 vectors" , () => {
			var delta = 0.0000001 ;
			expect( new Vector3D( 5 , 0 , 0 ).angleTo( new Vector3D( 5 , 0 , 0 ) ) ).to.be( 0 ) ;
			expect( new Vector3D( 0 , 5 , 0 ).angleTo( new Vector3D( 0 , 5 , 0 ) ) ).to.be( 0 ) ;
			expect( new Vector3D( 0 , 5 , 0 ).angleTo( new Vector3D( 0 , 1 , 0 ) ) ).to.be( 0 ) ;
			expect( new Vector3D( 5 , 5 , 0 ).angleTo( new Vector3D( 5 , 5 , 0 ) ) ).to.be.around( 0 , delta ) ;
			expect( new Vector3D( 5 , 0 , 0 ).angleTo( new Vector3D( 0 , 5 , 0 ) ) ).to.be.around( Math.PI / 2 ) ;
			expect( new Vector3D( 5 , 0 , 0 ).angleTo( new Vector3D( 0 , 0 , 10 ) ) ).to.be.around( Math.PI / 2 ) ;
			expect( new Vector3D( 5 , 0 , 0 ).angleTo( new Vector3D( 0 , 1 , 0 ) ) ).to.be.around( Math.PI / 2 ) ;
			expect( new Vector3D( 5 , 5 , 5 ).angleTo( new Vector3D( 1 , 1 , 1 ) ) ).to.be( 0 ) ;
		} ) ;

		it( "projections" , () => {
			var v1 = new Vector3D( 3 , 4 , 5 ) ;
			var v2 = new Vector3D( 4 , 3 , -2 ) ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 1.979898987322333 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( 1.979898987322333 ) ;
			expect( v1.projectionOf( v2 ) ).to.be.like( { x: 0.8400000000000001 , y: 1.12 , z: 1.4000000000000001 } ) ;
			expect( v1.projectionOf( v2 ).add( v1.diffProjectionOf( v2 ) )
				.isEqualTo( v2 ) ).to.be( true ) ;
			expect( v1.diffProjectionOf( v2 ) ).to.be.like( { x: 3.16 , y: 1.88 , z: -3.4000000000000004 } ) ;

			v2.inv() ;
			expect( v1.projectionLengthOf( v2 ) ).to.be( 1.979898987322333 ) ;
			expect( v1.projectionValueOf( v2 ) ).to.be( -1.979898987322333 ) ;
			expect( v1.projectionOf( v2 ) ).to.be.like( { x: -0.8400000000000001 , y: -1.12 , z: -1.4000000000000001 } ) ;
			expect( v1.projectionOf( v2 ).add( v1.diffProjectionOf( v2 ) )
				.isEqualTo( v2 ) ).to.be( true ) ;
			expect( v1.diffProjectionOf( v2 ) ).to.be.like( { x: -3.16 , y: -1.88 , z: 3.4000000000000004 } ) ;
		} ) ;

		it( "decompose" , () => {
			var v , decomp ;

			v = new Vector3D( 4 , 3 , 5 ) ;

			expect( v.decompose( new Vector3D( 1 , 0 , 0 ) ) ).to.be.like( [ { x: 4 , y: 0 , z: 0 } , { x: 0 , y: 3 , z: 5 } ] ) ;
			expect( v.decompose( new Vector3D( 5 , 0 , 0 ) ) ).to.be.like( [ { x: 4 , y: 0 , z: 0 } , { x: 0 , y: 3 , z: 5 } ] ) ;
			expect( v.decompose( new Vector3D( 0 , 1 , 0 ) ) ).to.be.like( [ { x: 0 , y: 3 , z: 0 } , { x: 4 , y: 0 , z: 5 } ] ) ;
			expect( v.decompose( new Vector3D( -5 , 0 , 0 ) ) ).to.be.like( [ { x: 4 , y: 0 , z: 0 } , { x: 0 , y: 3 , z: 5 } ] ) ;

			decomp = v.decompose( new Vector3D( 1 , 1 , 1 ) ) ;
			expectCirca( decomp[0].x , 4 ) ;
			expectCirca( decomp[0].y , 4 ) ;
			expectCirca( decomp[0].z , 4 ) ;
			expectCirca( decomp[1].x , 0 ) ;
			expectCirca( decomp[1].y , -1 ) ;
			expectCirca( decomp[1].z , 1 ) ;

			decomp = v.decompose( new Vector3D( 1 , 2 , 0 ) ) ;
			expectCirca( decomp[0].x , 2 ) ;
			expectCirca( decomp[0].y , 4 ) ;
			expectCirca( decomp[0].z , 0 ) ;
			expectCirca( decomp[1].x , 2 ) ;
			expectCirca( decomp[1].y , -1 ) ;
			expectCirca( decomp[1].z , 5 ) ;

			decomp = v.decompose( new Vector3D( 1 , 2 , 3 ) ) ;
			expectCirca( decomp[0].x , 1.785714285714286 ) ;
			expectCirca( decomp[0].y , 3.571428571428572 ) ;
			expectCirca( decomp[0].z , 5.357142857142858 ) ;
			expectCirca( decomp[1].x , 2.214285714285714 ) ;
			expectCirca( decomp[1].y , -0.5714285714285721 ) ;
			expectCirca( decomp[1].z , -0.35714285714285765 ) ;
		} ) ;

		it( "fast decompose" , () => {
			var v , decomp , alongAxis = new Vector3D() , perpToAxis = new Vector3D() ;

			v = new Vector3D( 4 , 3 , 5 ) ;

			v.fastDecompose( new Vector3D( 1 , 0 , 0 ) , alongAxis , perpToAxis ) ;
			expect( alongAxis ).to.be.like( { x: 4 , y: 0 , z: 0 } ) ;
			expect( perpToAxis ).to.be.like( { x: 0 , y: 3 , z: 5 } ) ;

			v.fastDecompose( new Vector3D( 0 , 1 , 0 ) , alongAxis , perpToAxis ) ;
			expect( alongAxis ).to.be.like( { x: 0 , y: 3 , z: 0 } ) ;
			expect( perpToAxis ).to.be.like( { x: 4 , y: 0 , z: 5 } ) ;

			v.fastDecompose( new Vector3D( 1 , 1 , 1 ).normalize() , alongAxis , perpToAxis ) ;
			expectCirca( alongAxis.x , 4 ) ;
			expectCirca( alongAxis.y , 4 ) ;
			expectCirca( alongAxis.z , 4 ) ;
			expectCirca( perpToAxis.x , 0 ) ;
			expectCirca( perpToAxis.y , -1 ) ;
			expectCirca( perpToAxis.z , 1 ) ;

			v.fastDecompose( new Vector3D( 1 , 2 , 0 ).normalize() , alongAxis , perpToAxis ) ;
			expectCirca( alongAxis.x , 2 ) ;
			expectCirca( alongAxis.y , 4 ) ;
			expectCirca( alongAxis.z , 0 ) ;
			expectCirca( perpToAxis.x , 2 ) ;
			expectCirca( perpToAxis.y , -1 ) ;
			expectCirca( perpToAxis.z , 5 ) ;

			v.fastDecompose( new Vector3D( 1 , 2 , 3 ).normalize() , alongAxis , perpToAxis ) ;
			expectCirca( alongAxis.x , 1.785714285714286 ) ;
			expectCirca( alongAxis.y , 3.571428571428572 ) ;
			expectCirca( alongAxis.z , 5.357142857142858 ) ;
			expectCirca( perpToAxis.x , 2.214285714285714 ) ;
			expectCirca( perpToAxis.y , -0.5714285714285721 ) ;
			expectCirca( perpToAxis.z , -0.35714285714285765 ) ;
		} ) ;

		it( "xxx using a transformation matrix" , () => {
			var vector , xVector , yVector , zVector , matrix , reciprocalMatrix ;
			
			vector = new Vector3D( 7 , 4 , 7 ) ;	// (3,2,1) in the new basis
			xVector = new Vector3D( 2 , 1 , 1 ) ;
			yVector = new Vector3D( -1 , 1 , 3 ) ;
			zVector = new Vector3D( 3 , -1 , -2 ) ;
			
			matrix = Matrix.identity( 3 , 3 ).changeOfBasis3D( xVector , yVector , zVector ) ;
			expect( matrix ).to.be.like( { h: 3 , w: 3 , a: [
				1/7, 1,  -2/7,
				1/7, -1, 5/7 - Number.EPSILON/2,
				2/7, -1, 3/7
			] } ) ;
			
			// Check with the reciprocal syntax
			matrix = Matrix.identity( 3 , 3 ).changeOfBasis3D( xVector , yVector , zVector , reciprocalMatrix = new Matrix() ) ;
			expect( matrix ).to.be.like( { h: 3 , w: 3 , a: [
				1/7, 1,  -2/7,
				1/7, -1, 5/7 - Number.EPSILON/2,
				2/7, -1, 3/7
			] } ) ;
			expect( reciprocalMatrix ).to.be.like( { h: 3 , w: 3 , a: [
				2, -1, 3,
				1, 1, -1,
				1, 3, -2
			] } ) ;
			
			vector.transform( matrix ) ;
			expect( vector ).to.be.like( { x: 3 , y: 2 - Number.EPSILON*4, z: 1 } ) ;

			vector.transform( reciprocalMatrix ) ;
			expect( vector ).to.be.like( { x: 7 + Number.EPSILON*4 , y: 4 - Number.EPSILON*4 , z: 7 - Number.EPSILON*16} ) ;
		} ) ;
		
		it( "xxx using an affine transformation matrix" , () => {
			var vector , oVector , xVector , yVector , zVector , matrix , reciprocalMatrix ;
			
			vector = new Vector3D( 14 , 9 , 4 ) ;	// (3,2,1) in the new basis
			oVector = new Vector3D( 7 , 5 , -3 ) ;
			xVector = new Vector3D( 2 , 1 , 1 ) ;
			yVector = new Vector3D( -1 , 1 , 3 ) ;
			zVector = new Vector3D( 3 , -1 , -2 ) ;
			
			matrix = Matrix.identity( 4 , 4 ).changeOfOriginAndBasis3D( oVector , xVector , yVector , zVector ) ;
			expect( matrix ).to.be.like( { h: 4 , w: 4 , a: [
				1/7, 1,  -2/7, -7+1/7,
				1/7, -1, 5/7-Number.EPSILON/2, 6+1/7-Number.EPSILON*6,
				2/7, -1, 3/7, 4+2/7,
				0, 0, 0, 1
			] } ) ;
			
			// Check with the reciprocal syntax
			matrix = Matrix.identity( 4 , 4 ).changeOfOriginAndBasis3D( oVector , xVector , yVector , zVector , reciprocalMatrix = new Matrix() ) ;
			expect( matrix ).to.be.like( { h: 4 , w: 4 , a: [
				1/7, 1,  -2/7, -7+1/7,
				1/7, -1, 5/7-Number.EPSILON/2, 6+1/7-Number.EPSILON*6,
				2/7, -1, 3/7, 4+2/7,
				0, 0, 0, 1
			] } ) ;
			expect( reciprocalMatrix ).to.be.like( { h: 4 , w: 4 , a: [
				2, -1, 3, 7,
				1, 1, -1, 5,
				1, 3, -2, -3,
				0, 0, 0, 1
			] } ) ;
			
			vector.affineTransform( matrix ) ;
			expect( vector ).to.be.like( { x: 3 + Number.EPSILON*2, y: 2 - Number.EPSILON*4, z: 1 - Number.EPSILON*5} ) ;

			vector.affineTransform( reciprocalMatrix ) ;
			expect( vector ).to.be.like( { x: 14 - Number.EPSILON*16 , y: 9 + Number.EPSILON*8 , z: 4} ) ;
		} ) ;

		it( "yyy using a rotation quaternion" , () => {
			var vector , quat ;
			
			vector = new Vector3D( 3 , 2 , 1 ) ;
			quat = Quaternion.fromVectorAngleDeg( new Vector3D( 0 , 0 , 1 ) , 90 ) ;
			vector.rotateQuaternion( quat ) ;
			expect( vector ).to.be.like( { x: -2 + Number.EPSILON*2, y: 3 + Number.EPSILON*4, z: 1 } ) ;

			vector = new Vector3D( 3 , 2 , 1 ) ;
			quat = Quaternion.fromVectorAngleDeg( new Vector3D( 0 , 0 , 1 ) , 45 ) ;
			vector.rotateQuaternion( quat ) ;
			expect( vector ).to.be.like( {
				x: 0.707106781186547,
				y: 3.5355339059327378,
				z: 1
			} ) ;

			vector = new Vector3D( 3 , 2 , 1 ) ;
			quat = Quaternion.fromVectorAngleDeg( new Vector3D( 0 , 1 , 0 ) , 45 ) ;
			vector.rotateQuaternion( quat ) ;
			expect( vector ).to.be.like( {
				x: 2.8284271247461894,
				y: 2,
				z: -1.414213562373095
			} ) ;
		} ) ;
		
		it( "transpose 2D" , () => {
			var v , transposed , origin , normal , xAxis ;

			v = new Vector3D( 1 , 3 , 0 ) ;
			origin = new Vector3D( 0 , 0 , 1 ) ;
			normal = new Vector3D( 1 , 0 , 1 ).normalize() ;
			xAxis = new Vector3D( 1 , 0 , -1 ).normalize() ;
			transposed = v.transpose2D( origin , normal , xAxis ) ;
			//console.log( transposed ) ;
			expectCirca( transposed.x , Math.SQRT2 ) ;
			expectCirca( transposed.y , 3 ) ;

			v = new Vector3D( 1 , 3 , 0 ) ;
			origin = new Vector3D( 1 , 0 , 0 ) ;
			normal = new Vector3D( 1 , 0 , 1 ).normalize() ;
			xAxis = new Vector3D( 1 , 0 , -1 ).normalize() ;
			transposed = v.transpose2D( origin , normal , xAxis ) ;
			//console.log( transposed ) ;
			expectCirca( transposed.x , 0 ) ;
			expectCirca( transposed.y , 3 ) ;

			v = new Vector3D( 1 , 3 , 0 ) ;
			origin = new Vector3D( -2 , 0 , 3 ) ;
			normal = new Vector3D( 1 , 0 , 1 ).normalize() ;
			xAxis = new Vector3D( 1 , 0 , -1 ).normalize() ;
			transposed = v.transpose2D( origin , normal , xAxis ) ;
			//console.log( transposed ) ;
			expectCirca( transposed.x , 3 * Math.SQRT2 ) ;
			expectCirca( transposed.y , 3 ) ;

			v = new Vector3D( 5 , 3 , 4 ) ;
			origin = new Vector3D( 0 , 0 , 1 ) ;
			normal = new Vector3D( 1 , 0 , 1 ).normalize() ;
			xAxis = new Vector3D( 1 , 0 , -1 ).normalize() ;
			transposed = v.transpose2D( origin , normal , xAxis ) ;
			//console.log( transposed ) ;
			expectCirca( transposed.x , Math.SQRT2 ) ;
			expectCirca( transposed.y , 3 ) ;
		} ) ;
	} ) ;



	describe( "BoundVector3D" , () => {

		it( "constructor" , () => {
			expect( new BoundVector3D( 3 , 4 , 5 , 5 , 2 , -1 ) )
				.to.be.like( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: 2 , z: -1 } } ) ;
		} ) ;

		it( "from/to constructor" , () => {
			expect( BoundVector3D.fromTo( new Vector3D( 3 , 4 , 5 ) , new Vector3D( 8 , 2 , 7 ) ) )
				.to.be.like( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: -2 , z: 2 } } ) ;
		} ) ;

		it( "get/set endPoint" , () => {
			var v = BoundVector3D.fromTo( new Vector3D( 3 , 4 , 5 ) , new Vector3D( 8 , 2 , 7 ) ) ;
			expect( v ).to.be.like( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: 5 , y: -2 , z: 2 } } ) ;
			expect( v.endPoint ).to.be.like( { x: 8 , y: 2 , z: 7 } ) ;
			expect( v.setEndPoint( new Vector3D( -4 , 1 , 11 ) ) ).to.be.like( { position: { x: 3 , y: 4 , z: 5 } , vector: { x: -7 , y: -3 , z: 6 } } ) ;
			expect( v.endPoint ).to.be.like( { x: -4 , y: 1 , z: 11 } ) ;
		} ) ;

		it( "apply" ) ;

		it( "apply acceleration" ) ;

		it( "test if a point is on the line" , () => {
			var line ;

			line = new BoundVector3D( 2 , 3 , 5 , 2 , 1 , -1 ) ;
			expect( line.isOnLine( new Vector3D( 2 , 3 , 5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( 2 , 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLine( new Vector3D( 4 , 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( 3 , 3.5 , 4.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( 2.5 , 3.25 , 4.75 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( 2.25 , 3.25 , 4.75 ) ) ).to.be( false ) ;
			expect( line.isOnLine( new Vector3D( 5 , 4.5 , 3.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( 0 , 2 , 6 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( -1 , 1.5 , 6.5 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( -1.5 , 1.25 , 6.75 ) ) ).to.be( true ) ;
			expect( line.isOnLine( new Vector3D( -1.5 , 1.25 , 6.5 ) ) ).to.be( false ) ;
			expect( line.isOnLine( new Vector3D( -1.4 , 1.25 , 6.75 ) ) ).to.be( false ) ;
		} ) ;

		it( "test if a point is on the line segment" , () => {
			var line ;

			line = new BoundVector3D( 2 , 3 , 5 , 2 , 1 , -1 ) ;
			expect( line.isOnLineSegment( new Vector3D( 2 , 3 , 5 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector3D( 2 , 2 , 2 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector3D( 4 , 4 , 4 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector3D( 3 , 3.5 , 4.5 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector3D( 2.5 , 3.25 , 4.75 ) ) ).to.be( true ) ;
			expect( line.isOnLineSegment( new Vector3D( 2.25 , 3.25 , 4.75 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector3D( 5 , 4.5 , 3.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector3D( 0 , 2 , 6 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector3D( -1 , 1.5 , 6.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector3D( -1.5 , 1.25 , 6.75 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector3D( -1.5 , 1.25 , 6.5 ) ) ).to.be( false ) ;
			expect( line.isOnLineSegment( new Vector3D( -1.4 , 1.25 , 6.75 ) ) ).to.be( false ) ;
		} ) ;

		it( "projection of a point on a 3D line" , () => {
			var bv1 = new BoundVector3D( 2 , 1 , 0 , 2 , 1 , 0 ) ;
			var v2 = new Vector3D( 3 , 9 , 0 ) ;
			var vi = bv1.pointProjection( v2 ) ;
			expect( vi ).to.be.an( Vector3D ) ;
			expect( vi ).to.be.like( { x: 6 , y: 3 , z: 0 } ) ;
		} ) ;

		it( "distance of a point to a 3D line" , () => {
			var line , point ;

			line = new BoundVector3D( 0 , 0 , 0 , 1 , 0 , 0 ) ;
			point = new Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;

			line = new BoundVector3D( 0 , 0 , 0 , 10 , 0 , 0 ) ;
			point = new Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;

			line = new BoundVector3D( 0 , 0 , 0 , -10 , 0 , 0 ) ;
			point = new Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;

			line = new BoundVector3D( -7 , 0 , 0 , -10 , 0 , 0 ) ;
			point = new Vector3D( 0 , 2 , 0 ) ;
			expect( line.pointDistance( point ) ).to.be( 2 ) ;

			line = new BoundVector3D( 0 , 0 , 0 , 1 , 1 , 1 ) ;
			point = new Vector3D( 0 , 2 , 1 ) ;
			expectCirca( line.pointDistance( point ) , Math.sqrt( 2 ) ) ;

			line = new BoundVector3D( 0 , 0 , 0 , 10 , 10 , 10 ) ;
			point = new Vector3D( 0 , 2 , 1 ) ;
			expectCirca( line.pointDistance( point ) , Math.sqrt( 2 ) ) ;
		} ) ;

		it( "shortest segment between two 3D lines" , () => {
			var line1 , line2 ;

			line1 = new BoundVector3D( -1 , 0 , 0 , 0 , 1 , 1 ) ;
			line2 = new BoundVector3D( 1 , 0 , 0 , 0 , -1 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: -1 , y: 0 , z: 0 } , vector: { x: 2 , y: 0 , z: 0 } } ) ;
			line1.apply( 7 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: -1 , y: 0 , z: 0 } , vector: { x: 2 , y: 0 , z: 0 } } ) ;
			line2.apply( -2.5 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: -1 , y: 0 , z: 0 } , vector: { x: 2 , y: 0 , z: 0 } } ) ;

			line1 = new BoundVector3D( -1 , 0 , 0 , 0 , 1 , 12 ) ;
			line2 = new BoundVector3D( 1 , 0 , 0 , 0 , -3 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: -1 , y: 0 , z: 0 } , vector: { x: 2 , y: 0 , z: 0 } } ) ;

			line1 = new BoundVector3D( -1 , 0 , 0 , 0 , 1 , 1 ) ;
			line2 = new BoundVector3D( 2 , 0 , 0 , 1 , -1 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: -1 , y: 0 , z: 0 } , vector: { x: 2 , y: 1 , z: -1 } } ) ;

			line1 = new BoundVector3D( -1 , 0 , 0 , 0 , 1 , 1 ) ;
			line2 = new BoundVector3D( 2 , 0 , 0 , 1 , -1 , 3 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: -1 , y: -1 / 3 , z: -1 / 3 } , vector: { x: 2 + 2 / 3 + Number.EPSILON , y: 2 / 3 , z: -2 / 3 - Number.EPSILON / 2 } } ) ;

			line1 = new BoundVector3D( -2 , 0 , 0 , 1 , 1 , 1 ) ;
			line2 = new BoundVector3D( 1 , 0 , 0 , 0 , -1 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: -1 , y: 1 , z: 1 } , vector: { x: 2 , y: -1 , z: -1 } } ) ;

			// Collinear lines
			line1 = new BoundVector3D( 0 , 0 , 0 , 0 , 0 , 1 ) ;
			line2 = new BoundVector3D( 3 , 0 , 0 , 0 , 0 , 1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: 0 , y: 0 , z: 0 } , vector: { x: 3 , y: 0 , z: 0 } } ) ;

			line1 = new BoundVector3D( 0 , 0 , 0 , 0 , 0 , 1 ) ;
			line2 = new BoundVector3D( 3 , 0 , 0 , 0 , 0 , -1 ) ;
			expect( line1.shortestSegmentToLine( line2 ) ).to.be.like( { position: { x: 0 , y: 0 , z: 0 } , vector: { x: 3 , y: 0 , z: 0 } } ) ;
		} ) ;
	} ) ;



	describe( "Plane3D" , () => {

		it( "create a plane from 3 points" , () => {
			var plane ;

			plane = Plane3D.fromThreePoints(
				new Vector3D( 0 , 0 , 2 ) ,
				new Vector3D( 2 , 1 , 2 ) ,
				new Vector3D( 1 , 2 , 2 )
			) ;
			expect( plane ).to.be.like( { normal: { x: 0 , y: 0 , z: 1 } , d: -2 } ) ;

			plane = Plane3D.fromThreePoints(
				new Vector3D( 0 , 0 , 2 ) ,
				new Vector3D( 1 , 2 , 2 ) ,
				new Vector3D( 2 , 1 , 2 )
			) ;
			expect( plane ).to.be.like( { normal: { x: 0 , y: 0 , z: -1 } , d: 2 } ) ;

			plane = Plane3D.fromThreePoints(
				new Vector3D( 1 , 0 , 0 ) ,
				new Vector3D( 0 , 1 , 0 ) ,
				new Vector3D( 0 , 0 , 1 )
			) ;
			expect( plane ).to.be.like( { normal: { x: 0.5773502691896258 , y: 0.5773502691896258 , z: 0.5773502691896258 } , d: -0.5773502691896258 } ) ;

			plane = Plane3D.fromThreePoints(
				new Vector3D( 1 , 0 , 0 ) ,
				new Vector3D( 0 , 0 , 1 ) ,
				new Vector3D( 0 , 1 , 0 )
			) ;
			expect( plane ).to.be.like( { normal: { x: -0.5773502691896258 , y: -0.5773502691896258 , z: -0.5773502691896258 } , d: 0.5773502691896258 } ) ;
		} ) ;

		it( "intersection of plane and line" , () => {
			var plane , line , point ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = new BoundVector3D( 0 , 0 , 5 , 0 , 0 , 3 ) ;
			point = plane.lineIntersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.be.like( { x: 0 , y: 0 , z: 0 } ) ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = new BoundVector3D( 0 , 0 , 2 , 1 , 0 , 2 ) ;
			point = plane.lineIntersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.be.like( { x: -1 , y: 0 , z: 0 } ) ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = new BoundVector3D( 0 , 0 , 2 , 1 , 4 , 2 ) ;
			point = plane.lineIntersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.be.like( { x: -1 , y: -4 , z: 0 } ) ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			line = new BoundVector3D( 0 , 0 , 1 , 1 , 4 , 2 ) ;
			point = plane.lineIntersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.be.like( { x: -0.5 , y: -2 , z: 0 } ) ;

			plane = Plane3D.fromNormal( 5 , -18 , 0 , 0 , 0 , 4 ) ;
			line = new BoundVector3D( 0 , 0 , 1 , 1 , 4 , 2 ) ;
			point = plane.lineIntersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.be.like( { x: -0.5 , y: -2 , z: 0 } ) ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 0 , 2 ) ;
			line = new BoundVector3D( 0 , 0 , 2 , 1 , 0 , 0 ) ;
			point = plane.lineIntersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.be.like( { x: -4 , y: 0 , z: 2 } ) ;

			plane = Plane3D.fromNormal( -3 , 5 , 0 , 1 , 0 , 2 ) ;
			line = new BoundVector3D( 0 , 0 , 2 , 1 , 0 , 0 ) ;
			point = plane.lineIntersection( line ) ;
			expect( point ).to.be.an( Vector3D ) ;
			expect( point ).to.be.like( { x: -7 , y: 0 , z: 2 } ) ;
		} ) ;

		it( "projection of a point on a plane" , () => {
			var plane , point , projected ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.be.like( { x: 0 , y: 0 , z: 0 } ) ;

			plane = Plane3D.fromNormal( 777 , 111 , 0 , 0 , 0 , 4 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.be.like( { x: 0 , y: 0 , z: 0 } ) ;

			plane = Plane3D.fromNormal( 0 , 0 , -4 , 0 , 0 , 4 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.be.like( { x: 0 , y: 0 , z: -4 } ) ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 0 , 1 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			projected = plane.pointProjection( point ) ;
			expect( projected ).to.be.an( Vector3D ) ;
			expect( projected ).to.be.like( { x: -2.5 , y: 0 , z: 2.5 } ) ;
		} ) ;

		it( "distance of a point to a plane" , () => {
			var plane , point ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			expect( plane.pointDistance( point ) ).to.be( 5 ) ;

			plane = Plane3D.fromNormal( 777 , 111 , 0 , 0 , 0 , 4 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			expect( plane.pointDistance( point ) ).to.be( 5 ) ;

			plane = Plane3D.fromNormal( 0 , 0 , -4 , 0 , 0 , 4 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			expect( plane.pointDistance( point ) ).to.be( 9 ) ;

			plane = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 0 , 1 ) ;
			point = new Vector3D( 0 , 0 , 5 ) ;
			expectCirca( plane.pointDistance( point ) , Math.hypot( 2.5 , 2.5 ) ) ;
		} ) ;

		it( "intersection of 2 planes" , () => {
			var plane1 , plane2 , line ;

			// x
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: 0 , y: 0 , z: 0 } , vector: { x: -1 , y: 0 , z: 0 } } ) ;

			plane1 = Plane3D.fromNormal( -10 , 2 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 14 , 0 , -4 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: 0 , y: 0 , z: 0 } , vector: { x: -1 , y: 0 , z: 0 } } ) ;

			plane1 = Plane3D.fromNormal( 0 , 0 , 3 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , -1 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: 0 , y: -1 , z: 3 } , vector: { x: -1 , y: 0 , z: 0 } } ) ;

			// y
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 4 , 0 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: 0 , y: 0 , z: 0 } , vector: { x: 0 , y: 1 , z: 0 } } ) ;

			plane1 = Plane3D.fromNormal( 0 , 0 , 18 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( -21 , 0 , 0 , 4 , 0 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: -21 , y: 0 , z: 18 } , vector: { x: 0 , y: 1 , z: 0 } } ) ;

			// z
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 4 , 0 , 0 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: 0 , y: 0 , z: 0 } , vector: { x: 0 , y: 0 , z: 1 } } ) ;

			plane1 = Plane3D.fromNormal( 2 , 0 , 0 , 4 , 0 , 0 ) ;
			plane2 = Plane3D.fromNormal( 0 , -1 , 0 , 0 , 4 , 0 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: 2 , y: -1 , z: 0 } , vector: { x: 0 , y: 0 , z: 1 } } ) ;

			// non-axial
			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 1 , 0 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 1 , 1 , 1 ) ;
			expect( plane1.planeIntersection( plane2 ) ).to.be.like( { position: { x: 0 , y: 0 , z: 0 } , vector: { x: 0.408248290463863 , y: -0.408248290463863 , z: 0 } } ) ;

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
			//expect( line ).to.be.like( { position: { x: 2, y: 0, z: 2 }, vector: { x: 1, y: -1, z: 0 } } ) ;
			expect( line.vector ).to.be.like( { x: 0.408248290463863 , y: -0.408248290463863 , z: 0 } ) ;
			expect( plane1.testVector( line.position ) ).to.be( 0 ) ;
			expect( plane2.testVector( line.position ) ).to.be( 0 ) ;
		} ) ;

		it( "intersection of 3 planes" , () => {
			var plane1 , plane2 , plane3 , point ;

			plane1 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 4 ) ;
			plane2 = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 4 , 0 ) ;
			plane3 = Plane3D.fromNormal( 0 , 0 , 0 , -1 , 4 , 0 ) ;
			expect( plane1.threePlanesIntersection( plane2 , plane3 ) ).to.be.like( { x: 0 , y: 0 , z: 0 } ) ;

			// It's easier to test with the same position for all 3 bound vectors.
			// It may looks like cheating but since those points does not exist inside a Plane3D instance (converted into .d),
			// it's perfectly legit.
			plane1 = Plane3D.fromNormal( 3 , 4 , 5 , 5 , 2 , 1 ) ;
			plane2 = Plane3D.fromNormal( 3 , 4 , 5 , 0 , 2 , -4 ) ;
			plane3 = Plane3D.fromNormal( 3 , 4 , 5 , 18 , -3 , 8 ) ;
			point = plane1.threePlanesIntersection( plane2 , plane3 ) ;
			expectCirca( point.x , 3 ) ;
			expectCirca( point.y , 4 ) ;
			expectCirca( point.z , 5 ) ;
		} ) ;
	} ) ;



	describe( "Circle2D" , () => {

		it( "projection of a point on a circle" , () => {
			var circle , point , projected ;

			circle = new Circle2D( 0 , 0 , 2 ) ;
			point = new Vector2D( 0 , 1 ) ;
			projected = circle.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector2D ) ;
			expect( projected ).to.be.like( { x: 0 , y: 2 } ) ;

			circle = new Circle2D( 0 , 0 , 2 ) ;
			point = new Vector2D( 1 , 1 ) ;
			projected = circle.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector2D ) ;
			expectCirca( projected.x , Math.sqrt( 2 ) ) ;
			expectCirca( projected.y , Math.sqrt( 2 ) ) ;

			circle = new Circle2D( 0 , 0 , 2 ) ;
			point = new Vector2D( 10 , 10 ) ;
			projected = circle.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector2D ) ;
			expectCirca( projected.x , Math.sqrt( 2 ) ) ;
			expectCirca( projected.y , Math.sqrt( 2 ) ) ;
		} ) ;

		it( "intersection of circle and a line" , () => {
			var circle , line , points ;

			circle = new Circle2D( 0 , 0 , 2 ) ;
			line = new BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.be.like( [ { x: Math.sqrt( 3 ) , y: 1 } , { x: -Math.sqrt( 3 ) , y: 1 } ] ) ;

			circle = new Circle2D( 0 , 1 , 2 ) ;
			line = new BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.be.like( [ { x: 2 , y: 1 } , { x: -2 , y: 1 } ] ) ;

			circle = new Circle2D( 0 , -1 , 2 ) ;
			line = new BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.be.like( [ { x: 0 , y: 1 } ] ) ;

			circle = new Circle2D( 0 , -1.1 , 2 ) ;
			line = new BoundVector2D( 0 , 1 , 1 , 0 ) ;
			points = circle.lineIntersection( line ) ;
			expect( points ).to.be( null ) ;

			circle = new Circle2D( 1 , 1 , 2 ) ;
			line = new BoundVector2D( 2 , 2 , 1 , -1 ) ;
			points = circle.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.be.like( [ { x: 3 , y: 1 } , { x: 1 , y: 3 } ] ) ;
		} ) ;
	} ) ;



	describe( "Sphere3D" , () => {

		it( "projection of a point on a sphere" , () => {
			var sphere , point , projected ;

			sphere = new Sphere3D( 0 , 0 , 0 , 2 ) ;
			point = new Vector3D( 0 , 1 , 0 ) ;
			projected = sphere.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector3D ) ;
			expect( projected ).to.be.like( { x: 0 , y: 2 , z: 0 } ) ;

			sphere = new Sphere3D( 0 , 0 , 0 , 3 ) ;
			point = new Vector3D( 1 , 1 , 1 ) ;
			projected = sphere.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector3D ) ;
			expectCirca( projected.x , Math.sqrt( 3 ) ) ;
			expectCirca( projected.y , Math.sqrt( 3 ) ) ;
			expectCirca( projected.z , Math.sqrt( 3 ) ) ;

			sphere = new Sphere3D( 0 , 0 , 0 , 3 ) ;
			point = new Vector3D( 10 , 10 , 10 ) ;
			projected = sphere.pointProjection( point ) ;
			expect( projected ).to.be.a( Vector3D ) ;
			expectCirca( projected.x , Math.sqrt( 3 ) ) ;
			expectCirca( projected.y , Math.sqrt( 3 ) ) ;
			expectCirca( projected.z , Math.sqrt( 3 ) ) ;
		} ) ;

		it( "intersection of sphere and a line" , () => {
			var sphere , line , points ;

			sphere = new Sphere3D( 0 , 0 , 0 , 2 ) ;
			line = new BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.be.like( [ { x: Math.sqrt( 3 ) , y: 1 , z: 0 } , { x: -Math.sqrt( 3 ) , y: 1 , z: 0 } ] ) ;

			sphere = new Sphere3D( 0 , 1 , 0 , 2 ) ;
			line = new BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.be.like( [ { x: 2 , y: 1 , z: 0 } , { x: -2 , y: 1 , z: 0 } ] ) ;

			sphere = new Sphere3D( 0 , -1 , 0 , 2 ) ;
			line = new BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expect( points ).to.be.like( [ { x: 0 , y: 1 , z: 0 } ] ) ;

			sphere = new Sphere3D( 0 , -1.1 , 0 , 2 ) ;
			line = new BoundVector3D( 0 , 1 , 0 , 1 , 0 , 0 ) ;
			points = sphere.lineIntersection( line ) ;
			expect( points ).to.be( null ) ;

			sphere = new Sphere3D( 0 , 0 , 0 , 3 ) ;
			line = new BoundVector3D( 1 , 1 , 1 , 1 , 1 , 1 ) ;
			points = sphere.lineIntersection( line ) ;
			expect( points ).to.be.an( Array ) ;
			expectCirca( points[0].x , Math.sqrt( 3 ) ) ;
			expectCirca( points[0].y , Math.sqrt( 3 ) ) ;
			expectCirca( points[0].z , Math.sqrt( 3 ) ) ;
			expectCirca( points[1].x , -Math.sqrt( 3 ) ) ;
			expectCirca( points[1].y , -Math.sqrt( 3 ) ) ;
			expectCirca( points[1].z , -Math.sqrt( 3 ) ) ;
		} ) ;

		it( "intersection of sphere and a plane" , () => {
			var sphere , plane , circle ;

			sphere = new Sphere3D( 0 , 0 , 0 , 2 ) ;
			plane = Plane3D.fromNormal( 0 , 0 , 1 , 0 , 0 , 1 ) ;
			circle = sphere.planeIntersection( plane ) ;
			expect( circle ).to.be.a( Circle3D ) ;
			expect( circle ).to.be.like( { center: { x: 0 , y: 0 , z: 1 } , r: 1.7320508075688772 , planeNormal: { x: 0 , y: 0 , z: 1 } } ) ;

			sphere = new Sphere3D( 0 , 0 , 0 , 2 ) ;
			plane = Plane3D.fromNormal( 0 , 0 , 1 , 1 , 0 , 1 ) ;
			circle = sphere.planeIntersection( plane ) ;
			expect( circle ).to.be.like( { center: { x: 0.5 , y: 0 , z: 0.5 } , r: 1.8708286933869707 , planeNormal: { x: 0.7071067811865475 , y: 0 , z: 0.7071067811865475 } } ) ;

			sphere = new Sphere3D( 0 , 0 , 0 , 2 ) ;
			plane = Plane3D.fromNormal( 0 , 5 , 5 , 1 , 0 , 1 ) ;
			circle = sphere.planeIntersection( plane ) ;
			expect( circle ).to.be( null ) ;
		} ) ;
	} ) ;



	describe( "Circle3D" , () => {

		it( "projection of a point on a 3D circle" , () => {
			var circle , point ;

			circle = new Circle3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			point = new Vector3D( 0 , 0 , 0 ) ;
			expect( circle.pointProjection( point ).isUndefined() ).to.be( true ) ;

			circle = new Circle3D( 0 , 0 , 0 , 0 , 0 , 5 , 1 ) ;
			point = new Vector3D( 5 , 0 , 0 ) ;
			expect( circle.pointProjection( point ) ).to.be.like( { x: 1 , y: 0 , z: 0 } ) ;

			circle = new Circle3D( 3 , 0 , 0 , 0 , 0 , 5 , 1 ) ;
			point = new Vector3D( 5 , 0 , 0 ) ;
			expect( circle.pointProjection( point ) ).to.be.like( { x: 4 , y: 0 , z: 0 } ) ;

			circle = new Circle3D( 0 , 0 , 2 , 1 , 0 , 1 , 2 * Math.sqrt( 2 ) ) ;
			point = new Vector3D( 3 , 0 , 1 ) ;
			expect( circle.pointProjection( point ) ).to.be.like( { x: 2 , y: 0 , z: 0 } ) ;

			circle = new Circle3D( 0 , 0 , 2 , 1 , 0 , 1 , 1 ) ;
			point = new Vector3D( 3 , 0 , 1 ) ;
			expect( circle.pointProjection( point ) ).to.be.like( { x: 0.7071067811865475 , y: 0 , z: 1.2928932188134525 } ) ;
		} ) ;
	} ) ;



	describe( "InfiniteCylinder3D" , () => {

		it( "projection of a point on an infinite cylinder" , () => {
			var cylinder , point ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			point = new Vector3D( 0 , 0 , 0 ) ;
			expect( cylinder.pointProjection( point ).isUndefined() ).to.be( true ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 5 , 1 ) ;
			point = new Vector3D( 5 , 0 , 0 ) ;
			expect( cylinder.pointProjection( point ) ).to.be.like( { x: 1 , y: 0 , z: 0 } ) ;

			cylinder = new InfiniteCylinder3D( 3 , 0 , 0 , 0 , 0 , 5 , 1 ) ;
			point = new Vector3D( 5 , 0 , 0 ) ;
			expect( cylinder.pointProjection( point ) ).to.be.like( { x: 4 , y: 0 , z: 0 } ) ;

			cylinder = new InfiniteCylinder3D( 3 , 0 , 0 , 0 , 0 , 5 , 1 ) ;
			point = new Vector3D( 5 , 0 , -7 ) ;
			expect( cylinder.pointProjection( point ) ).to.be.like( { x: 4 , y: 0 , z: -7 } ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 2 , 1 , 0 , 1 , Math.SQRT2 ) ;
			point = new Vector3D( 3 , 0 , 1 ) ;
			expect( cylinder.pointProjection( point ) ).to.be.like( { x: 2 , y: 0 , z: 2 } ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 2 , 1 , 0 , 1 , 2 * Math.SQRT2 ) ;
			point = new Vector3D( 3 , 0 , 1 ) ;
			expect( cylinder.pointProjection( point ) ).to.be.like( { x: 3 , y: 0 , z: 1 } ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 2 , 1 , 0 , 1 , 1 ) ;
			point = new Vector3D( 3 , 0 , 1 ) ;
			expect( cylinder.pointProjection( point ) ).to.be.like( { x: 1.7071067811865475 , y: 0 , z: 2.2928932188134525 } ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 2 , 1 , 0 , 1 , 2 * Math.SQRT2 ) ;
			point = new Vector3D( 3 , 1 , 1 ) ;
			expect( cylinder.pointProjection( point ) ).to.be.like( { x: 2.885618083164127 , y: 0.9428090415820635 , z: 1.114381916835873 } ) ;
		} ) ;

		it( "line intersection with an infinite cylinder" , () => {
			var cylinder , line , projected ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			line = new BoundVector3D( 0 , 0 , 0 , 0 , 0 , 1 ) ;
			expect( cylinder.lineIntersection( line ) ).to.be( null ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			line = new BoundVector3D( 0 , 0 , 0 , 1 , 0 , 0 ) ;
			expect( cylinder.lineIntersection( line ) ).to.be.like( [ { x: 1 , y: 0 , z: 0 } , { x: -1 , y: 0 , z: 0 } ] ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			line = new BoundVector3D( 0 , 0 , 10 , 1 , 0 , 0 ) ;
			expect( cylinder.lineIntersection( line ) ).to.be.like( [ { x: 1 , y: 0 , z: 10 } , { x: -1 , y: 0 , z: 10 } ] ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			line = new BoundVector3D( 0 , 0 , 0 , 1 , 1 , 1 ) ;
			expect( cylinder.lineIntersection( line ) ).to.be.like( [
				{ x: Math.SQRT1_2 , y: Math.SQRT1_2 , z: Math.SQRT1_2 } ,
				{ x: -Math.SQRT1_2 , y: -Math.SQRT1_2 , z: -Math.SQRT1_2 }
			] ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , -1 , 0 , 1 , 1 ) ;
			line = new BoundVector3D( 0 , 0 , 0 , 1 , 1 , 1 ) ;
			expect( cylinder.lineIntersection( line ) ).to.be.like( [
				{ x: 0.5773502691896258 , y: 0.5773502691896258 , z: 0.5773502691896258 } ,
				{ x: -0.5773502691896258 , y: -0.5773502691896258 , z: -0.5773502691896258 }
			] ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , -1 , 0 , 1 , 1 ) ;
			line = new BoundVector3D( 0 , 0 , 0 , 0 , 0 , 1 ) ;
			expect( cylinder.lineIntersection( line ) ).to.be.like( [
				{ x: 0 , y: 0 , z: Math.SQRT2 } ,
				{ x: 0 , y: 0 , z: -Math.SQRT2 }
			] ) ;

			cylinder = new InfiniteCylinder3D( 0.5 , 0.5 , 0 , -1 , 0 , 1 , 1 ) ;
			line = new BoundVector3D( 0 , 0 , 0 , 0 , 0 , 1 ) ;
			expect( cylinder.lineIntersection( line ) ).to.be.like( [
				{ x: 0 , y: 0 , z: 1.7247448713915892 } ,
				{ x: 0 , y: 0 , z: -0.7247448713915893 }
			] ) ;
		} ) ;

		it( "plane intersection with an infinite cylinder" , () => {
			var cylinder , plane , intersection ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			plane = Plane3D.fromNormal( 0 , 0 , 0 , 0 , 0 , 1 ) ;
			intersection = cylinder.planeIntersection( plane ) ;
			expect( intersection ).to.be.a( Circle3D ) ;
			expect( intersection ).to.be.like( { center: { x: 0 , y: 0 , z: 0 } , r: 1 , planeNormal: { x: 0 , y: 0 , z: 1 } } ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			plane = Plane3D.fromNormal( 0 , 0 , -20 , 0 , 0 , 1 ) ;
			intersection = cylinder.planeIntersection( plane ) ;
			expect( intersection ).to.be.a( Circle3D ) ;
			expect( intersection ).to.be.like( { center: { x: 0 , y: 0 , z: -20 } , r: 1 , planeNormal: { x: 0 , y: 0 , z: 1 } } ) ;

			cylinder = new InfiniteCylinder3D( 0 , 0 , 0 , 0 , 0 , 1 , 1 ) ;
			plane = Plane3D.fromNormal( 0 , 0 , 2 , 1 , 0 , 1 ) ;
			intersection = cylinder.planeIntersection( plane ) ;
			//console.log( intersection ) ;
			expect( intersection ).to.be.a( Ellipse3D ) ;
			expectCirca( intersection.center.x , 0 ) ;
			expectCirca( intersection.center.y , 0 ) ;
			expectCirca( intersection.center.z , 2 ) ;
			expectCirca( intersection.c , 1 ) ;
			expectCirca( intersection.e , Math.SQRT1_2 ) ;
			expectCirca( intersection.semiMajor , Math.SQRT2 ) ;
			expectCirca( intersection.semiMinor , 1 ) ;
			expectCirca( intersection.planeNormal.x , Math.SQRT1_2 ) ;
			expectCirca( intersection.planeNormal.y , 0 ) ;
			expectCirca( intersection.planeNormal.z , Math.SQRT1_2 ) ;
			expect( intersection.focus1 ).to.be.like( { x: -0.7071067811865476 , y: 0 , z: 2.7071067811865475 } ) ;
			expect( intersection.focus2 ).to.be.like( { x: 0.7071067811865476 , y: 0 , z: 1.2928932188134525 } ) ;
		} ) ;
	} ) ;



	describe( "Ellipse2D" , () => {

		it( "Focal points, eccentricity" , () => {
			var ellipse , focalPoints ;

			ellipse = new Ellipse2D( 0 , 0 , 1 , 0 , 1 , 0.5 ) ;
			//expect( ellipse.getFocalPoints() ).to.be.like( [ { x: 0.8660254037844386 , y: 0 } , { x: -0.8660254037844386 , y: 0 } ] ) ;
			expect( ellipse.e ).to.be( Math.sqrt( 0.75 ) ) ;
			expect( ellipse.focus1 ).to.be.like( { x: Math.sqrt( 0.75 ) , y: 0 } ) ;
			expect( ellipse.focus2 ).to.be.like( { x: -Math.sqrt( 0.75 ) , y: 0 } ) ;

			ellipse = new Ellipse2D( 2 , 2 , 1 , 0 , 1 , 0.5 ) ;
			expect( ellipse.e ).to.be( Math.sqrt( 0.75 ) ) ;
			expect( ellipse.focus1 ).to.be.like( { x: 2 + Math.sqrt( 0.75 ) , y: 2 } ) ;
			expect( ellipse.focus2 ).to.be.like( { x: 2 - Math.sqrt( 0.75 ) , y: 2 } ) ;

			ellipse = new Ellipse2D( 2 , 2 , 1 , 1 , 1 , 0.5 ) ;
			expect( ellipse.e ).to.be( Math.sqrt( 0.75 ) ) ;
			expect( ellipse.focus1 ).to.be.like( { x: 2 + Math.sqrt( 0.75 ) * Math.SQRT1_2 , y: 2 + Math.sqrt( 0.75 ) * Math.SQRT1_2 } ) ;
			expectCirca( ellipse.focus2.x , 2 - Math.sqrt( 0.75 ) * Math.SQRT1_2 ) ;
			expectCirca( ellipse.focus2.y , 2 - Math.sqrt( 0.75 ) * Math.SQRT1_2 ) ;
		} ) ;

		it( "test if a point is on/inside the ellipse" , () => {
			var ellipse ;

			ellipse = new Ellipse2D( 0 , 0 , 1 , 0 , 1 , 0.5 ) ;
			expectCirca( ellipse.test( 0 , 0 ) , -0.2679491924311228 ) ;
			expectCirca( ellipse.test( 1 , 0 ) , 0 ) ;
		} ) ;
	} ) ;



	describe( "Ellipse3D" , () => {

		it( "point projection" , () => {
			var ellipse , point , projected ;

			ellipse = new Ellipse3D(
				0 , 0 , 1 ,
				1 , 0 , 1 ,
				1 , 0 , -1 ,
				1 , 0.5
			) ;
			point = new Vector3D( 1 , 0 , 0 ) ;
			projected = ellipse.pointProjection( point ) ;
			expectCirca( projected.x , Math.SQRT1_2 ) ;
			expectCirca( projected.y , 0 ) ;
			expectCirca( projected.z , 1 - Math.SQRT1_2 ) ;

			ellipse = new Ellipse3D(
				0 , 0 , 1 ,
				1 , 0 , 1 ,
				1 , 0 , -1 ,
				1 , 0.5
			) ;
			point = new Vector3D( 1 , 1 , 0 ) ;
			projected = ellipse.pointProjection( point ) ;
			expectCirca( projected.x , 0.5958015781628886 ) ;
			expectCirca( projected.y , 0.2692772543853373 ) ;
			expectCirca( projected.z , 0.4041984218371114 ) ;
		} ) ;
	} ) ;



	describe( "Epsilon" , () => {

		it( "Vector2D collinearity epsilon" , () => {
			expect( new Vector2D( 0.3 , 0.4 ).isCollinearTo( new Vector2D( 0.3 , 0.4 ) ) ).to.be( true ) ;
			expect( new Vector2D( 0.3 , 0.4 ).isCollinearTo( new Vector2D( 0.3 + Number.EPSILON , 0.4 ) ) ).to.be( true ) ;
			expect( new Vector2D( 0.3 , 0.4 ).isCollinearTo( new Vector2D( 0.3 + Number.EPSILON , 0.4 + Number.EPSILON ) ) ).to.be( true ) ;
			expect( new Vector2D( 0.3 , 0.4 ).isCollinearTo( new Vector2D( 0.3 + Number.EPSILON , 0.4 - Number.EPSILON ) ) ).to.be( true ) ;
		} ) ;

		it( "Vector3D collinearity epsilon" , () => {
			expect( new Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( new Vector3D( 0.3 , 0.4 , 0.5 ) ) ).to.be( true ) ;
			expect( new Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( new Vector3D( 0.3 + Number.EPSILON , 0.4 , 0.5 ) ) ).to.be( true ) ;
			expect( new Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( new Vector3D( 0.3 + Number.EPSILON , 0.4 + Number.EPSILON , 0.5 + Number.EPSILON ) ) ).to.be( true ) ;
			expect( new Vector3D( 0.3 , 0.4 , 0.5 ).isCollinearTo( new Vector3D( 0.3 + Number.EPSILON , 0.4 - Number.EPSILON , 0.5 ) ) ).to.be( true ) ;
		} ) ;
	} ) ;

} ) ;


