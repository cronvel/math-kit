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



const Common = require( './Common.js' ) ;
const crypto = require( 'crypto' ) ;



/*
	It uses node's crypto random
*/

function Entropy() {}

module.exports = Entropy ;



// Inherits from random.Common
Entropy.prototype = Object.create( Common.prototype ) ;
Entropy.prototype.constructor = Entropy ;



// Get a pseudo random int32
Entropy.prototype.randomUInt32 = function() {
	var r ;

	try {
		r = crypto.randomBytes( 4 ) ;
	}
	catch ( exception ) {
		return undefined ;
	}

	return r.readUInt32LE( 0 , true ) ;
} ;

//Entropy.prototype.randomFloat = function() { return this.randomUInt32() / 4294967296.0 ; } ;

