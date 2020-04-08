'use strict';
	function main() {
		var canvas = document.getElementById('canvas');	

		var gl = canvas.getContext('webgl');
		if(!gl) {
			window.alert('Absolutely no WebGL here!');
		}
		
		var player = new Fighter();
		var enemy = new Carrier();
		var gameObjects = [player, enemy];		
			
		var camera = new Camera(gl);
		
		var currentX, currentY, nextX, nextY;
		var controls = canvas.getContext('2d');
		var border = canvas.getBoundingClientRect();
		
		//var zoomSensivity = 20;
		//canvas.addEventListener('wheel', e => {
		//	if(e.deltaY < 0) {
		//		camera.zoom -= zoomSensivity;
		//	} else 
		//	if(e.deltaY > 0) {
		//		camera.zoom += zoomSensivity;
		//	}
		//});
		
		canvas.addEventListener('mousemove', e => {
			nextX = e.clientX - border.left;
			nextY = e.clientY - border.top;
			if (nextX > currentX) {			player.rotation[2] += degToRad(player.rotationSpeed[2]);} 
			else if (nextX < currentX) {	player.rotation[2] -= degToRad(player.rotationSpeed[2]);}		
			if (nextY > currentY) {			player.rotation[0] -= degToRad(player.rotationSpeed[0]);} 
			else if (nextY < currentY) {	player.rotation[0] += degToRad(player.rotationSpeed[0]);}
			currentX = nextX;
			currentY = nextY;
		});
		
		canvas.addEventListener('mousedown', e => {player.shootON = true;});
		canvas.addEventListener('mouseup', e => {player.shootON = false;});

		document.addEventListener('keydown', (e) => {
			if(e.code == 'KeyQ') {player.turnLeft = true;}
			if(e.code == 'KeyE') {player.turnRight = true;}
			if(e.code == 'KeyW') {player.accelerateON = true;}
			if(e.code == 'Space') {player.brakesON = true;}
			if(e.code == 'KeyS'){camera.mode == 0 ? camera.mode = 1 : camera.mode = 0;}
		});
		document.addEventListener('keyup', (e) => {
			if(e.code == 'KeyQ') {player.turnLeft = false;}
			if(e.code == 'KeyE') {player.turnRight = false;}
			if(e.code == 'KeyW') {player.accelerateON = false;}
			if(e.code == 'Space') {player.brakesON = false;}
		});
		
		var vertexShaderSource = document.getElementById('vertex-shader').text;
		var fragmentShaderSource = document.getElementById('fragment-shader').text;	
		var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);	
		var program = createProgram(gl, vertexShader, fragmentShader);
		
		var positionLocation = gl.getAttribLocation(program, 'a_position');	
		var colorLocation = gl.getAttribLocation(program, 'a_color');
		var matrixLocation = gl.getUniformLocation(program, 'u_matrix');						
		
		var positionBuffer = gl.createBuffer();	
		var colorBuffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		
		requestAnimationFrame(start);
		
		function start() {
			draw(gameObjects);
			realign(camera);
			collide(gameObjects);
			process(gameObjects);
			requestAnimationFrame(start);
		}
		
		function collide(o) {
			/*
				1) calc hitbox nodes for objects OR get data from WebGL texture
			*/
			
			//var point = [0];
			//
			//for(var i = 0; i < o.length; i++) {
			//	for(var j = 0; j < o[i].draftnodes.length; j += 3) {
			//		point = o[i].draftnodes.slice(j, j + 3);
			//		o[i].hitbox[j] = m4. (o[i].state, v3.multiply(point, o[i].size));
			//	}
			//}
		}
		
		function process(o) {
			for(var i = 0; i < o.length; i++) {
				if(!o[i].exists) {
					o.splice(i, 1);
				} else {
					if(o[i].act !== undefined) {
						o[i].act();
					}
					move(o[i]);
				}
			}
		}
		
		function realign(camera) {
			switch(camera.mode) {						
				case 0: 
					var ploc = player.location();
					var eloc = enemy.location();
					
					var lineOfFire = v3.substract(ploc, eloc);
					//var median = v3.multiply(v3.add(ploc, eloc), 0.5);				
					//var distance = v3.vlength(lineOfFire);			
					var distance = 800;// * camera.zoom;
					
					var cameraPosition = v3.add(ploc, v3.multiply(v3.normalize(lineOfFire), distance));
					var target = eloc;
					var up = [0, 1, 0];
			
					camera.cameraMatrix = m4.lookAt(cameraPosition, target, up);
					
					break;
				case 1: 
					break;
			}		
		}
		
		function move(o) {
			if(o.velocity !== [0,0,0] && o.velocity !== undefined) { 
				o.state[12] += o.velocity[0];
				o.state[13] += o.velocity[1];
				o.state[14] += o.velocity[2];
			}
			if(o.rotation !== [0,0,0] && o.rotation !== undefined) {
				o.state = m4.zRotate(o.state, o.rotation[2]); o.rotation[2] = 0;
				o.state = m4.xRotate(o.state, o.rotation[0]); o.rotation[0] = 0;
				o.state = m4.yRotate(o.state, o.rotation[1]); o.rotation[1] = 0;
			}
		}

		function draw(gameObjects) {
			var o = 0;
			
			resizeCanvasToDisplaySize(gl.canvas);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
			
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				
			gl.enable(gl.CULL_FACE);
			gl.enable(gl.DEPTH_TEST);
			gl.useProgram(program);
			
			var projectionMatrix = m4.perspective(camera.fieldOfViewRadians, camera.aspect, camera.zNear, camera.zFar);
			var viewMatrix = m4.inverse(camera.cameraMatrix);
			var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
			
			for(var i = 0; i < gameObjects.length; i++) {	
				o = gameObjects[i];	
				o.nodes.length > 9 ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);
				gl.enableVertexAttribArray(positionLocation);
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);	
				setGeometry(o, gl);		
					var size = 3;
					var type = gl.FLOAT;
					var normalize = false;
					var stride = 0;
					var offset = 0;
					gl.vertexAttribPointer(
						positionLocation, size, type, normalize, stride, offset);

				gl.enableVertexAttribArray(colorLocation);
				gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
				setColors(o, gl);
					var size = 3;
					var type = gl.UNSIGNED_BYTE;
					var normalize = true;
					var stride = 0;
					var offset = 0;
					gl.vertexAttribPointer(
						colorLocation, size, type, normalize, stride, offset);			
			
				var matrix = viewProjectionMatrix;
				matrix = m4.multiply(matrix, o.state);
				matrix = m4.scale(matrix, camera.scale[0], camera.scale[1], camera.scale[2]);				//global scale				
				gl.uniformMatrix4fv(matrixLocation, false, matrix);	

					var primitiveType = gl.TRIANGLES;
					var offset = 0;
					var count = o.nodes.length/3;
					gl.drawArrays(primitiveType, offset, count);
			}
		}
		
		function Fighter() {
			this.isPlayer = true;
			this.turnLeft = false;
			this.turnRight = false;
			this.accelerateON = false;
			this.shootON = false;
			this.shootTimer = 0;
			this.shootDelay = 5;
			this.brakesON = false;
			this.state = [
				1,	0,	0,	0,
				0,	1,	0,	0,
				0,	0,	1,	0,
				0,	0,-250,	1,
			];
			this.velocity = [0, 0, 0];
			this.acceleration = 4;
			this.rotationSpeed = [6, 0.15, 6];
			this.rotation = [3, 0, 0];
			this.exists = true;
			this.size = 10;
			this.nodes = [0];
			this.hitbox = [0];
			this.draftnodes = [
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
			];
			this.colors = [
				//front wings
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
				Math.random()*55,Math.random()*35,Math.random()*155,
			];
			setNodes(this);
		}
		Fighter.prototype.act = function() {
			if(this.turnLeft) {
				this.rotation[1] = -this.rotationSpeed[1];
			}
			if(this.turnRight) {
				this.rotation[1] = this.rotationSpeed[1];
			}
			if(this.accelerateON) {
				this.accelerate();
			}
			if(this.shootON && this.shootTimer++ == this.shootDelay) {
				this.shoot();
				this.shootTimer = 0;
			}	
			if(this.brakesON) {
				this.brake();
			}
		}
		Fighter.prototype.brake = function() {
			this.velocity = v3.multiply(this.velocity, 0.9);
			gameObjects.push(new Throttle(this));
		} 
		Fighter.prototype.direction = function() {
			return this.state.slice(8,11);
		} 
		Fighter.prototype.location = function() {
			return this.state.slice(12,15);
		}
		Fighter.prototype.accelerate = function() {
			this.velocity = v3.add(this.velocity, v3.multiply(this.direction(), this.acceleration));
			gameObjects.push(new Throttle(this));
		} 
		Fighter.prototype.shoot = function() {
			gameObjects.push(new Bolt(this));
		}

		function Bolt(o) {
			this.isPlayer = false;
			var s = o.state.slice();
			this.state = s;
			this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), 100));
			this.size = 5;
			this.nodes = [0];
			this.hitbox = [0];
			this.draftnodes = [
					0,	0,	0,
					1,	0,	6,
					-1,	0,	6,
					
					//0,	0,	0,
					//-1,	0,	6,
					//1,	0,	6,
				];
			this.colors = [
					1, 255,  1,
					1, 255,  1,
					1, 255,  1,
					
					//1, 255,  1,
					//1, 255,  1,
					//1, 255,  1,
				];
			this.TTL = 15;
			this.exists = true;
			this.state = m4.translate(this.state, 0, 0, o.size*6);
			setNodes(this);
		}
		Bolt.prototype.act = function() {
			if(this.TTL-- == 0) {
				this.exists = false;
			}
		}
		
		function Throttle(o) {
			this.isPlayer = false;
			var s = o.state.slice();
			this.state = s;
			this.size = 10;
			this.nodes = [0];
			this.hitbox = [0];
			this.draftnodes = [				
				0,	0,	-1,
				0,	-1,	0, 				
				-1,	0,	0,
				
				0,	0,	-1,
				1,	0,	0,
				0,	-1,	0, 
				
				0,	0,	-1,
				-1,	0,	0, 				
				1,	0,	0, 	
				
				-1,	0,	0, 
				0,	-1,	0, 				
				1,	0,	0,
			];
			this.colors = [
				255, 1,  1,
				255, 1,  1,
				255, 1,  1,
				
				255, 1,  1,
				255, 1,  1,
				255, 1,  1,
				
				255, 1,  1,
				255, 1,  1,
				255, 1,  1,			

				255, 1,  1,
				255, 1,  1,
				255, 1,  1,				
			];
			this.TTL = 20;
			this.fadeRatio = 0.7;
			this.exists = true;
			this.state = m4.translate(this.state, 0, 0, -o.size*2);
			setNodes(this);
		} 
		Throttle.prototype.act = function() {
			if(this.TTL-- == 0 || this.size == 0) {
				this.exists = false;
			} else {
				this.size *= this.fadeRatio;
				this.state = m4.translate(this.state, 0, 0, -3);
				setNodes(this);
			}
		}

		function Carrier() {
			this.isPlayer = false;
			this.turnLeft = false;
			this.turnRight = false;
			this.accelerateON = false;
			this.shootON = false;
			this.shootTimer = 0;
			this.shootDelay = 5;
			this.brakesON = false;
			this.state = [
				1,	0,	0,	0,
				0,	1,	0,	0,
				0,	0,	1,	0,
				0,	0,-10000,1,
			];
			this.velocity = [0, 0, 0,];
			this.acceleration = 1;
			this.size = 10000;
			this.nodes = [0];
			this.hitbox = [0];
			this.draftnodes = [				
				0,-.5,	-2,
				0,	-1,	0, 				
				-1,	0,	0,
				
				0,-.5,	-2,
				1,	0,	0,
				0,	-1,	0, 
				
				0,-.5,	-2,
				-1,	0,	0, 				
				1,	0,	0, 	
				
				-1,	0,	0, 
				0,	-1,	0, 				
				1,	0,	0,
			];
			this.colors = [
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
							
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
							
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,

				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,		
			];
			this.exists = true;
			setNodes(this);
		}
		Carrier.prototype.shoot = function() {
			gameObjects.push(new Blaster(this));
		}
		Carrier.prototype.launch = function() {
			gameObjects.push(new Interceptor(this));
		}
		Carrier.prototype.accelerate = function() {
			this.velocity = v3.add(this.velocity, v3.multiply(this.direction(), this.acceleration));
			gameObjects.push(new Throttle(this));
		}
		Carrier.prototype.direction = function() {
			return this.state.slice(8, 11);
		}
		Carrier.prototype.location = function() {
			return this.state.slice(12,15);
		}
		
		function Blaster(o) {
			var s = o.state.slice();
			this.state = s;
			this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), 5));
			this.size = 10;
			this.nodes = [0];
			this.hitbox = [0];
			this.draftnodes = [
				 0,  	0,	  2,
				 0.25,  0,	  3,
				-0,25,  0, 	  3,
			];
			this.colors = [
				255,  1, 1,
				255,  1, 1,
				255,  1, 1,
			];
			this.TTL = 30;
			this.exists = true;
			setNodes(this);
		}
		Blaster.prototype.fade = function() {
			if(this.TTL-- == 0) {this.exists = false;}
		}
		
		function Interceptor(o) {
			this.isPlayer = false;
			this.turnLeft = false;
			this.turnRight = false;
			this.accelerateON = false;
			this.shootON = false;
			this.shootTimer = 0;
			this.shootDelay = 50;
			this.brakesON = false;
			var s = o.state.slice();
			this.state = s;
			this.velocity = [0, 0, 0];
			this.acceleration = 4;
			this.rotationSpeed = [6, 0.15, 6];
			this.rotation = [3, 0, 0];
			this.exists = true;
			this.size = 10;
			this.nodes = [0];
			this.hitbox = [0];
			this.draftnodes = [
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
			];
			this.colors = [
				//front wings
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//sides       1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//hood        1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//buttocks		1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//front		  1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//upper jaws	1	
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//butt        1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//bottom      1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//bottom sides1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//bottom wings1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//bottom front1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				//bottom jaws 1
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
				Math.random()*155,Math.random()*35,Math.random()*55,
			];
			setNodes(this);
		}
		Interceptor.prototype.act = function() {
			if(this.turnLeft) {
				this.rotation[1] = -this.rotationSpeed[1];
			}
			if(this.turnRight) {
				this.rotation[1] = this.rotationSpeed[1];
			}
			if(this.accelerateON) {
				this.accelerate();
			}
			if(this.shootON && this.shootTimer++ == this.shootDelay) {
				this.shoot();
				this.shootTimer = 0;
			}	
			if(this.brakesON) {
				this.brake();
			}
		}
		Interceptor.prototype.brake = function() {
			this.velocity = v3.multiply(this.velocity, 0.9);
			gameObjects.push(new Throttle(this));
		} 
		Interceptor.prototype.direction = function() {
			return this.state.slice(8,11);
		} 
		Interceptor.prototype.location = function() {
			return this.state.slice(12,15);
		}
		Interceptor.prototype.accelerate = function() {
			this.velocity = v3.add(this.velocity, v3.multiply(this.direction(), this.acceleration));
			gameObjects.push(new Throttle(this));
		} 
		Interceptor.prototype.shoot = function() {
			//shoot beam
			//gameObjects.push(new Beam(this));
		}
		
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
	}

main();