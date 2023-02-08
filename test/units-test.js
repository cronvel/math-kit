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

	it( "zero offset" , () => {
		var unitSet = new units.UnitSet() ;
		unitSet.add( 'K' , 'kelvin' ) ;
		unitSet.add( '°C' , 'celsius' , 1 , 'K' , { zeroOffset: 273.15 } ) ;
		unitSet.add( '°F' , 'fahrenheit' , 5/9 , 'K' , { zeroOffset: 459.67 } ) ;

		expect( unitSet.convert( 0 , 'K' , '°C' ) ).to.be.around( -273.15 ) ;
		expect( unitSet.convert( 0 , 'K' , '°F' ) ).to.be.around( -459.67 ) ;
		expect( unitSet.convert( 25 , '°C' , 'K' ) ).to.be.around( 298.15 ) ;
		expect( unitSet.convert( 120 , 'K' , '°C' ) ).to.be.around( -153.15 ) ;

		expect( unitSet.convert( 0 , '°C' , 'K' ) ).to.be.around( 273.15 ) ;
		expect( unitSet.convert( 0 , '°C' , '°F' ) ).to.be.around( 32 , 0.000001 ) ;

		expect( unitSet.convert( 100 , '°C' , 'K' ) ).to.be.around( 373.15 ) ;
		expect( unitSet.convert( 100 , '°C' , '°F' ) ).to.be.around( 212 , 0.000001 ) ;

		expect( unitSet.convert( -40 , '°C' , '°F' ) ).to.be.around( -40 , 0.000001 ) ;
		expect( unitSet.convert( -40 , '°F' , '°C' ) ).to.be.around( -40 , 0.000001 ) ;
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
		expect( unitSet.convertCompound( 40 , 'km/h' , 'm.s⁻¹' ) ).to.be.around( 11.11111111111111 ) ;
		expect( unitSet.convertCompound( 40 , 'km/h' , 'm/s' ) ).to.be.around( 11.11111111111111 ) ;

		expect( unitSet.convertCompound( 20 , 'cm²' , 'm²' ) ).to.be.around( 0.002 ) ;
		expect( unitSet.convertCompound( 20 , 'cm³' , 'm³' ) ).to.be.around( 0.00002 ) ;

		// Implicit compound conversion
		expect( unitSet.convert( 40 , 'km.h-1' , 'm/s' ) ).to.be.around( 11.11111111111111 ) ;
		expect( unitSet.convert( 40 , 'km.h⁻¹' , 'm/s' ) ).to.be.around( 11.11111111111111 ) ;
		expect( unitSet.convert( 40 , 'km.h⁻¹' , 'm.s⁻¹' ) ).to.be.around( 11.11111111111111 ) ;
		expect( unitSet.convert( 40 , 'km/h' , 'm.s⁻¹' ) ).to.be.around( 11.11111111111111 ) ;
		expect( unitSet.convert( 40 , 'km/h' , 'm/s' ) ).to.be.around( 11.11111111111111 ) ;

		expect( unitSet.convert( 20 , 'cm²' , 'm²' ) ).to.be.around( 0.002 ) ;
		expect( unitSet.convert( 20 , 'cm³' , 'm³' ) ).to.be.around( 0.00002 ) ;
	} ) ;

	it( "unit having compound unit as root, converting units having the same root compound unit" , () => {
		var unitSet = new units.UnitSet() ;
		unitSet.add( 'm' , 'meter' , { multipliers: 'powerOf10' } ) ;
		unitSet.add( 'L' , 'Litre' , 0.001 , 'm³' , { multipliers: 'powerOf10' } ) ;
		unitSet.add( 'US gal' , 'US Gallon' , 3.785411784 , 'L' , { alias: 'gal' } ) ;

		expect( unitSet.convert( 10 , 'L' , 'm³' ) ).to.be.around( 0.01 ) ;
		expect( unitSet.convert( 8 , 'hL' , 'm³' ) ).to.be.around( 0.8 ) ;
		expect( unitSet.convert( 8 , 'mL' , 'cm³' ) ).to.be.around( 8 ) ;
		expect( unitSet.convert( 8 , 'L' , 'dm³' ) ).to.be.around( 8 ) ;

		expect( unitSet.convert( 8 , 'm³' , 'L' ) ).to.be.around( 8000 ) ;
		expect( unitSet.convert( 8 , 'cm³' , 'L' ) ).to.be.around( 0.008 ) ;

		expect( unitSet.convert( 10 , 'gal' , 'L' ) ).to.be.around( 37.85411784 ) ;
		expect( unitSet.convert( 1000 , 'gal' , 'hL' ) ).to.be.around( 37.85411784 ) ;
		expect( unitSet.convert( 10 , 'gal' , 'm³' ) ).to.be.around( 0.03785411784 ) ;
		expect( unitSet.convert( 10 , 'gal' , 'cm³' ) ).to.be.around( 37854.11784 ) ;

		expect( unitSet.convert( 10 , 'L' , 'gal' ) ).to.be.around( 2.6417205235814842 ) ;
		expect( unitSet.convert( 10 , 'cm³' , 'gal' ) ).to.be.around( 0.0026417205235814843 ) ;
	} ) ;

	it( "unit having compound unit as root, converting units having different root compound unit" , () => {
		var unitSet = new units.UnitSet() ;

		unitSet.add( 'm' , 'meter' , { multipliers: 'powerOf10' } ) ;
		unitSet.add( 'L' , 'Litre' , 0.001 , 'm³' , { multipliers: 'powerOf10' } ) ;

		unitSet.add( 'in' , 'inch' , 25.4 , 'mm' ) ;
		unitSet.add( 'US gal' , 'US Gallon' , 231 , 'in³' , { alias: 'gal' } ) ;

		expect( unitSet.convert( 10 , 'gal' , 'L' ) ).to.be.around( 37.85411784 ) ;
		expect( unitSet.convert( 1000 , 'gal' , 'hL' ) ).to.be.around( 37.85411784 ) ;
		expect( unitSet.convert( 10 , 'gal' , 'm³' ) ).to.be.around( 0.03785411784 ) ;
		expect( unitSet.convert( 10 , 'gal' , 'cm³' ) ).to.be.around( 37854.11784 ) ;

		expect( unitSet.convert( 10 , 'L' , 'gal' ) ).to.be.around( 2.6417205235814842 ) ;
		expect( unitSet.convert( 10 , 'cm³' , 'gal' ) ).to.be.around( 0.0026417205235814843 ) ;
	} ) ;
} ) ;
	
