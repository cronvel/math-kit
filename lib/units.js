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
	factor: (number) (default: 1) value of the unit in the reference unit
	referenceUnit: (Unit) (default: null) name of the unit of reference, if null the current unit is THE reference
*/
function Unit( symbol , name = null , factor = 1 , referenceUnit = null , rootId = null , options = null ) {
	this.symbol = symbol ;
	this.name = name ;
	// The value of the unit relative to its reference
	this.factor = + factor ;
	// The unit of reference the factor is expressed into
	this.referenceUnit = referenceUnit ;
	// The root unit when following all references until the last one, equal to this if the current unit is a root unit
	this.rootUnit = this.referenceUnit ? this.referenceUnit.rootUnit : this ;
	// Used to reduce the number of conversion iteration, thus improving precision (and speed)
	this.rootUnitStep = this.referenceUnit ? this.referenceUnit.rootUnitStep + 1 : 0 ;
	// Used for sorting Unit in CompoundUnit, set by UnitSet
	this.rootId = this.referenceUnit ? this.rootUnit.rootId : rootId ;

	// Rarely used, but it is necessary for unit that doesn't have the same “0”, like temperature units: °C, °F and K.
	// The offset is the value of 0 in the reference unit.
	this.zeroOffset = 0 ;

	if ( options && typeof options === 'object' ) {
		if ( options.zeroOffset ) {
			if ( ! isFinite( this.zeroOffset ) ) {
				throw new Error( "Invalid unit zero-offset: it should be a real number" ) ;
			}

			this.zeroOffset = + options.zeroOffset ;
		}
	}

	if ( ! this.factor || ! isFinite( this.factor ) || this.factor <= 0 ) {
		throw new Error( "Invalid unit factor: it should be a positive real number" ) ;
	}

	if ( this.referenceUnit && ( ! ( this.referenceUnit instanceof Unit ) && ! ( this.referenceUnit instanceof CompoundUnit ) ) ) {
		throw new Error( "The reference unit is not an instance of Unit or CompoundUnit" ) ;
	}

	if ( ! this.rootUnitStep && this.factor !== 1 ) {
		throw new Error( "Cannot create a root Unit with a factor different from 1" ) ;
	}
}

exports.Unit = Unit ;



Unit.prototype.toReference = function( value ) {
	return ( value + this.zeroOffset ) * this.factor ;
} ;



Unit.prototype.fromReference = function( value ) {
	return ( value / this.factor ) - this.zeroOffset ;
} ;



Unit.prototype.isEqualToUnit = function( unit ) {
	return (
		this.symbol === unit.symbol
		&& this.name === unit.name
		&& this.factor === unit.factor
		&& this.zeroOffset === unit.zeroOffset
		&& this.referenceUnit === unit.referenceUnit
	) ;
} ;



function UnitSet() {
	this.unitMap = {} ;
	this.rootUnitIncrement = 0 ;
}

exports.UnitSet = UnitSet ;



UnitSet.prototype.get = function( name ) {
	return this.unitMap[ name ] ;
} ;



/*
	.add( symbol , [options] )
	.add( symbol , name , [options] )
	.add( symbol , factor , reference , [options] )
	.add( symbol , name , factor , reference , [options] )
*/
UnitSet.prototype.add = function( symbol , name , factor , reference , options ) {
	var referenceUnit , unit ;


	// Manage arguments

	if ( arguments.length === 1 ) {
		name = null ;
		factor = 1 ;
		reference = null ;
		options = {} ;
	}
	else if ( typeof name === 'string' ) {
		if ( arguments.length === 2 ) {
			factor = 1 ;
			reference = null ;
			options = {} ;
		}
		else if ( typeof factor === 'number' ) {
			options = options || {} ;
		}
		else if ( typeof factor === 'object' ) {
			options = factor ;
			factor = 1 ;
			reference = null ;
		}
		else {
			throw new Error( "Arguments mismatches all signatures for UnitSet#add()" ) ;
		}
	}
	else if ( typeof name === 'number' ) {
		options = reference || {} ;
		reference = factor ;
		factor = name ;
		name = null ;
	}
	else if ( typeof name === 'object' ) {
		name = null ;
		factor = 1 ;
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
			if ( ! UnitSet.isCompound( reference ) ) {
				throw new Error( "Unit of reference '" + reference + "' does not exist" ) ;
			}

			referenceUnit = this.parseCompound( reference , this.rootUnitIncrement ) ;
			referenceUnit = this.registerUnit( referenceUnit.symbol , referenceUnit ) ;
		}
	}


	// Register the unit

	unit = new Unit( symbol , name , factor , referenceUnit , this.rootUnitIncrement , options ) ;
	unit = this.registerUnit( symbol , unit ) ;

	if ( name ) { this.registerUnit( name , unit , true ) ; }
	if ( options.alias ) { this.registerUnit( options.alias , unit , true ) ; }
	if ( options.aliases ) { options.aliases.forEach( alias => this.registerUnit( alias , unit , true ) ) ; }
	if ( options.multipliers ) { this.buildMultipliers( unit , options.multipliers ) ; }

	return unit ;
} ;



UnitSet.prototype.registerUnit = function( key , unit , isAlias = false ) {
	var existing = this.unitMap[ key ] ;

	if ( existing ) {
		if ( existing === unit ) { return existing ; }
		if ( ! isAlias && existing.isEqualToUnit( unit ) ) { return existing ; }

		throw new Error(
			"Unit '" + key + "' is already defined but with different value and reference unit: "
			+ existing.factor + ' ' + existing.referenceUnit?.name
		) ;
	}

	this.unitMap[ key ] = unit ;

	// Auto-increment must be incremented now
	if ( ! isAlias && ! unit.referenceUnit ) { this.rootUnitIncrement ++ ; }

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
			factor = m[ 2 ] ;

		var unit = new Unit( symbol , name , factor , baseUnit ) ;
		unit = this.registerUnit( symbol , unit ) ;
		if ( name ) { this.registerUnit( name , unit , true ) ; }
	} ) ;
} ;



UnitSet.prototype.convert = function( value , from , to ) {
	var fromUnit = ( from instanceof Unit ) ? from : this.unitMap[ from ] ,
		toUnit = ( to instanceof Unit ) ? to : this.unitMap[ to ] ;

	//console.log( "From:" , fromUnit , from , from instanceof Unit ) ;
	//console.log( "To:" , toUnit ) ;
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
			value = fromUnit.toReference( value ) ;
			fromUnit = fromUnit.referenceUnit ;
		}

		while ( toUnit.rootUnitStep > fromUnit.rootUnitStep ) {
			//console.log( "To:" , toUnit.symbol , "-->" , toUnit.referenceUnit.symbol ) ;
			value = toUnit.fromReference( value ) ;
			toUnit = toUnit.referenceUnit ;
		}
	}

	while ( fromUnit !== toUnit ) {
		//console.log( "From:" , fromUnit.symbol , "-->" , fromUnit.referenceUnit.symbol , "and To:" , toUnit.symbol , "-->" , toUnit.referenceUnit.symbol ) ;
		value = fromUnit.toReference( value ) ;
		fromUnit = fromUnit.referenceUnit ;
		value = toUnit.fromReference( value ) ;
		toUnit = toUnit.referenceUnit ;
	}

	return value ;
} ;



UnitSet.prototype.convertCompound = function( value , from , to ) {
	var factor = 1 ,
		fromCompoundUnit = this.parseCompound( from ) ,
		toCompoundUnit = this.parseCompound( to ) ;

	if ( fromCompoundUnit.unitsPower.length !== toCompoundUnit.unitsPower.length ) {
		throw new Error( "Can't convert " + from + " to " + to ) ;
	}

	for ( let index = 0 , length = fromCompoundUnit.unitsPower.length ; index < length ; index ++ ) {
		let partFrom = fromCompoundUnit.unitsPower[ index ] ,
			partTo = toCompoundUnit.unitsPower[ index ] ;

		if ( partFrom.unit.rootUnit !== partTo.unit.rootUnit || partFrom.power !== partTo.power ) {
			throw new Error( "Can't convert " + from + " to " + to ) ;
		}

		let partFactor = this.convert( 1 , partFrom.unit , partTo.unit ) ;
		factor *= partFactor ** partFrom.power ;
	}

	return value * factor ;
} ;



const FROM_SUPERSCRIPT = {
	'⁰': '0' ,
	'¹': '1' ,
	'²': '2' ,
	'³': '3' ,
	'⁴': '4' ,
	'⁵': '5' ,
	'⁶': '6' ,
	'⁷': '7' ,
	'⁸': '8' ,
	'⁹': '9' ,
	'⁻': '-'
} ;

const TO_SUPERSCRIPT = {
	'0': '⁰' ,
	'1': '¹' ,
	'2': '²' ,
	'3': '³' ,
	'4': '⁴' ,
	'5': '⁵' ,
	'6': '⁶' ,
	'7': '⁷' ,
	'8': '⁸' ,
	'9': '⁹' ,
	'-': '⁻'
} ;

const COMPOUND_UNITS_REGEXP = /(^|\.|\/)([^./⁰¹²³⁴⁵⁶⁷⁸⁹⁻0-9-]+)([⁻-]?[⁰¹²³⁴⁵⁶⁷⁸⁹0-9]+)?/g ;
const IS_COMPOUND_UNITS_REGEXP = /\.|\/|[./⁰¹²³⁴⁵⁶⁷⁸⁹⁻0-9-]/ ;
UnitSet.isCompound = function( str ) { return IS_COMPOUND_UNITS_REGEXP.test( str ) ; } ;



UnitSet.prototype.parseCompound = function( str , rootId = null ) {
	var match ,
		unitsPower = [] ;

	COMPOUND_UNITS_REGEXP.lastIndex = 0 ;

	while ( ( match = COMPOUND_UNITS_REGEXP.exec( str ) ) !== null ) {
		let unitName = match[ 2 ] ;
		let unit = this.get( unitName ) ;

		if ( ! unit ) {
			throw new Error( "Unit '" + unitName + "' does not exist" ) ;
		}

		let power = 1 ;

		if ( match[ 3 ] ) {
			let powerStr = match[ 3 ].replace( /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g , char => FROM_SUPERSCRIPT[ char ] ) ;
			power = parseFloat( powerStr ) ;
		}

		if ( match[ 1 ] === '/' ) { power = -power ; }

		unitsPower.push( { unit , power } ) ;
	}

	return new CompoundUnit( unitsPower , rootId ) ;
} ;



function CompoundUnit( unitsPower = [] , rootId = null ) {
	// An array of { unit , power }
	this.unitsPower = unitsPower ;

	// Enforce sort, to help compare compatible CompoundUnit
	this.unitsPower.sort( ( a , b ) => a.unit.rootId - b.unit.rootId ) ;

	this.symbol = '' ;
	for ( let unitPower of this.unitsPower ) {
		if ( this.symbol ) { this.symbol += '.' ; }

		this.symbol += unitPower.unit.symbol ;

		if ( unitPower.power !== 1 ) {
			let powerStr = '' + unitPower.power ;
			for ( let char of powerStr ) {
				if ( ! TO_SUPERSCRIPT[ char ] ) {
					throw new Error( "Bad sub-unit power: " + unitPower.power ) ;
				}

				this.symbol += TO_SUPERSCRIPT[ char ] ;
			}
		}
	}
	
	console.log( "Canonical:" , this.symbol ) ;

	// For compatibility with Unit
	this.rootUnit = this ;
	this.rootUnitStep = 0 ;
	this.rootId = rootId ;
}

