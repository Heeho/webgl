'use strict';
	function createShader(gl, type, source) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if(success) {
			return shader;
		}
		
		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}

	function createProgram(gl, vertexShader, fragmentShader) {
		var program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if(success) {
			gl.detachShader(program, vertexShader);
			gl.deleteShader(vertexShader);
			gl.detachShader(program, fragmentShader);
			gl.deleteShader(fragmentShader);		
			return program;
		}
		
		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}

	function resizeCanvasToDisplaySize(canvas, multiplier) {
		multiplier = multiplier || 1;
		const width  = canvas.clientWidth  * multiplier | 0;
		const height = canvas.clientHeight * multiplier | 0;
		if (canvas.width !== width ||  canvas.height !== height) {
			canvas.width  = width;
			canvas.height = height;
			return true;
		}
		
		return false;
	}

	function setGeometry(o, gl) {
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array(o.nodes),
			gl.STATIC_DRAW
		);
	}

	function setColors(o, gl) {
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Uint8Array(o.colors),
			gl.STATIC_DRAW
		);
	}