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
const search = math.search ;



describe( "Search local minimum" , () => {

	it( "1D" , () => {
		var fn , vector ;
		
		fn = x => 2 + ( x - 2 ) ** 2 ;
		vector = search.localMinimum( fn , [ 0 ] , 100 , { accuracy: 0.01 } ) ;
		expect( vector[ 0 ] ).to.be.within( 1.99 , 2.01 ) ;
		//console.log( "vector:" , vector ) ;

		vector = search.localMinimum( fn , [ 0 ] , 100 , { accuracy: 0.0001 } ) ;
		expect( vector[ 0 ] ).to.be.within( 1.9999 , 2.0001 ) ;
		//console.log( "vector:" , vector ) ;
	} ) ;

	it( "2D" , () => {
		var fn , vector ;
		
		fn = ( x , y ) => -5 + Math.hypot( x - 2 , y + 3 ) ;
		vector = search.localMinimum( fn , [ 0 , 0 ] , 100 , { accuracy: 0.01 } ) ;
		expect( vector[ 0 ] ).to.be.within( 1.99 , 2.01 ) ;
		expect( vector[ 1 ] ).to.be.within( -3.01 , -2.99 ) ;
		//console.log( "vector:" , vector ) ;
	} ) ;

	it( "3D" , () => {
		var fn , vector ;
		
		fn = ( x , y , z ) => Math.hypot( x - 2 , y + 3 , z - 34 ) ;
		vector = search.localMinimum( fn , [ 0 , 0 , 0 ] , 100 , { accuracy: 0.01 } ) ;
		expect( vector[ 0 ] ).to.be.within( 1.99 , 2.01 ) ;
		expect( vector[ 1 ] ).to.be.within( -3.01 , -2.99 ) ;
		expect( vector[ 2 ] ).to.be.within( 33.99 , 34.01 ) ;
		//console.log( "vector:" , vector ) ;
	} ) ;
} ) ;

