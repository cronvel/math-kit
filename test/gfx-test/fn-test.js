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
const GmTracer = require( '../../lib/tracer/GmTracer.js' ) ;

//const random = math.random ;
const rng = new math.random.MersenneTwister() ;
rng.seed() ;



describe( "InterpolatedFn" , () => {

	it( "Simple interpolated fn" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -1 ,
			xmax: 6 ,
			ymin: -1 ,
			ymax: 8 ,
			every: 1
			//xUnit: 'rpm' , yUnit: 'hp'
		} ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 1 , fx: 1 } ,
			{ x: 3 , fx: 5 } ,
			{ x: 5 , fx: 1 }
		] ) ;

		tracer.createImage() ;
		tracer.drawAxis() ;
		//tracer.traceFn( fn , '#0f0' ) ;
		tracer.trace( fn , '#f0f' ) ;
		tracer.traceFn( fn.createDfxFn() , '#00f' ) ;
		tracer.traceFn( fn.createSfxFn() , '#f00' ) ;
		tracer.traceControlPoints( fn ) ;

		await tracer.saveImage( __dirname + "/simple-interpolated-fn.png" ) ;
	} ) ;

	it( "Simple interpolated fn2" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -1 ,
			xmax: 6 ,
			ymin: -1 ,
			ymax: 8 ,
			every: 1
			//xUnit: 'rpm' , yUnit: 'hp'
		} ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 1 , fx: 1 } ,
			{ x: 2 , fx: 3 } ,
			{ x: 4 , fx: 3 } ,
			{ x: 5 , fx: 5 }
		] ) ;

		tracer.createImage() ;
		tracer.drawAxis() ;
		tracer.traceFn( fn , '#0f0' ) ;
		tracer.traceFn( fn.createDfxFn() , '#00f' ) ;
		tracer.traceFn( fn.createSfxFn() , '#f00' ) ;
		tracer.traceControlPoints( fn ) ;

		await tracer.saveImage( __dirname + "/simple-interpolated-fn2.png" ) ;
	} ) ;

	it( "Simple interpolated fn3" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -1 ,
			xmax: 6 ,
			ymin: -1 ,
			ymax: 8 ,
			every: 1
			//xUnit: 'rpm' , yUnit: 'hp'
		} ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 1 , fx: 1 } ,
			{ x: 2 , fx: 3.5 } ,
			{ x: 4 , fx: 2.5 } ,
			{ x: 5 , fx: 5 }
		] ) ;

		tracer.createImage() ;
		tracer.drawAxis() ;
		tracer.traceFn( fn , '#0f0' ) ;
		tracer.traceFn( fn.createDfxFn() , '#00f' ) ;
		tracer.traceFn( fn.createSfxFn() , '#f00' ) ;
		tracer.traceControlPoints( fn ) ;

		await tracer.saveImage( __dirname + "/simple-interpolated-fn3.png" ) ;
	} ) ;

	it( "Simple interpolated fn4" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -1 ,
			xmax: 6 ,
			ymin: -1 ,
			ymax: 8 ,
			every: 1
			//xUnit: 'rpm' , yUnit: 'hp'
		} ) ;

		var fn = new math.fn.InterpolatedFn( [
			{ x: 0 , fx: 2.5 } ,
			{ x: 1 , fx: 3 } ,
			{ x: 2 , fx: 4 } ,
			{ x: 3 , fx: 4.7 } ,
			{ x: 4 , fx: 4.9 } ,
			{ x: 5 , fx: 4 } ,
			{ x: 6 , fx: 3.5 }
		] ) ;

		tracer.createImage() ;
		tracer.drawAxis() ;
		tracer.traceFn( fn , '#0f0' ) ;
		tracer.traceFn( fn.createDfxFn() , '#00f' ) ;
		tracer.traceFn( fn.createSfxFn() , '#f00' ) ;
		tracer.traceControlPoints( fn ) ;

		await tracer.saveImage( __dirname + "/simple-interpolated-fn4.png" ) ;
	} ) ;

	it( "Random interpolated fn" , async () => {
		var tracer = new GmTracer( {
			size: 600 ,
			bgColor: '#000' ,
			xmin: -1 ,
			xmax: 6 ,
			ymin: -3 ,
			ymax: 12 ,
			every: 1
			//xUnit: 'rpm' , yUnit: 'hp'
		} ) ;

		var x , fx , lastFx = 2 , array = [] ;

		for ( x = tracer.bbox.min.x + rng.randomFloatRange( 0 , 0.8 ) ; x <= tracer.bbox.max.x ; x += rng.randomFloatRange( 0.2 , 0.8 ) ) {
			fx = lastFx + rng.randomFloatRange( -3 , 3 ) ;
			array.push( { x , fx } ) ;
			lastFx = fx ;
		}

		var fn = new math.fn.InterpolatedFn( array , { preserveExtrema: false , atanMeanDfx: true } ) ;

		tracer.createImage() ;
		tracer.drawAxis() ;
		tracer.traceFn( fn , '#0f0' ) ;
		tracer.traceFn( fn.createDfxFn() , '#00f' ) ;
		tracer.traceFn( fn.createSfxFn() , '#f00' ) ;
		tracer.traceControlPoints( fn ) ;

		await tracer.saveImage( __dirname + "/random-interpolated-fn.png" ) ;
	} ) ;
} ) ;



describe( "Const2ndOrdDifferentialEquationFn" , () => {

	it( "Simple constant 2nd order differential equation" , async () => {
		var tracer = new GmTracer( {
			height: 600 ,
			width: 800 ,
			bgColor: '#000' ,
			xmin: -1 ,
			xmax: 6 ,
			ymin: -5 ,
			ymax: 5 ,
			every: 1
			//xUnit: 'rpm' , yUnit: 'hp'
		} ) ;

		var fn = new math.fn.Const2ndOrdDifferentialEquationFn( 1 , 1 , 0 , 0 , 1 ) ;

		tracer.createImage() ;
		tracer.drawAxis() ;
		tracer.traceFn( fn ) ;
		tracer.traceDFn( fn ) ;
		tracer.traceD2Fn( fn ) ;
		console.log( "At 10:" , fn.fx( 10 ) , fn.dfx( 10 ) , fn.d2fx( 10 ) ) ;

		await tracer.saveImage( __dirname + "/differential-equation-fn.png" ) ;
	} ) ;

	it( "zzz Spring-Damper-Mass system" , async () => {
		var tracer = new GmTracer( {
			height: 600 ,
			width: 800 ,
			bgColor: '#000' ,
			xmin: 0 ,
			xmax: 10 ,
			ymin: -4 ,
			ymax: 4 ,
			every: 1
			//xUnit: 'rpm' , yUnit: 'hp'
		} ) ;

		var springK , damperD , mass , p0 , v0 , externalForce ;
		
		springK = 200 ;
		damperD = 10 ;
		mass = 10 ;
		p0 = -1 ;
		v0 = 0 ;
		externalForce = -9.8 * mass ;

		var fn = math.fn.Const2ndOrdDifferentialEquationFn.createSpringDamperMass( springK , damperD , mass , p0 , v0 , externalForce ) ;

		tracer.createImage() ;
		tracer.drawGrid() ;
		tracer.drawAxis() ;
		tracer.drawUnits() ;
		tracer.traceFn( fn ) ;
		tracer.traceDFn( fn ) ;
		tracer.traceD2Fn( fn ) ;
		
		var DELTA = 0.00001 ;

		log( "Δ:%[.5]f" , fn.discriminant ) ;

		for ( let x = 0 ; x <= tracer.bbox.max.x ; x += tracer.bbox.max.x / 10 ) {
			log( ">>> #%f -- y:%[.5]f y':%[.5]f y\":%[.5]f" , x , fn.fx( x ) , fn.dfx( x ) , fn.d2fx( x ) ) ;
			let dfx = ( fn.fx( x + DELTA ) - fn.fx( x - DELTA ) ) / ( DELTA * 2 ) ;
			let d2fx = ( fn.dfx( x + DELTA ) - fn.dfx( x - DELTA ) ) / ( DELTA * 2 ) ;
			log( "    y':%[.5]f   expected y':%[.5]f   ΔE:%[.5]f" , fn.dfx( x ) , dfx , fn.dfx( x ) - dfx ) ;
			log( "    y\":%[.5]f   expected y\":%[.5]f   ΔE:%[.5]f" , fn.d2fx( x ) , d2fx , fn.d2fx( x ) - d2fx ) ;
			let left = fn.d2fx( x ) + ( damperD / mass ) * fn.dfx( x ) + ( springK / mass ) * fn.fx( x ) ;
			log( "    %[.5]f = %[.5]f ? ΔE:%[.5]f" , left , fn.constant , left - fn.constant ) ;
			//let left2 = fn.d2fx( x ) + fn.dfx( x ) + fn.fx( x ) ;
			//log( "    without coeffs: %[.5]f = %[.5]f ? ΔE:%[.5]f" , left2 , fn.constant , left2 - fn.constant ) ;
		}

		await tracer.saveImage( __dirname + "/differential-equation-fn.png" ) ;
	} ) ;
} ) ;

