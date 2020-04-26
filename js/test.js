'use strict';
function main() {
	var objlist = [
		{
			exists: false,
			act: function() {},
		},
		{
			exists: true,
			act: function() {},
		},
	];
	
	console.log(objlist);
	objlist = existantin(objlist);
	console.log(objlist);

	function existantin(objlist) {
		return objlist.filter(element => element.exists == true);
	}

	/*
	//this.velocity = v3.add(this.velocity, v3.multiply(pen, (-2 * v3.dot(this.velocity, v3.normalize(pen)))));
	var v = [1,1,1];
	var p = [0,-5,0];
	var pn = v3.normalize(p);
	
	console.log(v3.add(v, v3.multiply(pn, (-2 * v3.dot(v, pn)))));
	*/
	/*
	var d4 = [1,1,1]
	d4 = v3.dot(d4, [0,0,-1]) > 0 ? d4 : v3.invert(d4);
	console.log(d4);
	*/
	
	/*
	var faces = [];
	
	var n1 = [1,1,1];
	var	n2 = [2,2,2];
	var n3 = [3,3,3];
	var n4 = [4,4,4];
	
	faces.push(
		{normal: [1,1,1], distance: 1,},
		{normal: [2,2,2], distance: 4,},
		{normal: [3,3,3], distance: 2,},
		{normal: [4,4,4], distance: 5,},
	);
	console.log(faces);
	
	faces.sort( function(a, b) {
		return a.distance - b.distance;
	});
	console.log(faces);
	*/
	/*
	gjk3d(
		{
			currentHitbox: [
				0,0,1,
				0,0,3,
				2,0,1,
				2,0,3,
				0,2,1,
				0,2,3,
				2,2,3,
				2,2,1,
			],
			state: [
				1,1,1,1,
				1,1,1,1,
				1,1,1,1,
				1,1,2,1,
			],	
			location: function() {
				return this.state.slice(12,15);
			},
			onCollision: function(o, pen) {
				console.log('collision!');
			}
		},{
			currentHitbox: [
				1,1,2+1,
				1,1,4+1,
				3,1,2+1,
				3,1,4+1,
				1,3,2+1,
				1,3,4+1,
				3,3,4+1,
				3,3,2+1,
			],
			state: [
				1,1,1,1,
				1,1,1,1,
				1,1,1,1,
				2,2,3,1,
			],
			location: function() {
				return this.state.slice(12,15);
			},
			onCollision: function(o, pen) {
				console.log('collision!');
			}
		}
	);
	*/
}

main();