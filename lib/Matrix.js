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
	if ( typeof by === 'number' ) { return this.multiplyByScalar( by , outputMatrix ) ; }
	return this.multiplyByMatrix( by , outputMatrix ) ;
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
	if ( this.h !== this.w || ! Matrix.det[ this.h ] ) { throw new Error( 'Cannot compute the determinant of a ' + this.h + 'x' + this.w + ' matrix.' ) ; }
	return Matrix.det[ this.h ]( this.a ) ;
} ;



// Fast determinant formula
Matrix.det = [
	null ,
	null ,
	// det2
	a => a[0] * a[3]
		- a[1] * a[2] ,
	// det3
	a => a[0] * a[4] * a[8]
		+ a[3] * a[7] * a[2]
		+ a[6] * a[1] * a[5]
		- a[6] * a[4] * a[2]
		- a[0] * a[7] * a[5]
		- a[3] * a[1] * a[8] ,
	//	det4 (= afkp−aflo−agjp+agln+ahjo−ahkn−bekp+belo+bgip−bglm−bhio+bhkm+cejp−celn−cfip+cflm+chin−chjm−dejo+dekn+dfio−dfkm−dgin+dgjm)
	a => a[0] * a[5] * a[10] * a[15]
		- a[0] * a[5] * a[11] * a[14]
		- a[0] * a[6] * a[9] * a[15]
		+ a[0] * a[6] * a[11] * a[13]
		+ a[0] * a[7] * a[9] * a[14]
		- a[0] * a[7] * a[10] * a[13]
		- a[1] * a[4] * a[10] * a[15]
		+ a[1] * a[4] * a[11] * a[14]
		+ a[1] * a[6] * a[8] * a[15]
		- a[1] * a[6] * a[11] * a[12]
		- a[1] * a[7] * a[8] * a[14]
		+ a[1] * a[7] * a[10] * a[12]
		+ a[2] * a[4] * a[9] * a[15]
		- a[2] * a[4] * a[11] * a[13]
		- a[2] * a[5] * a[8] * a[15]
		+ a[2] * a[5] * a[11] * a[12]
		+ a[2] * a[7] * a[8] * a[13]
		- a[2] * a[7] * a[9] * a[12]
		- a[3] * a[4] * a[9] * a[14]
		+ a[3] * a[4] * a[10] * a[13]
		+ a[3] * a[5] * a[8] * a[14]
		- a[3] * a[5] * a[10] * a[12]
		- a[3] * a[6] * a[8] * a[13]
		+ a[3] * a[6] * a[9] * a[12]
] ;

