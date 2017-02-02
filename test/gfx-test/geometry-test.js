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
var Vector3D = geo.Vector3D ;
var BoundVector2D = geo.BoundVector2D ;
var BoundVector3D = geo.BoundVector3D ;
var Circle2D = geo.Circle2D ;
var Ellipse2D = geo.Ellipse2D ;
var Sphere3D = geo.Sphere3D ;
var Plane3D = geo.Plane3D ;
var Circle3D = geo.Circle3D ;
//geo.setFastMode( true ) ;

var gm = require( 'gm' ) ;

var random = math.random ;
var rng = new math.random.MersenneTwister() ;
rng.seed() ;





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



describe( "Circle" , function() {

	it( "Circle random shortest point" , function( done ) {
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
	
	it( "Circle intersection" , function( done ) {
		var i , test , tries = 50 , size = 600 ;
		
		var img = gm( size , size , "#000" ) ;
		var line = BoundVector2D() ;
		var array ;
		
		img.fill( "#000f" ) ;
		
		var circle = Circle2D( size / 2 , size / 2 , size / 3 ) ;
		//var circle = Circle2D( 0 , 0 , size / 3 ) ;
		
		img.stroke( "#00f" ) ;
		trace( img , circle.tracer( 1 ) ) ;
		
		for ( i = 0 ; i < tries ; i ++ )
		{
			line.set(
				rng.random( 1 , size - 1 ) ,
				rng.random( 1 , size - 1 ) ,
				rng.random( -50 , 50 ) ,
				rng.random( -50 , 50 )
			) ;
			
			array = circle.lineIntersection( line ) ;
			//console.log( '#' + i , array ) ;
			
			if ( ! array )
			{
				img.stroke( '#f00' ) ;
				img.drawLine( line.position.x , line.position.y , line.position.x + line.vector.x , line.position.y + line.vector.y ) ;
			}
			else
			{
				img.stroke( '#0f0' ) ;
				img.drawLine( line.position.x , line.position.y , line.position.x + line.vector.x , line.position.y + line.vector.y ) ;
				
				img.stroke( '#ad0' ) ;
				img.drawCircle( array[ 0 ].x , array[ 0 ].y , array[ 0 ].x + 4 , array[ 0 ].y + 4 ) ;
				
				//console.log( 'a:' , circle.pointDistance( array[ 0 ] ) ) ;
				
				if ( array[ 1 ] )
				{
					img.stroke( '#0da' ) ;
					img.drawCircle( array[ 1 ].x , array[ 1 ].y , array[ 1 ].x + 4 , array[ 1 ].y + 4 ) ;
					//console.log( 'b:' , circle.pointDistance( array[ 1 ] ) ) ;
				}
			}
		}
		
		img.write( __dirname + "/circle-intersection.png" , done ) ;
	} ) ;
} ) ;



describe( "Ellipse" , function() {

	it( "Ellipse random shortest point" , function( done ) {
		var i , test , tries = 200 , size = 600 ;
		
		var img = gm( size , size , "#000" ) ;
		var position = Vector2D() ;
		var projected ;
		
		img.fill( "#fff6" ) ;
		
		var semiMajor = rng.random( size / 5 , size / 3 ) ;
		var semiMinor = rng.random( semiMajor ) ;
		var majorAxis = Vector2D( rng.random( - 100 , 100 ) , rng.random( - 100 , 100 ) ) ;
		//var majorAxis = Vector2D( 1 , 0 ) ;
		
		//console.log( 'Axis size:' , semiMajor , semiMinor ) ;
		
		var ellipse = Ellipse2D( size / 2 , size / 2 , majorAxis.x , majorAxis.y , semiMajor , semiMinor ) ;
		
		img.stroke( "#0f0" ) ;
		trace( img , ellipse.tracer( 1 ) ) ;
		
		for ( i = 0 ; i < tries ; i ++ )
		{
			position.set(
				rng.random( 1 , size - 1 ) ,
				rng.random( 1 , size - 1 )
			) ;
			
			projected = ellipse.pointProjection( position ) ;
			//console.log( '#' + i , position , projected ) ;
			
			if ( ! projected.x || ! projected.y )
			{
				console.log( 'Null vector?' ) ;
				continue ;
			}
			
			test = ellipse.testVector( position ) ;
			img.stroke( test > 0 ? '#ff8' : '#8ff' ) ;
			img.drawLine( position.x , position.y , projected.x , projected.y ) ;
			//img.drawPoint( projected.x , projected.y ) ;
		}
		
		img.write( __dirname + "/ellipse-point-projection.png" , done ) ;
	} ) ;

	it( "Ellipse intersection" , function( done ) {
		var i , test , tries = 50 , size = 600 ;
		
		var img = gm( size , size , "#000" ) ;
		var line = BoundVector2D() ;
		var array ;
		
		img.fill( "#000f" ) ;
		
		var semiMajor = rng.random( size / 5 , size / 3 ) ;
		var semiMinor = rng.random( semiMajor ) ;
		var majorAxis = Vector2D( rng.random( - 100 , 100 ) , rng.random( - 100 , 100 ) ) ;
		//var majorAxis = Vector2D( 1 , 0 ) ;
		
		//console.log( 'Axis size:' , semiMajor , semiMinor ) ;
		
		var ellipse = Ellipse2D( size / 2 , size / 2 , majorAxis.x , majorAxis.y , semiMajor , semiMinor ) ;
		
		img.stroke( "#00f" ) ;
		trace( img , ellipse.tracer( 1 ) ) ;
		
		for ( i = 0 ; i < tries ; i ++ )
		{
			line.set(
				rng.random( 1 , size - 1 ) ,
				rng.random( 1 , size - 1 ) ,
				rng.random( -50 , 50 ) ,
				rng.random( -50 , 50 )
			) ;
			
			array = ellipse.lineIntersection( line ) ;
			//console.log( '#' + i , position , projected ) ;
			
			if ( ! array )
			{
				img.stroke( '#f00' ) ;
				img.drawLine( line.position.x , line.position.y , line.position.x + line.vector.x , line.position.y + line.vector.y ) ;
			}
			else
			{
				img.stroke( '#0f0' ) ;
				img.drawLine( line.position.x , line.position.y , line.position.x + line.vector.x , line.position.y + line.vector.y ) ;
				
				img.stroke( '#ad0' ) ;
				img.drawCircle( array[ 0 ].x , array[ 0 ].y , array[ 0 ].x + 4 , array[ 0 ].y + 4 ) ;
				
				if ( array[ 1 ] )
				{
					img.stroke( '#0da' ) ;
					img.drawCircle( array[ 1 ].x , array[ 1 ].y , array[ 1 ].x + 4 , array[ 1 ].y + 4 ) ;
				}
			}
		}
		
		img.write( __dirname + "/ellipse-intersection.png" , done ) ;
	} ) ;
} ) ;



