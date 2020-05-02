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
		var indexBuffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		
			var camera = new Camera(gl);
			
			var objects = [];
			var projectiles = [];
			var effects = [];
			
			var player = new Fighter(objects, projectiles, effects);
			player.isPlayer = true;
			player.settarget(new Carrier(objects, projectiles, effects));
			player.target.settarget(player);

			var currentX, currentY, nextX, nextY;			
			canvas.addEventListener('mousemove', e => {
				nextX = e.clientX;
				nextY = e.clientY;
				if		(nextX > currentX)	{player.controls.mousepos[0] += !player.controls.lockedontarget ? 1 : 0;}
				else if	(nextX < currentX)	{player.controls.mousepos[0] -= !player.controls.lockedontarget ? 1 : 0;}	
				if		(nextY > currentY)	{player.controls.mousepos[1] += !player.controls.lockedontarget ? 1 : 0;}
				else if	(nextY < currentY)	{player.controls.mousepos[1] -= !player.controls.lockedontarget ? 1 : 0;}
				currentX = nextX;
				currentY = nextY;
				//console.log(player.controls.mousepos);
			});
			
			canvas.addEventListener('mousedown', (e) => {player.controls.shootON = true;});
			canvas.addEventListener('mouseup', (e) => {player.controls.shootON = false;});

			document.addEventListener('keydown', (e) => {
				if(e.code == 'KeyQ')	{player.controls.turnLeft = true;}
				if(e.code == 'KeyE')	{player.controls.turnRight = true;}
				if(e.code == 'KeyW')	{player.controls.accelerateON = true;}
				if(e.code == 'Space')	{player.controls.brakesON = true;}
				
				if(e.code == 'KeyS')	{camera.mode = camera.mode == 0 ? 1 : 0;}
				if(e.code == 'KeyR')	{camera.changetarget = true;}
			});
			document.addEventListener('keyup', (e) => {
				if(e.code == 'KeyQ')	{player.controls.turnLeft = false;}
				if(e.code == 'KeyE')	{player.controls.turnRight = false;}
				if(e.code == 'KeyW')	{player.controls.accelerateON = false;}
				if(e.code == 'Space')	{player.controls.brakesON = false;}
			});

		requestAnimationFrame(start);
		
		function start() {
			deletenonexistant([projectiles, objects, effects]);
			physics(projectiles, objects, effects);
			realign(camera);
			render([projectiles, objects, effects]);
			requestAnimationFrame(start);
		}
		
		function render(objlist) {
			var objects;
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
			
						
			for(var h = 0; h < objlist.length; h++) {
				objects = objlist[h];
				//console.log(objects);
				for(var i = 0; i < objects.length; i++) {	
					o = objects[i];	
					//console.log(o.nodes.length);
					o.model.indices.length > 3 ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);				
					
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
					setIndices(o, gl);
					
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
					matrix = m4.multiply(matrix, o.state.matrix);
					matrix = m4.scale(matrix, camera.scale[0], camera.scale[1], camera.scale[2]);				//global scale				
					gl.uniformMatrix4fv(matrixLocation, false, matrix);	

					var primitiveType = gl.TRIANGLES;
					var count = o.model.indices.length;
					var type = gl.UNSIGNED_SHORT;
					var offset = 0;
					gl.drawElements(primitiveType, count, type, offset);
					
					gl.bindBuffer(gl.ARRAY_BUFFER, null);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
				}
			}
		}

		function realign(camera) {
			while(camera.changetarget) {
				if(++camera.target > objects.length - 1) {camera.target = 1;}
				if(objects[camera.target].hitpoints !== undefined) {player.target = objects[camera.target];}
				camera.changetarget = false;
			}
			
			var target;
			var cameraPosition;
			var nextCameraPosition;
			var currentCameraPosition = camera.cameraMatrix.slice(12,15);
			
			mode(camera.mode);
			
			function mode(m) {
				switch(m) {						
				case 0: 
					nextCameraPosition = v3.add(v3.add(player.state.location(), v3.multiply(v3.normalize(player.lineoffire), -camera.distance)), v3.multiply(camera.up, camera.distance/4));
					target = player.target.state.location();
					break;
				case 1: 
					var halfline = v3.multiply(player.lineoffire, .5);
					var distance = v3.vlength(halfline)*2;
					var camz = v3.multiply(player.state.Y(), v3.vlength(halfline)*2);
			
					if(distance > camera.distance*8) {mode(0); player.controls.lockedontarget = false; break;}
					player.controls.lockedontarget = true;
					
					target = v3.multiply(v3.add(player.state.location(), player.target.state.location()), .5);
					nextCameraPosition = v3.substract(target, camz);
					//console.log(target, camz, nextCameraPosition);
					break;
				}
			}
			
			cameraPosition = v3.add(currentCameraPosition, v3.multiply(v3.substract(nextCameraPosition, currentCameraPosition), camera.speed));
			camera.cameraMatrix = m4.lookAt(cameraPosition, target, camera.up);	
		}		
	}
	
	main();