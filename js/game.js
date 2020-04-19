'use strict';
	function main() {
		var gl = document.getElementById('canvas').getContext('webgl');
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
		
		var positionBuffer = gl.createBuffer();	
		var colorBuffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			
			var camera = new Camera(gl);
			var gameObjects = [];		
			
			var player = new Fighter(gameObjects);	
			var enemy = new Carrier(gameObjects);
			
			//var controls = canvas.getContext('2d');
			var currentX, currentY, nextX, nextY;
			var border = canvas.getBoundingClientRect();
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
			
			canvas.addEventListener('mousedown', (e) => {player.shootON = true;});
			canvas.addEventListener('mouseup', (e) => {player.shootON = false;});

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

		requestAnimationFrame(start);
		
		function start() {
			render(gameObjects);			
			//realign(camera);
			process(gameObjects);
			realign(camera);
			requestAnimationFrame(start);
		}
		
		function render(gameObjects) {
			var o;
			
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
					gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

				gl.enableVertexAttribArray(colorLocation);
				gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
				setColors(o, gl);
					var size = 3;
					var type = gl.UNSIGNED_BYTE;
					var normalize = true;
					var stride = 0;
					var offset = 0;
					gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);			
			
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
	}
	
	main();