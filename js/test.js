'use strict';
function main() {
	var m = {
		nodes:   [0,0,0,1,0,0,0,1,0,0,0,1,],
		indices: [0,1,3,0,3,2,0,2,1,1,2,3,],		
	};

	m.normals = [];

	var p1, p2, p3, p1p2, p1p3;
	var facenormals = [];
	var facenormal;
	for(var i = 0; i < m.indices.length; i += 3) { //console.log(3 * m.indices[i], 3 * m.indices[i] + 3);
		p1 = m.nodes.slice(3 * m.indices[i + 0], 3 * m.indices[i + 0] + 3);
		p2 = m.nodes.slice(3 * m.indices[i + 1], 3 * m.indices[i + 1] + 3);
		p3 = m.nodes.slice(3 * m.indices[i + 2], 3 * m.indices[i + 2] + 3); //console.log('p1, p2, p3: ', p1, p2, p3);
		p1p2 = v3.substract(p2, p1);
		p1p3 = v3.substract(p3, p1);
		facenormal = v3.normalize(v3.cross(p1p2, p1p3)); //console.log(facenormal);
		facenormals.push(...facenormal); 
	} //console.log('facenormals: ', facenormals);

	var normal;
	for(var i = 0; i < m.nodes.length/3; i++) { //0, 1, 2 ,3
		normal = [0,0,0];
		for(var j = 0; j < m.indices.length; j += 3) {
			if(m.indices[j] == i || m.indices[j + 1] == i || m.indices[j + 2] == i) { //console.log('i, m.indices[j + x]: ', i, m.indices[j], m.indices[j + 1], m.indices[j + 2]);
				normal = v3.normalize(v3.add(normal, facenormals.slice(j, j + 3))); //console.log('j, facenormals.slice(j, j + 3): ', j, facenormals.slice(j, j + 3));
			}

		}
		m.normals.push(...normal); //console.log('normal: ', normal);
	} //console.log('m.normals: ', m.normals);


}

main();