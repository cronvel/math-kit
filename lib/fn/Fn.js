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

"use strict" ;



const Vector2D = require( '../geometry/Vector2D.js' ) ;



// This is the superclass.

function Fn() {}
module.exports = Fn ;



// Duplicate
Fn.prototype.dup = function() { throw new Error( "Not supported!" ) ; } ;

Fn.prototype.add = function( v ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.sub = function( v ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.fx = function( x ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.dfx = function( x ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.createDfxFn = function() { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.sfx = function( x , constant = 0 ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.createSfxFn = function( constant = 0 ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.solveFor = function( v = 0 ) { throw new Error( "Not supported!" ) ; } ;



// Tracer generator for the fn
Fn.prototype.tracer = function*( pixelSize , xmin , xmax ) {
	for ( let x = xmin ; x <= xmax ; x += pixelSize ) {
		yield new Vector2D( x , this.fx( x ) ) ;
	}
} ;

