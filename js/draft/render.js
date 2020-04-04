'use strict';
function draw(o) {
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);		
	setGeometry(o, gl);	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	setColors(o, gl);	
	
	var scale = [40, 40, 40];				// global scale?
	var fieldOfViewRadians = degToRad(60);	// = camera.fieldOfView;
	
	//requestAnimationFrame(drawScene);
	drawScene();
	
	function drawScene() {
		resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.useProgram(program);
		
		gl.enableVertexAttribArray(positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);		
			var size = 3;
			var type = gl.FLOAT;
			var normalize = false;
			var stride = 0;
			var offset = 0;
			gl.vertexAttribPointer(
				positionLocation, size, type, normalize, stride, offset);

		gl.enableVertexAttribArray(colorLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			var size = 3;
			var type = gl.UNSIGNED_BYTE;
			var normalize = true;
			var stride = 0;
			var offset = 0;
			gl.vertexAttribPointer(
				colorLocation, size, type, normalize, stride, offset);			
		
		var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);	//placeholder for camera
		matrix = m4.multiply(matrix, o.state);
		matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);				//global scale
		
		gl.uniformMatrix4fv(matrixLocation, false, matrix);	

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = o.draftnodes.length;	//22 * 3;
		
		gl.drawArrays(primitiveType, offset, count);
		
		//requestAnimationFrame(drawScene);
	}
}