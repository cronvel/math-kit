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
	if ( typeof value !== 'number' ) { value = parseFloat( value ) ; }
	if ( value < min ) { return min ; }
	if ( value > max ) { return max ; }
	return value ;
} ;



// It is a trivial formula, but I always forget how to do it...
math.baseLog = function baseLog( x , y ) { return Math.log( y ) / Math.log( x ) ; } ;







