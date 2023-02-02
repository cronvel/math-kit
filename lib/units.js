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
	symbol: (string) symbol/abbreviated name
	name: (string) full name of the unit
	value: (number) (default: 1) value of the unit in the reference unit
	referenceUnit: (Unit) (default: null) name of the unit of reference, if null the current unit is THE reference
*/
function Unit( symbol , name = null , value = 1 , referenceUnit = null ) {
	this.symbol = symbol ;
	this.name = name ;
	// The value of the unit relative to its reference
	this.value = + value ;
	// The unit of reference the value is expressed into
	this.referenceUnit = referenceUnit ;
	// The root unit when following all references until the last one, equal to this if the current unit is a root unit
	this.rootUnit = this.referenceUnit ? this.referenceUnit.rootUnit : this ;
	// Used to reduce the number of conversion iteration, thus improving precision (and speed)
	this.rootUnitStep = this.referenceUnit ? this.referenceUnit.rootUnitStep + 1 : 0 ;

	if ( ! this.value || ! isFinite( this.value ) || this.value <= 0 ) {
		throw new Error( "Invalid unit value: it should be a positive real number" ) ;
	}

	if ( this.referenceUnit && ! ( this.referenceUnit instanceof Unit ) ) {
		throw new Error( "The reference unit is not an instance of Unit" ) ;
	}

	if ( ! this.rootUnitStep && this.value !== 1 ) {
		throw new Error( "Cannot create a root Unit with a value different from 1" ) ;
	}
}

exports.Unit = Unit ;



function UnitSet() {
	this.unitMap = {} ;
}

exports.UnitSet = UnitSet ;



UnitSet.prototype.get = function( name ) {
	return this.unitMap[ name ] ;
} ;



/*
	.add( symbol , [options] )
	.add( symbol , name , [options] )
	.add( symbol , value , reference , [options] )
	.add( symbol , name , value , reference , [options] )
*/
UnitSet.prototype.add = function( symbol , name , value , reference , options ) {
	var referenceUnit , unit ;


	// Manage arguments

	if ( arguments.length === 1 ) {
		name = null ;
		value = 1 ;
		reference = null ;
		options = {} ;
	}
	else if ( typeof name === 'string' ) {
		if ( arguments.length === 2 ) {
			value = 1 ;
			reference = null ;
			options = {} ;
		}
		else if ( typeof value === 'number' ) {
			options = options || {} ;
		}
		else if ( typeof value === 'object' ) {
			options = value ;
			value = 1 ;
			reference = null ;
		}
		else {
			throw new Error( "Arguments mismatches all signatures for UnitSet#add()" ) ;
		}
	}
	else if ( typeof name === 'number' ) {
		options = reference || {} ;
		reference = value ;
		value = name ;
		name = null ;
	}
	else if ( typeof name === 'object' ) {
		name = null ;
		value = 1 ;
		reference = null ;
		options = name ;
	}
	else {
		throw new Error( "Arguments mismatches all signatures for UnitSet#add()" ) ;
	}


	// Manage reference

	if ( reference ) {
		referenceUnit = this.get( reference ) ;

		if ( ! referenceUnit ) {
			throw new Error( "Unit of reference '" + reference + "' does not exist" ) ;
		}
	}


	// Register the unit

	unit = new Unit( symbol , name , value , referenceUnit ) ;
	unit = this.registerUnit( symbol , unit ) ;

	if ( name ) { this.registerUnit( name , unit , true ) ; }
	if ( options.alias ) { this.registerUnit( options.alias , unit , true ) ; }
	if ( options.aliases ) { options.aliases.forEach( alias => this.registerUnit( alias , unit , true ) ) ; }
	if ( options.multipliers ) { this.buildMultipliers( unit , options.multipliers ) ; }

	return unit ;
} ;



UnitSet.prototype.registerUnit = function( key , unit , alias = false ) {
	var existing = this.unitMap[ key ] ;

	if ( existing ) {
		if ( existing === unit ) { return existing ; }

		if (
			! alias
			&& existing.symbol === unit.symbol
			&& existing.name === unit.name
			&& existing.value === unit.value
			&& existing.referenceUnit === unit.referenceUnit
		) {
			return existing ;
		}

		throw new Error(
			"Unit '" + key + "' is already defined but with different value and reference unit: "
			+ existing.value + ' ' + existing.referenceUnit?.name
		) ;
	}

	this.unitMap[ key ] = unit ;

	return unit ;
} ;



const MULTIPLIERS_TYPES = {
	powerOf10: [
		[ 'm' , 'milli' , 1e-3 ] ,
		[ 'c' , 'centi' , 1e-2 ] ,
		[ 'd' , 'deci' , 1e-1 ] ,
		[ 'da' , 'deca' , 1e1 ] ,
		[ 'h' , 'hecto' , 1e2 ] ,
		[ 'k' , 'kilo' , 1e3 ]
	] ,
	powerOf1000: [
		[ 'y' , 'yocto' , 1e-24 ] ,
		[ 'z' , 'zepto' , 1e-21 ] ,
		[ 'a' , 'atto' , 1e-18 ] ,
		[ 'f' , 'femto' , 1e-15 ] ,
		[ 'p' , 'pico' , 1e-12 ] ,
		[ 'n' , 'nano' , 1e-9 ] ,
		[ 'µ' , 'micro' , 1e-6 ] ,
		[ 'm' , 'milli' , 1e-3 ] ,
		[ 'k' , 'kilo' , 1e3 ] ,
		[ 'M' , 'mega' , 1e6 ] ,
		[ 'G' , 'giga' , 1e9 ] ,
		[ 'T' , 'tera' , 1e12 ] ,
		[ 'P' , 'peta' , 1e15 ] ,
		[ 'E' , 'exa' , 1e18 ] ,
		[ 'Z' , 'zetta' , 1e21 ] ,
		[ 'Y' , 'yotta' , 1e24 ]
	] ,
	powerOf10And1000: [
		[ 'y' , 'yocto' , 1e-24 ] ,
		[ 'z' , 'zepto' , 1e-21 ] ,
		[ 'a' , 'atto' , 1e-18 ] ,
		[ 'f' , 'femto' , 1e-15 ] ,
		[ 'p' , 'pico' , 1e-12 ] ,
		[ 'n' , 'nano' , 1e-9 ] ,
		[ 'µ' , 'micro' , 1e-6 ] ,
		[ 'm' , 'milli' , 1e-3 ] ,
		[ 'c' , 'centi' , 1e-2 ] ,
		[ 'd' , 'deci' , 1e-1 ] ,
		[ 'da' , 'deca' , 1e1 ] ,
		[ 'h' , 'hecto' , 1e2 ] ,
		[ 'k' , 'kilo' , 1e3 ] ,
		[ 'M' , 'mega' , 1e6 ] ,
		[ 'G' , 'giga' , 1e9 ] ,
		[ 'T' , 'tera' , 1e12 ] ,
		[ 'P' , 'peta' , 1e15 ] ,
		[ 'E' , 'exa' , 1e18 ] ,
		[ 'Z' , 'zetta' , 1e21 ] ,
		[ 'Y' , 'yotta' , 1e24 ]
	] ,
	powerOf1024: [
		[ 'ki' , 'kibi' , 1024 ] ,
		[ 'Mi' , 'mebi' , 1024 ** 2 ] ,
		[ 'Gi' , 'gibi' , 1024 ** 3 ] ,
		[ 'Ti' , 'tebi' , 1024 ** 4 ] ,
		[ 'Pi' , 'pebi' , 1024 ** 5 ] ,
		[ 'Ei' , 'exbi' , 1024 ** 6 ] ,
		[ 'Zi' , 'zebi' , 1024 ** 7 ] ,
		[ 'Yi' , 'yobi' , 1024 ** 8 ]
	]
} ;



UnitSet.prototype.buildMultipliers = function( baseUnit , type ) {
	var multipliers = MULTIPLIERS_TYPES[ type ] ;

	if ( ! multipliers ) {
		throw new Error( "Unknown multipliers type: " + type ) ;
	}

	multipliers.forEach( m => {
		var symbol = m[ 0 ] + baseUnit.symbol ,
			name = baseUnit.name && m[ 1 ] ? m[ 1 ] + baseUnit.name : null ,
			value = m[ 2 ] ;

		var unit = new Unit( symbol , name , value , baseUnit ) ;
		unit = this.registerUnit( symbol , unit ) ;
		if ( name ) { this.registerUnit( name , unit , true ) ; }
	} ) ;
} ;



UnitSet.prototype.convert = function( value , from , to ) {
	var factor = 1 ,
		fromUnit = this.unitMap[ from ] ,
		toUnit = this.unitMap[ to ] ;

	if ( ! fromUnit ) { throw new Error( "Unknown unit: '" + from + "'" ) ; }
	if ( ! toUnit ) { throw new Error( "Unknown unit: '" + to + "'" ) ; }
	//console.log( this.unitMap ) ;
	//console.log( "\n\n>>> starting value:" , value , fromUnit.symbol ) ;

	if ( fromUnit === toUnit ) { return value ; }

	// It should share the same rootUnit or it will not be possible to convert
	if ( fromUnit.rootUnit !== toUnit.rootUnit ) {
		throw new Error( "Can't convert " + from + " to " + to ) ;
	}

	if ( fromUnit.rootUnitStep !== toUnit.rootUnitStep ) {
		while ( fromUnit.rootUnitStep > toUnit.rootUnitStep ) {
			//console.log( "From:" , fromUnit.symbol , "-->" , fromUnit.referenceUnit.symbol ) ;
			factor *= fromUnit.value ;
			fromUnit = fromUnit.referenceUnit ;
		}

		while ( toUnit.rootUnitStep > fromUnit.rootUnitStep ) {
			//console.log( "To:" , toUnit.symbol , "-->" , toUnit.referenceUnit.symbol ) ;
			factor /= toUnit.value ;
			toUnit = toUnit.referenceUnit ;
		}
	}

	while ( fromUnit !== toUnit ) {
		//console.log( "From:" , fromUnit.symbol , "-->" , fromUnit.referenceUnit.symbol , "and To:" , toUnit.symbol , "-->" , toUnit.referenceUnit.symbol ) ;
		factor *= fromUnit.value ;
		fromUnit = fromUnit.referenceUnit ;
		factor /= toUnit.value ;
		toUnit = toUnit.referenceUnit ;
	}

	//console.log( "Found factor of:" , factor ) ;
	return value * factor ;
} ;
