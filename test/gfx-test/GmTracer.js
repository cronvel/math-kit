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



const Tracer = require( './Tracer.js' ) ;



function GmTracer( params = {} ) {
	Tracer.call( this , params ) ;
	this.gm = params.gm || require( 'gm' ) ;
	this.image = null ;
}

GmTracer.prototype = Object.create( Tracer.prototype ) ;
GmTracer.prototype.constructor = GmTracer ;

module.exports = GmTracer ;



GmTracer.prototype.create = function() {
	this.image = this.gm( this.width , this.height , this.backgroundColor ) ;
} ;



GmTracer.prototype.save = function( filePath ) {
	return new Promise( ( resolve , reject ) => {
		this.image.write( filePath , ( error ) => {
			if ( error ) { reject( error ) ; }
			else { resolve() ; }
		} ) ;
	} ) ;
} ;



GmTracer.prototype.setStrokeColor = function( color ) { 
	this.image.stroke( color ) ;
} ;



GmTracer.prototype.setStrokeWidth = function( width ) { 
	this.image.strokeWidth( width ) ;
} ;



GmTracer.prototype.setFillColor = function( color ) { 
	this.image.fill( color ) ;
} ;



GmTracer.prototype.drawLine = function( x1 , y1 , x2 , y2 ) { 
	this.image.drawLine( x1 , y1 , x2 , y2 ) ;
} ;



GmTracer.prototype.drawCircle = function( x , y , radius ) { 
	this.image.drawCircle( x , y , x + radius , y + radius ) ;
} ;

