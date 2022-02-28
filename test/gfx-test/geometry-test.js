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

//const random = math.random ;
var rng = new math.random.MersenneTwister() ;
rng.seed() ;



describe( "Circle" , () => {

	it( "Circle random shortest point" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -12 ,
			xmax: 12 ,
			ymin: -12 ,
			ymax: 12 ,
			every: 1
		} ) ;

		var i , test , projected , segment ,
			tries = 200 ,
			position = new Vector2D() ,
			circle = new Circle2D(
				rng.randomFloatRange( tracer.bbox.min.x / 2 , tracer.bbox.max.x / 2 ) ,
				rng.randomFloatRange( tracer.bbox.min.y / 2 , tracer.bbox.max.y / 2 ) ,
				rng.randomFloatRange( ( tracer.bbox.max.x - tracer.bbox.min.x ) / 10 , ( tracer.bbox.max.x - tracer.bbox.min.x ) / 3 )
			) ;

		tracer.createImage() ;
		tracer.trace( circle , '#0f0' ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			//console.log( ">>> New segment" ) ;
			position.set(
				rng.randomFloatRange( tracer.bbox.min.x , tracer.bbox.max.x ) ,
				rng.randomFloatRange( tracer.bbox.min.y , tracer.bbox.max.y )
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
			size: 600 ,
			bgColor: '#000' ,
			xmin: -12 ,
			xmax: 12 ,
			ymin: -12 ,
			ymax: 12 ,
			every: 1
		} ) ;

		var i , array ,
			tries = 50 ,
			line = new BoundVector2D() ,
			circle = new Circle2D(
				rng.randomFloatRange( tracer.bbox.min.x / 2 , tracer.bbox.max.x / 2 ) ,
				rng.randomFloatRange( tracer.bbox.min.y / 2 , tracer.bbox.max.y / 2 ) ,
				rng.randomFloatRange( ( tracer.bbox.max.x - tracer.bbox.min.x ) / 10 , ( tracer.bbox.max.x - tracer.bbox.min.x ) / 3 )
			) ;

		tracer.createImage() ;
		tracer.trace( circle , '#00f' ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			line.set(
				rng.randomFloatRange( tracer.bbox.min.x , tracer.bbox.max.x ) ,
				rng.randomFloatRange( tracer.bbox.min.y , tracer.bbox.max.y ) ,
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

	it( "Ellipse random shortest point" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -12 ,
			xmax: 12 ,
			ymin: -12 ,
			ymax: 12 ,
			every: 1
		} ) ;

		var i , test , projected , segment ,
			tries = 200 ,
			position = new Vector2D() ,
			semiMajor = rng.randomFloatRange( tracer.bbox.max.x * 0.3 , tracer.bbox.max.x * 0.7 ) ,
			semiMinor = rng.randomFloatRange( 0 , semiMajor ) ,
			//majorAxis = new Vector2D( v = rng.random( - 100 , 100 ) , v ) ,
			majorAxis = new Vector2D( rng.randomFloatRange( -tracer.bbox.max.x / 2 , tracer.bbox.max.x / 2 ) , rng.randomFloatRange( -tracer.bbox.max.y / 2 , tracer.bbox.max.y / 2 ) ) ,
			//majorAxis = Vector2D( 1 , 0 ) ,
			ellipse = new Ellipse2D(
				rng.randomFloatRange( tracer.bbox.min.x / 2 , tracer.bbox.max.x / 2 ) ,
				rng.randomFloatRange( tracer.bbox.min.y / 2 , tracer.bbox.max.y / 2 ) ,
				majorAxis.x , majorAxis.y , semiMajor , semiMinor
			) ;

		tracer.createImage() ;
		tracer.trace( ellipse , '#0f0' ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			position.set(
				rng.randomFloatRange( tracer.bbox.min.x , tracer.bbox.max.x ) ,
				rng.randomFloatRange( tracer.bbox.min.y , tracer.bbox.max.y )
			) ;
			//console.log( v ) ;

			projected = ellipse.pointProjection( position ) ;
			//console.log( '#' + i , position , projected ) ;

			if ( ! projected.x || ! projected.y ) {
				console.log( 'Null vector?' , projected ) ;
				continue ;
			}

			test = ellipse.testVector( position ) ;
			segment = BoundVector2D.fromTo( position , projected ) ;
			tracer.trace( segment , test > 0 ? '#ff8' : '#8ff' ) ;
		}

		await tracer.saveImage( __dirname + "/ellipse-point-projection.png" ) ;
	} ) ;

	it( "Ellipse projection toward center" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -12 ,
			xmax: 12 ,
			ymin: -12 ,
			ymax: 12 ,
			every: 1
		} ) ;

		var i , test , projected , segment ,
			tries = 200 ,
			position = new Vector2D() ,
			semiMajor = rng.randomFloatRange( tracer.bbox.max.x * 0.3 , tracer.bbox.max.x * 0.7 ) ,
			semiMinor = rng.randomFloatRange( 0 , semiMajor ) ,
			//majorAxis = new Vector2D( v = rng.random( - 100 , 100 ) , v ) ,
			majorAxis = new Vector2D( rng.randomFloatRange( -tracer.bbox.max.x / 2 , tracer.bbox.max.x / 2 ) , rng.randomFloatRange( -tracer.bbox.max.y / 2 , tracer.bbox.max.y / 2 ) ) ,
			//majorAxis = Vector2D( 1 , 0 ) ,
			ellipse = new Ellipse2D(
				rng.randomFloatRange( tracer.bbox.min.x / 2 , tracer.bbox.max.x / 2 ) ,
				rng.randomFloatRange( tracer.bbox.min.y / 2 , tracer.bbox.max.y / 2 ) ,
				majorAxis.x , majorAxis.y , semiMajor , semiMinor
			) ;

		tracer.createImage() ;
		tracer.trace( ellipse , '#0f0' ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			position.set(
				rng.randomFloatRange( tracer.bbox.min.x , tracer.bbox.max.x ) ,
				rng.randomFloatRange( tracer.bbox.min.y , tracer.bbox.max.y )
			) ;

			projected = ellipse.pointProjectionTowardCenter( position ) ;
			//console.log( '#' + i , position , projected ) ;

			if ( ! projected.x || ! projected.y ) {
				console.log( 'Null vector?' ) ;
				continue ;
			}

			test = ellipse.testVector( position ) ;
			segment = BoundVector2D.fromTo( position , projected ) ;
			tracer.trace( segment , test > 0 ? '#ff8' : '#8ff' ) ;
		}

		await tracer.saveImage( __dirname + "/ellipse-point-projection-toward-center.png" ) ;
	} ) ;

	it( "Ellipse intersection" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -12 ,
			xmax: 12 ,
			ymin: -12 ,
			ymax: 12 ,
			every: 1
		} ) ;

		var i , array ,
			tries = 50 ,
			line = new BoundVector2D() ,
			semiMajor = rng.randomFloatRange( tracer.bbox.max.x * 0.3 , tracer.bbox.max.x * 0.7 ) ,
			semiMinor = rng.randomFloatRange( 0 , semiMajor ) ,
			//majorAxis = new Vector2D( v = rng.random( - 100 , 100 ) , v ) ,
			majorAxis = new Vector2D( rng.randomFloatRange( -tracer.bbox.max.x / 2 , tracer.bbox.max.x / 2 ) , rng.randomFloatRange( -tracer.bbox.max.y / 2 , tracer.bbox.max.y / 2 ) ) ,
			//majorAxis = Vector2D( 1 , 0 ) ,
			ellipse = new Ellipse2D(
				rng.randomFloatRange( tracer.bbox.min.x / 2 , tracer.bbox.max.x / 2 ) ,
				rng.randomFloatRange( tracer.bbox.min.y / 2 , tracer.bbox.max.y / 2 ) ,
				majorAxis.x , majorAxis.y , semiMajor , semiMinor
			) ;

		tracer.createImage() ;
		tracer.trace( ellipse , '#00f' ) ;

		for ( i = 0 ; i < tries ; i ++ ) {
			line.set(
				rng.randomFloatRange( tracer.bbox.min.x , tracer.bbox.max.x ) ,
				rng.randomFloatRange( tracer.bbox.min.y , tracer.bbox.max.y ) ,
				rng.randomFloatRange( -5 , 5 ) ,
				rng.randomFloatRange( -5 , 5 )
			) ;

			array = ellipse.lineIntersection( line ) ;
			//console.log( '#' + i , position , projected ) ;

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

		await tracer.saveImage( __dirname + "/ellipse-intersection.png" ) ;
	} ) ;
} ) ;

