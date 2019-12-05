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



function Matrix( w , h , a , copy = false ) {
	this.w = + w || 1 ;
	this.h = + h || 1 ;

	if ( ! Array.isArray( a ) ) {
		this.a = [] ;
		this.toIdentity() ;
	}
	else {
		if ( a.length !== this.w * this.h ) {
			throw new Error( "Matrix: bad array length, expected " + ( this.w * this.h ) + " but got " + a.length + "." ) ;
		}
		
		if ( copy ) {
			this.a = [ ... a ] ;
		}
		else {
			this.a = a ;
		}
	}
}

module.exports = Matrix ;



Matrix.fromObject = object => new Matrix( object.w , object.h , object.a , true ) ;
Matrix.identity = ( w , h ) => new Matrix( w , h ) ;



// Matrix coordinates start at 1, not 0, in math convention
Matrix.prototype.get = function( x , y ) { return this.a[ ( y - 1 ) * this.w + x - 1 ] ; } ;

// Same than .get(), but coordinates start at 0
Matrix.prototype.get0 = function( x , y ) { return this.a[ y * this.w + x ] ; } ;



// Matrix coordinates start at 1, not 0, in math convention
Matrix.prototype.set = function( x , y , v ) {
	this.a[ ( y - 1 ) * this.w + x - 1 ] = + v ;
	return this ;
} ;



// Same than .set(), but coordinates start at 0
Matrix.prototype.set0 = function( x , y , v ) {
	this.a[ y * this.w + x ] = + v ;
	return this ;
} ;



Matrix.prototype.dup = function() {
	return Matrix.fromObject( this ) ;
} ;



Matrix.prototype.toIdentity = function() {
	var x , y ;
	
	for ( y = 0 ; y < this.h ; y ++ ) {
		for ( x = 0 ; x < this.w ; x ++ ) {
			this.a[ y * this.w + x ] = x === y ? 1 : 0 ;
		}
	}
} ;



Matrix.prototype.add = function( matrix ) {} ;
Matrix.prototype.mul = function( scalar ) {} ;

