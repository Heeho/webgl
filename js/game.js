'use strict';
	function main() {				

		var objects = [];
		var projectiles = [];
		var effects = [];
		var celestials = [];
		
		var player = new Fighter(objects, projectiles, effects);
		player.isPlayer = true;
		player.target = new Carrier(objects, projectiles, effects);
		player.target.target = player;
		
		//var sun = new Sun(celestials);
		//var planet = new Planet(celestials);
		//var moon = new Moon(celestials);
		//var light = v3.substract(planet.state.location(), sun.state.location());
		
		var currentX, currentY, nextX, nextY;
		var condition;
		canvas.addEventListener('mousemove', e => {
			nextX = e.clientX;
			nextY = e.clientY;
			condition = player.controls.autopilotON && player.controls.lockedontarget;
			if		(nextX > currentX) {player.controls.mousepos[0] += condition ? 0 : 1;}
			else if	(nextX < currentX) {player.controls.mousepos[0] -= condition ? 0 : 1;}	
			if		(nextY > currentY) {player.controls.mousepos[1] += condition ? 0 : 1;}
			else if	(nextY < currentY) {player.controls.mousepos[1] -= condition ? 0 : 1;}
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
			
			if(e.code == 'KeyS')	{player.controls.autopilotON = !player.controls.autopilotON;}
			
			if(e.code == 'KeyR')	{player.controls.changetarget = true;}
		});
		document.addEventListener('keyup', (e) => {
			if(e.code == 'KeyQ')	{player.controls.turnLeft = false;}
			if(e.code == 'KeyE')	{player.controls.turnRight = false;}
			if(e.code == 'KeyW')	{player.controls.accelerateON = false;}
			if(e.code == 'Space')	{player.controls.brakesON = false;}
		});

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
		//var colorLocation = gl.getAttribLocation(program, 'a_color');
		var matrixLocation = gl.getUniformLocation(program, 'u_matrix');
		var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');
		
		var positionBuffer = gl.createBuffer();	
		//var colorBuffer = gl.createBuffer();
		var indexBuffer = gl.createBuffer();
		var textureBuffer = gl.createBuffer();
		var texture = gl.createTexture();		
		
		gl.bindTexture(gl.TEXTURE_2D, texture);	
			const level = 0;
			const internalFormat = gl.RGB;
			const width = 4;
			const height = 2;
			const border = 0;
			const format = gl.RGB;
			const type = gl.UNSIGNED_BYTE;
			const data = new Uint8Array(
			[
				255,0,0,	0,255,0,	0,0,255,	255,255,255,
				255,255,0,	255,0,255,	0,255,255,	0,0,0,
			]);
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data);
		
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);		
		
		var camera = new Camera(gl, player);		
		
		requestAnimationFrame(start);
		
		function start() {
			render([projectiles, objects, effects, celestials]);
			physics(projectiles, objects, effects, celestials);
			camera.realign();
			//render([projectiles, objects, effects, celestials]);
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
			var viewMatrix = m4.inverse(camera.state.matrix);
			var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
									
			for(var h = 0; h < objlist.length; h++) {
				objects = objlist[h];
				for(var i = 0; i < objects.length; i++) {	
					o = objects[i];	
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

					//gl.enableVertexAttribArray(colorLocation);
					//gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
					//setColors(o, gl);
					//	var size = 3;
					//	var type = gl.UNSIGNED_BYTE;
					//	var normalize = true;
					//	var stride = 0;
					//	var offset = 0;
					//	gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
				
					gl.enableVertexAttribArray(texcoordLocation);
					gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);	
					setTexcoords(o, gl);
						var size = 2;
						var type = gl.FLOAT;
						var normalize = false;
						var stride = 0;
						var offset = 0;
						gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);					
					
					var matrix = viewProjectionMatrix;
					matrix = m4.multiply(matrix, o.state.matrix);
					matrix = m4.scale(matrix, camera.scale[0], camera.scale[1], camera.scale[2]); //global scale
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
	}
	
	main();