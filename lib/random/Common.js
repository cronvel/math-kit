/*
	Math Kit
	
	Copyright (c) 2014 - 2017 Cédric Ronvel
	
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



// Load modules
var stat = require( '../stat.js' ) ;



/*
	Super-class, containing common random methods
*/



function Common()
{
	throw new Error( "Cannot create a random.Common() object, use subclass constructor instead." ) ;
}

module.exports = Common ;



// Function to subclass
Common.prototype.seed = function seed() {} ;



// .random() : generate a [ 0 , 1 ) float
// .random( IntegerA ) : generate a [ 0 , IntegerA ) integer
// .random( IntegerA , IntegerB ) : generate a [ IntegerA , IntegerB ] integer
Common.prototype.random = function random() 
{
	if ( ! arguments.length )
	{
		if ( this.randomFloat )
		{
			return this.randomFloat() ;
		}
		else if ( this.randomUInt32 )
		{
			return this.randomUInt32() / 4294967296.0 ;
		}
	}
	else if ( arguments.length === 1 )
	{
		if ( this.randomFloat )
		{
			return Math.floor( this.randomFloat() * arguments[ 0 ] ) ;
		}
		else if ( this.randomUInt32 )
		{
			return Math.floor( ( this.randomUInt32() / 4294967296.0 ) * arguments[ 0 ] ) ;
		}
	}
	else
	{
		if ( this.randomFloat )
		{
			return Math.floor( arguments[ 0 ] + this.randomFloat() * ( 1 + arguments[ 1 ] - arguments[ 0 ] ) ) ;
		}
		else if ( this.randomUInt32 )
		{
			return Math.floor( arguments[ 0 ] + ( this.randomUInt32() / 4294967296.0 ) * ( 1 + arguments[ 1 ] - arguments[ 0 ] ) ) ;
		}
	}
} ;



// .randomFloatRange( FloatA , FloatB ) : generate a [ FloatA , FloatB ) float
Common.prototype.randomFloatRange = function randomFloatRange( a , b ) 
{
	return a + this.random() * ( b - a ) ;
} ;



/*
	Round a number randomly up or down and returns it, the closer integer has more chance.
	Example:
		* 3.5 has 50% of chance to be rounded to 3 or to 4
		* 3.2 has 80% of chance to be rounded to 3 and 20% to be rounded to 4
	
	* f `number` the number to round
*/
Common.prototype.randomRound = function randomRound( f ) 
{
	return Math.floor( f + this.random() ) ;
} ;



/*
	Like randomRound(), except that it accepts an array (or object) of number, the error by each round is reported
	to the next value.
	It returns an array (or object) of rounded values.
*/
Common.prototype.sharedRandomRound = function sharedRandomRound( container ) 
{
	var key , r , error = 0 , result = Array.isArray( container ) ? [] : {} ;
	
	for ( key in container )
	{
		r = error < 0 ? this.randomFloatRange( - error , 1 ) : this.randomFloatRange( 0 , 1 - error ) ;
		result[ key ] = Math.floor( container[ key ] + r ) ;
		error += result[ key ] - container[ key ] ;
	}
	
	return result ;
} ;



/*
	Return a random element from an array.
*/
Common.prototype.randomElement = function randomElement( array ) 
{
	return array[ this.random( array.length ) ] ;
} ;



/*
	Random dice ( number of dice , number of faces )
*/
Common.prototype.dice = function dice( diceCount , faceCount ) 
{
	var sum = 0 ;
	for ( ; diceCount > 0 ; diceCount -- ) { sum += this.random( 1 , faceCount ) ; }
	return sum ;
} ;



/*
	Given the probability of success for each independent experiment and a number of trial,
	it returns the random number of success.
*/
Common.prototype.randomTrialSuccesses = function randomTrialSuccesses( p , n ) 
{
	if ( n <= 30 ) { return this.randomTrialSuccessesBruteForce( p , n ) ; }
	else { return this.randomTrialSuccessesNormal( p , n ) ; }
} ;



// This provide the best results possible, it uses 'n' trials with the 'p' probability, so it costs CPU
Common.prototype.randomTrialSuccessesBruteForce = function randomTrialSuccessesBruteForce( p , n )
{
	var i , s = 0 ;
	
	for ( i = 0 ; i < n ; i ++ )
	{
		if ( this.random() < p ) { s ++ ; }
	}
	
	return s ;
} ;



/*
	This use the Normal inverse cumulative distribution function.
	Warning: to be perfect, it should use the Binomial distribution, the Normal distribution
	approximate it when 'n' is big enough.
	For lower 'n' values (e.g. n <= 30), one may use .randomTrialSuccessesBruteForce().
	For higher values, its way faster than the brute force algorithm.
*/
Common.prototype.randomTrialSuccessesNormal = function randomTrialSuccessesNormal( p , n )
{
	var expectedValue , // fr: esperance
		s , variance , sigma ;
	
	expectedValue = p * n ;
	variance = p * ( 1 - p ) * n ;
	sigma = Math.sqrt( variance ) ;
	
	s = stat.normalInvCdf( this.random() , expectedValue , sigma ) ;
	
	s = Math.round( s ) ;
	
	// Sometime out of bound values are produced, when 'n' is low
	if ( s < 0 ) { s = 0 ; }
	else if ( s > n ) { s = n ; }
	
	return s ;
} ;


