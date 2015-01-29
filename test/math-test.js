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
var expect = require( 'expect.js' ) ;





			/* Tests */



describe( "math.isWithinRange()" , function() {
	
	it( "test with values" , function() {
		expect( math.isWithinRange( 2.5 , 2.1 , 3.3 ) ).to.be.ok() ;
		expect( math.isWithinRange( 2.05 , 2.1 , 3.3 ) ).not.to.be.ok() ;
		expect( math.isWithinRange( 3.35 , 2.1 , 3.3 ) ).not.to.be.ok() ;
	} ) ;
	
	it( "test with arrays" , function() {
		expect( math.isWithinRange( [ 2.5 ] , [ 2.1 ] , [ 3.3 ] ) ).to.be.ok() ;
		expect( math.isWithinRange( [ 2 , 5 ] , [ 2 , 1 ] , [ 3 , 3 ] ) ).to.be.ok() ;
		expect( math.isWithinRange( [ 2 , 0.5 ] , [ 2 , 1 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
		expect( math.isWithinRange( [ 3 , 4 ] , [ 2 , 1 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
	} ) ;
	
	it( "test with arrays of different length" , function() {
		expect( math.isWithinRange( [ 2 , 0 ] , [ 2 , 1 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
		expect( math.isWithinRange( [ 2 ] , [ 2 , 1 ] , [ 3 , 3 ] ) ).not.to.be.ok() ;
		expect( math.isWithinRange( [ 2 ] , [ 1 , 9 ] , [ 3 , 3 ] ) ).to.be.ok() ;
		expect( math.isWithinRange( [ 4 ] , [ 2 , 1 ] , [ 4 , 3 ] ) ).to.be.ok() ;
		expect( math.isWithinRange( [ 4 ] , [ 1 , 9 ] , [ 3 , 9 ] ) ).not.to.be.ok() ;
	} ) ;
} ) ;



