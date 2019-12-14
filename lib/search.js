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



const search = {} ;
module.exports = search ;



/*
	params:
		inputRange: the input range validity
		inputPrecisionDelta: the wanted input precision, search stop when the hypothetical extremum is within this delta
*/
search.localMinimum = ( fn , params ) => {
	// We use a sort of gradient descent
	var output , gradient ,
		gradientDelta = inputPrecisionDelta / 10 ;
		input = ( params.inputRange.min + params.inputRange.max ) / 2 ;
	
	output = fn( input ) ;
	gradient = ( fn( input + gradientDelta ) - output ) / gradientDelta ;
	
	if ( gradient > 0 ) {
		// We need a smaller input
	}
	else {
		// We need a bigger input
	}
} ;

