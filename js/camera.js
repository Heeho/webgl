'use strict';
	function Camera(gl) {
		//this.zoom = 100;
		this.mode = 0;
		this.scale = [1, 1, 1];					// global scale?
		this.fieldOfViewRadians = degToRad(55);
		this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		this.zNear = 1;
		this.zFar = 444444444;
		this.cameraMatrix = [
			1,	0,	0,	0,
			0,	1,	0,	0,
			0,	0,	1,	0,
			0,	0,	0,	1,
		];
	}