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



// Tracer driver for the “gm” module (GraphicMagick)

function GmTracer( params = {} ) {
	Tracer.call( this , params ) ;
	this.gm = params.gm || require( 'gm' ) ;
	this.image = null ;
	this.fontPointSize = 14 ;	// This is gm default value
}

GmTracer.prototype = Object.create( Tracer.prototype ) ;
GmTracer.prototype.constructor = GmTracer ;

module.exports = GmTracer ;



GmTracer.prototype.createImage = function() {
	this.image = this.gm( this.width , this.height , this.backgroundColor ) ;
} ;



GmTracer.prototype.saveImage = function( filePath ) {
	return new Promise( ( resolve , reject ) => {
		this.image.write( filePath , ( error ) => {
			if ( error ) { reject( error ) ; }
			else { resolve() ; }
		} ) ;
	} ) ;
} ;



GmTracer.prototype.setStrokeColor = function( color ) { this.image.stroke( color ) ; } ;
GmTracer.prototype.setStrokeWidth = function( width ) { this.image.strokeWidth( width ) ; } ;
GmTracer.prototype.setFillColor = function( color ) { this.image.fill( color ) ; } ;
GmTracer.prototype.setFontSize = function( size ) { this.fontPointSize = + size || 14 ; this.image.pointSize( this.fontPointSize ) ; } ;



GmTracer.prototype.drawPoint = function( x , y ) { this.image.drawPoint( x , y ) ; } ;
GmTracer.prototype.drawLine = function( x1 , y1 , x2 , y2 ) { this.image.drawLine( x1 , y1 , x2 , y2 ) ; } ;
GmTracer.prototype.drawCircle = function( x , y , radius ) { this.image.drawCircle( x , y , x + radius , y + radius ) ; } ;



const POINT_TO_PIXEL = 96 / 72 ;
const PIXEL_TO_POINT = 72 / 96 ;

GmTracer.prototype.drawText = function( x , y , text , xOrigin = 'left' , yOrigin = 'bottom' ) {
	var textWidth = 0 ,
		fontCharWidth = this.fontPointSize * POINT_TO_PIXEL * 0.4 ,	// value found empirically for character's width (fixed font)
		fontCharHeight = this.fontPointSize * POINT_TO_PIXEL * 0.5 ;	// value found empirically for character's height

	// text.length does not work because of unicode, but iterator should be safe
	for ( let char of text ) { textWidth ++ ; }
	
	if ( xOrigin === 'center' || xOrigin === 'middle' ) {
		x -= fontCharWidth * textWidth / 2 ;
	}
	else if ( xOrigin === 'right' ) {
		x -= fontCharWidth * textWidth ;
	}

	if ( yOrigin === 'center' || yOrigin === 'middle' ) {
		y += fontCharHeight / 2 ;
	}
	else if ( yOrigin === 'top' ) {
		y += fontCharHeight ;
	}

	this.image.drawText( x , y , text ) ;
} ;

