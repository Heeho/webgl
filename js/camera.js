'use strict';
	function Camera(gl, o) {
		this.observer = o;
		this.up = [0, 1, 0];
		this.speed = .6;
		this.distance = 600;
		this.scale = [1, 1, 1];
		this.fieldOfViewRadians = degToRad(55);
		this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		this.zNear = 10;
		this.zFar = 1495978707000; 
		this.state = new State();
	}
	Camera.prototype.realign = function()
		{
			(this.observer.controls.autopilotON && this.observer.controls.lockedontarget) ? this.topdown() : this.lof();
		}
	Camera.prototype.topdown = function()
		{
			var halfline = v3.multiply(this.observer.lineoffire, .5);
			var camz = v3.multiply(this.observer.state.Y(), v3.vlength(halfline)*2);

			var currentCameraPosition = this.state.location();
			var target = v3.add(this.observer.state.location(), halfline);
			var nextCameraPosition = v3.substract(target, camz);

			var cameraPosition = v3.add(currentCameraPosition, v3.multiply(v3.substract(nextCameraPosition, currentCameraPosition), this.speed));
			this.state.matrix = m4.lookAt(cameraPosition, target, this.up); //console.log(target, camz, nextCameraPosition);
		}
	Camera.prototype.lof = function()
		{
			var currentCameraPosition = this.state.location();
			var target = this.observer.target.state.location();
			var nextCameraPosition = v3.add(v3.add(this.observer.state.location(), v3.multiply(v3.normalize(this.observer.lineoffire), -this.distance)), v3.multiply(this.up, this.distance/4));

			var cameraPosition = v3.add(currentCameraPosition, v3.multiply(v3.substract(nextCameraPosition, currentCameraPosition), this.speed));
			this.state.matrix = m4.lookAt(cameraPosition, target, this.up);
		}