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



const BoundingBox2D = require( '../geometry/BoundingBox2D.js' ) ;
const common = require( '../common.js' ) ;



function Tracer( params = {} ) {
	// Image size and defaults
	this.width = params.width ?? params.size ?? 500 ;
	this.height = params.height ?? params.size ?? 500 ;
	this.backgroundColor = params.backgroundColor ?? params.bgColor ?? '#fff' ;

	// Bounding box
	this.bbox = new BoundingBox2D(
		params.xMin ?? params.xmin ?? -1 ,
		params.yMin ?? params.ymin ?? -1 ,
		params.xMax ?? params.xmax ?? 1 ,
		params.yMax ?? params.ymax ?? 1
	) ;

	// Marks on each axis, 0=no mark
	this.everyX = params.everyX ?? params.every ?? 0 ;
	this.everyY = params.everyY ?? params.every ?? 0 ;
	this.semiXAxis = Math.sign( + params.semiXAxis || 0 ) ;
	this.semiYAxis = Math.sign( + params.semiYAxis || 0 ) ;
	this.xUnit = params.xUnit || '' ;
	this.yUnit = params.yUnit || '' ;

	this.markSize = 5 ;

	this._tracerParams = null ;
}

module.exports = Tracer ;



// Things that should be done on the driver-side
Tracer.prototype.createImage = function() { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.saveImage = function( filePath ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.setStrokeColor = function( color ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.setStrokeWidth = function( width ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.setFillColor = function( color ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.setFontSize = function( size ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.drawPoint = function( x , y ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.drawLine = function( x1 , y1 , x2 , y2 ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.drawRectangle = function( x1 , y1 , x2 , y2 ) { throw new Error( "This driver does not support this!" ) ; } ;
Tracer.prototype.drawCircle = function( x , y , radius ) { throw new Error( "This driver does not support this!" ) ; } ;



// Convert from/to image coordinates
Tracer.prototype.toImageX = function( x ) {
	return Math.round( ( this.width - 1 ) * ( x - this.bbox.min.x ) / ( this.bbox.max.x - this.bbox.min.x ) ) ;
} ;

Tracer.prototype.toImageY = function( y ) {
	return Math.round( this.height - 1 - ( this.height - 1 ) * ( y - this.bbox.min.y ) / ( this.bbox.max.y - this.bbox.min.y ) ) ;
} ;

Tracer.prototype.fromImageX = function( imgX ) {
	return this.bbox.min.x + ( this.bbox.max.x - this.bbox.min.x ) * ( imgX / ( this.width - 1 ) ) ;
} ;

Tracer.prototype.fromImageY = function( imgY ) {
	return this.bbox.min.y + ( this.bbox.max.y - this.bbox.min.y ) * ( ( this.height - 1 - imgY ) / ( this.height - 1 ) ) ;
} ;

Tracer.prototype.fromImageXMin = function() { return this.fromImageX( 0 ) ; } ;
Tracer.prototype.fromImageXMax = function() { return this.fromImageX( this.width - 1 ) ; } ;
Tracer.prototype.fromImageYMin = function() { return this.fromImageY( 0 ) ; } ;
Tracer.prototype.fromImageYMax = function() { return this.fromImageY( this.height - 1 ) ; } ;

Tracer.prototype.getPixelWidth = function() { return ( this.bbox.max.x - this.bbox.min.x ) / ( this.width - 1 ) ; } ;
Tracer.prototype.getPixelHeight = function() { return ( this.bbox.max.y - this.bbox.min.y ) / ( this.height - 1 ) ; } ;



// Set the window: bounding box (moving the axis), and units
Tracer.prototype.setWindow = function( params = {} ) {
	if ( params.xMin !== undefined || params.xmin !== undefined ) { this.bbox.min.x = params.xMin ?? params.xmin ?? -1 ; }
	if ( params.yMin !== undefined || params.ymin !== undefined ) { this.bbox.min.y = params.yMin ?? params.ymin ?? -1 ; }
	if ( params.xMax !== undefined || params.xmax !== undefined ) { this.bbox.max.x = params.xMax ?? params.xmax ?? 1 ; }
	if ( params.yMax !== undefined || params.ymax !== undefined ) { this.bbox.max.y = params.yMax ?? params.ymax ?? 1 ; }

	// Marks on each axis, 0=no mark
	if ( params.every !== undefined ) {
		this.everyX = this.everyY = params.every ?? 0 ;
	}
	else {
		if ( params.everyX !== undefined ) { this.everyX = params.everyX ?? 0 ; }
		if ( params.everyY !== undefined ) { this.everyY = params.everyY ?? 0 ; }
	}

	if ( params.xUnit !== undefined ) { this.xUnit = params.xUnit || '' ; }
	if ( params.yUnit !== undefined ) { this.yUnit = params.yUnit || '' ; }
} ;



// Build params for the foreign tracer call
Tracer.prototype.buildTracerParams = function() {
	this._tracerParams = {
		bbox: this.bbox.dup() ,
		incX: this.getPixelWidth() ,
		incY: this.getPixelHeight()
	} ;

	return this._tracerParams ;
} ;



Object.defineProperties( Tracer.prototype , {
	imageXMin: { get: function() { return this.fromImageXMin() ; } } ,
	imageXMax: { get: function() { return this.fromImageXMax() ; } } ,
	imageYMin: { get: function() { return this.fromImageYMin() ; } } ,
	imageYMax: { get: function() { return this.fromImageYMax() ; } } ,
	pixelWidth: { get: function() { return this.getPixelWidth() ; } } ,
	pixelHeight: { get: function() { return this.getPixelHeight() ; } } ,
	tracerParams: { get: function() { return this._tracerParams || this.buildTracerParams() ; } }
} ) ;



// Trace axis
Tracer.prototype.drawAxis = function( axisColor = '#dd7' ) {
	this.drawXAxis( axisColor ) ;
	this.drawYAxis( axisColor ) ;
} ;



Tracer.prototype.drawXAxis = function( axisColor = '#dd7' ) {
	var x , imgX , min , max ,
		oImgX = this.toImageX( 0 ) ,
		oImgY = this.toImageY( 0 ) ;

	this.setStrokeColor( axisColor ) ;

	if ( this.semiXAxis > 0 ) { this.drawLine( oImgX , oImgY , this.width - 1 , oImgY ) ; }
	else if ( this.semiXAxis < 0 ) { this.drawLine( 0 , oImgY , oImgX , oImgY ) ; }
	else { this.drawLine( 0 , oImgY , this.width - 1 , oImgY ) ; }

	if ( this.everyX ) {
		min = this.bbox.min.x - this.bbox.min.x % this.everyX ;
		max = this.bbox.max.x - this.bbox.max.x % this.everyX ;

		if ( this.semiXAxis > 0 && min < 0 ) { min = 0 ; }
		else if ( this.semiXAxis < 0 && max > 0 ) { max = 0 ; }

		for ( x = min ; x <= max ; x += this.everyX ) {
			if ( ! x ) { continue ; }
			imgX = this.toImageX( x ) ;
			this.drawLine( imgX , oImgY - this.markSize , imgX , oImgY + this.markSize ) ;
		}
	}
} ;



Tracer.prototype.drawYAxis = function( axisColor = '#dd7' ) {
	var y , imgY , min , max ,
		oImgX = this.toImageX( 0 ) ,
		oImgY = this.toImageY( 0 ) ;

	this.setStrokeColor( axisColor ) ;

	if ( this.semiYAxis > 0 ) { this.drawLine( oImgX , 0 , oImgX , oImgY ) ; }
	else if ( this.semiYAxis < 0 ) { this.drawLine( oImgX , oImgY , oImgX , this.height - 1 ) ; }
	else { this.drawLine( oImgX , 0 , oImgX , this.height - 1 ) ; }

	if ( this.everyY ) {
		min = this.bbox.min.y - this.bbox.min.y % this.everyY ;
		max = this.bbox.max.y - this.bbox.max.y % this.everyY ;

		if ( this.semiYAxis > 0 && min < 0 ) { min = 0 ; }
		else if ( this.semiYAxis < 0 && max > 0 ) { max = 0 ; }

		for ( y = min ; y <= max ; y += this.everyY ) {
			if ( ! y ) { continue ; }
			imgY = this.toImageY( y ) ;
			this.drawLine( oImgX - this.markSize , imgY , oImgX + this.markSize , imgY ) ;
		}
	}
} ;



Tracer.prototype.drawUnits = function( labelColor = '#dd7' , labelFontSize = 14 ) {
	this.drawXUnits( labelColor , labelFontSize ) ;
	this.drawYUnits( labelColor , labelFontSize ) ;
} ;



// Draw measure and units
Tracer.prototype.drawXUnits = function( labelColor = '#dd7' , labelFontSize = 14 ) {
	if ( ! this.everyX ) { return ; }

	var x , imgX , min , max ,
		xAxisY = this.toImageY( 0 ) + 2 * this.markSize ,
		xAxisAlign = 'top' ,
		//labelWidth = ( '' + ( this.bbox.max.y % this.everyY ) + this.yUnit ).length * labelFontSize ,
		//labelCharWidth = labelFontSize ,
		labelHeight = labelFontSize ,
		margin = labelFontSize / 4 ;

	if ( xAxisY < margin ) {
		xAxisY = margin ;
	}
	else if ( xAxisY + labelHeight > this.height - 1 - margin ) {
		xAxisAlign = 'bottom' ;
		xAxisY = Math.min( this.height - 1 - margin , this.toImageY( 0 ) - 2 * this.markSize ) ;
	}

	this.setStrokeColor( labelColor ) ;
	this.setFillColor( labelColor ) ;
	this.setFontSize( labelFontSize ) ;

	min = this.bbox.min.x - this.bbox.min.x % this.everyX ;
	max = this.bbox.max.x - this.bbox.max.x % this.everyX ;

	if ( this.semiXAxis > 0 && min < 0 ) { min = 0 ; }
	else if ( this.semiXAxis < 0 && max > 0 ) { max = 0 ; }

	for ( x = min ; x <= max ; x += this.everyX ) {
		imgX = this.toImageX( x ) ;
		this.drawText( imgX , xAxisY , '' + x + this.xUnit , 'center' , xAxisAlign ) ;
	}
} ;



// side: 0=auto, -1=left, 1=right
Tracer.prototype.drawYUnits = function( labelColor = '#dd7' , labelFontSize = 14 , side = 0 ) {
	if ( ! this.everyY ) { return ; }

	var y , imgY , min , max , yAxisX , yAxisAlign ,
		labelWidth = ( '' + ( this.bbox.max.y % this.everyY ) + this.yUnit ).length * labelFontSize ,
		//labelCharWidth = labelFontSize ,
		labelHeight = labelFontSize ,
		margin = labelFontSize / 4 ;

	if ( side > 0 ) {
		yAxisAlign = 'right' ;
		yAxisX = this.width - 1 - margin ;
	}
	else if ( side < 0 ) {
		yAxisAlign = 'left' ;
		yAxisX = margin ;
	}
	else {
		yAxisX = this.toImageX( 0 ) - 2 * this.markSize ;
		yAxisAlign = 'right' ;

		if ( yAxisX - labelWidth < margin ) {
			yAxisAlign = 'left' ;
			yAxisX = Math.max( margin , this.toImageX( 0 ) + 2 * this.markSize ) ;
		}
		else if ( yAxisX > this.width - 1 - margin ) {
			yAxisX = this.width - 1 - margin ;
		}
	}

	this.setStrokeColor( labelColor ) ;
	this.setFillColor( labelColor ) ;
	this.setFontSize( labelFontSize ) ;

	min = this.bbox.min.y - this.bbox.min.y % this.everyY ;
	max = this.bbox.max.y - this.bbox.max.y % this.everyY ;

	if ( this.semiYAxis > 0 && min < 0 ) { min = 0 ; }
	else if ( this.semiYAxis < 0 && max > 0 ) { max = 0 ; }

	for ( y = min ; y <= max ; y += this.everyY ) {
		imgY = this.toImageY( y ) ;
		this.drawText( yAxisX , y ? imgY : imgY - labelHeight , '' + y + this.yUnit , yAxisAlign , 'center' ) ;
	}
} ;



Tracer.prototype.drawGrid = function( gridColor = '#7777' , drawX = true , drawY = true ) {
	var x , y , imgX , imgY , min , max ;

	this.setStrokeColor( gridColor ) ;
	this.setFillColor( gridColor ) ;	// gm use fill color instead of stroke color for .drawLine() -_-'

	if ( this.everyX && drawY ) {
		min = this.bbox.min.x - this.bbox.min.x % this.everyX ;
		max = this.bbox.max.x - this.bbox.max.x % this.everyX ;

		if ( this.semiXAxis > 0 && min < 0 ) { min = 0 ; }
		else if ( this.semiXAxis < 0 && max > 0 ) { max = 0 ; }

		for ( x = min ; x <= max ; x += this.everyX ) {
			imgX = this.toImageX( x ) ;
			this.drawLine( imgX , 0 , imgX , this.height - 1 ) ;
		}
	}

	if ( this.everyY && drawX ) {
		min = this.bbox.min.y - this.bbox.min.y % this.everyY ;
		max = this.bbox.max.y - this.bbox.max.y % this.everyY ;

		if ( this.semiYAxis > 0 && min < 0 ) { min = 0 ; }
		else if ( this.semiYAxis < 0 && max > 0 ) { max = 0 ; }

		for ( y = min ; y <= max ; y += this.everyY ) {
			imgY = this.toImageY( y ) ;
			this.drawLine( 0 , imgY , this.width - 1 , imgY ) ;
		}
	}
} ;



// Trace any object having a tracer function* (generator), or directly pass a generator function.
Tracer.prototype.trace = function( objectOrFunction , strokeColor = '#aaa' , strokeWidth = 1 , dotRadius = 0 ) {
	if ( typeof objectOrFunction !== 'function' && typeof objectOrFunction?.tracer !== 'function' ) { throw new Error( 'Untraceable object' ) ; }

	var iterator , imgX , lastImgX , imgY , lastImgY , point ,
		streak = 0 ;

	this.setStrokeColor( strokeColor ) ;
	this.setStrokeWidth( strokeWidth ) ;

	if ( dotRadius ) { this.setFillColor( '#000f' ) ; }
	else { this.setFillColor( strokeColor ) ; }	// gm use fill color instead of stroke color for .drawLine() and .drawPoint() -_-'

	iterator = typeof objectOrFunction === 'function' ? objectOrFunction( this.tracerParams ) :
		objectOrFunction.tracer( this.tracerParams ) ;

	for ( point of iterator ) {
		//console.log( "Got point:" , point ) ;
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



// Trace histogram bars for any object having a tracer function* (generator), or directly pass a generator function.
Tracer.prototype.traceBars = function( objectOrFunction , barWidth = 1 , strokeColor = '#aaa' , strokeWidth = 1 , fillColor = '#777' ) {
	if ( typeof objectOrFunction !== 'function' && typeof objectOrFunction?.tracer !== 'function' ) { throw new Error( 'Untraceable object' ) ; }

	this.setStrokeColor( strokeColor ) ;
	this.setStrokeWidth( strokeWidth ) ;
	this.setFillColor( fillColor ) ;

	for ( let point of (
		typeof objectOrFunction === 'function' ? objectOrFunction( this.tracerParams ) : objectOrFunction.tracer( this.tracerParams )
	) ) {
		//console.log( "Got point:" , point ) ;
		if ( point && Number.isFinite( point.x ) && Number.isFinite( point.y ) ) {
			let imgX1 = this.toImageX( point.x - barWidth / 2 ) ;
			let imgX2 = this.toImageX( point.x + barWidth / 2 ) ;
			let imgY1 = this.toImageY( 0 ) ;
			let imgY2 = this.toImageY( point.y ) ;

			this.drawRectangle( imgX1 , imgY1 , imgX2 , imgY2 ) ;
		}
	}
} ;



// Draw histogram bar's value for any object having a tracer function* (generator), or directly pass a generator function.
Tracer.prototype.drawBarValues = function( objectOrFunction , labelColor = '#dd7' , labelFontSize = 14 , round = 0.1 ) {
	if ( typeof objectOrFunction !== 'function' && typeof objectOrFunction?.tracer !== 'function' ) { throw new Error( 'Untraceable object' ) ; }

	this.setStrokeColor( labelColor ) ;
	this.setFillColor( labelColor ) ;
	this.setFontSize( labelFontSize ) ;

	for ( let point of (
		typeof objectOrFunction === 'function' ? objectOrFunction( this.tracerParams ) : objectOrFunction.tracer( this.tracerParams )
	) ) {
		//console.log( "Got point:" , point ) ;
		if ( point && Number.isFinite( point.x ) && Number.isFinite( point.y ) ) {
			let imgX = this.toImageX( point.x ) ;
			let imgY = this.toImageY( point.y ) ;
			let oImgY = this.toImageY( 0 ) ;
			let height = Math.abs( imgY - oImgY ) ;
			let above = point.y > 0 === labelFontSize * 2 > height ;
			let displayValue = round ? common.round( point.y , round ) : point.y ;

			if ( above ) {
				this.drawText( imgX , imgY - 0.5 * labelFontSize , '' + displayValue + this.yUnit , 'center' , 'bottom' ) ;
			}
			else {
				this.drawText( imgX , imgY + 0.5 * labelFontSize , '' + displayValue + this.yUnit , 'center' , 'top' ) ;
			}
		}
	}
} ;



// Trace a Fn instance
Tracer.prototype.traceFn = function( fn , strokeColor = '#0f0' , strokeWidth = 1 , property = 'fx' ) {
	var imgX , x , imgY , y ,
		lastImgY = NaN ,
		lastImgX = NaN ;

	this.setStrokeColor( strokeColor ) ;
	this.setStrokeWidth( strokeWidth ) ;

	for ( imgX = 0 ; imgX < this.width ; imgX ++ ) {
		x = this.fromImageX( imgX ) ;
		y = fn[ property ]( x ) ;

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

Tracer.prototype.traceDFn = function( fn , strokeColor = '#ff0' , strokeWidth = 1 ) { return this.traceFn( fn , strokeColor , strokeWidth , 'dfx' ) ; } ;
Tracer.prototype.traceD2Fn = function( fn , strokeColor = '#f00' , strokeWidth = 1 ) { return this.traceFn( fn , strokeColor , strokeWidth , 'd2fx' ) ; } ;
Tracer.prototype.traceSFn = function( fn , strokeColor = '#0ff' , strokeWidth = 1 ) { return this.traceFn( fn , strokeColor , strokeWidth , 'sfx' ) ; } ;
Tracer.prototype.traceS2Fn = function( fn , strokeColor = '#00f' , strokeWidth = 1 ) { return this.traceFn( fn , strokeColor , strokeWidth , 's2fx' ) ; } ;



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

