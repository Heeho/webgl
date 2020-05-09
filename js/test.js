'use strict';
function main() {
	var m = {
		nodes: [1,0,0,0,0,1,0,0,0,],
		indices: [0,1,2,1,2,0,2,0,1,],		
	};
	
	m.normals = [];
	
	var p1, p2, p3, p1p2, p1p3;
	for(var i = 0; i < m.indices.length; i += 3) { //0,3,6
		console.log(3*m.indices[i], 3*m.indices[i]+3);
		p1 = m.nodes.slice(3 * m.indices[i + 0], 3 * m.indices[i + 0] + 3);
		p2 = m.nodes.slice(3 * m.indices[i + 1], 3 * m.indices[i + 1] + 3);
		p3 = m.nodes.slice(3 * m.indices[i + 2], 3 * m.indices[i + 2] + 3);
		console.log('p1, p2, p3: ', p1, p2, p3);
		p1p2 = v3.substract(p2, p1);
		p1p3 = v3.substract(p3, p1);

		m.normals.push(...v3.cross(p1p2, p1p3));
		console.log(v3.dot(v3.cross(p1p2, p1p3), p1));
	}
	
	console.log(m.normals);
}

main();