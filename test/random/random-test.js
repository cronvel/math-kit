/*
	The Cedric's Swiss Knife (CSK) - CSK math toolbox test suit

	Copyright (c) 2015 Cédric Ronvel 
	
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



var math = require( '../lib/math.js' ) ;
var random = math.random ;
var expect = require( 'expect.js' ) ;
var gm = require( 'gm' ) ;





			/* Helper functions */



function floatRange( type , shouldNotHaveBelow , shouldNotHaveAbove , shouldHaveBelow , shouldHaveAbove )
{
	var i , r , tries = 1000000 ,
		haveBelow = false , haveAbove = false ,
		notHaveBelow = true , notHaveAbove = true ;
	
	var rng = new random[ type ]() ;
	rng.seed() ;
	
	for ( i = 0 ; i < tries ; i ++ )
	{
		r = rng.random() ;
		if ( r < shouldHaveBelow )  haveBelow = true ;
		if ( r < shouldNotHaveBelow )  notHaveBelow = false ;
		if ( r > shouldHaveAbove )  haveAbove = true ;
		if ( r >= shouldNotHaveAbove )  notHaveAbove = false ;
	}
	
	expect( haveBelow ).to.be.equal( true ) ;
	expect( notHaveBelow ).to.be.equal( true ) ;
	expect( haveAbove ).to.be.equal( true ) ;
	expect( notHaveAbove ).to.be.equal( true ) ;
}



function integerOccurencies( type )
{
	var i , r , tries = 1000000 , occurencies = [] ;
	
	var rng = new random[ type ]() ;
	rng.seed() ;
	
	for ( i = 0 ; i < 100 ; i ++ )  { occurencies[ i ] = 0 ; }
	
	for ( i = 0 ; i < tries ; i ++ )
	{
		r = rng.random( 100 ) ;
		
		// expect() is really slow, so doing it 1M time is not a good idea:
		// it's faster to add a if condition, then to use expect() to generate the usual output
		if ( r < 0 || r > 99 )  { expect( r ).to.be.within( 0 , 99 ) ; }
		
		occurencies[ r ] ++ ;
	}
	
	for ( i = 0 ; i < 100 ; i ++ )  { expect( 100 * occurencies[ i ] / tries ).to.be.within( 0.95 , 1.05 ) ; }
}



function dotPatternImage( type , done )
{
	var i , x , y , tries = 2000 , size = 300 ;
	
	var rng = new random[ type ]() ;
	rng.seed() ;
	
	var img = gm( size , size , "#000" ) ;
	
	img.fill( "#fff" ) ;
	
	for ( i = 0 ; i < tries ; i ++ )
	{
		x = rng.random( size ) ;
		y = rng.random( size ) ;
		
		if ( x === undefined || y === undefined )  { console.log( "Not enough entropy?" ) ; }
		
		img.drawPoint( x , y ) ;
	}
	
	img.write( "./dotPatternImage-" + type + ".png" , done ) ;
}



function ellipsePatternImage( type , done )
{
	var i , x , y , rx , ry , tries = 500 , size = 600 ;
	
	var rng = new random[ type ]() ;
	rng.seed() ;
	
	var img = gm( size , size , "#000" ) ;
	
	img.stroke( "#fff" , 1 ) ;
	img.fill() ;
	
	for ( i = 0 ; i < tries ; i ++ )
	{
		x = rng.random( size ) ;
		y = rng.random( size ) ;
		rx = rng.random( size / 5 ) ;
		//ry = rng.random( size / 5 ) ;
		ry = rx ;
		
		if ( x === undefined || y === undefined )  { console.log( "Not enough entropy?" ) ; }
		
		img.drawEllipse( x , y , rx , ry ) ;
	}
	
	img.write( "./ellipsePatternImage-" + type + ".png" , done ) ;
}



function linePatternImage( type , done )
{
	var i , r , g , b , x1 , y1 , x2 , y2 , tries = 600 , size = 600 ;
	
	var rng = new random[ type ]() ;
	rng.seed() ;
	
	var img = gm( size , size , "#000" ) ;
	
	img.fill( "#fff6" ) ;
	
	for ( i = 0 ; i < tries ; i ++ )
	{
		/*
		r = rng.random( 256 ) ;
		g = rng.random( 256 ) ;
		b = rng.random( 256 ) ;
		
		img.fill( "rgba(" + r + "," + g + ","+ b + ",100)" ) ;
		*/
		
		x1 = rng.random( size ) ;
		y1 = rng.random( size ) ;
		x2 = x1 + rng.random( 2 * size ) - size ;
		y2 = y1 + rng.random( 2 * size ) - size ;
		
		if ( x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined )  { console.log( "Not enough entropy?" ) ; }
		
		img.drawLine( x1 , y1 , x2 , y2 ) ;
		
		if ( x2 >= size )  img.drawLine( x1 - size , y1 , x2 - size , y2 ) ;
		if ( y2 >= size )  img.drawLine( x1 , y1 - size , x2 , y2 - size ) ;
		if ( x2 >= size && y2 >= size )  img.drawLine( x1 - size , y1 - size , x2 - size , y2 - size ) ;
		
		if ( x2 < 0 )  img.drawLine( x1 + size , y1 , x2 + size , y2 ) ;
		if ( y2 < 0 )  img.drawLine( x1 , y1 + size , x2 , y2 + size ) ;
		if ( x2 < 0 && y2 < 0 )  img.drawLine( x1 + size , y1 + size , x2 + size , y2 + size ) ;
	}
	
	img.write( "./linePatternImage-" + type + ".png" , done ) ;
}





			/* Tests */



function testSuiteFor( type )
{
	it( "should generate values in the [ 0 , 1 ) range, and should generate values close to boundary (closer than 0.00001)" , function() {
		
		this.timeout( 10000 ) ;
		floatRange( type , 0 , 1 , 0.00001 , 0.99999 ) ;
	} ) ;
	
	it( "should generate [ 0 , 99 ] integer with a flat distribution" , function() {
		
		this.timeout( 10000 ) ;
		integerOccurencies( type ) ;
	} ) ;
	
	it( "Dot pattern image" , function( done ) {
		
		this.timeout( 10000 ) ;
		dotPatternImage( type , done ) ;
	} ) ;
	/*
	it( "Ellipse pattern image" , function( done ) {
		
		this.timeout( 5000 ) ;
		ellipsePatternImage( type , done ) ;
	} ) ;
	
	it( "Line pattern image" , function( done ) {
		
		this.timeout( 5000 ) ;
		linePatternImage( type , done ) ;
	} ) ;
	*/
}



describe( "Native" , function() {
	testSuiteFor( 'Native' ) ;
} ) ;



describe( "Entropy" , function() {
	testSuiteFor( 'Entropy' ) ;
} ) ;



describe( "LessEntropy" , function() {
	testSuiteFor( 'LessEntropy' ) ;
} ) ;



describe( "Mersenne-Twister" , function() {
	testSuiteFor( 'MersenneTwister' ) ;
} ) ;



describe( "Misc" , function() {
	
	it( "randomRound()" , function() {
		
		var i , n , min , max , r = [] , rng ;
		
		rng = new random.MersenneTwister() ;
		rng.seed() ;
		
		n = 3.05 ;
		
		min = Math.floor( n ) ;
		max = Math.ceil( n ) ;
		
		r[ min ] = 0 ;
		r[ max ] = 0 ;
		
		for ( i = 0 ; i < 100 ; i ++ )
		{
			r[ rng.randomRound( n ) ] ++ ;
		}
		
		console.log( '' + r[ min ] + '% - ' + r[ max ] + '%' ) ;
	} ) ;
	
	it( "sharedRandomRound()" , function() {
		
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



