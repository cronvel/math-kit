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

"use strict" ;




/*
	name: (string) name of the unit
	value: (number) (default: 1) value of the unit in the reference unit
	reference: (null|string) (default: null) name of the unit of reference, if null the current unit is THE reference
	multiplier: (null|string) (default: null) auto-create multiplier of the unit in the metric system
*/
function Unit( name , value = 1 , reference = null , unitSet = null ) {
	this.name = name ;
	this.value = + value ;
	this.referenceUnit = null ;
	this.rootUnitDistance = 0 ;	// Used to reduce the number of conversion iteration, thus improving precision (and speed)

	if ( ! this.value || ! isFinite( this.value ) || this.value <= 0 ) {
		throw new Error( "Invalid unit value: it should be a positive real number" ) ;
	}

	if ( reference ) {
		if ( reference instanceof Unit ) {
			this.referenceUnit = reference ;
		}
		else {
			this.referenceUnit = unitSet && unitSet.get( reference ) ;

			if ( ! this.referenceUnit ) {
				throw new Error( "Unit of reference '" + reference + "' does not exist" ) ;
			}
		}
		
		this.rootUnitDistance = this.referenceUnit.rootUnitDistance + 1 ;
	}
	else if ( this.value !== 1 ) {
		throw new Error( "Cannot create a Unit of reference with a value different from 1" ) ;
	}
}

exports.Unit = Unit ;



function UnitSet() {
	this.registeredUnits = {} ;
}

exports.UnitSet = UnitSet ;



UnitSet.prototype.get = function( name ) {
	return this.registeredUnits[ name ] ;
} ;



UnitSet.prototype.register = UnitSet.prototype.create = function( name , value = 1 , reference = null , options = {} ) {
	var existing = this.registeredUnits[ name ] ;
	var unit = new Unit( name , value , reference , this ) ;

	if ( existing ) {
		if ( existing.value !== this.value || existing.referenceUnit !== this.referenceUnit ) {
			throw new Error(
				"Unit '" + name + "' is already defined but with different value and reference unit: "
				+ existing.value + ' ' + existing.referenceUnit?.name
			) ;
		}

		return existing ;
	}

	this.registeredUnits[ name ] = unit ;

	return unit ;
} ;



UnitSet.prototype.convert = function( value , from , to ) {
	var fromFactor = 1 ,
		toFactor = 1 ,
		fromUnit = this.registeredUnits[ from ] ,
		toUnit = this.registeredUnits[ to ] ;

	if ( ! fromUnit ) { throw new Error( "Unknown unit: '" + from + "'" ) ; }
	if ( ! toUnit ) { throw new Error( "Unknown unit: '" + to + "'" ) ; }
	console.log( this.registeredUnits ) ;
	console.log( "\n\n>>> starting value:" , value , fromUnit.name ) ;

	if ( fromUnit === toUnit ) { return value ; }
	
	// Use this.rootUnitDistance to improve the algorithm

	while ( fromUnit.referenceUnit ) {
		value *= fromUnit.value ;
		fromUnit = fromUnit.referenceUnit ;
		console.log( "converting to:" , value , fromUnit?.name ) ;

		if ( fromUnit === toUnit ) {
			return value ;
		}
	}

	while ( toUnit ) {
		value /= toUnit.value ;
		toUnit = toUnit.referenceUnit ;
		console.log( "reverse converting:" , value , toUnit?.name ) ;

		console.log( "checking" , fromUnit.name , "against" , toUnit , fromUnit === toUnit ) ;
		if ( fromUnit === toUnit ) {
			return value ;
		}
	}

	throw new Error( "Can't convert " + from + " to " + to ) ;
} ;

