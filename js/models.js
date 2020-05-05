'use strict';
	var models = {
		fighter: {
			size: 10,
			draftnodes: [/*jaws*//*0*/-1,0,6,/*1*/1,0,6,/*front*//*2*/-1,0,4,/*3*/1,0,4,/*top*//*4*/-1,-1,2,/*5*/1,-1,2,/*sides*//*6*/-3,0,0,/*7*/3,0,0,/*bottom*//*8*/-1,1,0,/*9*/1,1,0,/*butt*//*10*/-2,0,-2,/*11*/0,-1,-2,/*12*/2,0,-2,],
			indices: [/*frontwings*/0,6,4,1,5,7,/*sides*/6,11,4,7,5,11,/*hood*/4,11,5,/*buttocks*/11,6,10,11,12,7,/*front*/2,4,3,3,4,5,/*upperjaws*/2,0,4,3,5,1,/*butt*/10,12,11,/*bottom*/8,12,10,8,9,12,/*bottomsides*/8,10,6,9,7,12,/*bottomwings*/8,6,0,9,1,7,/*bottomfront*/8,2,3,9,8,3,/*bottomjaws*/8,0,2,9,3,1,],
			texcoords: [
			.5,.0,.5,.0,
			.5,.5,.5,.5,
			.5,.5,.5,.5,
			.5,.0,.5,.0,
			.5,.0,.5,.0,
			.5,.0,.5,.0,.5,.0,],
			drafthitbox: [-1,0,6,1,0,6,/*+*/-1,-1,2,1,-1,2,/*+*/-3,0,0,3,0,0,/*+*/-1,1,0,1,1,0,/*+*/2,0,-2,0,-1,-2,-2,0,-2,],
		},
		bolt: {
			size: 5,
			TTL: 3,
			decay: .95,				
			draftnodes: [0,0,0,-11,0,6666,11,0,6666,],
			indices: [0,1,2,],
			texcoords: [1,0,1,0,1,0,],
			drafthitbox: [0,0,0,0,0,6666,],

		},
		explosion: {
			size: 44,
			TTL: 5,
			decay: .85,
			draftnodes: [1,0,0,0,1,0,0,0,1,-1,0,0,0,-1,0,0,0,-1,],
			indices: [0,5,1,5,3,1,3,2,1,2,0,1,5,0,4,0,2,4,2,3,4,3,5,4,],
			texcoords: [1,0,1,0,1,0,1,0,1,0,1,0,],
		},
		throttle: {
			size: 8,
			TTL: 8,
			decay: .8,
			draftnodes: [/*0*/-1,0,0,/*1*/0,-1,0,/*2*/1,0,0,/*3*/0,0,-1,],
			indices: [0,3,1,3,2,1,0,1,2,0,2,3,],
			texcoords: [0,0,0,0,0,0,0,0,],
		},
		flash: {
			size: 8,
			TTL: 3,
			decay: .1,
			draftnodes: [/*0*/-1,0,0,/*1*/0,-1,0,/*2*/1,0,0,/*3*/0,0,-2,],
			indices: [0,3,1,3,2,1,0,1,2,0,2,3,],
			texcoords: [.499,1,.499,1,.499,1,.499,1,],
		},
		carrier: {
			size: 8000,
			draftnodes: [/*0*/-2,0,1,/*1*/0,-2,1,/*2*/2,0,1,/*3*/0,1,-2,],
			indices: [3,1,0,3,2,1,3,0,2,0,1,2,],
			texcoords: [.499,.0,.499,.0,.499,.0,.499,.0,],
			drafthitbox: [0,1,-2,0,-2,1,-2,0,1,2,0,1,],		
		},
		interceptor: {
			size: 10,
			draftnodes: [/*tip*//*0*/0,0,4,/*pit*//*1*/0,-0.5,3,/*top*//*2*/0,-1,2,/*3*/-2,-1,0,/*4*/2,-1,0,/*sides*//*5*/-3,0,0,/*6*/3,0,0,/*butt*//*7*/-2,0,-2,/*8*/0,-1,-2,/*9*/2,0,-2,/*bottom*//*10*/-1,1,0,/*11*/1,1,0,],
			indices: [/*front*/0,5,3,0,4,6,0,3,1,0,1,4,/*windview*/3,2,1,1,2,4,/*top*/2,3,8,2,8,4,/*buttocks*/5,7,3,3,7,8,4,8,9,6,4,9,/*butt*/7,9,8,/*bottom*/0,10,5,0,11,10,0,6,11,5,10,7,6,9,11,10,11,7,11,9,7,],
			drafthitbox: [/*tip*//*0*/0,0,4,/*top*//*2*/0,-1,2,/*3*/-2,0,0,/*4*/2,0,0,/*sides*//*5*/-3,0,0,/*6*/3,0,0,/*butt*//*7*/-2,0,-2,/*8*/0,-1,-2,/*9*/2,0,-2,/*bottom*//*10*/-1,1,0,/*11*/1,1,0,],
			texcoords: [0,.0,0,.5,0,.5,0,.5,0,.5,0,.0,0,.0,0,.0,0,.0,0,.0,0,.0,0,.0,],
		},	
		//sun: {
		//	size: 70 * 10 ** 11,
		//	draftnodes: [1,0,0,0,1,0,0,0,1,-1,0,0,0,-1,0,0,0,-1,],
		//	indices: [0,5,1,5,3,1,3,2,1,2,0,1,5,0,4,0,2,4,2,3,4,3,5,4,],
		//	texcoords: [],
		//	//colors: [255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,],
		//	drafthitbox: [1,0,0,0,1,0,0,0,1,-1,0,0,0,-1,0,0,0,-1,],
		//},
		//planet: {
		//	size: 64 * 10 ** 5,
		//	draftnodes: [1,0,0,0,1,0,0,0,1,-1,0,0,0,-1,0,0,0,-1,],
		//	indices: [0,5,1,5,3,1,3,2,1,2,0,1,5,0,4,0,2,4,2,3,4,3,5,4,],
		//	texcoords: [],
		//	//colors: [0,0,255,255,0,255,0,100,255,255,0,0,0,100,255,255,0,255,],			
		//	drafthitbox: [1,0,0,0,1,0,0,0,1,-1,0,0,0,-1,0,0,0,-1,],
		//},
	}
	
	for(var m in models) {
		set(models[m]);
	}
	
	function set(m) {
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

			m.radius2 = 0;
			var max = Number.NEGATIVE_INFINITY;
			var len2;
			for(var i = 0; i < m.draftnodes.length; i += 3) {
				len2 = v3.vlength2(m.drafthitbox.slice(i, i + 3));
				max = len2 > max ? len2 : max;
			}
			m.radius2 = max;
			//console.log('radius2: ', m.radius2);
		}
	}	