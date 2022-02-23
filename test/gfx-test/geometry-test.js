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
const Vector3D = geo.Vector3D ;
const BoundVector2D = geo.BoundVector2D ;
const BoundVector3D = geo.BoundVector3D ;
const Circle2D = geo.Circle2D ;
const Ellipse2D = geo.Ellipse2D ;
const Sphere3D = geo.Sphere3D ;
const Plane3D = geo.Plane3D ;
const Circle3D = geo.Circle3D ;
//geo.setFastMode( true ) ;

const GmTracer = require( '../../lib/tracer/GmTracer.js' ) ;
const gm = require( 'gm' ) ;

const random = math.random ;
var rng = new math.random.MersenneTwister() ;
rng.seed() ;





/* Tests */



function trace( img , gen ) {
	var r , pos , lastPos = new Vector2D() ;

	if ( ( r = gen.next() ).done ) { return ; }

	lastPos.setVector( r.value ) ;

	while ( ! ( r = gen.next() ).done ) {
		pos = r.value ;
		img.drawLine( lastPos.x , lastPos.y , pos.x , pos.y ) ;
		lastPos.setVector( pos ) ;
	}
}





/* Tests */



describe( "Circle" , () => {

	it( "Circle random shortest point" , async () => {
		var tracer = new GmTracer( {
			size: 600 , bgColor: '#000' ,
			xmin: -12 , xmax: 12 , ymin: -12 , ymax: 12 , every: 1 ,
		} ) ;

		var i , test , projected , segment ,
			tries = 200 ,
			position = new Vector2D() ,
			circle = new Circle2D(
				rng.randomFloatRange( tracer.xMin / 2 , tracer.xMax / 2 ) ,
				rng.randomFloatRange( tracer.yMin / 2 , tracer.yMax / 2 ) ,
				rng.randomFloatRange( ( tracer.xMax - tracer.xMin ) / 10 , ( tracer.xMax - tracer.xMin ) / 3 )
			) ;

		tracer.createImage() ;
		tracer.trace( circle , '#0f0' ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			//console.log( ">>> New segment" ) ;
			position.set(
				rng.randomFloatRange( tracer.xMin , tracer.xMax ) ,
				rng.randomFloatRange( tracer.yMin , tracer.yMax )
			) ;

			projected = circle.pointProjection( position ) ;
			test = circle.testVector( position ) ;
			segment = BoundVector2D.fromTo( position , projected ) ;
			//console.log( ">>>" , segment ) ;
			tracer.trace( segment , test > 0 ? '#ff8' : '#8ff' ) ;
		}

		//console.log( ">>> end" ) ;

		await tracer.saveImage( __dirname + "/circle-point-projection.png" ) ;
	} ) ;

	it( "Circle intersection" , async () => {
		var tracer = new GmTracer( {
			size: 600 , bgColor: '#000' ,
			xmin: -12 , xmax: 12 , ymin: -12 , ymax: 12 , every: 1 ,
		} ) ;

		var i , test , segment , array ,
			tries = 50 ,
			line = new BoundVector2D() ,
			circle = new Circle2D(
				rng.randomFloatRange( tracer.xMin / 2 , tracer.xMax / 2 ) ,
				rng.randomFloatRange( tracer.yMin / 2 , tracer.yMax / 2 ) ,
				rng.randomFloatRange( ( tracer.xMax - tracer.xMin ) / 10 , ( tracer.xMax - tracer.xMin ) / 3 )
			) ;

		tracer.createImage() ;
		tracer.trace( circle , '#00f' ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			line.set(
				rng.randomFloatRange( tracer.xMin , tracer.xMax ) ,
				rng.randomFloatRange( tracer.yMin , tracer.yMax ) ,
				rng.randomFloatRange( -5 , 5 ) ,
				rng.randomFloatRange( -5 , 5 )
			) ;

			array = circle.lineIntersection( line ) ;
			//console.log( '#' + i , array ) ;

			if ( ! array ) {
				tracer.trace( line , '#f00' ) ;
			}
			else {
				tracer.trace( line , '#0f0' ) ;
				tracer.trace( array[ 0 ] , '#ad0' , undefined , 4 ) ;

				//console.log( 'a:' , circle.pointDistance( array[ 0 ] ) ) ;

				if ( array[ 1 ] ) {
					tracer.trace( array[ 1 ] , '#0ad' , undefined , 4 ) ;
					//console.log( 'b:' , circle.pointDistance( array[ 1 ] ) ) ;
				}
			}
		}

		await tracer.saveImage( __dirname + "/circle-intersection.png" ) ;
	} ) ;
} ) ;



describe( "Ellipse" , () => {

	it( "Ellipse random shortest point" , ( done ) => {
		var i , test , tries = 200 , size = 600 , v ;

		var img = gm( size , size , "#000" ) ;
		var position = new Vector2D() ;
		var projected ;

		img.fill( "#fff6" ) ;

		var semiMajor = rng.random( size / 5 , size / 3 ) ;
		var semiMinor = rng.random( semiMajor ) ;
		//var majorAxis = new Vector2D( v = rng.random( - 100 , 100 ) , v ) ;
		var majorAxis = new Vector2D( rng.random( -100 , 100 ) , rng.random( -100 , 100 ) ) ;
		//var majorAxis = Vector2D( 1 , 0 ) ;

		console.log( 'Axis size:' , semiMajor , semiMinor ) ;

		var ellipse = new Ellipse2D( size / 2 , size / 2 , majorAxis.x , majorAxis.y , semiMajor , semiMinor ) ;

		img.stroke( "#0f0" ) ;
		trace( img , ellipse.tracer( 1 ) ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			position.set(
				rng.random( 1 , size - 1 ) ,
				rng.random( 1 , size - 1 )
				//v = rng.random( 1 , size - 1 ) , v
			) ;
			//console.log( v ) ;

			projected = ellipse.pointProjection( position ) ;
			//console.log( '#' + i , position , projected ) ;

			if ( ! projected.x || ! projected.y ) {
				console.log( 'Null vector?' , projected ) ;
				continue ;
			}

			test = ellipse.testVector( position ) ;
			img.stroke( test > 0 ? '#ff8' : '#8ff' ) ;
			img.drawLine( position.x , position.y , projected.x , projected.y ) ;
			//img.drawPoint( projected.x , projected.y ) ;
		}

		img.write( __dirname + "/ellipse-point-projection.png" , done ) ;
	} ) ;

	it( "Ellipse projection toward center" , ( done ) => {
		var i , test , tries = 200 , size = 600 ;

		var img = gm( size , size , "#000" ) ;
		var position = new Vector2D() ;
		var projected ;

		img.fill( "#fff6" ) ;

		var semiMajor = rng.random( size / 5 , size / 3 ) ;
		var semiMinor = rng.random( semiMajor ) ;
		var majorAxis = new Vector2D( rng.random( -100 , 100 ) , rng.random( -100 , 100 ) ) ;
		//var majorAxis = new Vector2D( 1 , 0 ) ;

		//console.log( 'Axis size:' , semiMajor , semiMinor ) ;

		var ellipse = new Ellipse2D( size / 2 , size / 2 , majorAxis.x , majorAxis.y , semiMajor , semiMinor ) ;

		img.stroke( "#0f0" ) ;
		trace( img , ellipse.tracer( 1 ) ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			position.set(
				rng.random( 1 , size - 1 ) ,
				rng.random( 1 , size - 1 )
			) ;

			projected = ellipse.pointProjectionTowardCenter( position ) ;
			//console.log( '#' + i , position , projected ) ;

			if ( ! projected.x || ! projected.y ) {
				console.log( 'Null vector?' ) ;
				continue ;
			}

			test = ellipse.testVector( position ) ;
			img.stroke( test > 0 ? '#ff8' : '#8ff' ) ;
			img.drawLine( position.x , position.y , projected.x , projected.y ) ;
			//img.drawPoint( projected.x , projected.y ) ;
		}

		img.write( __dirname + "/ellipse-point-projection-toward-center.png" , done ) ;
	} ) ;

	it( "Ellipse intersection" , ( done ) => {
		var i , test , tries = 50 , size = 600 ;

		var img = gm( size , size , "#000" ) ;
		var line = new BoundVector2D() ;
		var array ;

		img.fill( "#000f" ) ;

		var semiMajor = rng.random( size / 5 , size / 3 ) ;
		var semiMinor = rng.random( semiMajor ) ;
		var majorAxis = new Vector2D( rng.random( -100 , 100 ) , rng.random( -100 , 100 ) ) ;
		//var majorAxis = new Vector2D( 1 , 0 ) ;

		//console.log( 'Axis size:' , semiMajor , semiMinor ) ;

		var ellipse = new Ellipse2D( size / 2 , size / 2 , majorAxis.x , majorAxis.y , semiMajor , semiMinor ) ;

		img.stroke( "#00f" ) ;
		trace( img , ellipse.tracer( 1 ) ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			line.set(
				rng.random( 1 , size - 1 ) ,
				rng.random( 1 , size - 1 ) ,
				rng.random( -50 , 50 ) ,
				rng.random( -50 , 50 )
			) ;

			array = ellipse.lineIntersection( line ) ;
			//console.log( '#' + i , position , projected ) ;

			if ( ! array ) {
				img.stroke( '#f00' ) ;
				img.drawLine( line.position.x , line.position.y , line.position.x + line.vector.x , line.position.y + line.vector.y ) ;
			}
			else {
				img.stroke( '#0f0' ) ;
				img.drawLine( line.position.x , line.position.y , line.position.x + line.vector.x , line.position.y + line.vector.y ) ;

				img.stroke( '#ad0' ) ;
				img.drawCircle( array[ 0 ].x , array[ 0 ].y , array[ 0 ].x + 4 , array[ 0 ].y + 4 ) ;

				if ( array[ 1 ] ) {
					img.stroke( '#0da' ) ;
					img.drawCircle( array[ 1 ].x , array[ 1 ].y , array[ 1 ].x + 4 , array[ 1 ].y + 4 ) ;
				}
			}
		}

		img.write( __dirname + "/ellipse-intersection.png" , done ) ;
	} ) ;
} ) ;

