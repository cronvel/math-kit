/*
	Math Kit
	
	Copyright (c) 2014 - 2017 Cédric Ronvel
	
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



/* jshint -W064 */
/* global describe, it */



var math = require( '../../lib/math.js' ) ;
var geo = math.geometry ;
var Vector2D = geo.Vector2D ;
//geo.setFastMode( true ) ;

var gm = require( 'gm' ) ;

/*
var random = math.random ;
var rng = new math.random.MersenneTwister() ;
rng.seed() ;
*/





			/* Tests */



function trace( img , gen )
{
	var r , pos , lastPos = Vector2D() ;
	
	if ( ( r = gen.next() ).done ) { return ; }
	
	lastPos.setVector( r.value ) ;
	
	while ( ! ( r = gen.next() ).done )
	{
		pos = r.value ;
		img.drawLine( lastPos.x , lastPos.y , pos.x , pos.y ) ;
		lastPos.setVector( pos ) ;
	}
}





			/* Tests */



describe( "Fn" , function() {

	it( "Simple fn" , function( done ) {
		var i , test , tries = 200 , size = 600 ;
		
		var img = gm( size , size , "#000" ) ;
		var position = Vector2D() ;
		var projected ;
		
		img.fill( "#fff6" ) ;
		
		var circle = Circle2D( size / 2 , size / 2 , size / 3 ) ;
		
		img.stroke( "#0f0" ) ;
		trace( img , circle.tracer( 1 ) ) ;
		
		img.stroke( "#fff" ) ;
		
		for ( i = 0 ; i < tries ; i ++ )
		{
			position.set(
				rng.random( 1 , size - 1 ) ,
				rng.random( 1 , size - 1 )
			) ;
			
			projected = circle.pointProjection( position ) ;
			
			test = circle.testVector( position ) ;
			img.stroke( test > 0 ? '#ff8' : '#8ff' ) ;
			img.drawLine( position.x , position.y , projected.x , projected.y ) ;
		}
		
		img.write( __dirname + "/circle-point-projection.png" , done ) ;
	} ) ;
} ) ;



