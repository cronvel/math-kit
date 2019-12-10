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



const math = require( '..' ) ;
const Quaternion = math.Quaternion ;



describe( "Quaternion" , () => {

	it( "constructor" , () => {
		expect( new Quaternion( 1 , 0.5 , -2 , -1.5 ) ).to.be.like( { w: 1 , x: 0.5 , y: -2 , z: -1.5 } ) ;
	} ) ;

	it( "to/from euler" , () => {
		var q = Quaternion.fromEulerDeg( 45 , 50 ) ;
		expect( q.norm ).to.be( 1 ) ;
		expect( q.toEulerDeg() ).to.equal( {
			yaw: 45 ,
			pitch: 50 ,
			roll: 4.948064700585223e-15
		} ) ;
		expect( q.toEuler() ).to.equal( {
			yaw: 0.7853981633974483 ,
			pitch: 0.8726646259971648 ,
			roll: 8.636002062691953e-17
		} ) ;
	} ) ;

	it( "multiply" , () => {
		var q , q2 ;
		
		q = Quaternion.fromEulerDeg( 30 ) ;
		expect( q.norm ).to.be.around( 1 ) ;
		expect( q.toEulerDeg() ).to.equal( {
			yaw: 29.999999999999993 ,
			pitch: 0 ,
			roll: 0
		} ) ;
		
		q2 = q.multiply( q ) ;
		expect( q2.norm ).to.be.around( 1 ) ;
		expect( q2.toEulerDeg() ).to.equal( {
			yaw: 59.99999999999999 ,
			pitch: 0 ,
			roll: 0
		} ) ;

		q2 = q2.multiply( Quaternion.fromEulerDeg( 0 , 60 ) ) ;
		expect( q2.norm ).to.be.around( 1 ) ;
		expect( q2.toEulerDeg() ).to.equal( {
			yaw: 59.99999999999999 ,
			pitch: 59.99999999999999 ,
			roll: 0
		} ) ;

		// Now this is interesting: we can move farther than the zenith, and have the head down
		q2 = q2.multiply( Quaternion.fromEulerDeg( 0 , 50 ) ) ;
		expect( q2.norm ).to.be.around( 1 ) ;
		expect( q2.toEulerDeg() ).to.equal( {
			yaw: -120.00000000000001 ,
			pitch: 70.00000000000003 ,
			roll: 180
		} ) ;
	} ) ;
} ) ;

