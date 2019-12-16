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
	from: input vector
	radius: the radius around "from"
	options:
		accuracy: the acceptable delta for input, away from the local minimum
		gradientDelta: the delta used for gradient calculation, away from the current input
		iterations: if set, define the maximum iteration
*/
search.localMinimum = ( fn , from , radius , options = {} ) => {
	// We use a sort of gradient descent
	var swap , old , output , step , minStep ,
		input = [ ... from ] ,
		lastInput = new Array( input.length ) ,
		gradient = new Array( input.length ) ,
		lastGradient = new Array( input.length ) ,
		maxIterations = options.iterations || Infinity ,
		accuracy = options.accuracy || 0.01 ,
		gradientDelta = options.gradientDelta || accuracy / 10 ;

	radius = radius || 1000 ;
	step = radius / 2 ;
	minStep = accuracy / 2 ;

	var iter , d , dMax = input.length ,
		first = true ;

	for ( iter = 0 ; iter < maxIterations && step >= minStep ; iter ++ ) {
		//console.log( "#" + iter , "input:" , input ) ;

		// Compute the output
		output = fn( ... input ) ;
		//console.log( "    output:" , output ) ;

		// Compute the gradient
		for ( d = 0 ; d < dMax ; d ++ ) {
			old = input[ d ] ;
			input[ d ] += gradientDelta ;
			gradient[ d ] = ( fn( ... input ) - output ) / gradientDelta ;
			input[ d ] = old ;
		}

		//console.log( "    gradient:" , gradient ) ;

		// We need a normalized gradient to produce the next step length
		normalize( gradient ) ;
		//console.log( "    normalized gradient:" , gradient ) ;

		// If NaN after the normalization, it means the gradient was 0, so we return now
		// (we have an extremum, and even if it's not the minimum, we don't know where to go anyway)
		if ( Number.isNaN( gradient[ 0 ] ) ) { return input ; }

		// Compute the next step
		if ( first ) { first = false ; }
		else { step /= 1 + Math.abs( dotProduct( gradient , lastGradient ) ) ; }

		// Prepare next loop
		swap = lastGradient ; lastGradient = gradient ; gradient = swap ;
		swap = lastInput ; lastInput = input ; input = swap ;

		// Next input: to the direction of the (normalized) descending gradient, using step as the displacement length
		for ( d = 0 ; d < dMax ; d ++ ) {
			// We go in the direction of the descending gradient, hence the "-" minus
			input[ d ] = lastInput[ d ] - lastGradient[ d ] * step ;
		}
	}

	return input ;
} ;



function normalize( vector ) {
	var d ,
		dMax = vector.length ,
		length = Math.hypot( ... vector ) ;

	for ( d = 0 ; d < dMax ; d ++ ) {
		vector[ d ] /= length ;
	}
}



// Dot product for any vector dimensions
function dotProduct( v1 , v2 ) {
	var d ,
		dMax = v1.length ,
		result = 0 ;

	for ( d = 0 ; d < dMax ; d ++ ) {
		result += v1[ d ] * v2[ d ] ;
	}

	return result ;
}

