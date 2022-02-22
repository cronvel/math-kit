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



function trace( img , area , fn ) {
	var imgX , lastImgX , x , imgY , lastImgY , y ;

	for ( imgX = 0 ; imgX < img.__width__ ; imgX ++ ) {
		x = area.xmin + ( area.xmax - area.xmin ) * ( imgX / ( img.__width__ - 1 ) ) ;
		y = fn.fx( x ) ;
		
		if ( Number.isNaN( y ) ) {
			lastImgY = NaN ;
			lastImgX = NaN ;
		}
		else {
			imgY = Math.round( img.__height__ - 1 - ( img.__height__ - 1 ) * ( y - area.ymin ) / ( area.ymax - area.ymin ) ) ;

			if ( ! Number.isNaN( lastImgY ) ) {
				img.drawLine( lastImgX , lastImgY , imgX , imgY ) ;
			}

			lastImgY = imgY ;
			lastImgX = imgX ;
		}
	}
}



function traceCps( img , area , cps ) {
	var i , len = cps.length , cp , imgX , imgY ;

	for ( i = 0 ; i < len ; i ++ ) {
		cp = cps[ i ] ;
		imgX = Math.round( ( img.__width__ - 1 ) * ( cp.x - area.xmin ) / ( area.xmax - area.xmin ) ) ;
		imgY = Math.round( img.__height__ - 1 - ( img.__height__ - 1 ) * ( cp.fx - area.ymin ) / ( area.ymax - area.ymin ) ) ;
		img.drawCircle( imgX , imgY , imgX + 4 , imgY + 4 ) ;
	}
}



function traceAxis( img , area ) {
	var imgX = Math.round( ( img.__width__ - 1 ) * ( - area.xmin ) / ( area.xmax - area.xmin ) ) ,
		imgY = Math.round( img.__height__ - 1 - ( img.__height__ - 1 ) * ( - area.ymin ) / ( area.ymax - area.ymin ) ) ;
	
	img.drawLine( 0 , imgY , img.__width__ - 1 , imgY ) ;
	img.drawLine( imgX , 0 , imgX , img.__height__ - 1 ) ;
}



describe( "InterpolatedFn" , () => {

	it( "Simple interpolated fn" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 1 , fx: 1 } ,
			{ x: 3 , fx: 5 } ,
			{ x: 5 , fx: 1 }
		] ) ;
		
		var area = { xmin: -1 , xmax: 6 , ymin: -1 , ymax: 8 } ;

		img.stroke( "#ff0" ) ;
		traceAxis( img , area ) ;
		img.stroke( "#0f0" ) ;
		trace( img , area , fn ) ;
		img.stroke( "#00f" ) ;
		trace( img , area , fn.createDfxFn() ) ;
		img.stroke( "#f00" ) ;
		trace( img , area , fn.createSfxFn() ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , area , fn.controlPoints ) ;

		img.write( __dirname + "/simple-interpolated-fn.png" , done ) ;
	} ) ;

	it( "Simple interpolated fn2" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 1 , fx: 1 } ,
			{ x: 2 , fx: 3 } ,
			{ x: 4 , fx: 3 } ,
			{ x: 5 , fx: 5 }
		] ) ;

		var area = { xmin: -1 , xmax: 6 , ymin: -1 , ymax: 8 } ;

		img.stroke( "#ff0" ) ;
		traceAxis( img , area ) ;
		img.stroke( "#0f0" ) ;
		trace( img , area , fn ) ;
		img.stroke( "#00f" ) ;
		trace( img , area , fn.createDfxFn() ) ;
		img.stroke( "#f00" ) ;
		trace( img , area , fn.createSfxFn() ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , area , fn.controlPoints ) ;

		img.write( __dirname + "/simple-interpolated-fn2.png" , done ) ;
	} ) ;

	it( "Simple interpolated fn3" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 1 , fx: 1 } ,
			{ x: 2 , fx: 3.5 } ,
			{ x: 4 , fx: 2.5 } ,
			{ x: 5 , fx: 5 }
		] ) ;

		var area = { xmin: -1 , xmax: 6 , ymin: -1 , ymax: 8 } ;

		img.stroke( "#ff0" ) ;
		traceAxis( img , area ) ;
		img.stroke( "#0f0" ) ;
		trace( img , area , fn ) ;
		img.stroke( "#00f" ) ;
		trace( img , area , fn.createDfxFn() ) ;
		img.stroke( "#f00" ) ;
		trace( img , area , fn.createSfxFn() ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , area , fn.controlPoints ) ;

		img.write( __dirname + "/simple-interpolated-fn3.png" , done ) ;
	} ) ;

	it( "Simple interpolated fn4" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 0 , fx: 2.5 } ,
			{ x: 1 , fx: 3 } ,
			{ x: 2 , fx: 4 } ,
			{ x: 3 , fx: 4.7 } ,
			{ x: 4 , fx: 4.9 } ,
			{ x: 5 , fx: 4 } ,
			{ x: 6 , fx: 3.5 }
		] ) ;

		var area = { xmin: -1 , xmax: 6 , ymin: -1 , ymax: 8 } ;

		img.stroke( "#ff0" ) ;
		traceAxis( img , area ) ;
		img.stroke( "#0f0" ) ;
		trace( img , area , fn ) ;
		img.stroke( "#00f" ) ;
		trace( img , area , fn.createDfxFn() ) ;
		img.stroke( "#f00" ) ;
		trace( img , area , fn.createSfxFn() ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , area , fn.controlPoints ) ;

		img.write( __dirname + "/simple-interpolated-fn4.png" , done ) ;
	} ) ;

	it( "Random interpolated fn" , ( done ) => {
		var size = 600 ;

		var img = gm( size , size , "#000" ) ;

		img.__width__ = size ;
		img.__height__ = size ;

		img.fill( "#fff6" ) ;

		var x , fx , lastFx = 2 , array = [] ;

		var area = { xmin: -1 , xmax: 6 , ymin: -3 , ymax: 12 } ;

		for ( x = area.xmin + rng.randomFloatRange( 0 , 0.8 ) ; x <= area.xmax ; x += rng.randomFloatRange( 0.2 , 0.8 ) ) {
			fx = lastFx + rng.randomFloatRange( -3 , 3 ) ;
			array.push( { x , fx } ) ;
			lastFx = fx ;
		}

		var fn = new math.fn.InterpolatedFn( array , { preserveExtrema: false , atanMeanDfx: true } ) ;

		img.stroke( "#ff0" ) ;
		traceAxis( img , area ) ;
		img.stroke( "#0f0" ) ;
		trace( img , area , fn ) ;
		img.stroke( "#00f" ) ;
		trace( img , area , fn.createDfxFn() ) ;
		img.stroke( "#f00" ) ;
		trace( img , area , fn.createSfxFn() ) ;
		img.stroke( '#ad0' ) ;
		traceCps( img , area , fn.controlPoints ) ;

		img.write( __dirname + "/random-interpolated-fn.png" , done ) ;
	} ) ;
} ) ;

