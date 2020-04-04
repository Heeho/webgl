'use strict';
	function Camera(gl) {
		var scale = [1, 1, 1];	// global scale?
		var fieldOfViewRadians = degToRad(60);
		var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		var zNear = 1;
		var zFar = 4000;
	}