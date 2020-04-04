'use strict';
var m4 = {
	perspective: function(fieldOfViewRadians, aspect, near, far) {
		var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewRadians);
		var rangeInv = 1.0 / (near - far);
		
		return [
			f/aspect, 	0, 			0, 						0,
			0, 			f, 			0, 						0,
			0, 			0, 			(near+far)*rangeInv,    -1,
			0,			0,			near*far*rangeInv*2, 	0,
		];
	},
	projection: function(width, height, depth) {
		return [
			2/width, 	0, 			0, 			0,
			0, 			-2/height, 	0, 			0,
			0, 			0, 			2/depth, 	0,
			-1, 		1, 			0, 			1,
		];
	},
	multiply: function(a, b) {
		var d = 4;
		var c = [
			0,  0,  0,  0,
			0,  0,  0,  0,
			0,  0,  0,  0,
			0,  0,  0,  0,
		];
		for(var i = 0; i < d; i++) {
			for(var j = 0; j < d; j++) {
				for(var k = 0; k < d; k++) {
					c[i * d + j] += b[i * d + k] * a[k * d + j];
				}	
			}
		}		
		return c;
	},
	translation: function(tx, ty, tz) {
		return [
			1,  0,  0,  0,
			0,  1,  0,  0,
			0,  0,  1,  0,
			tx, ty, tz, 1,
		];
	},
	xRotation: function(theta) {
		var c = Math.cos(theta);
		var s = Math.sin(theta);
		return [
			1,  0,  0,  0,
			0,  c,  s,  0,
			0, -s,  c,  0,
			0,  0,  0,  1,
		];
	},
	yRotation: function(phi) {
		var c = Math.cos(phi);
		var s = Math.sin(phi);
		return [
			c,  0, -s,  0,
			0,  1,  0,  0,
			s,  0,  c,  0,
			0,  0,  0,  1,
		];
	},	
	zRotation: function(gamma) {
		var c = Math.cos(gamma);
		var s = Math.sin(gamma);
		return [
			c,  s,  0,  0,
		   -s,  c,  0,  0,
			0,  0,  1,  0,
			0,  0,  0,  1,
		];
	},	
	scaling: function(sx, sy, sz) {
		return [
			sx, 0,  0,  0,
			0, sy,  0,  0,
			0,  0, sz,  0,
			0,  0,  0,  1,
		];
	},
	translate: function(m, tx, ty, tz) {
		return m4.multiply(m, m4.translation(tx, ty, tz));},
	xRotate: function (m, theta) {
		return m4.multiply(m, m4.xRotation(theta));},
	yRotate: function (m, phi) {
		return m4.multiply(m, m4.yRotation(phi));},
	zRotate: function (m, gamma) {
		return m4.multiply(m, m4.zRotation(gamma));},
	scale: function(m, sx, sy, sz) {
		return m4.multiply(m, m4.scaling(sx, sy, sz));},
};