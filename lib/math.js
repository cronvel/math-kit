/*
	The Cedric's Swiss Knife (CSK) - CSK math toolbox

	Copyright (c) 2015 Cédric Ronvel 
	
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



var math = {} ;
module.exports = math ;



math.random = require( './random.js' ) ;
math.stat = require( './stat.js' ) ;



// Just return the value in bounds
math.range = function range( value , min , max )
{
	var swap ;
	if ( min > max ) { swap = min ; min = max ; max = swap ; }
	
	if ( typeof value !== 'number' )
	{
		if ( typeof value === 'string' ) { value = parseFloat( value ) ; }
		else { return undefined ; }
	}
	
	if ( value < min ) { return min ; }
	if ( value > max ) { return max ; }
	
	return value ;
} ;



function toValue( value )
{
	if ( typeof value === 'string' ) { value = parseFloat( value ) ; }
	if ( typeof value !== 'number' ) { return 0 ; }
	return value ;
}



// Return true if the arguments are all in an ascendant order.
// Each arguments can be an array, so it works with versions-like numbers.
math.isOrdered = function isOrdered()
{
	var i , j , args = Array.prototype.slice.call( arguments ) ;
	
	for ( i = 0 ; i < args.length ; i ++ )
	{
		if ( ! Array.isArray( args[ i ] ) ) { args[ i ] = [ args[ i ] ] ; }
		
		if ( i === 0 ) { continue ; }
		
		for ( j = 0 ; j < args[ i - 1 ].length || j < args[ i ].length ; j ++ )
		{
			args[ i - 1 ][ j ] = toValue( args[ i - 1 ][ j ] ) ;
			args[ i ][ j ] = toValue( args[ i ][ j ] ) ;
			
			if ( args[ i - 1 ][ j ] > args[ i ][ j ] ) { return false ; }
			else if ( args[ i - 1 ][ j ] < args[ i ][ j ] ) { break ; }
		}
	}
	
	return true ;
} ;



// Return true if the 'a' is greater than 'b'.
// Each arguments can be an array, so it works with versions-like numbers.
math.isGreater = function isGreater( a , b , orEquals )
{
	var i ;
	
	if ( ! Array.isArray( a ) ) { a = [ a ] ; }
	if ( ! Array.isArray( b ) ) { b = [ b ] ; }
	
	for ( i = 0 ; i < a.length || i < b.length ; i ++ )
	{
		a[ i ] = toValue( a[ i ] ) ;
		b[ i ] = toValue( b[ i ] ) ;
		
		if ( a[ i ] < b[ i ] ) { return false ; }
		else if ( a[ i ] > b[ i ] ) { return true ; }
	}
	
	return orEquals ? true : false ;
} ;

// Shorthand
math.isGreaterOrEquals = function isGreaterOrEquals( a , b ) { return math.isGreater( a , b , true ) ; } ;
math.isLesser = function isLesser( a , b ) { return math.isGreater( b , a ) ; } ;
math.isLesserOrEquals = function isLesserOrEquals( a , b ) { return math.isGreater( b , a , true ) ; } ;



// It is a trivial formula, but I always forget how to do it...
math.baseLog = function baseLog( x , y ) { return Math.log( y ) / Math.log( x ) ; } ;





