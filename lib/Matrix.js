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



// For faster computing, we re-use some matrix
const REUSABLE_MATRIX = new Matrix() ;



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
	if ( this.w !== matrix.h ) { throw new Error( "The \"this\" matrix's number of columns mismatches the \"argument\" matrix's number of rows." ) ; }

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



Matrix.prototype.invert = function( outputMatrix = null ) {
	if ( this.h !== this.w || ! Matrix.invert[ this.h ] ) { throw new Error( 'Cannot compute the invert of a ' + this.h + 'x' + this.w + ' matrix.' ) ; }

	var det = Matrix.det[ this.h ]( this.a ) ;

	// The matrix is not invertible
	if ( ! det ) { return null ; }

	if ( outputMatrix ) {
		outputMatrix.h = this.h ;
		outputMatrix.w = this.w ;
	}
	else {
		outputMatrix = new Matrix( this.h , this.w , new Array( this.h * this.w ) ) ;
	}

	Matrix.invert[ this.h ]( this.a , outputMatrix.a , 1 / det ) ;
	return outputMatrix ;
} ;



// Fast determinant formula
Matrix.invert = [
	null ,
	null ,
	// invert2
	( a , ai , idet ) => {
		ai[0] = a[3] * idet ;
		ai[1] = -a[1] * idet ;
		ai[2] = -a[2] * idet ;
		ai[3] = a[0] * idet ;
	} ,
	// invert3
	// https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_3_%C3%97_3_matrices
	( a , ai , idet ) => {
		ai[0] = ( a[4] * a[8] - a[5] * a[7] ) * idet ;
		ai[1] = ( a[2] * a[7] - a[1] * a[8] ) * idet ;
		ai[2] = ( a[1] * a[5] - a[2] * a[4] ) * idet ;

		ai[3] = ( a[5] * a[6] - a[3] * a[8] ) * idet ;
		ai[4] = ( a[0] * a[8] - a[2] * a[6] ) * idet ;
		ai[5] = ( a[2] * a[3] - a[0] * a[5] ) * idet ;

		ai[6] = ( a[3] * a[7] - a[4] * a[6] ) * idet ;
		ai[7] = ( a[1] * a[6] - a[0] * a[7] ) * idet ;
		ai[8] = ( a[0] * a[4] - a[1] * a[3] ) * idet ;
	} ,
	// invert4
	// Adaptated from: https://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix#1148405
	( a , ai , idet ) => {
		ai[0] = idet * ( a[5] * a[10] * a[15] - a[5] * a[11] * a[14] - a[9] * a[6] * a[15] + a[9] * a[7] * a[14] + a[13] * a[6] * a[11] - a[13] * a[7] * a[10] ) ;
		ai[4] = idet * ( -a[4] * a[10] * a[15] + a[4] * a[11] * a[14] + a[8] * a[6] * a[15] - a[8] * a[7] * a[14] - a[12] * a[6] * a[11] + a[12] * a[7] * a[10] ) ;
		ai[8] = idet * ( a[4] * a[9] * a[15] - a[4] * a[11] * a[13] - a[8] * a[5] * a[15] + a[8] * a[7] * a[13] + a[12] * a[5] * a[11] - a[12] * a[7] * a[9] ) ;
		ai[12] = idet * ( -a[4] * a[9] * a[14] + a[4] * a[10] * a[13] + a[8] * a[5] * a[14] - a[8] * a[6] * a[13] - a[12] * a[5] * a[10] + a[12] * a[6] * a[9] ) ;
		ai[1] = idet * ( -a[1] * a[10] * a[15] + a[1] * a[11] * a[14] + a[9] * a[2] * a[15] - a[9] * a[3] * a[14] - a[13] * a[2] * a[11] + a[13] * a[3] * a[10] ) ;
		ai[5] = idet * ( a[0] * a[10] * a[15] - a[0] * a[11] * a[14] - a[8] * a[2] * a[15] + a[8] * a[3] * a[14] + a[12] * a[2] * a[11] - a[12] * a[3] * a[10] ) ;
		ai[9] = idet * ( -a[0] * a[9] * a[15] + a[0] * a[11] * a[13] + a[8] * a[1] * a[15] - a[8] * a[3] * a[13] - a[12] * a[1] * a[11] + a[12] * a[3] * a[9] ) ;
		ai[13] = idet * ( a[0] * a[9] * a[14] - a[0] * a[10] * a[13] - a[8] * a[1] * a[14] + a[8] * a[2] * a[13] + a[12] * a[1] * a[10] - a[12] * a[2] * a[9] ) ;
		ai[2] = idet * ( a[1] * a[6] * a[15] - a[1] * a[7] * a[14] - a[5] * a[2] * a[15] + a[5] * a[3] * a[14] + a[13] * a[2] * a[7] - a[13] * a[3] * a[6] ) ;
		ai[6] = idet * ( -a[0] * a[6] * a[15] + a[0] * a[7] * a[14] + a[4] * a[2] * a[15] - a[4] * a[3] * a[14] - a[12] * a[2] * a[7] + a[12] * a[3] * a[6] ) ;
		ai[10] = idet * ( a[0] * a[5] * a[15] - a[0] * a[7] * a[13] - a[4] * a[1] * a[15] + a[4] * a[3] * a[13] + a[12] * a[1] * a[7] - a[12] * a[3] * a[5] ) ;
		ai[14] = idet * ( -a[0] * a[5] * a[14] + a[0] * a[6] * a[13] + a[4] * a[1] * a[14] - a[4] * a[2] * a[13] - a[12] * a[1] * a[6] + a[12] * a[2] * a[5] ) ;
		ai[3] = idet * ( -a[1] * a[6] * a[11] + a[1] * a[7] * a[10] + a[5] * a[2] * a[11] - a[5] * a[3] * a[10] - a[9] * a[2] * a[7] + a[9] * a[3] * a[6] ) ;
		ai[7] = idet * ( a[0] * a[6] * a[11] - a[0] * a[7] * a[10] - a[4] * a[2] * a[11] + a[4] * a[3] * a[10] + a[8] * a[2] * a[7] - a[8] * a[3] * a[6] ) ;
		ai[11] = idet * ( -a[0] * a[5] * a[11] + a[0] * a[7] * a[9] + a[4] * a[1] * a[11] - a[4] * a[3] * a[9] - a[8] * a[1] * a[7] + a[8] * a[3] * a[5] ) ;
		ai[15] = idet * ( a[0] * a[5] * a[10] - a[0] * a[6] * a[9] - a[4] * a[1] * a[10] + a[4] * a[2] * a[9] + a[8] * a[1] * a[6] - a[8] * a[2] * a[5] ) ;
	}
] ;



// Some transformation matrix.
// See: https://en.wikipedia.org/wiki/Transformation_matrix



// A change of basis tranformation matrix
Matrix.prototype.changeOfBasis2D = function( xVector , yVector , reciprocalMatrix = REUSABLE_MATRIX ) {
	if ( this.h !== 2 || this.w !== 2 ) { throw new Error( ".changeOfBasis2() requires a 2x2 matrix." ) ; }
	
	reciprocalMatrix.h = 2 ;
	reciprocalMatrix.w = 2 ;
	
	var a = reciprocalMatrix.a ;
	a[0] = xVector.x ; a[1] = yVector.x ;
	a[2] = xVector.y ; a[3] = yVector.y ;
	
	// For faster computing, avoid calling REUSABLE_MATRIX.invert( this )
	var det = Matrix.det[ 2 ]( a ) ;
	Matrix.invert[ 2 ]( a , this.a , 1 / det ) ;
	
	return this ;
} ;



// Same in 3D
Matrix.prototype.changeOfBasis3D = function( xVector , yVector , zVector , reciprocalMatrix = REUSABLE_MATRIX ) {
	if ( this.h !== 3 || this.w !== 3 ) { throw new Error( ".changeOfBasis3() requires a 3x3 matrix." ) ; }
	
	reciprocalMatrix.h = 3 ;
	reciprocalMatrix.w = 3 ;
	
	var a = reciprocalMatrix.a ;
	a[0] = xVector.x ; a[1] = yVector.x ; a[2] = zVector.x ;
	a[3] = xVector.y ; a[4] = yVector.y ; a[5] = zVector.y ;
	a[6] = xVector.z ; a[7] = yVector.z ; a[8] = zVector.z ;
	
	// For faster computing, avoid calling REUSABLE_MATRIX.invert( this )
	var det = Matrix.det[ 3 ]( a ) ;
	Matrix.invert[ 3 ]( a , this.a , 1 / det ) ;
	
	return this ;
} ;

