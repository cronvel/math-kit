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



const Fn = require( './Fn.js' ) ;



/*
	It transforms f(x) into: yMul * ( yAdd + fx( xMul * ( xAdd + x ) ) ).
	So it adds first, then multiply. It's much easier to center things this way.
	On a visual side, greater xMul compress/shrinks the graph along x, while greater yMul expands/grows the graph along y.
	On the other hand, positive xAdd move the graph to the left (negative x) while positive yAdd move the graph to the top (positive y).
*/
function TransformFn( fn , xAdd = 0 , xMul = 1 , yAdd = 0 , yMul = 1 ) {
	this.fn = fn ;
	this.xAdd = xAdd ;
	this.xMul = xMul ;
	this.yAdd = yAdd ;
	this.yMul = yMul ;
}

TransformFn.prototype = Object.create( Fn.prototype ) ;
TransformFn.prototype.constructor = TransformFn ;

module.exports = TransformFn ;



TransformFn.prototype.set = function( xAdd = 0 , xMul = 1 , yAdd = 0 , yMul = 1 ) {
	this.xAdd = xAdd ;
	this.xMul = xMul ;
	this.yAdd = yAdd ;
	this.yMul = yMul ;
} ;



TransformFn.prototype.dup = TransformFn.prototype.clone = function() {
	return new TransformFn( this.fn.dup() , this.xAdd , this.xMul , this.yAdd , this.yMul ) ;
} ;



TransformFn.prototype.add = function( v ) { this.yAdd += v / this.yMul ; } ;
TransformFn.prototype.sub = function( v ) { this.yAdd -= v / this.yMul ; } ;
TransformFn.prototype.mul = function( v ) { this.yMul *= v ; } ;
TransformFn.prototype.addArg = function( xAdd ) { this.xAdd += xAdd / this.xMul ; } ;
TransformFn.prototype.mulArg = function( xMul ) { this.xMul *= xMul ; } ;

TransformFn.prototype.fx = function( x ) {
	return this.yMul * ( this.yAdd + this.fn.fx( this.xMul * ( this.xAdd + x ) ) ) ;
} ;

TransformFn.prototype.dfx = function( x ) {
	// For derivative, we have to also multiply the output by the x scaling factor
	return this.yMul * this.xMul * ( this.yAdd + this.fn.dfx( this.xMul * ( this.xAdd + x ) ) ) ;
} ;

TransformFn.prototype.createDfxFn = function() {
	return new TransformFn(
		this.fn.createDfxFn() ,
		this.xAdd ,
		this.xMul ,
		this.yAdd ,
		this.yMul * this.xMul
	) ;
} ;

TransformFn.prototype.sfx = function( x , constant = 0 ) {
	// For integral, we have to divide the output by the x scaling factor
	return ( this.yMul / this.xMul ) * ( this.yAdd + this.fn.sfx( this.xMul * ( this.xAdd + x ) ) ) + constant ;
} ;

TransformFn.prototype.createSfxFn = function( constant = 0 ) {
	return new TransformFn(
		this.fn.createSfxFn() ,
		this.xAdd ,
		this.xMul ,
		this.yAdd + constant * this.xMul / this.yMul ,
		this.yMul / this.xMul
	) ;
} ;

TransformFn.prototype.solveFor = TransformFn.prototype.solve = function( y = 0 ) {
	// Revert y transformation
	y = y / this.yMul - this.yAdd ;

	var roots = this.fn.solveFor( y ) ;

	if ( roots ) {
		for ( let i = 0 ; i < roots.length ; i ++ ) {
			// Now revert x transformation
			roots[ i ] = roots[ i ] / this.yMul - this.yAdd ;
		}
	}

	return roots ;
} ;

