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
var expect = require( 'expect.js' ) ;





			/* Tests */



describe( "Vector2D" , function() {
	
	it( "duplicate" , function() {
		var v1 = new geo.Vector2D( 3 , 4 ) ;
		expect( v1.dup() ).to.eql( { vx: 3 , vy: 4 } ) ;
	} ) ;
	
	it( "addition" , function() {
		var v1 = new geo.Vector2D( 3 , 4 ) ;
		var v2 = new geo.Vector2D( 5 , 7 ) ;
		expect( v1.dup().add( v2 ) ).to.eql( { vx: 8 , vy: 11 } ) ;
	} ) ;
	
	it( "length" , function() {
		var v1 = new geo.Vector2D( 3 , 4 ) ;
		expect( v1.length() ).to.be( 5 ) ;
	} ) ;
} ) ;



