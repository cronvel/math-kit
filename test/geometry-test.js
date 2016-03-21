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





			/* Helper */



function expectCirca( value , circa )
{
	var precision = 0.000000000001 ;
	expect( value ).to.be.within( circa - precision , circa + precision ) ;
}





			/* Tests */



describe( "Vector2D" , function() {
	
	it( "duplicate" , function() {
		var v1 = geo.Vector2D( 3 , 4 ) ;
		expect( v1.dup() ).to.eql( { vx: 3 , vy: 4 } ) ;
	} ) ;
	
	it( "addition" , function() {
		var v1 = geo.Vector2D( 3 , 4 ) ;
		var v2 = geo.Vector2D( 5 , 7 ) ;
		var v3 = geo.Vector2D( 2 , 1 ) ;
		expect( v1.dup().add( v2 ) ).to.eql( { vx: 8 , vy: 11 } ) ;
		expect( v1.dup().add( v2 , v3 ) ).to.eql( { vx: 10 , vy: 12 } ) ;
	} ) ;
	
	it( "substract" , function() {
		var v1 = geo.Vector2D( 3 , 4 ) ;
		var v2 = geo.Vector2D( 2 , 1 ) ;
		expect( v1.dup().sub( v2 ) ).to.eql( { vx: 1 , vy: 3 } ) ;
	} ) ;
	
	it( "multiply" , function() {
		var v1 = geo.Vector2D( 3 , 4 ) ;
		expect( v1.dup().mul( 3 ) ).to.eql( { vx: 9 , vy: 12 } ) ;
	} ) ;
	
	it( "divide" , function() {
		var v1 = geo.Vector2D( 3 , 4 ) ;
		expect( v1.dup().div( 4 ) ).to.eql( { vx: 0.75 , vy: 1 } ) ;
	} ) ;
	
	it( "inverse" , function() {
		var v1 = geo.Vector2D( 3 , 4 ) ;
		expect( v1.dup().inv() ).to.eql( { vx: -3 , vy: -4 } ) ;
	} ) ;
	
	it( "get/set length" , function() {
		var v1 = geo.Vector2D( 3 , 4 ) ;
		expect( v1.length ).to.be( 5 ) ;
		
		v1.length = 10 ;
		expect( v1 ).to.eql( { vx: 6 , vy: 8 } ) ;
		
		v1.length = -10 ;
		expect( v1 ).to.eql( { vx: 6 , vy: 8 } ) ;
	} ) ;
	
	it( "get/set angle" , function() {
		var v1 = geo.Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.angle , Math.PI / 3 ) ;
		expectCirca( v1.inv().angle , - Math.PI + Math.PI / 3 ) ;
		
		v1 = geo.Vector2D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.angle , 2 * Math.PI / 3 ) ;
		
		v1 = geo.Vector2D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.angle , - Math.PI / 3 ) ;
		
		v1 = geo.Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
		v1.angle = Math.PI / 6 ;
		expectCirca( v1.vx ,  10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.vy ,  5 ) ;
	} ) ;
	
	it( "get/set angle in degree" , function() {
		var v1 = geo.Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.angleDeg , 60 ) ;
		expectCirca( v1.inv().angleDeg , -120 ) ;
		
		v1 = geo.Vector2D( -5 , 10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.angleDeg , 120 ) ;
		
		v1 = geo.Vector2D( 5 , -10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.angleDeg , -60 ) ;
		
		v1 = geo.Vector2D( 5 , 10 * Math.sqrt( 3 ) / 2 ) ;
		v1.angleDeg = 30 ;
		expectCirca( v1.vx , 10 * Math.sqrt( 3 ) / 2 ) ;
		expectCirca( v1.vy , 5 ) ;
	} ) ;
	
} ) ;



