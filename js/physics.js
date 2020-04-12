'use strict';
	function process(o) {
		hitboxes(o);	
		collide(o);
		for(var i = 0; i < o.length; i++) {
			if(!o[i].exists) {o.splice(i, 1);} else {
				if(o[i].act !== undefined) {o[i].act();}
				move(o[i]);			
			}
		}
	}
	
	function hitboxes(o) {
		
		var tempHitbox = [];
		var tempState = [];
		
		for(var i = 0; i < o.length; i++) {
			if(o[i].hitbox !== undefined) {
				tempHitbox = [];
				tempState = o[i].state.slice();
				//console.log('tempState: ', tempState);
				if(o[i].velocity !== undefined) { 
					tempState[12] += o[i].velocity[0] + 1;
					tempState[13] += o[i].velocity[1] + 1;
					tempState[14] += o[i].velocity[2] + 1;
				}
				//console.log('tempState + velocity: ', tempState);
				for(var j = 0; j < o[i].hitbox.length; j += 3) {
					tempHitbox = m4.m4v3(tempState, o[i].hitbox.slice(j, j+3));
					o[i].currentHitbox[j] = tempHitbox[0];
					o[i].currentHitbox[j+1] = tempHitbox[1];
					o[i].currentHitbox[j+2] = tempHitbox[2];
				}
			}
		}
	}
	
	function collide(o) {
		var distance, measure;
		
		for(var i = 0; i < o.length - 1; i++) {
			for(var j = i + 1; j < o.length; j++) {
				if(o[i].currentHitbox !== undefined && o[j].currentHitbox !== undefined) {
					distance = v3.vlength(v3.substract(o[i].state.slice(12,15), o[j].state.slice(12,15)));
					measure = Math.max.apply(null, o[i].hitbox.map(Math.abs)) + Math.max.apply(null, o[j].hitbox.map(Math.abs));
					//console.log('distance, measure: ', distance, measure);
					if(distance	< measure) {
						gjk3d(o[i], o[j]);
					}
				}
			}
		}
	}	
	
	function move(o) {
		if(o.velocity !== [0,0,0] && o.velocity !== undefined) { 
			o.state[12] += o.velocity[0];
			o.state[13] += o.velocity[1];
			o.state[14] += o.velocity[2];
		}
		if(o.rotation !== [0,0,0] && o.rotation !== undefined) {
			o.state = m4.zRotate(o.state, o.rotation[2]); o.rotation[2] = 0;
			o.state = m4.xRotate(o.state, o.rotation[0]); o.rotation[0] = 0;
			o.state = m4.yRotate(o.state, o.rotation[1]); o.rotation[1] = 0;
		}
	}
	
	function gjk3d(o1, o2) {
		var hitbox1 = o1.currentHitbox;
		var hitbox2 = o2.currentHitbox;
		//console.log('hitboxes: ',hitbox1, hitbox2);
		
		var c1 = o1.location();//state.slice(12,15);
		var c2 = o2.location();//state.slice(12,15);
		//console.log('centres: ', c1, c2);
		
		var simplex = [];
		
		var d1, d2, d3, d4;
		var p1, p2, p3, p4;
		var p2p1, p3p1;
		
		var d;
		var p4p1, p4p2, p4p3;	
		var n1, n2, n3;
		var collision = false;
		
		while(true) {
			switch(simplex.length) {
			case 0: 
				d1 = v3.substract(c2, c1);
				if(v3.vlength(d1) == 0) {
					//console.log('centers overlap, d1: ', d1); 
					return;
				}
				d2 = v3.substract(c1, c2);
				p1 = v3.substract(furthest(hitbox1, d1), furthest(hitbox2, d2));
				//console.log('d1, p1: ', d1, p1);
				simplex.push(p1);
				break;
				
			case 1:
				p2 = v3.substract(furthest(hitbox1, d2), furthest(hitbox2, d1));
				//console.log('d2, p2 ', d2, p2);
				if(v3.dot(p2, d2) > 0) {
					simplex.push(p2);
				} else {
					//console.log('no collision'); 
					return;
				}
				break;
				
			case 2:
				p2p1 = v3.substract(p1,p2);
				d3 = v3.cross(v3.cross(p2p1, p1), p2p1);
				if(v3.vlength(d3) == 0) {
					//console.log('edge collision, d3: ', d3); 
					return;
				}
				p3 = v3.substract(furthest(hitbox1, d3), furthest(hitbox2, v3.multiply(d3, -1)));
				//console.log('d3, p3 ', d3, p3);
				if(v3.dot(p3, d3) > 0) {
					simplex.push(p3);
				} else {
					//console.log('no collision'); 
					return;
				}	
				break;
				
			case 3:
				p3p1 = v3.substract(simplex[0],simplex[2]);
				d4 = v3.cross(p2p1, p3p1);
				if(v3.vlength(d4) == 0) {
					//console.log('edge collision, d4: ', d4); 
					return;
				}
				if(v3.dot(d4, p3) > 0) {
					d4 = v3.multiply(d4, -1);
				}
				p4 = v3.substract(furthest(hitbox1, d4), furthest(hitbox2, v3.multiply(d4, -1)));
				//console.log('d4, p4 ', d4, p4);
				if(v3.dot(p4, d4) > 0) {
					simplex.push(p4);
				} else {
					//console.log('no collision'); 
					return;
				}
				break;
				
			case 4:
				p2p1 = v3.substract(simplex[0], simplex[1]);
				p3p1 = v3.substract(simplex[0], simplex[2]);
				p4p1 = v3.substract(simplex[0], simplex[3]);
				p4p2 = v3.substract(simplex[1], simplex[3]);
				p4p3 = v3.substract(simplex[2], simplex[3]);
				
				if(v3.dot(v3.cross(p2p1, p3p1), p4p1) < 0) {
					/*		3
							4
						1		2
					*/
					n1 = v3.cross(p4p1, p4p2);
					n2 = v3.cross(p4p2, p4p3);
					n3 = v3.cross(p4p3, p4p1);
				} else {
					/*		2
							4
						1		3
					*/
					n1 = v3.cross(p4p2, p4p1);
					n2 = v3.cross(p4p3, p4p2);
					n3 = v3.cross(p4p1, p4p3);						
				}
				//console.log('n1, n2, n3: ', n1, n2, n3);
				//console.log('simplex[0,1,2,3]: ', simplex);
				if(v3.dot(n1, simplex[3]) <= 0) {simplex.splice(2, 1); d = n1;} else
				if(v3.dot(n2, simplex[3]) <= 0) {simplex.splice(0, 1); d = n2;} else
				if(v3.dot(n3, simplex[3]) <= 0) {simplex.splice(1, 1); d = n3;} else {collision = true;}
				
				if(collision) {
					//console.log('collision'); 
					if(o1.onCollision !== undefined) {o1.onCollision(o2);}
					if(o2.onCollision !== undefined) {o2.onCollision(o1);}
					return;
				} else {
					p4 = v3.substract(furthest(hitbox1, d), furthest(hitbox2, v3.multiply(d, -1)));
					if(v3.dot(p4, d) > 0) {simplex.push(p4);} else {
						//console.log('no collision'); 
						return;
					}
				}
				break;
			}
		}
	}
	
	function furthest(hitbox, d) {		
		var furthest = 0;
		var max = Number.NEGATIVE_INFINITY;
		var temp = 0;
		for(var i = 0; i < hitbox.length; i += 3) {
			temp = v3.dot(hitbox.slice(i, i + 3), d);
			if(temp > max) {max = temp; furthest = i;}
		}		

		return hitbox.slice(furthest, furthest + 3);
	}