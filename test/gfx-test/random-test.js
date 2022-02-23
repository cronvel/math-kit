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

/* global expect, describe, it */

"use strict" ;

const math = require( '../../lib/math.js' ) ;
const geo = math.geometry ;
const Vector2D = geo.Vector2D ;
const GmTracer = require( '../../lib/tracer/GmTracer.js' ) ;

const random = math.random ;



function floatRange( type , shouldNotHaveBelow , shouldNotHaveAbove , shouldHaveBelow , shouldHaveAbove ) {
	var i , r , tries = 1000000 ,
		haveBelow = false , haveAbove = false ,
		notHaveBelow = true , notHaveAbove = true ;

	var rng = new random[ type ]() ;
	rng.seed() ;

	for ( i = 0 ; i < tries ; i ++ ) {
		r = rng.random() ;
		if ( r < shouldHaveBelow )  haveBelow = true ;
		if ( r < shouldNotHaveBelow )  notHaveBelow = false ;
		if ( r > shouldHaveAbove )  haveAbove = true ;
		if ( r >= shouldNotHaveAbove )  notHaveAbove = false ;
	}

	expect( haveBelow ).to.be( true ) ;
	expect( notHaveBelow ).to.be( true ) ;
	expect( haveAbove ).to.be( true ) ;
	expect( notHaveAbove ).to.be( true ) ;
}



function integerOccurencies( type ) {
	var i , r , tries = 1000000 , occurencies = [] ;

	var rng = new random[ type ]() ;
	rng.seed() ;

	for ( i = 0 ; i < 100 ; i ++ )  { occurencies[ i ] = 0 ; }

	for ( i = 0 ; i < tries ; i ++ ) {
		r = rng.random( 100 ) ;

		// expect() is really slow, so doing it 1M time is not a good idea:
		// it's faster to add a if condition, then to use expect() to generate the usual output
		if ( r < 0 || r > 99 )  { expect( r ).to.be.within( 0 , 99 ) ; }

		occurencies[ r ] ++ ;
	}

	for ( i = 0 ; i < 100 ; i ++ )  { expect( 100 * occurencies[ i ] / tries ).to.be.within( 0.95 , 1.05 ) ; }
}



function dotPatternImage( type ) {
	var i , tries = 2000 , size = 300 , position = new Vector2D() ;

	var tracer = new GmTracer( {
		size ,
		bgColor: '#000' ,
		xmin: 0 ,
		xmax: size ,
		ymin: 0 ,
		ymax: size
	} ) ;

	tracer.createImage() ;

	var rng = new random[ type ]() ;
	rng.seed() ;

	for ( i = 0 ; i < tries ; i ++ ) {
		position.set( rng.random( size ) , rng.random( size ) ) ;
		if ( position.x === undefined || position.y === undefined )  { console.log( "Not enough entropy?" ) ; }
		tracer.trace( position , '#fff' ) ;
	}

	return tracer.saveImage( __dirname + "/dotPatternImage-" + type + ".png" ) ;
}



function testSuiteFor( type ) {
	it( "should generate values in the [ 0 , 1 ) range, and should generate values close to boundary (closer than 0.00001)" , function() {
		this.timeout( 10000 ) ;
		floatRange( type , 0 , 1 , 0.00001 , 0.99999 ) ;
	} ) ;

	it( "should generate [ 0 , 99 ] integer with a flat distribution" , function() {
		this.timeout( 10000 ) ;
		integerOccurencies( type ) ;
	} ) ;

	it( "Dot pattern image" , async function() {
		this.timeout( 10000 ) ;
		await dotPatternImage( type ) ;
	} ) ;
}



describe( "Native" , () => {
	testSuiteFor( 'Native' ) ;
} ) ;



describe( "Entropy" , () => {
	testSuiteFor( 'Entropy' ) ;
} ) ;



describe( "LessEntropy" , () => {
	testSuiteFor( 'LessEntropy' ) ;
} ) ;



describe( "Mersenne-Twister" , () => {
	testSuiteFor( 'MersenneTwister' ) ;
} ) ;



describe( "Misc" , () => {

	it( "randomElement()" , () => {
		var i , array , rng ;

		rng = new random.MersenneTwister() ;
		rng.seed() ;

		array = [ 'a' , 'b' , 'c' , 'd' , 'e' , 'f' ] ;

		for ( i = 0 ; i < 10 ; i ++ ) {
			console.log( rng.randomElement( array ) ) ;
		}
	} ) ;

	it( "randomRound()" , () => {
		var i , n , min , max , r = [] , rng ;

		rng = new random.MersenneTwister() ;
		rng.seed() ;

		n = 3.05 ;

		min = Math.floor( n ) ;
		max = Math.ceil( n ) ;

		r[ min ] = 0 ;
		r[ max ] = 0 ;

		for ( i = 0 ; i < 100 ; i ++ ) {
			r[ rng.randomRound( n ) ] ++ ;
		}

		console.log( '' + r[ min ] + '% - ' + r[ max ] + '%' ) ;
	} ) ;

	it( "sharedRandomRound()" , () => {
		var rng , array ;

		rng = new random.MersenneTwister() ;
		rng.seed() ;

		array = [ 1.5 , 1.6 , 1.4 , 1.5 ] ;

		console.log( rng.sharedRandomRound( array ) ) ;
		console.log( rng.sharedRandomRound( array ) ) ;
		console.log( rng.sharedRandomRound( array ) ) ;
		console.log( rng.sharedRandomRound( array ) ) ;
		console.log( rng.sharedRandomRound( array ) ) ;
	} ) ;
} ) ;

