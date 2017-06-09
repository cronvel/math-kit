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
var Common = require( './Common.js' ) ;
var crypto = require( 'crypto' ) ;


/*
	It uses node's crypto pseudoRandom
*/



// Crypto module pseudo-random
function LessEntropy()
{
	var r = Object.create( LessEntropy.prototype ) ;
	return r ;
}

module.exports = LessEntropy ;



// Inherits from random.Common
LessEntropy.prototype = Object.create( Common.prototype ) ;
LessEntropy.prototype.constructor = LessEntropy ;



// Get a pseudo random int32
LessEntropy.prototype.randomUInt32 = function randomUInt32()
{
	return crypto.pseudoRandomBytes( 4 ).readUInt32LE( 0 , true ) ;
} ;

//LessEntropy.prototype.randomFloat = function randomFloat() { return this.randomUInt32() / 4294967296.0 ; } ;


