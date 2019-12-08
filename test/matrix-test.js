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



const math = require( '..' ) ;
const Matrix = math.Matrix ;



describe( "Matrix" , () => {

	it( "constructor" , () => {
		expect( new Matrix( 3 , 1 , [ 1 , 0 , 0 ] ) ).to.be.like( { w: 1 , h: 3 , a: [ 1 , 0 , 0 ] } ) ;
		expect( new Matrix( 2 , 2 , [ 1 , 0 , 0 , 1 ] ) ).to.be.like( { w: 2 , h: 2 , a: [ 1 , 0 , 0 , 1 ] } ) ;
		expect( new Matrix( 2 , 2 , [ 1 , 2 , 3 , 4 ] ) ).to.be.like( { w: 2 , h: 2 , a: [ 1 , 2 , 3 , 4 ] } ) ;
	} ) ;

	it( "identity constructor" , () => {
		expect( Matrix.identity( 2 , 2 ) ).to.be.like( { w: 2 , h: 2 , a: [ 1 , 0 , 0 , 1 ] } ) ;
		expect( Matrix.identity( 3 , 3 ) ).to.be.like( { w: 3 , h: 3 , a: [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		] } ) ;
	} ) ;

	it( "get/set" , () => {
		var m = new Matrix( 2 , 2 , [
			1, 2,
			3, 4
		] ) ;
		
		expect( m ).to.be.like( { w: 2 , h: 2 , a: [ 1 , 2 , 3 , 4 ] } ) ;
		expect( m.get( 1 , 1 ) ).to.be( 1 ) ;
		expect( m.get( 2 , 1 ) ).to.be( 3 ) ;
		expect( m.get( 1 , 2 ) ).to.be( 2 ) ;
		expect( m.get( 2 , 2 ) ).to.be( 4 ) ;

		m.set( 1 , 2 , 7 ) ;
		expect( m.get( 1 , 2 ) ).to.be( 7 ) ;
	} ) ;

	it( "transpose" , () => {
		var m = new Matrix( 2 , 3 , [
			1, 2, 3,
			4, 5, 6
		] ) ;
		
		var t = m.transpose() ;
		
		expect( m ).to.be.like( { w: 3 , h: 2 , a: [
			1, 2, 3 ,
			4, 5, 6
		] } ) ;
		
		expect( t ).to.be.like( { w: 2 , h: 3 , a: [
			1, 4,
			2, 5,
			3, 6
		] } ) ;
	} ) ;

	it( "2x2 determinant" , () => {
		var m ;
		
		m = new Matrix( 2 , 2 , [
			1, 2,
			3, 4
		] ) ;
		
		expect( m.determinant() ).to.be( -2 ) ;
	} ) ;

	it( "3x3 determinant" , () => {
		var m ;
		
		m = new Matrix( 3 , 3 , [
			1, 2, 3,
			4, 5, 6,
			7, 8, 9
		] ) ;
		
		expect( m.determinant() ).to.be( 0 ) ;

		m = new Matrix( 3 , 3 , [
			10, 2, 3,
			4, 5, 6,
			7, 8, 9
		] ) ;
		
		expect( m.determinant() ).to.be( -27 ) ;

		m = new Matrix( 3 , 3 , [
			10, 2, 3,
			4, 5, -6,
			7, 8, 9
		] ) ;
		
		expect( m.determinant() ).to.be( 765 ) ;
	} ) ;

	it( "4x4 determinant" , () => {
		var m ;
		
		m = new Matrix( 4 , 4 , [
			1, 2, 3, 4,
			5, 6, 7, 8,
			9, 10, 11, 12,
			13, 14, 15, 16
		] ) ;
		
		expect( m.determinant() ).to.be( 0 ) ;
		
		m = new Matrix( 4 , 4 , [
			1, 2, -3, 4,
			-5, 6, 7, 8,
			9, 10, 11, 12,
			13, 14, 15, 16
		] ) ;
		
		expect( m.determinant() ).to.be( -480 ) ;
		
		m = new Matrix( 4 , 4 , [
			10, 2, -3, 4,
			-5, 6, 7, 8,
			9, 10, 11, 12,
			13, 14, 15, 16
		] ) ;
		
		expect( m.determinant() ).to.be( -480 ) ;
		
		m = new Matrix( 4 , 4 , [
			10, 2, -3, 4,
			-5, 6, 7, 8,
			9, 10, 1.1, 12,
			13, 14, 15, 16
		] ) ;
		
		expect( m.determinant() ).to.be.around( 3321.6 ) ;
	} ) ;

	it( "add two matrices" , () => {
		expect( ( new Matrix( 2 , 2 , [ 1 , 2 , 3 , 4 ] ) ).add( new Matrix( 2 , 2 , [ 1 , 0 , 0 , 1 ] ) ) ).to.be.like( { w: 2 , h: 2 , a: [ 2 , 2 , 3 , 5 ] } ) ;
	} ) ;

	it( "multiply by scalar" , () => {
		var a , b ;
		
		a = new Matrix( 2 , 1 , [
			3,
			2
		] ) ;

		expect( a.multiplyByScalar( 3 ) ).to.be.like( { w: 1 , h: 2 , a: [
			9,
			6
		] } ) ;

		// Check autodetect
		expect( a.multiply( 3 ) ).to.be.like( { w: 1 , h: 2 , a: [
			9,
			6
		] } ) ;
	} ) ;
		
	it( "multiply two matrices" , () => {
		var a , b ;
		
		a = new Matrix( 2 , 1 , [
			3,
			2
		] ) ;

		b = new Matrix( 1 , 2 , [ 4, 5 ] ) ;
		
		expect( a.multiplyByMatrix( b ) ).to.be.like( { w: 2 , h: 2 , a: [
			12, 15,
			8, 10
		] } ) ;
		
		// Check autodetect
		expect( a.multiply( b ) ).to.be.like( { w: 2 , h: 2 , a: [
			12, 15,
			8, 10
		] } ) ;
		
		a = new Matrix( 3 , 1 , [
			3,
			2,
			1
		] ) ;

		b = new Matrix( 1 , 3 , [ 6, 7, 8 ] ) ;
		
		expect( a.multiplyByMatrix( b ) ).to.be.like( { w: 3 , h: 3 , a: [
			18, 21, 24,
			12, 14, 16,
			6, 7, 8
		] } ) ;
	} ) ;
} ) ;

