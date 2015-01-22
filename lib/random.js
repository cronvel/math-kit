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



// Load modules
var crypto = require( 'crypto' ) ;



var random = {} ;
module.exports = random ;



			////////////////////////////
			// Generic random methods //
			////////////////////////////



// Base class, contains common functions
random.GenericRandom = function GenericRandom()
{
	throw new Error( "Cannot create a random.GenericRandom() object, use subclass constructor instead." ) ;
} ;



// Function to subclass
random.GenericRandom.prototype.seed = function seed() {} ;



// .random() : generate a [ 0 , 1 ) float
// .random( IntegerA ) : generate a [ 0 , IntegerA ) integer
// .random( IntegerA , IntegerB ) : generate a [ IntegerA , IntegerB ] integer
random.GenericRandom.prototype.random = function random() 
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



			//////////////////////////
			// Native Math.random() //
			//////////////////////////



// Crypto module pseudo-random
random.Native = function Native()
{
	var r = Object.create( random.Native.prototype ) ;
	return r ;
} ;

// Inherits from random.GenericRandom
random.Native.prototype = Object.create( random.GenericRandom.prototype ) ;
random.Native.prototype.constructor = random.Native ;



// Get the native [ 0 , 1 ) random
random.Native.prototype.randomFloat = function randomFloat()
{
	return Math.random() ;
} ;



			//////////////////////////
			// node's crypto random //
			//////////////////////////



// Crypto module pseudo-random
random.Entropy = function Entropy()
{
	var r = Object.create( random.Entropy.prototype ) ;
	return r ;
} ;

// Inherits from random.GenericRandom
random.Entropy.prototype = Object.create( random.GenericRandom.prototype ) ;
random.Entropy.prototype.constructor = random.Entropy ;



// Get a pseudo random int32
random.Entropy.prototype.randomUInt32 = function randomUInt32()
{
	if ( typeof arguments[ 0 ] === 'function' )
	{
		// Async mode
		CSK.async.do( [ crypto.randomBytes , 4 ] )
		.retry( 20 , 1 , 1.2 , 100 )
		.lastJobOnly()
		.exec( arguments[ 0 ] ) ;
	}
	else
	{
		// Sync mode
		var r ;
		
		try {
			r = crypto.randomBytes( 4 ) ;
		}
		catch ( exception ) {
			return undefined ;
		}
		
		return r.readUInt32LE( 0 , true ) ;
	}
} ;



			////////////////////////////////
			// node's crypto pseudoRandom //
			////////////////////////////////



// Crypto module pseudo-random
random.LessEntropy = function LessEntropy()
{
	var r = Object.create( random.LessEntropy.prototype ) ;
	return r ;
} ;

// Inherits from random.GenericRandom
random.LessEntropy.prototype = Object.create( random.GenericRandom.prototype ) ;
random.LessEntropy.prototype.constructor = random.LessEntropy ;



// Get a pseudo random int32
random.LessEntropy.prototype.randomUInt32 = function randomUInt32()
{
	return crypto.pseudoRandomBytes( 4 ).readUInt32LE( 0 , true ) ;
} ;



			//////////////////////
			// Mersenne-Twister //
			//////////////////////



// Source: Wikipedia.

// Create a Mersenne Twister generator instance
random.MersenneTwister = function MersenneTwister()
{
	var r = Object.create( random.MersenneTwister.prototype , {
		state: { value: [] , enumerable: true } ,
		index: { value: 0 , writable: true , enumerable: true }
	} ) ;
	
	return r ;
} ;

// Inherits from random.GenericRandom
random.MersenneTwister.prototype = Object.create( random.GenericRandom.prototype ) ;
random.MersenneTwister.prototype.constructor = random.MersenneTwister ;



// Initialize the generator from a seed
random.MersenneTwister.prototype.seed = function seed( newSeed )
{
	var i ;
	
	if ( typeof newSeed !== 'number' )  { newSeed = new Date().getTime() ; }
	
	this.index = 0 ;
	this.state[ 0 ] = newSeed >>> 0 ;	// To 32bits
	
	// loop over each other element
	for ( i = 1 ; i < 624 ; i ++ )
	{
		this.state[ i ] = 0x6c078965 * ( this.state[ i - 1 ] ^ ( this.state[ i - 1 ] >>> 30 ) ) + i ;
		this.state[ i ] >>>= 0 ; // To 32bits integer
	}
} ;



// Initialize the generator with better random values, but the series cannot be reproduced
// with a single integer seed, you should save the state
random.MersenneTwister.prototype.betterInit = function betterInit()
{
	var i ;
	
	// loop over each other element
	for ( i = 0 ; i < 624 ; i ++ )
	{
		this.state[ i ] = random.LessEntropy.prototype.randomUInt32() >>> 0 ;
	}
} ;



// Extract a tempered pseudorandom number based on the this.index-th value,
// calling generate_numbers() every 624 numbers
random.MersenneTwister.prototype.randomUInt32 = function randomUInt32()
{
	if ( this.index === 0 )  { this.generate() ; }
	
	var x = this.state[ this.index ] ;
	
	x ^= x >>> 11 ;
	x ^= ( x << 7 ) & 0x9d2c5680 ;
	x ^= ( x << 15 ) & 0xefc60000 ;
	x ^= x >>> 18 ;
	
	this.index = ( this.index + 1 ) % 624 ;
	
	return x >>> 0 ;
} ;



// Generate an array of 624 untempered numbers
random.MersenneTwister.prototype.generate = function generate()
{
	var i , x ;
	
	for ( i = 0 ; i < 624 ; i ++ )
	{
		x = this.state[ this.index ] ;
		
		// 0x80000000: bit 31 (32nd bit) of this.state[i]
		// 0x7fffffff: bits 0-30 (first 31 bits) of this.state[...]
		x = ( this.state[ i ] & 0x80000000 ) + ( this.state[ ( i + 1 ) % 624 ] & 0x7fffffff ) ;
		this.state[ i ] = this.state[ ( i + 397 ) % 624 ] ^ ( this.state[ i ] >>> 1 ) ;
		
		if ( x % 2 !== 0 )
		{
			this.state[ i ] = this.state[ i ] ^ 0x9908b0df ;
		}
	}
} ;



