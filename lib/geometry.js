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



var geometry = {} ;
module.exports = geometry ;



Object.assign( geometry , require( './geometry/utils.js' ) ) ;

geometry.Vector2D = require( './geometry/Vector2D.js' ) ;
geometry.Vector3D = require( './geometry/Vector3D.js' ) ;

geometry.BoundVector2D = require( './geometry/BoundVector2D.js' ) ;
geometry.BoundVector3D = require( './geometry/BoundVector3D.js' ) ;

geometry.BoundingBox2D = require( './geometry/BoundingBox2D.js' ) ;
geometry.BoundingBox3D = require( './geometry/BoundingBox3D.js' ) ;

geometry.Circle2D = require( './geometry/Circle2D.js' ) ;
geometry.Sphere3D = require( './geometry/Sphere3D.js' ) ;
geometry.Plane3D = require( './geometry/Plane3D.js' ) ;
geometry.Circle3D = require( './geometry/Circle3D.js' ) ;


