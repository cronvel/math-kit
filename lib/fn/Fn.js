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



// This is the superclass.

function Fn() {}
module.exports = Fn ;



// Create a custom fn.
// A custom fn only supports pure functional stuffs, no getter/setter or new fn creation
Fn.create = ( params = {} ) => {
	if ( typeof params === 'function' ) { params = { fx: params } ; }

	var fn = new Fn() ;

	if ( params.fx ) { fn.fx = params.fx ; }
	if ( params.dfx ) { fn.dfx = params.dfx ; }
	if ( params.sfx ) { fn.sfx = params.sfx ; }
	if ( params.solveFor || params.solve ) { fn.solveFor = fn.solve = params.solveFor || params.solve ; }

	return fn ;
} ;



// Add or subtract so that f(0) = 0
Fn.prototype.toOrigin = Fn.prototype.setF0 = function( v = 0 ) {
	var f0 = this.fx( 0 ) ;

	if ( Number.isFinite( f0 ) && v - f0 ) {
		this.add( v - f0 ) ;
	}

	return this ;
} ;



Fn.prototype.set = function() { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.dup = Fn.prototype.clone = function() { throw new Error( "Not supported!" ) ; } ;

Fn.prototype.add = function( v ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.sub = function( v ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.mul = function( v ) { throw new Error( "Not supported!" ) ; } ;

// Add and mul the input argument (x), making this function f'(x) = f(x + offset) or f"(x) = f(x * xScale)
Fn.prototype.addArg = function( xAdd ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.mulArg = function( xMul ) { throw new Error( "Not supported!" ) ; } ;

Fn.prototype.fx = function( x ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.dfx = function( x ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.createDfxFn = function() { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.sfx = function( x , constant = 0 ) { throw new Error( "Not supported!" ) ; } ;
Fn.prototype.createSfxFn = function( constant = 0 ) { throw new Error( "Not supported!" ) ; } ;

Fn.prototype.solveFor = Fn.prototype.solve = function( y = 0 ) { throw new Error( "Not supported!" ) ; } ;



// Tracer generator for the fn, not very useful...
Fn.prototype.tracer = function*( tracer ) {
	var xMin = tracer.imageXMin ,
		xMax = tracer.imageXMax ,
		inc = tracer.pixelWidth ;

	for ( let x = xMin ; x <= xMax ; x += inc ) {
		yield { x , y: this.fx( x ) } ;
	}
} ;

