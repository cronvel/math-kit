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
const units = math.units ;



describe( "Unit conversion" , () => {

	it( "basic conversions" , () => {
		var unitSet = new units.UnitSet() ;
		unitSet.add( 'm' ) ;
		unitSet.add( 'km' , 1000 , 'm' ) ;
		unitSet.add( 'mile' , 1609.344 , 'm' ) ;
		expect( unitSet.convert( 30 , 'km' , 'mile' ) ).to.be.around( 18.64113576712002 ) ;

		unitSet = new units.UnitSet() ;
		unitSet.add( 'm' , 'meter' ) ;
		unitSet.add( 'km' , 'kilometer' , 1000 , 'm' ) ;
		unitSet.add( 'mi' , 'mile' , 1.609344 , 'km' ) ;
		expect( unitSet.convert( 30 , 'km' , 'mile' ) ).to.be.around( 18.64113576712002 ) ;
		expect( unitSet.convert( 30 , 'km' , 'mi' ) ).to.be.around( 18.64113576712002 ) ;

		unitSet = new units.UnitSet() ;
		unitSet.add( 'm' , 'meter' ) ;
		unitSet.add( 'km' , 'kilometer' , 1000 , 'm' ) ;
		unitSet.add( 'yd' , 'yard' , 0.9144 , 'm' , { alias: 'yards' } ) ;
		unitSet.add( 'mi' , 'mile' , 1760 , 'yard' , { aliases: [ 'miles' , 'mi.' ] } ) ;
		//unitSet.add( 'mile' , 1.609344 , 'km' ) ;
		expect( unitSet.convert( 30 , 'km' , 'mile' ) ).to.be.around( 18.64113576712002 ) ;
		expect( unitSet.convert( 30 , 'km' , 'miles' ) ).to.be.around( 18.64113576712002 ) ;
		expect( unitSet.convert( 30 , 'kilometer' , 'mi' ) ).to.be.around( 18.64113576712002 ) ;
		expect( unitSet.convert( 30 , 'kilometer' , 'mi.' ) ).to.be.around( 18.64113576712002 ) ;
	} ) ;

	it( "automatic multipliers creation" , () => {
		var unitSet = new units.UnitSet() ;
		unitSet.add( 'm' , 'meter' , { multipliers: 'powerOf10' } ) ;
		//console.log( unitSet ) ;
		unitSet.add( 'mile' , 1609.344 , 'm' ) ;
		expect( unitSet.convert( 30 , 'km' , 'mile' ) ).to.be.around( 18.64113576712002 ) ;
		expect( unitSet.convert( 30 , 'cm' , 'mile' ) ).to.be.around( 0.00018641135767120018 ) ;
		expect( unitSet.convert( 2 , 'mile' , 'millimeter' ) ).to.be.around( 3218688 ) ;
	} ) ;

	it( "compound unit conversion" , () => {
		var unitSet = new units.UnitSet() ;
		unitSet.add( 'm' , 'meter' , { multipliers: 'powerOf10' } ) ;
		unitSet.add( 'mile' , 1609.344 , 'm' ) ;
		unitSet.add( 's' , 'second' ) ;
		unitSet.add( 'h' , 'hour' , 3600 , 's' ) ;
		//expect( unitSet.convert( 3 , 'h' , 's' ) ).to.be( 10800 ) ;
		
		/*
		log( "%[4]I" , unitSet.parseCompound( 'km' ) ) ;
		log( "%[4]I" , unitSet.parseCompound( 'km/s' ) ) ;
		log( "%[4]I" , unitSet.parseCompound( 'm/s2' ) ) ;
		*/

		expect( unitSet.convertCompound( 40 , 'km.h-1' , 'm/s' ) ).to.be.around( 11.11111111111111 ) ;
		expect( unitSet.convertCompound( 40 , 'km.h⁻¹' , 'm/s' ) ).to.be.around( 11.11111111111111 ) ;
		expect( unitSet.convertCompound( 40 , 'km.h⁻¹' , 'm.s⁻¹' ) ).to.be.around( 11.11111111111111 ) ;

		expect( unitSet.convertCompound( 20 , 'cm²' , 'm²' ) ).to.be.around( 0.002 ) ;
		expect( unitSet.convertCompound( 20 , 'cm³' , 'm³' ) ).to.be.around( 0.00002 ) ;
	} ) ;
} ) ;

