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



function Tracer( params = {} ) {
	// Image size and defaults
	this.width = params.width ?? params.size ?? 500 ;
	this.height = params.height ?? params.size ?? 500 ;
	this.backgroundColor = params.backgroundColor ?? params.bgColor ?? '#fff' ;
	
	// Bounding box
	this.xMin = params.xMin ?? params.xmin ?? -1 ;
	this.xMax = params.xMax ?? params.xmax ?? 1 ;
	this.yMin = params.yMin ?? params.ymin ?? -1 ;
	this.yMax = params.yMax ?? params.ymax ?? 1 ;
	
	// Marks on each axis, 0=no mark
	this.everyX = params.everyX ?? params.every ?? 0 ;
	this.everyY = params.everyY ?? params.every ?? 0 ;
	this.xUnit = params.xUnit || '' ;
	this.yUnit = params.yUnit || '' ;
}

module.exports = Tracer ;



// Things that should be done on the driver-side
Tracer.prototype.createImage = function() { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.saveImage = function( filePath ) { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.setStrokeColor = function( color ) { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.setStrokeWidth = function( width ) { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.setFillColor = function( color ) { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.setFontSize = function( size ) { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.drawPoint = function( x , y ) { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.drawLine = function( x1 , y1 , x2 , y2 ) { throw new Error( "This driver does not support this!" ) ; }
Tracer.prototype.drawCircle = function( x , y , radius ) { throw new Error( "This driver does not support this!" ) ; }



// Convert from/to image coordinates
Tracer.prototype.toImageX = function( x ) {
	return Math.round( ( this.width - 1 ) * ( x - this.xMin ) / ( this.xMax - this.xMin ) ) ;
} ;

Tracer.prototype.toImageY = function( y ) {
	return Math.round( this.height - 1 - ( this.height - 1 ) * ( y - this.yMin ) / ( this.yMax - this.yMin ) ) ;
} ;

Tracer.prototype.fromImageX = function( imgX ) {
	return this.xMin + ( this.xMax - this.xMin ) * ( imgX / ( this.width - 1 ) ) ;
} ;

Tracer.prototype.fromImageY = function( imgY ) {
	return this.yMin + ( this.yMax - this.yMin ) * ( ( this.height - 1 - imgY ) / ( this.height - 1 ) ) ;
} ;

Tracer.prototype.fromImageXMin = function() { return this.fromImageX( 0 ) ; } ;
Tracer.prototype.fromImageXMax = function() { return this.fromImageX( this.width - 1 ) ; } ;
Tracer.prototype.fromImageYMin = function() { return this.fromImageY( 0 ) ; } ;
Tracer.prototype.fromImageYMax = function() { return this.fromImageY( this.height - 1 ) ; } ;

Tracer.prototype.getPixelWidth = function() { return ( this.xMax - this.xMin ) / ( this.width - 1 ) ; }
Tracer.prototype.getPixelHeight = function() { return ( this.yMax - this.yMin ) / ( this.height - 1 ) ; }



Object.defineProperties( Tracer.prototype , {
	imageXMin: { get: function() { return this.fromImageXMin() ; } } ,
	imageXMax: { get: function() { return this.fromImageXMax() ; } } ,
	imageYMin: { get: function() { return this.fromImageYMin() ; } } ,
	imageYMax: { get: function() { return this.fromImageYMax() ; } } ,
	pixelWidth: { get: function() { return this.getPixelWidth() ; } } ,
	pixelHeight: { get: function() { return this.getPixelHeight() ; } }
} ) ;



// Trace axis and units
Tracer.prototype.drawAxis = function( axisColor = '#dd7' , labelColor = '#dd7' , labelFontSize = 14 ) {
	var x , y , imgX , imgY , min , max ,
		markSize = 5 ,
		oImgX = this.toImageX( 0 ) ,
		oImgY = this.toImageY( 0 ) ;
	
	this.setStrokeColor( axisColor ) ;
	this.drawLine( 0 , oImgY , this.width - 1 , oImgY ) ;
	this.drawLine( oImgX , 0 , oImgX , this.height - 1 ) ;
	
	if ( this.everyX ) {
		min = this.xMin - this.xMin % this.everyX ;
		max = this.xMax - this.xMax % this.everyX ;
		
		for ( x = min ; x <= max ; x += this.everyX ) {
			if ( ! x ) { continue ; }
			imgX = this.toImageX( x ) ;
			this.setStrokeColor( axisColor ) ;
			this.drawLine( imgX , oImgY - markSize , imgX , oImgY + markSize ) ;

			this.setStrokeColor( labelColor ) ;
			this.setFillColor( labelColor ) ;
			this.setFontSize( labelFontSize ) ;
			this.drawText( imgX , oImgY + 2 * markSize , '' + x + this.xUnit , 'center' , 'top' ) ;
		}
	}

	if ( this.everyY ) {
		min = this.yMin - this.yMin % this.everyY ;
		max = this.yMax - this.yMax % this.everyY ;
		
		for ( y = min ; y <= max ; y += this.everyY ) {
			if ( ! y ) { continue ; }
			imgY = this.toImageY( y ) ;
			this.setStrokeColor( axisColor ) ;
			this.drawLine( oImgX - markSize , imgY , oImgX + markSize , imgY ) ;

			this.setStrokeColor( labelColor ) ;
			this.setFillColor( labelColor ) ;
			this.setFontSize( labelFontSize ) ;
			this.drawText( oImgX - 2 * markSize , imgY , '' + y + this.yUnit , 'right' , 'center' ) ;
		}
	}
} ;



// Trace any object having a tracer function* (generator)
Tracer.prototype.trace = function( object , strokeColor = '#aaa' , strokeWidth = 1 , dotRadius = 0 ) {
	if ( typeof object?.tracer !== 'function' ) { throw new Error( 'Untraceable object' ) ; }
	
	var imgX , lastImgX , x , imgY , lastImgY , y , point ,
		streak = 0 ;
	
	this.setStrokeColor( strokeColor ) ;
	this.setFillColor( '#000f' ) ;
	this.setStrokeWidth( strokeWidth ) ;

	for ( point of object.tracer( this ) ) {
		if ( ! point || ! Number.isFinite( point.x ) || ! Number.isFinite( point.y ) ) {
			if ( streak === 1 ) {
				// There was a previous and orphaned point, draw a dot
				//console.log( "drawPoint()" , lastImgX , lastImgY ) ;
				if ( dotRadius ) {
					this.drawCircle( lastImgX , lastImgY , dotRadius ) ;
				}
				else {
					this.drawPoint( lastImgX , lastImgY ) ;
				}
			}
			
			lastImgY = NaN ;
			lastImgX = NaN ;
			streak = 0 ;
		}
		else {
			imgX = this.toImageX( point.x ) ;
			imgY = this.toImageY( point.y ) ;
			
			if ( streak ) {
				//console.log( "drawLine()" , lastImgX , lastImgY , imgX , imgY ) ;
				this.drawLine( lastImgX , lastImgY , imgX , imgY ) ;
			}
			
			lastImgY = imgY ;
			lastImgX = imgX ;
			streak ++ ;
		}
	}

	if ( streak === 1 ) {
		// It was ending with an orphaned point, draw a dot
		//console.log( "drawPoint()" , lastImgX , lastImgY ) ;
		if ( dotRadius ) {
			this.drawCircle( lastImgX , lastImgY , dotRadius ) ;
		}
		else {
			this.drawPoint( lastImgX , lastImgY ) ;
		}
	}
} ;



// Trace a Fn instance
Tracer.prototype.traceFn = function( fn , strokeColor = '#0f0' , strokeWidth = 1 ) {
	var imgX , x , imgY , y ,
		lastImgY = NaN ,
		lastImgX = NaN ;
	
	this.setStrokeColor( strokeColor ) ;
	this.setStrokeWidth( strokeWidth ) ;

	for ( imgX = 0 ; imgX < this.width ; imgX ++ ) {
		x = this.fromImageX( imgX ) ;
		y = fn.fx( x ) ;
		
		if ( Number.isNaN( y ) ) {
			lastImgY = NaN ;
			lastImgX = NaN ;
		}
		else {
			imgY = this.toImageY( y ) ;

			if ( ! Number.isNaN( lastImgY ) ) {
				this.drawLine( lastImgX , lastImgY , imgX , imgY ) ;
			}

			lastImgY = imgY ;
			lastImgX = imgX ;
		}
	}
} ;



// Trace a Fn having controlPoints
Tracer.prototype.traceControlPoints = function( fn , radius = 4 , strokeColor = '#ad0' , strokeWidth = 1 , fillColor = '#fff6' ) {
	var i , cp ,
		cps = fn.controlPoints ;

	// Check if this is an InterpolatedFn, exit if not
	if ( ! Array.isArray( cps ) ) { return ; }

	this.setStrokeColor( strokeColor ) ;
	this.setStrokeWidth( strokeWidth ) ;
	this.setFillColor( fillColor ) ;

	for ( i = 0 ; i < cps.length ; i ++ ) {
		cp = cps[ i ] ;
		this.drawCircle( this.toImageX( cp.x ) , this.toImageY( cp.fx ) , radius ) ;
	}
} ;

