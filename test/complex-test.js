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
const Complex = math.Complex ;



describe( "Complex numbers" , () => {

	it( "constructor" , () => {
		expect( new Complex( 3 , 4 ) ).to.be.like( { re: 3 , im: 4 } ) ;
		expect( Number.isNaN( new Complex().re ) ).to.be( true ) ;
		expect( Number.isNaN( new Complex().im ) ).to.be( true ) ;
	} ) ;

	it( "angle" , () => {
		expect( new Complex( 1 , 0 ).angleDeg ).to.be( 0 ) ;
		expect( new Complex( 1 , 0 ).angle ).to.be( 0 ) ;
		
		expect( new Complex( 0 , 1 ).angleDeg ).to.be( 90 ) ;
		expect( new Complex( 0 , 1 ).angle ).to.be( Math.PI / 2 ) ;
		
		expect( new Complex( -1 , 0 ).angleDeg ).to.be( 180 ) ;
		expect( new Complex( -1 , 0 ).angle ).to.be( Math.PI ) ;
		
		expect( new Complex( 0 , -1 ).angleDeg ).to.be( -90 ) ;
		expect( new Complex( 0 , -1 ).angle ).to.be( - Math.PI / 2 ) ;
		
		expect( new Complex( 1 , Math.sqrt( 3 ) ).angleDeg ).to.be.around( 60 ) ;
		expect( new Complex( 1 , Math.sqrt( 3 ) ).angle ).to.be.around( Math.PI / 3 ) ;
	} ) ;

	it( "add" , () => {
		expect( new Complex( 3 , 4 ).add( new Complex( 1 , 5 ) ) ).to.be.like( { re: 4 , im: 9 } ) ;
		expect( new Complex( -5 , -2 ).add( new Complex( 1 , 5 ) ) ).to.be.like( { re: -4 , im: 3 } ) ;
		expect( new Complex( 1 , -2 ).add( new Complex( -4 , -5 ) ) ).to.be.like( { re: -3 , im: -7 } ) ;
	} ) ;

	it( "mul" , () => {
		expect( new Complex( 3 , 4 ).mul( new Complex( 2 , 0 ) ) ).to.be.like( { re: 6 , im: 8 } ) ;
		expect( new Complex( 3 , 4 ).mul( new Complex( 0 , 1 ) ) ).to.be.like( { re: -4 , im: 3 } ) ;
		expect( new Complex( 3 , 4 ).mul( new Complex( 0 , 2 ) ) ).to.be.like( { re: -8 , im: 6 } ) ;
		expect( new Complex( 3 , 4 ).mul( new Complex( 2 , 2 ) ) ).to.be.like( { re: -2 , im: 14 } ) ;
		expect( new Complex( 4 , 3 ).mul( new Complex( 2 , 2 ) ) ).to.be.like( { re: 2 , im: 14 } ) ;
		expect( new Complex( 2 , 1 ).mul( new Complex( 3 , 1 ) ) ).to.be.like( { re: 5 , im: 5 } ) ;
		expect( new Complex( 3 , 4 ).mul( new Complex( 3 , 4 ) ) ).to.be.like( { re: -7 , im: 24 } ) ;
	} ) ;

	it( "intPow" , () => {
		var c ;
		
		c = new Complex( 3 , 4 ).intPow( 2 ) ;
		expect( c.re ).to.be.around( -7 ) ;
		expect( c.im ).to.be.around( 24 ) ;
	} ) ;
} ) ;

