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
			
			var objects = [];
			var projectiles = [];
			var effects = [];
			
			var player = new Fighter(objects, projectiles, effects);	
			player.settarget(new Carrier(objects, projectiles, effects));

			//var controls = canvas.getContext('2d');
			//var border = canvas.getBoundingClientRect();
		
			var currentX, currentY, nextX, nextY;
			
			canvas.addEventListener('mousemove', e => {
				nextX = e.clientX;
				nextY = e.clientY;
				//console.log('next, current: ', nextX, nextY, currentX, currentY);
				if		(nextX > currentX)	{player.mousecontrol[0] += !player.lockedontarget ? 1 : 0;}
				else if	(nextX < currentX)	{player.mousecontrol[0] -= !player.lockedontarget ? 1 : 0;}	
				if		(nextY > currentY)	{player.mousecontrol[1] += !player.lockedontarget ? 1 : 0;}
				else if	(nextY < currentY)	{player.mousecontrol[1] -= !player.lockedontarget ? 1 : 0;}
				currentX = nextX;
				currentY = nextY;
			});
			
			canvas.addEventListener('mousedown', (e) => {player.shootON = true;});
			canvas.addEventListener('mouseup', (e) => {player.shootON = false;});

			document.addEventListener('keydown', (e) => {
				if(e.code == 'KeyQ')	{player.turnLeft = true;}
				if(e.code == 'KeyE')	{player.turnRight = true;}
				if(e.code == 'KeyW')	{player.accelerateON = true;}
				if(e.code == 'Space')	{player.brakesON = true;}
				
				if(e.code == 'KeyS')	{
					camera.mode = camera.mode == 0 ? 1 : 0; 
					player.lockedontarget = camera.mode == 1 ? true : false;
					if(player.lockedontarget) {player.initautopitch();}
				}
				if(e.code == 'KeyR')	{camera.changetarget = true;}
			});
			document.addEventListener('keyup', (e) => {
				if(e.code == 'KeyQ')	{player.turnLeft = false;}
				if(e.code == 'KeyE')	{player.turnRight = false;}
				if(e.code == 'KeyW')	{player.accelerateON = false;}
				if(e.code == 'Space')	{player.brakesON = false;}
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
					//console.log(o);
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
					
					gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
			
			switch(camera.mode) {						
			case 0: 
				nextCameraPosition = v3.add(v3.add(player.location(), v3.multiply(v3.normalize(player.lineoffire), -camera.distance)), v3.multiply(camera.up, camera.distance/4));
				target = player.target.location();
				break;
			case 1: 
				var halfline = v3.multiply(player.lineoffire, .5);
				var camz = v3.multiply(player.state.slice(4,7), v3.vlength(halfline)*2);
				target = v3.multiply(v3.add(player.location(), player.target.location()), .5);
				nextCameraPosition = v3.substract(target, camz);
				//console.log(target, camz, nextCameraPosition);
				break;
			}
			
			cameraPosition = v3.add(currentCameraPosition, v3.multiply(v3.substract(nextCameraPosition, currentCameraPosition), camera.speed));
			camera.cameraMatrix = m4.lookAt(cameraPosition, target, camera.up);				
		}		
	}
	
	main();