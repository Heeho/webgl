"use strict";
var v3 = {
	add: function(a, b) {
		var d = 3;
		var c = [0]; 
		for(var i = 0; i < d; i++) {
			c[i] = a[i] + b[i];
		}
		return c;
	},
	multiply: function(a, b) {
		var d = 3;
		var c = [0]; 
		for(var i = 0; i < d; i++) {
			c[i] = a[i] * b;
		}
		return c;
	},
	dotProduct: undefined,
	crossProduct: undefined,
}
	