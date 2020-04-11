'use strict';
function main() {
	//init
	var canvas = document.getElementById('canvas');	
	var gl = canvas.getContext('webgl');
	if(!gl) {
		window.alert('Absolutely no WebGL here!');
	}

	var vertexShaderSource = document.getElementById('vertex-shader').text;
	var fragmentShaderSource = document.getElementById('fragment-shader').text;	
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);	
	var program = createProgram(gl, vertexShader, fragmentShader);
	
	var positionLocation = gl.getAttribLocation(program, 'a_position');	
	var colorLocation = gl.getAttribLocation(program, 'a_color');
	var matrixLocation = gl.getUniformLocation(program, 'u_matrix');
	var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');

	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);	
		const level = 0;
		const internalFormat = gl.LUMINANCE;
		const width = 4
		const height = 2
		const border = 0;
		const format = gl.LUMINANCE;
		const type = gl.UNSIGNED_BYTE;
		const data = new Uint8Array([
			128, 64, 128, 64,
			64, 128, 64, 128,
		]);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	const tex = gl.createTexture();	
	gl.bindTexture(gl.TEXTURE_2D, tex);
	{
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}
	
	const fbuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbuffer);
	const attachmentPoint = gl.COLOR_ATTACHMENT0;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, tex, level);



	
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]));
	//var image = new Image();
	//image.src = 'res/image.PNG';
	//image.addEventListener('load', function() {
	//	gl.bindTexture(gl.TEXTURE_2D, texture);
	//	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	//	gl.generateMipmap(gl.TEXTURE_2D);
	//});
	
	var positionBuffer = gl.createBuffer();	
	//var colorBuffer = gl.createBuffer();
	var textureBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);		
	setGeometry(gl);	
	
	//gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	//setColors(gl);	

	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);	
	setTexcoords(gl);

	var translation = [0, 0, -350];									// = [obj.velocity[0], obj.velocity[1], obj.velocity[2]]
	var rotation = [degToRad(180), degToRad(0), degToRad(0)];		// = [obj.rotation[0], obj.rotation[1], obj.rotation[2]] // theta, phi, gamma
	var scale = [40, 40, 40];										// global scale?
	var fieldOfViewRadians = degToRad(60);							// = camera.fieldOfView;
	
	var currentX, currentY, nextX, nextY;
	var controls = canvas.getContext('2d');
	var borderXY = canvas.getBoundingClientRect();
	
	//separated to controls.js
	canvas.addEventListener('mousemove', e => {
		nextX = e.clientX - borderXY.left;
		nextY = e.clientY - borderXY.top;
		if (nextX > currentX) {		rotation[2] += degToRad(3);} 
		else if (nextX < currentX) {rotation[2] -= degToRad(3);}		
		if (nextY > currentY) {		rotation[0] -= degToRad(3);} 
		else if (nextY < currentY) {rotation[0] += degToRad(3);}
		currentX = nextX;
		currentY = nextY;
	});
	
	requestAnimationFrame(drawScene);
	
	function drawScene() {
		resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		//gl.enable(gl.CULL_FACE);
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
	
		gl.enableVertexAttribArray(texcoordLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);	
			var size = 2;
			var type = gl.FLOAT;
			var normalize = false;
			var stride = 0;
			var offset = 0;
			gl.vertexAttribPointer(
				texcoordLocation, size, type, normalize, stride, offset);
				
		
		
		//gl.enableVertexAttribArray(colorLocation);
		//gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		//	var size = 3;
		//	var type = gl.UNSIGNED_BYTE;
		//	var normalize = true;
		//	var stride = 0;
		//	var offset = 0;
		//	gl.vertexAttribPointer(
		//		colorLocation, size, type, normalize, stride, offset);
			
		var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		var zNear = 1;
		var zFar = 2000;
		
		var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
		//just //matrix = m4.multiply(matrix, obj.state);
		matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
		matrix = m4.xRotate(matrix, rotation[0]);
		matrix = m4.yRotate(matrix, rotation[1]);
		matrix = m4.zRotate(matrix, rotation[2]);
		matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
		
		gl.uniformMatrix4fv(matrixLocation, false, matrix);	

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 22 * 3;
		
		gl.drawArrays(primitiveType, offset, count);
		
		requestAnimationFrame(drawScene);
	}
}

function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER, 
		new Float32Array([
			//front wings
			-1, 0, 6,
			-3, 0, 0,
			-1, -1, 2,
			
			1, 0, 6,
			1, -1, 2,
			3, 0, 0,
			
			//sides
			-3, 0, 0,
			0, -1, -2,
			-1, -1, 2,
						
			3, 0, 0,
			1, -1, 2,
			0, -1, -2,

			//hood
			-1, -1, 2,
			0, -1, -2,
			1, -1, 2,
			
			//buttocks
			0, -1, -2,
			-3, 0, 0,
			-2, 0, -2,
						
			0, -1, -2,
			2, 0, -2,
			3, 0, 0,
			
			//front
			-1, 0, 4,
			-1, -1, 2,
			1, 0, 4,
			
			1, 0, 4,
			-1, -1, 2,
			1, -1, 2,
			
			//upper jaws
			-1, 0, 4,
			-1, 0, 6,
			-1, -1, 2,
			
			1, 0, 4,
			1, -1, 2,
			1, 0, 6,
			
			//butt
			-2, 0, -2,		
			2, 0, -2,
			0, -1, -2,
			
			//bottom
			-1, 1, 0,
			2, 0, -2,
			-2, 0, -2,
			
			-1, 1, 0,
			1, 1, 0,
			2, 0, -2,
			
			//bottom sides
			-1, 1, 0,
			-2, 0, -2,
			-3, 0, 0,
			
			1, 1, 0,
			3, 0, 0,
			2, 0, -2,
			
			//bottom wings
			-1, 1, 0,
			-3, 0, 0,
			-1, 0, 6,
			
			1, 1, 0,
			1, 0, 6,
			3, 0, 0,
			
			//bottom front
			-1, 1, 0,
			-1, 0, 4,
			1, 0, 4,
			
			1, 1, 0,
			-1, 1, 0,
			1, 0, 4,	
			
			//bottom jaws
			-1, 1, 0,
			-1, 0, 6,
			-1, 0, 4,
			
			1, 1, 0,
			1, 0, 4,
			1, 0, 6,							
		]),
		gl.STATIC_DRAW
	);
}

function setColors(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Uint8Array([
		/*//front wings
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//sides
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//hood
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//buttocks		
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//front		
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//upper jaws		
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//butt
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom sides
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom wings
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom front
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom jaws
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,*/
		]),
		gl.STATIC_DRAW
	);
}	

function setTexcoords(gl) {
	gl.bufferData (
		gl.ARRAY_BUFFER,
		new Float32Array([
			0, 0,
			0, 1,
			1, 0,
			
			0, 1,
			1, 1,
			1, 0,		

			0, 1,
			1, 1,
			1, 0,

			0, 1,
			1, 1,
			1, 0,	

			0, 0,
			0, 1,
			1, 0,
			
			0, 1,
			1, 1,
			1, 0,		

			0, 1,
			1, 1,
			1, 0,

			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			
			0, 1,
			1, 1,
			1, 0,		

			0, 1,
			1, 1,
			1, 0,

			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			
			0, 1,
			1, 1,
			1, 0,		

			0, 1,
			1, 1,
			1, 0,

			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			
			0, 1,
			1, 1,
			1, 0,		

			0, 1,
			1, 1,
			1, 0,

			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			
			0, 1,
			1, 1,
			1, 0,					
		]),
		gl.STATIC_DRAW
	);
}

main();