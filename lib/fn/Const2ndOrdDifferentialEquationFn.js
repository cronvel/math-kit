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



const Fn = require( './Fn.js' ) ;



/*
	This solve the differential equation:
	f"(x) + cDfx f'(x) + cFx f(x) = h
	... having starting condition f(0) = f0 and f'(0) = df0.
*/
function Const2ndOrdDifferentialEquationFn( cDfx , cFx , constant , df0 , f0 ) {
	this.cDfx = cDfx ;
	this.cFx = cFx ;
	this.constant = constant ;
	this.df0 = df0 ;
	this.f0 = f0 ;

	this.h = null ;
	this.discriminant = null ;
	this.r1 = null ;
	this.r2 = null ;
	this.alpha = null ;
	this.beta = null ;
	this.lambda = null ;
	this.mu = null ;
	this.dLambda = null ;
	this.dMu = null ;
	this.d2Lambda = null ;
	this.d2Mu = null ;

	this.compute() ;
}

Const2ndOrdDifferentialEquationFn.prototype = Object.create( Fn.prototype ) ;
Const2ndOrdDifferentialEquationFn.prototype.constructor = Const2ndOrdDifferentialEquationFn ;

module.exports = Const2ndOrdDifferentialEquationFn ;



Const2ndOrdDifferentialEquationFn.createSpringDamperMass = ( k , d , m , p0 , v0 , externalForces ) => {
	return new Const2ndOrdDifferentialEquationFn( d / m , k / m , externalForces / m , v0 , p0 ) ;
} ;



Const2ndOrdDifferentialEquationFn.prototype.set = function( cDfx , cFx , constant , df0 , f0 ) {
	this.cDfx = cDfx ;
	this.cFx = cFx ;
	this.constant = constant ;
	this.df0 = df0 ;
	this.f0 = f0 ;

	this.compute() ;
} ;



Const2ndOrdDifferentialEquationFn.prototype.dup = Const2ndOrdDifferentialEquationFn.prototype.clone = function() {
	return new Const2ndOrdDifferentialEquationFn( this.cDfx , this.cFx , this.h , this.df0 , this.f0 ) ;
} ;



Const2ndOrdDifferentialEquationFn.prototype.compute = function() {
	// First compute discriminant
	this.h = this.constant ? this.constant / this.cFx : 0 ;
	//console.log( "h:" , this.h ) ;
	this.discriminant = this.cDfx * this.cDfx - 4 * this.cFx ;
	//console.log( "delta:" , this.discriminant ) ;
	if ( this.discriminant > 0 ) { this.computeDoubleRealRoots() ; }
	else if ( this.discriminant < 0 ) { this.computeDoubleComplexRoots() ; }
	else { this.computeSingleRoot() ; }
} ;



// Form: λ.e(r1.t) + μ.e(r2.t) + h
Const2ndOrdDifferentialEquationFn.prototype.computeDoubleRealRoots = function() {
	var sqrtDiscriminant = Math.sqrt( this.discriminant ) ;
	this.r1 = ( -this.cDfx - sqrtDiscriminant ) / 2 ;
	this.r2 = ( -this.cDfx + sqrtDiscriminant ) / 2 ;

	this.lambda = ( this.df0 - this.f0 * this.r2 + this.h * this.r2 ) / ( this.r1 - this.r2 ) ;
	//this.mu = ( this.df0 - this.f0 * this.r1 + this.h * this.r1 ) / ( this.r2 - this.r1 ) ;	// Symetric
	this.mu = this.f0 - this.lambda - this.h ;	// Faster

	this.dLambda = this.r1 * this.lambda ;
	this.dMu = this.r2 * this.mu ;

	this.d2Lambda = this.r1 * this.dLambda ;
	this.d2Mu = this.r2 * this.dMu ;
} ;



// Form: [ λ.cos(β.t) + μ.sin(β.t) ].e(α.t) + h
Const2ndOrdDifferentialEquationFn.prototype.computeDoubleComplexRoots = function() {
	this.alpha = -this.cDfx / 2 ;
	this.beta = Math.sqrt( -this.discriminant ) / 2 ;

	this.lambda = this.f0 - this.h ;
	this.mu = ( this.df0 - this.lambda * this.alpha ) / this.beta ;

	this.dLambda = this.alpha * this.lambda + this.beta * this.mu ;
	this.dMu = this.alpha * this.mu - this.beta * this.lambda ;

	this.d2Lambda = this.alpha * this.dLambda + this.beta * this.dMu ;
	this.d2Mu = this.alpha * this.dMu - this.beta * this.dLambda ;
} ;



// Form: (λ + μ.t).e(r1.t) + h
Const2ndOrdDifferentialEquationFn.prototype.computeSingleRoot = function() {
	this.r1 = -this.cDfx / 2 ;

	this.lambda = this.f0 - this.h ;
	this.mu = this.df0 - this.lambda * this.r1 ;

	this.dLambda = this.r1 * this.lambda + this.mu ;
	this.dMu = this.r1 * this.mu ;

	this.d2Lambda = this.r1 * this.dLambda + this.dMu ;
	this.d2Mu = this.r1 * this.dMu ;
} ;



Const2ndOrdDifferentialEquationFn.prototype.fx = function( x ) {
	if ( this.discriminant > 0 ) {
		// Form: λ.e(r1.t) + μ.e(r2.t) + h
		return this.lambda * Math.exp( this.r1 * x ) + this.mu * Math.exp( this.r2 * x ) + this.h ;
	}

	if ( this.discriminant < 0 ) {
		// Form: [ λ.cos(β.t) + μ.sin(β.t) ].e(α.t) + h
		return ( this.lambda * Math.cos( this.beta * x ) + this.mu * Math.sin( this.beta * x ) ) * Math.exp( this.alpha * x ) + this.h ;
	}

	// Form: (λ + μ.t).e(r1.t) + h
	return ( this.lambda + this.mu * x ) * Math.exp( this.r1 * x ) + this.h ;
} ;



// Derivative f'(x)
Const2ndOrdDifferentialEquationFn.prototype.dfx = function( x ) {
	if ( this.discriminant > 0 ) {
		// Form: λ.e(r1.t) + μ.e(r2.t)
		return this.dLambda * Math.exp( this.r1 * x ) + this.dMu * Math.exp( this.r2 * x ) ;
	}

	if ( this.discriminant < 0 ) {
		// Form: [ λ.cos(β.t) + μ.sin(β.t) ].e(α.t)
		return ( this.dLambda * Math.cos( this.beta * x ) + this.dMu * Math.sin( this.beta * x ) ) * Math.exp( this.alpha * x ) ;
	}

	// Form: (λ + μ.t).e(r1.t)
	return ( this.dLambda + this.dMu * x ) * Math.exp( this.r1 * x ) ;
} ;



// Derivative f"(x)
Const2ndOrdDifferentialEquationFn.prototype.d2fx = function( x ) {
	if ( this.discriminant > 0 ) {
		// Form: λ.e(r1.t) + μ.e(r2.t)
		return this.d2Lambda * Math.exp( this.r1 * x ) + this.d2Mu * Math.exp( this.r2 * x ) ;
	}

	if ( this.discriminant < 0 ) {
		// Form: [ λ.cos(β.t) + μ.sin(β.t) ].e(α.t)
		return ( this.d2Lambda * Math.cos( this.beta * x ) + this.d2Mu * Math.sin( this.beta * x ) ) * Math.exp( this.alpha * x ) ;
	}

	// Form: (λ + μ.t).e(r1.t)
	return ( this.d2Lambda + this.d2Mu * x ) * Math.exp( this.r1 * x ) ;
} ;

