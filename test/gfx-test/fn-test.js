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

/* global describe, it */

"use strict" ;



const math = require( '../../lib/math.js' ) ;
const geo = math.geometry ;
const Vector2D = geo.Vector2D ;
//geo.setFastMode( true ) ;

const gm = require( 'gm' ) ;

const random = math.random ;
const rng = new math.random.MersenneTwister() ;
rng.seed() ;



function trace( img , gen ) {
	var r , pos , lastPos = new Vector2D() ;

	if ( ( r = gen.next() ).done ) { return ; }

	lastPos.setVector( r.value ) ;

	while ( ! ( r = gen.next() ).done ) {
		pos = r.value ;

		if ( ! lastPos.isUndefined() && ! pos.isUndefined() ) {
			//console.log( pos ) ;
			img.drawLine( lastPos.x , img.__height__ - lastPos.y , pos.x , img.__height__ - pos.y ) ;
		}

		lastPos.setVector( pos ) ;
	}
}



function traceCps( img , cps ) {
	//return ;
	var i , len = cps.length , cp ;

	for ( i = 0 ; i < len ; i ++ ) {
		cp = cps[ i ] ;
		img.drawCircle( cp.x , img.__height__ - cp.fx , cp.x + 4 , img.__height__ - cp.fx + 4 ) ;
	}
}





/* Tests */



describe( "Fn" , () => {

	it( "Simple fn" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.Fn( [
			{ x: 100 , fx: 100 } ,
			{ x: 300 , fx: 500 } ,
			{ x: 500 , fx: 100 }
		] ) ;

		img.stroke( "#0f0" ) ;
		trace( img , fn.tracer( 1 , 1 , size ) ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , fn.controlPoints ) ;

		img.write( __dirname + "/simple-fn.png" , done ) ;
	} ) ;

	it( "Simple fn2" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.Fn( [
			{ x: 100 , fx: 100 } ,
			{ x: 200 , fx: 300 } ,
			{ x: 400 , fx: 300 } ,
			{ x: 500 , fx: 500 }
		] ) ;

		img.stroke( "#0f0" ) ;
		trace( img , fn.tracer( 1 , 1 , size ) ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , fn.controlPoints ) ;

		img.write( __dirname + "/simple-fn2.png" , done ) ;
	} ) ;

	it( "Simple fn3" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.Fn( [
			{ x: 100 , fx: 100 } ,
			{ x: 200 , fx: 350 } ,
			{ x: 400 , fx: 250 } ,
			{ x: 500 , fx: 500 }
		] ) ;

		img.stroke( "#0f0" ) ;
		trace( img , fn.tracer( 1 , 1 , size ) ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , fn.controlPoints ) ;

		img.write( __dirname + "/simple-fn3.png" , done ) ;
	} ) ;

	it( "Simple fn4" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.Fn( [
			{ x: 0 , fx: 250 } ,
			{ x: 100 , fx: 300 } ,
			{ x: 200 , fx: 400 } ,
			{ x: 300 , fx: 470 } ,
			{ x: 400 , fx: 490 } ,
			{ x: 500 , fx: 400 } ,
			{ x: 600 , fx: 350 }
		] ) ;

		img.stroke( "#0f0" ) ;
		trace( img , fn.tracer( 1 , 1 , size ) ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , fn.controlPoints ) ;

		img.write( __dirname + "/simple-fn4.png" , done ) ;
	} ) ;

	it( "Random fn" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var i , array = [] ;

		for ( i = 0 ; i <= size ; i += rng.random( 10 , 80 ) ) {
			array.push( {
				x: i ,
				fx: rng.random( 0 , 600 )
			} ) ;
		}

		var fn = new math.Fn( array , { preserveExtrema: false , atanMeanSlope: true } ) ;

		img.stroke( "#0f0" ) ;
		trace( img , fn.tracer( 1 , 1 , size ) ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , fn.controlPoints ) ;

		img.write( __dirname + "/random-fn.png" , done ) ;
	} ) ;
} ) ;

