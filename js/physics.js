'use strict';
	function physics(p, o, e, c) {
		deletenonexistant([p, o, e]);
		actmove(e.concat(p, o, c));
		gravity(o.concat(c));
		hitboxes(o.concat(p, c));	
		collide(o.concat(c), p);
	}
	
	var G = 6.67 * 10 ** (-11);	
	function gravity(o) {
		//console.log('gravity');
		var num, a1, a2, r;
		
		for(var i = 0; i < o.length - 1; i++) {
			for(var j = i + 1; j < o.length; j++) {	
				r = v3.substract(o[j].state.location(), o[i].state.location());
				num = G / v3.vlength2(r) / 60; // 60 for 60FPS
				a1 = num * o[j].mass; 
				a2 = num * o[i].mass;
				r = v3.normalize(r);
				o[i].state.velocity = v3.add(o[i].state.velocity, v3.multiply(r, a1));
				o[j].state.velocity = v3.add(o[j].state.velocity, v3.multiply(v3.inverse(r), a2));
			}
			//for(var k = 0; k < o.length; k++) {
			//	r = v3.substract(c[i].state.location(), o[k].state.location());
			//	a1 = G * c[i].mass / v3.vlength2(r) / 60;
			//	r = v3.normalize(r);
			//	o[k].state.velocity = v3.add(o[k].state.velocity, v3.multiply(r, a1));
			//}
		}
	}
		
	function deletenonexistant(objlist) {
		var o;
		for(var h = 0; h < objlist.length; h++) {
			o = objlist[h];
			for(var i = o.length - 1; i >= 0; i--) {
				if(o[i].exists == false) {
					o.splice(i, 1);
				}				
			}
		}
	}
	
	function actmove(o) {
		for(var i = 0; i < o.length; i++) {
			move(o[i]);		
			o[i].act();
		}
	}
	
	function hitboxes(o) {		
		var tempHitbox = [];
		var tempObj;
		
		for(var i = 0; i < o.length; i++) {
			tempObj = {
				state: {
					matrix: o[i].state.matrix.slice(),
					velocity: o[i].state.velocity.slice(),
					rotation: o[i].state.rotation.slice(), //o[i].state.rotation !== undefined ? _ : undefined,
				},
			};
			move(tempObj);
			
			//console.log('tempState: ', tempState);
			//console.log('tempState + velocity: ', tempState);
			//console.log(o[i]);
			for(var j = 0; j < o[i].hitbox.length; j += 3) {
				tempHitbox = m4.m4v3(tempObj.state.matrix, o[i].hitbox.slice(j, j+3));
				o[i].currenthitbox[j] = tempHitbox[0];
				o[i].currenthitbox[j+1] = tempHitbox[1];
				o[i].currenthitbox[j+2] = tempHitbox[2];
			}
			//console.log(o[i].currenthitbox);
		}
	}
	
	function collide(o, p) {
		var distance, measure, penetration;
		
		//projectile <-> object
		for(var i = 0; i < p.length; i++) {
			for(var j = 0; j < o.length; j++) {
				//console.log(p[i], o[j]);
				distance = v3.vlength2(v3.substract(p[i].state.location(), o[j].state.location()));
				measure = p[i].model.radius2 + o[j].model.radius2;				
				//console.log('distance, measure: ', distance, measure);
				
				if(distance < measure) {
					penetration = gjk3d(p[i], o[j]);
					if(penetration !== undefined) {
						p[i].onCollision(o[j], penetration);
					}
				}	
			}
		}
				
		//object <-> object
		for(var i = 0; i < o.length - 1; i++) {
			for(var j = i + 1; j < o.length; j++) {
				/*
					o.length: 5
					i:	j:
					0	1234
					1	234
					2	34
					3	4
				*/
				
				distance = v3.vlength2(v3.substract(o[i].state.location(), o[j].state.location()));
				measure = o[i].model.radius2 + o[j].model.radius2;
				
				//console.log('distance, measure: ', distance, measure);
				//console.log('locations: ', o[i].state.location(), o[j].state.location());
				
				if(distance < measure) {
					penetration = gjk3d(o[i], o[j]);
					if(penetration !== undefined) {
						//console.log(o[i], o[j]);
						o[i].onCollision(o[j], penetration);
						o[j].onCollision(o[i], v3.inverse(penetration));
					}
				}
			}
		}
	}	
	
	function move(o) {
		o.state.matrix[12] += o.state.velocity[0];
		o.state.matrix[13] += o.state.velocity[1];
		o.state.matrix[14] += o.state.velocity[2];

		o.state.matrix = m4.zRotate(o.state.matrix, o.state.rotation[2]); o.state.rotation[2] = 0;
		o.state.matrix = m4.xRotate(o.state.matrix, o.state.rotation[0]); o.state.rotation[0] = 0;
		o.state.matrix = m4.yRotate(o.state.matrix, o.state.rotation[1]); o.state.rotation[1] = 0;
	}
	
	function gjk3d(o1, o2) {
		//GJK collision detection linked with EPA for penetration vector
		var hitbox1 = o1.currenthitbox;
		var hitbox2 = o2.currenthitbox;
		//console.log('hitboxes: ',hitbox1, hitbox2);
		
		var c1 = o1.state.location();
		var c2 = o2.state.location();
		//console.log('centres: ', c1, c2);
		var central = v3.substract(c2, c1);
		var up = [0,1,0];
		var simplex = [];
		
		var d1, d2, d3, d4, d;
		var p1, p2, p3, p4;
		var p2p1, p3p1;
		
		var p1p2, p1p3, p4p1, p4p2, p4p3;	
		var n1, n2, n3, n4;
		
		var collision = false;
		var winding = 0;
		var loopCount = 0;
		
		while(loopCount++ < 33) {
			//console.log('gjk3d loop');
			switch(simplex.length) {
			case 0: 
				d1 = central;
				if(v3.vlength(d1) == 0) {
					//console.log('centers overlap, d1: ', d1); 
					//collision = true;
					return up;
				}
				d2 = v3.inverse(d1);
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
					//collision = true;
					return central;
				}
				p3 = v3.substract(furthest(hitbox1, d3), furthest(hitbox2, v3.inverse(d3)));
				//console.log('d3, p3 ', d3, p3);
				if(v3.dot(p3, d3) > 0) {
					simplex.push(p3);
				} else {
					//console.log('no collision'); 
					return;
				}	
				break;
				
			case 3:
				p3p1 = v3.substract(p1,p3);
				d4 = v3.cross(p2p1, p3p1);
				if(v3.vlength(d4) == 0) {
					//console.log('edge collision, d4: ', d4); 
					//collision = true;
					return central;
				}
				
				d4 = v3.dot(d4, p3) < 0 ? d4 : v3.inverse(d4);
				
				p4 = v3.substract(furthest(hitbox1, d4), furthest(hitbox2, v3.inverse(d4)));
				//console.log('d4, p4 ', d4, p4);
				if(v3.dot(p4, d4) > 0) {
					simplex.push(p4);
				} else {
					//console.log('no collision'); 
					return;
				}
				break;
				
			case 4:
				p1p2 = v3.substract(simplex[1], simplex[0]);
				p1p3 = v3.substract(simplex[2], simplex[0]);
				p4p1 = v3.substract(simplex[0], simplex[3]);
				p4p2 = v3.substract(simplex[1], simplex[3]);
				p4p3 = v3.substract(simplex[2], simplex[3]);

				n4 = v3.cross(p1p2, p1p3);
				
				winding = v3.dot(n4, p1);
				
				n1 = winding > 0 ? v3.cross(p4p2, p4p1) : v3.cross(p4p1, p4p2);
				n2 = winding > 0 ? v3.cross(p4p3, p4p2) : v3.cross(p4p2, p4p3);
				n3 = winding > 0 ? v3.cross(p4p1, p4p3) : v3.cross(p4p3, p4p1);		
				n4 = winding > 0 ? n4 : v3.inverse(n4);
				
				//console.log('n1, n2, n3: ', n1, n2, n3);
				//console.log('simplex[0,1,2,3]: ', simplex);
				
				if(v3.dot(n1, simplex[3]) < 0) {
					simplex.splice(2, 1); d = n1;
				} 
				else if(v3.dot(n2, simplex[3]) < 0) {
					simplex.splice(0, 1); d = n2;
				} 
				else if(v3.dot(n3, simplex[3]) < 0) {
					simplex.splice(1, 1); d = n3;
				} 
				else {
					collision = true;
				}
				
				if(collision) {
					//console.log('collision!'); 
					//return collision;
					var penetration = epa3d([hitbox1, hitbox2],simplex,[n1, n2, n3, n4]);
					return penetration;
					
				} else {
					p4 = v3.substract(furthest(hitbox1, d), furthest(hitbox2, v3.inverse(d)));
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
	
	function epa3d(hitboxes, simplex, normals) {
		
		var tolerance = 20;
		var loopCount = 0;
		var faces = [];
		
		var l = [];	
		var n = [];
		var p = [];
		
		var dx, px, lx;
		var pxpa, pxpb, pxpc;
		var n1, n2, n3;
		var l1, l2, l3;
		
		var winding;
		var measure;
		var penetration;
		
		//get points from simplex and normalized normals from normals
		for(var i = 0; i < simplex.length; i++) {
			p.push(simplex[i].slice());
			n.push(v3.normalize(normals[i].slice()));
		}
		
		//get distance to origin for each face		
		l.push(v3.dot(p[3], n[0]));
		l.push(v3.dot(p[3], n[1]));
		l.push(v3.dot(p[3], n[2]));
		l.push(v3.dot(p[0], n[3]));					
		
		//form faces array
		faces = [
			{vertices: [p[0], p[1], p[3]], normal: n[0], distance: l[0],},
			{vertices: [p[1], p[2], p[3]], normal: n[1], distance: l[1],},
			{vertices: [p[2], p[0], p[3]], normal: n[2], distance: l[2],},
			{vertices: [p[0], p[2], p[1]], normal: n[3], distance: l[3],},
		];

		while(loopCount++ < 33) {
			//sort faces by distance to origin
			faces.sort(function(f1, f2) {
				return f1.distance - f2.distance;
			});

			//get the face closest to the origin and check if there are any simplex points in that direction
			dx = faces[0].normal;
			lx = faces[0].distance;
			px = v3.substract(furthest(hitboxes[0], dx), furthest(hitboxes[1], v3.inverse(dx)));
	
			//if none (or in tolerance margin), get this normal * distance as penetration, else check other faces 
			measure = v3.dot(v3.substract(px, faces[0].vertices[0]), dx);
			//console.log(measure);
			if(measure < tolerance) {
				penetration = v3.multiply(dx, lx);
				//console.log(penetration);
				return penetration;
			} else {			
				pxpa = v3.substract(px, faces[0].vertices[0]);
				pxpb = v3.substract(px, faces[0].vertices[1]);
				pxpc = v3.substract(px, faces[0].vertices[2]);
				
				n1 = v3.cross(pxpb, pxpa);
				winding = v3.dot(n1, px);
				
				n1 = winding > 0 ? n1 : v3.inverse(n1);
				l1 = v3.dot(px, v3.normalize(n1));
				
				faces.push({
					vertices: [px, faces[0].vertices[0], faces[0].vertices[1],], 
					normal: n1,	
					distance: l1,
				});
				
				n2 = winding > 0 ? v3.cross(pxpc, pxpb) : v3.cross(pxpb, pxpc);
				l2 = v3.dot(px, v3.normalize(n2));
				
				faces.push({
					vertices: [px, faces[0].vertices[1], faces[0].vertices[2],], 
					normal: n2,	
					distance: l2,
				});
				
				n3 = winding > 0 ? v3.cross(pxpa, pxpc) : v3.cross(pxpc, pxpa);
				l3 = v3.dot(px, v3.normalize(n3));
				
				faces.push({
						vertices: [px, faces[0].vertices[2], faces[0].vertices[0],], 
						normal: n3,	
						distance: l3,
				});
				
				faces.shift();
				//console.log(faces);
			}			
		}		
		return penetration;	
	}