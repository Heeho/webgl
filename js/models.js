'use strict';
	var models = {
		fighter: {
			size: 10,
			draftnodes:[/*jaws*//*0*/-1,0,6,/*1*/1,0,6,/*front*//*2*/-1,0,4,/*3*/1,0,4,/*top*//*4*/-1,-1,2,/*5*/1,-1,2,/*sides*//*6*/-3,0,0,/*7*/3,0,0,/*bottom*//*8*/-1,1,0,/*9*/1,1,0,/*butt*//*10*/-2,0,-2,/*11*/0,-1,-2,/*12*/2,0,-2,],
			indices: [/*frontwings*/0,6,4,1,5,7,/*sides*/6,11,4,7,5,11,/*hood*/4,11,5,/*buttocks*/11,6,10,11,12,7,/*front*/2,4,3,3,4,5,/*upperjaws*/2,0,4,3,5,1,/*butt*/10,12,11,/*bottom*/8,12,10,8,9,12,/*bottomsides*/8,10,6,9,7,12,/*bottomwings*/8,6,0,9,1,7,/*bottomfront*/8,2,3,9,8,3,/*bottomjaws*/8,0,2,9,3,1,],
			drafthitbox:[-1,0,6,1,0,6,/*+*/-1,-1,2,1,-1,2,/*+*/-3,0,0,3,0,0,/*+*/-1,1,0,1,1,0,/*+*/2,0,-2,0,-1,-2,-2,0,-2,],
			colors:[/*jaws*/Math.random()*55,Math.random()*35,Math.random()*155,Math.random()*55,Math.random()*35,Math.random()*155,/*front*/Math.random()*55,Math.random()*35,Math.random()*155,Math.random()*55,Math.random()*35,Math.random()*155,/*top*/Math.random()*55,Math.random()*35,Math.random()*155,Math.random()*55,Math.random()*35,Math.random()*155,/*sides*/Math.random()*55,Math.random()*35,Math.random()*155,Math.random()*55,Math.random()*35,Math.random()*155,/*bottom*/Math.random()*55,Math.random()*35,Math.random()*155,Math.random()*55,Math.random()*35,Math.random()*155,/*butt*/Math.random()*55,Math.random()*35,Math.random()*155,Math.random()*55,Math.random()*35,Math.random()*155,Math.random()*55,Math.random()*35,Math.random()*155,],			
		},
		bolt: {
			size: 5,
			TTL: 11,
			decay: .95,				
			draftnodes: [0,0,0,-11,0,6666,11,0,6666,],
			indices: [0,1,2,],
			drafthitbox: [0,0,0,0,0,6666,],
			colors: [255,255,255,255,255,255,255,255,255,],
		},
		explosion: {
			size: 44,
			TTL: 20,
			decay: .85,
			draftnodes:[/*0*/-1,0,0,/*1*/0,-1,0,/*2*/1,0,0,/*3*/0,0,-1,],
			indices: [0,3,1,3,2,1,0,1,2,0,2,3,],
			colors: [255,255,255,255,255,255,255,255,255,255,255,255,],
		},
		throttle: {
			size: 8,
			TTL: 30,
			decay: .85,
			draftnodes:[/*0*/-1,0,0,/*1*/0,-1,0,/*2*/1,0,0,/*3*/0,0,-1,],
			indices: [0,3,1,3,2,1,0,1,2,0,2,3,],
			colors:[255,1,1,255,1,1,255,1,1,255,1,1,],
		},
		carrier: {
			size: 8000,
			draftnodes:[/*0*/-2,0,1,/*1*/0,-2,1,/*2*/2,0,1,/*3*/0,1,-2,],
			indices: [3,1,0,3,2,1,3,0,2,0,1,2,],
			drafthitbox:[0,1,-2,0,-2,1,-2,0,1,2,0,1,],
			colors:[Math.random()*155,Math.random()*155,Math.random()*100,Math.random()*155,Math.random()*155,Math.random()*100,Math.random()*155,Math.random()*155,Math.random()*100,Math.random()*155,Math.random()*155,Math.random()*100,],
		},
		interceptor: {
			size: 10,
			draftnodes:[/*jaws*//*0*/-1,0,6,/*1*/1,0,6,/*front*//*2*/-1,0,4,/*3*/1,0,4,/*top*//*4*/-1,-1,2,/*5*/1,-1,2,/*sides*//*6*/-3,0,0,/*7*/3,0,0,/*bottom*//*8*/-1,1,0,/*9*/1,1,0,/*butt*//*10*/-2,0,-2,/*11*/0,-1,-2,/*12*/2,0,-2,],
			indices: [/*frontwings*/0,6,4,1,5,7,/*sides*/6,11,4,7,5,11,/*hood*/4,11,5,/*buttocks*/11,6,10,11,12,7,/*front*/2,4,3,3,4,5,/*upperjaws*/2,0,4,3,5,1,/*butt*/10,12,11,/*bottom*/8,12,10,8,9,12,/*bottomsides*/8,10,6,9,7,12,/*bottomwings*/8,6,0,9,1,7,/*bottomfront*/8,2,3,9,8,3,/*bottomjaws*/8,0,2,9,3,1,],
			drafthitbox:[-1,0,6,1,0,6,/*+*/-1,-1,2,1,-1,2,/*+*/-3,0,0,3,0,0,/*+*/-1,1,0,1,1,0,/*+*/2,0,-2,0,-1,-2,-2,0,-2,],
			colors:[/*jaws*/Math.random()*155,Math.random()*35,Math.random()*55,Math.random()*155,Math.random()*35,Math.random()*55,/*front*/Math.random()*155,Math.random()*35,Math.random()*55,Math.random()*155,Math.random()*35,Math.random()*55,/*top*/Math.random()*155,Math.random()*35,Math.random()*55,Math.random()*155,Math.random()*35,Math.random()*55,/*sides*/Math.random()*155,Math.random()*35,Math.random()*55,Math.random()*155,Math.random()*35,Math.random()*55,/*bottom*/Math.random()*155,Math.random()*35,Math.random()*55,Math.random()*155,Math.random()*35,Math.random()*55,/*butt*/Math.random()*155,Math.random()*35,Math.random()*55,Math.random()*155,Math.random()*35,Math.random()*55,Math.random()*155,Math.random()*35,Math.random()*55,],			
		},			
	}
	
	for(var m in models) {
		setnodes(models[m]);
	}
	
	function setnodes(m) {
		m.draftnodes = v.multiply(m.draftnodes, m.size);
		m.nodesbank = [];
		m.nodesbank.push(m.draftnodes);
		if(m.TTL != undefined && m.decay != undefined) {
			for(var i = 1; i < m.TTL; i++) {
				m.nodesbank.push(v.multiply(m.nodesbank[i-1], m.decay));
			}
		}	
		
		if(m.drafthitbox != undefined) {
			m.drafthitbox = v.multiply(m.drafthitbox, m.size);
			m.hitboxbank = [];
			m.hitboxbank.push(m.drafthitbox);
			if(m.TTL != undefined && m.decay != undefined) {
				for(var i = 1; i < m.TTL; i++) {
					m.hitboxbank.push(v.multiply(m.hitboxbank[i-1], m.decay));
				}
			}
			m.radius = 0;
			var max = Number.NEGATIVE_INFINITY;
			var len2;
			for(var i = 0; i < m.draftnodes.length; i += 3) {
				len2 = v3.vlength2(m.drafthitbox.slice(i, i + 3));
				max = len2 > max ? len2 : max;
			}
			m.radius = max;
			console.log('radius: ', m.radius);
		}
	}	