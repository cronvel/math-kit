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



describe( "Basic function" , () => {

	it( "math.avg()" , () => {
		expect( math.avg( 2 ) ).to.be( 2 ) ;
		expect( math.avg( 2 , 3 ) ).to.be( 2.5 ) ;
		expect( math.avg( 2 , 3 , 4 , 5 ) ).to.be( 3.5 ) ;
		expect( math.avg( 10 , 14 , 19 , 21 ) ).to.be( 16 ) ;
	} ) ;

	it( "math.eround()" , () => {
		expect( math.eround( 2.0001 ) ).to.be( 2.0001 ) ;
		expect( math.eround( 2.0000000000001 ) ).to.be( 2 ) ;
	} ) ;

	it( "math.round()" , () => {
		expect( math.round( 2.15 ) ).to.be( 2 ) ;
		expect( math.round( 2.15 , 0.1 ) ).to.be( 2.2 ) ;
		expect( math.round( 2.15 , 0.2 ) ).to.be( 2.2 ) ;
		expect( math.round( 2.15 , 0.05 ) ).to.be( 2.15 ) ;
	} ) ;
} ) ;



describe( "math.isOrdered()" , () => {

	it( "test with values" , () => {
		expect( math.isOrdered( 2.1 ) ).to.be.ok() ;
		expect( math.isOrdered( 2.1 , 2.5 ) ).to.be.ok() ;
		expect( math.isOrdered( 2.7 , 2.5 ) ).not.to.be.ok() ;
		expect( math.isOrdered( 2.1 , 2.5 , 3.3 ) ).to.be.ok() ;
		expect( math.isOrdered( 2.1 , 2.5 , 3.3 , 4.8 ) ).to.be.ok() ;
		expect( math.isOrdered( 2.1 , 2.5 , 2.5 , 4.8 ) ).to.be.ok() ;
		expect( math.isOrdered( 2.1 , 2.5 , 3.3 , 4.8 , -1 ) ).not.to.be.ok() ;
		expect( math.isOrdered( 2.1 , 2.05 , 3.3 ) ).not.to.be.ok() ;
		expect( math.isOrdered( 2.1 , 3.35 , 3.3 ) ).not.to.be.ok() ;
	} ) ;

	it( "test with arrays" , () => {
		expect( math.isOrdered( [ 2.1 ] , [ 2.5 ] , [ 3.3 ] ) ).to.be.ok() ;
		expect( math.isOrdered( [ 2 , 1 ] , [ 2 , 5 ] , [ 3 , 3 ] ) ).to.be.ok() ;
		expect( math.isOrdered( [ 2 , 1 ] , [ 3 , 0 ] , [ 3 , 3 ] ) ).to.be.ok() ;
		expect( math.isOrdered( [ 2 , 1 ] , [ 2 , 0.5 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
		expect( math.isOrdered( [ 2 , 1 ] , [ 1 , 9 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
		expect( math.isOrdered( [ 2 , 1 ] , [ 3 , 4 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
	} ) ;

	it( "test with arrays of different length" , () => {
		expect( math.isOrdered( [ 2 , 0 ] , [ 2 ] , [ 3 , 3 ] ) ).to.be.ok() ;
		expect( math.isOrdered( [ 2 ] , [ 2 , 0 ] , [ 3 , 3 ] ) ).to.be.ok() ;
		expect( math.isOrdered( [ 2 , 1 ] , [ 2 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
		expect( math.isOrdered( [ 1 , 9 ] , [ 2 ] , [ 3 , 3 ] ) ).to.be.ok() ;
		expect( math.isOrdered( [ 2 , 1 ] , [ 4 ] , [ 4 , 3 ] ) ).to.be.ok() ;
		expect( math.isOrdered( [ 1 , 9 ] , [ 4 ] , [ 3 , 9 ] ) ).not.to.be.ok() ;
	} ) ;
} ) ;



describe( "math.isGreater()" , () => {

	it( "test with values" , () => {
		expect( math.isGreater( 2.1 , 2.5 ) ).not.to.be.ok() ;
		expect( math.isGreater( 2.7 , 2.5 ) ).to.be.ok() ;
		expect( math.isGreater( 2.7 , 2.7 ) ).not.to.be.ok() ;
		expect( math.isGreaterOrEquals( 2.7 , 2.7 ) ).to.be.ok() ;
	} ) ;

	it( "test with arrays" , () => {
		expect( math.isGreater( [ 2.1 ] , [ 3.3 ] ) ).not.to.be.ok() ;
		expect( math.isGreater( [ 4.1 ] , [ 3.3 ] ) ).to.be.ok() ;
		expect( math.isGreater( [ 2 , 1 ] , [ 2 , 5 ] ) ).not.to.be.ok() ;
		expect( math.isGreater( [ 2 , 5 ] , [ 2 , 1 ] ) ).to.be.ok() ;
		expect( math.isGreater( [ 2 , 5 ] , [ 2 , 5 ] ) ).not.to.be.ok() ;
		expect( math.isGreaterOrEquals( [ 2 , 5 ] , [ 2 , 5 ] ) ).to.be.ok() ;
	} ) ;

	it( "test with arrays of different length" , () => {
		expect( math.isGreater( [ 2 , 1 ] , [ 2 , 5 , 7 , 8 ] ) ).not.to.be.ok() ;
		expect( math.isGreater( [ 2 , 5 , 8 ] , [ 2 , 1 ] ) ).to.be.ok() ;
		expect( math.isGreater( [ 2 , 5 , 1 ] , [ 2 , 5 ] ) ).to.be.ok() ;
		expect( math.isGreater( [ 2 , 5 ] , [ 2 , 5 , 1 ] ) ).not.to.be.ok() ;
		expect( math.isGreater( [ 2 , 5 ] , [ 2 , 5 ] ) ).not.to.be.ok() ;
		expect( math.isGreaterOrEquals( [ 2 , 5 ] , [ 2 , 5 ] ) ).to.be.ok() ;
		expect( math.isGreaterOrEquals( [ 2 , 5 , 0 ] , [ 2 , 5 ] ) ).to.be.ok() ;
		expect( math.isGreaterOrEquals( [ 2 , 5 ] , [ 2 , 5 , 0 ] ) ).to.be.ok() ;
	} ) ;
} ) ;



describe( "math.Fn()" , () => {

	it( "simple fn 1" , () => {
		var fn = new math.Fn( [
			{ x: 0 , fx: 0 } ,
			{ x: 1 , fx: 1 } ,
			{ x: 2 , fx: 0 }
		] ) ;

		//console.log( fn ) ;

		// Out of bounds
		expect( Number.isNaN( fn.fx( -1 ) ) ).to.be.ok() ;
		expect( Number.isNaN( fn.fx( 3 ) ) ).to.be.ok() ;

		// Exact match
		expect( fn.fx( 0 ) ).to.be( 0 ) ;
		expect( fn.fx( 1 ) ).to.be( 1 ) ;
		expect( fn.fx( 2 ) ).to.be( 0 ) ;

		// Interpoled
		expect( fn.fx( 0.5 ) ).to.be( 0.75 ) ;
		expect( fn.fx( 0.75 ) ).to.be( 15 / 16 ) ;
		expect( fn.fx( 1.25 ) ).to.be( 15 / 16 ) ;
		expect( fn.fx( 1.5 ) ).to.be( 0.75 ) ;
	} ) ;

	it( "simple fn 2" , () => {
		var fn = new math.Fn( [
			{ x: 0 , fx: 0 } ,
			{ x: 1 , fx: 1 } ,
			{ x: 2 , fx: 1 } ,
			{ x: 3 , fx: 2 }
		] , { preserveExtrema: true } ) ;

		//console.log( fn ) ;

		// Out of bounds
		expect( Number.isNaN( fn.fx( -1 ) ) ).to.be.ok() ;
		expect( Number.isNaN( fn.fx( 4 ) ) ).to.be.ok() ;

		// Exact match
		expect( fn.fx( 0 ) ).to.be( 0 ) ;
		expect( fn.fx( 1 ) ).to.be( 1 ) ;
		expect( fn.fx( 2 ) ).to.be( 1 ) ;
		expect( fn.fx( 3 ) ).to.be( 2 ) ;

		// Interpoled
		expect( fn.fx( 0.5 ) ).to.be( 0.75 ) ;
		expect( fn.fx( 0.75 ) ).to.be( 15 / 16 ) ;
		expect( fn.fx( 1.25 ) ).to.be( 1 ) ;
		expect( fn.fx( 1.5 ) ).to.be( 1 ) ;
	} ) ;

	it( "simple fn 3" , () => {
		var fn = new math.Fn( [
			{ x: 0 , fx: 0 } ,
			{ x: 2 , fx: 2 } ,
			{ x: 4 , fx: 1 } ,
			{ x: 6 , fx: 3 }
		] ) ;

		//console.log( fn ) ;

		// Out of bounds
		expect( Number.isNaN( fn.fx( -1 ) ) ).to.be.ok() ;
		expect( Number.isNaN( fn.fx( 7 ) ) ).to.be.ok() ;

		// Exact match
		expect( fn.fx( 0 ) ).to.be( 0 ) ;
		expect( fn.fx( 2 ) ).to.be( 2 ) ;
		expect( fn.fx( 4 ) ).to.be( 1 ) ;
		expect( fn.fx( 6 ) ).to.be( 3 ) ;

		// Interpoled
		expect( fn.fx( 1 ) ).to.be( 1.375 ) ;
		expect( fn.fx( 3 ) ).to.be( 1.5 ) ;
		expect( fn.fx( 5 ) ).to.be( 1.625 ) ;
	} ) ;
} ) ;

