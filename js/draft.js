'use strict';
//init
	// setup matrixes, one per instance

	// make a typed array with one view per matrix
	//const matrixData = new Float32Array(numInstances * 16);
	//const matrices = [];
	//for (let i = 0; i < numInstances; ++i) {
	//	const byteOffsetToMatrix = i * 16 * 4;
	//	const numFloatsForView = 16;
	//	matrices.push(new Float32Array(
	//	matrixData.buffer,
	//	byteOffsetToMatrix,
	//	numFloatsForView));
	//}
	const matrixBuffer = gl.createBuffer();
	//gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
	// just allocate the buffer
	//gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);
	
//render
	const numInstances = 5;
	const numVertices = 12;
	// upload the new matrix data
	gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);
	
	// set all 4 attributes for matrix
	const bytesPerMatrix = 4 * 16;
	for (let i = 0; i < 4; ++i) {
		const loc = matrixLoc + i;
		gl.enableVertexAttribArray(loc);
		// note the stride and offset
		const offset = i * 16;  // 4 floats per row, 4 bytes per float
		gl.vertexAttribPointer(
			loc,              // location
			4,                // size (num values to pull from buffer per iteration)
			gl.FLOAT,         // type of data in buffer
			false,            // normalize
			bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
			offset,           // offset in buffer
		);
		// this line says this attribute only changes for each 1 instance
		ext.vertexAttribDivisorANGLE(loc, 1);
	}