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



function Matrix( h , w , a , copy = false ) {
	this.h = + h || 1 ;
	this.w = + w || 1 ;

	if ( ! Array.isArray( a ) ) {
		this.a = new Array( this.h * this.w ) ;
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



Matrix.fromObject = object => new Matrix( object.h , object.w , object.a , true ) ;
Matrix.identity = ( h , w ) => ( new Matrix( h , w ) ).toIdentity() ;



// Matrix coordinates start at 1, not 0, in math convention
Matrix.prototype.get = function( y , x ) { return this.a[ ( y - 1 ) * this.w + x - 1 ] ; } ;

// Same than .get(), but coordinates start at 0
Matrix.prototype.get0 = function( y , x ) { return this.a[ y * this.w + x ] ; } ;



// Matrix coordinates start at 1, not 0, in math convention
Matrix.prototype.set = function( y , x , v ) {
	this.a[ ( y - 1 ) * this.w + x - 1 ] = + v ;
	return this ;
} ;



// Same than .set(), but coordinates start at 0
Matrix.prototype.set0 = function( y , x , v ) {
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

	return this ;
} ;



// The argument outputMatrix can help re-using existing objects
Matrix.prototype.transpose = function( outputMatrix = null ) {
	if ( outputMatrix ) {
		outputMatrix.h = this.w ;
		outputMatrix.w = this.h ;
	}
	else {
		outputMatrix = new Matrix( this.w , this.h , new Array( this.h * this.w ) ) ;
	}

	var x , y ;

	for ( y = 0 ; y < this.h ; y ++ ) {
		for ( x = 0 ; x < this.w ; x ++ ) {
			outputMatrix.a[ x * outputMatrix.w + y ] = this.a[ y * this.w + x ] ;
		}
	}

	return outputMatrix ;
} ;



// The argument outputMatrix can help re-using existing objects
Matrix.prototype.add = function( matrix , outputMatrix = null ) {
	if ( ! ( matrix instanceof Matrix ) ) { throw new Error( 'Argument is not a matrix.' ) ; }
	if ( matrix.w !== this.w || matrix.h !== this.h ) { throw new Error( 'The matrix argument has not the same size.' ) ; }

	if ( outputMatrix ) {
		outputMatrix.h = this.h ;
		outputMatrix.w = this.w ;
	}
	else {
		outputMatrix = new Matrix( this.h , this.w , new Array( this.h * this.w ) ) ;
	}

	var i , iMax = this.w * this.h ;

	for ( i = 0 ; i < iMax ; i ++ ) { outputMatrix.a[ i ] = this.a[ i ] + matrix.a[ i ] ; }

	return outputMatrix ;
} ;



// The argument outputMatrix can help re-using existing objects
Matrix.prototype.mul =
Matrix.prototype.multiply = function( by , outputMatrix = null ) {
	if ( typeof by === 'number' ) { return this.multiplyByScalar( by ) ; }
	return this.multiplyByMatrix( by ) ;
} ;



// The argument outputMatrix can help re-using existing objects
Matrix.prototype.multiplyByScalar = function( scalar , outputMatrix = null ) {
	if ( outputMatrix ) {
		outputMatrix.h = this.h ;
		outputMatrix.w = this.w ;
	}
	else {
		outputMatrix = new Matrix( this.h , this.w , new Array( this.h * this.w ) ) ;
	}

	var i , iMax = this.w * this.h ;

	for ( i = 0 ; i < iMax ; i ++ ) { outputMatrix.a[ i ] = scalar * this.a[ i ] ; }

	return outputMatrix ;
} ;



// The argument outputMatrix can help re-using existing objects
Matrix.prototype.multiplyByMatrix = function( matrix , outputMatrix = null ) {
	if ( ! ( matrix instanceof Matrix ) ) { throw new Error( 'Argument is not a matrix.' ) ; }
	if ( matrix.w !== this.h ) { throw new Error( 'The matrix argument width mismatch the "this" matrix height.' ) ; }

	var i , j , k , sum ;

	if ( outputMatrix ) {
		outputMatrix.h = this.h ;
		outputMatrix.w = matrix.w ;
	}
	else {
		outputMatrix = new Matrix( this.h , matrix.w , new Array( this.h * matrix.w ) ) ;
	}

	for ( i = 0 ; i < this.h ; i ++ ) {
		for ( j = 0 ; j < matrix.w ; j ++ ) {
			sum = 0 ;

			for ( k = 0 ; k < this.w ; k ++ ) {
				// Aik × Bkj
				sum += this.a[ i * this.w + k ] * matrix.a[ k * matrix.w + j ] ;
				//console.log( i,j,k, '---' , this.a[ i * this.w + k ] , matrix.a[ k * matrix.w + j ] , '-->' , sum ) ;
			}

			outputMatrix.a[ i * outputMatrix.w + j ] = sum ;
		}
	}

	return outputMatrix ;
} ;



Matrix.prototype.determinant = function() {
	if ( this.w !== this.h ) { throw new Error( 'Not a square matrix, so no determinant.' ) ; }
	if ( this.w === 2 ) { return this.det2() ; }
	if ( this.w === 3 ) { return this.det3() ; }
	throw new Error( 'Determinant for matrix bigger than 3x3 not supported yet.' ) ;
} ;



Matrix.prototype.det2 = function() { return this.a[ 0 ] * this.a[ 3 ] - this.a[ 1 ] * this.a[ 2 ] ; } ;
Matrix.prototype.det3 = function() {
	return (
		this.a[0] * this.a[4] * this.a[8]
		+ this.a[3] * this.a[7] * this.a[2]
		+ this.a[6] * this.a[1] * this.a[5]
		- this.a[6] * this.a[4] * this.a[2]
		- this.a[0] * this.a[7] * this.a[5]
		- this.a[3] * this.a[1] * this.a[8]
	) ;
} ;

