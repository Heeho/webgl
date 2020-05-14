'use strict';
	function main() {
		var gl = document.getElementById('canvas').getContext('webgl');
		if(!gl) {
			window.alert('Absolutely no WebGL here!');
		}

		/*-=ANGLE_instanced_arrays=-*/
		var extension = gl.getExtension('ANGLE_instanced_arrays');
		if(!extension) {
			window.alert('ANGLE_instanced_arrays not supported');
		}

		var vertexShaderSource = document.getElementById('vertex-shader').text;
		var fragmentShaderSource = document.getElementById('fragment-shader').text;
		var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		var program = createProgram(gl, vertexShader, fragmentShader);

		var matrixLocation = gl.getAttribLocation(program, 'matrix');
		var positionLocation = gl.getAttribLocation(program, 'a_position');
		var texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');
		var normalLocation = gl.getAttribLocation(program, 'a_normal');
		var projectionLoc = gl.getUniformLocation(program, 'projection');
		var viewLoc = gl.getUniformLocation(program, 'view');
		var reverseLightDirectionLocation = gl.getUniformLocation(program, 'u_reverseLightDirection');
		var ambientLight = gl.getUniformLocation(program, 'u_ambient');
		
		//var sun = new Sun({objlist}); 
		//var planet = new Planet({objlist});
		//var moon = new Moon(celestials);
		//var light = v3.substract(planet.state.location(), sun.state.location());
		
		var player = new Fighter({objlist});
		player.isPlayer = true;
		
		//player.target = sun;/*
		player.target = new Carrier({objlist});
		player.target.target = player;//*/

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
					currentY = nextY; //console.log(player.controls.mousepos);
				});

				canvas.addEventListener('mousedown',	(e) => {player.controls.shootON = true;});
				canvas.addEventListener('mouseup',		(e) => {player.controls.shootON = false;});

				document.addEventListener('keydown', (e) => {
					if(e.code == 'KeyQ')	{player.controls.turnLeft = true;}
					if(e.code == 'KeyE')	{player.controls.turnRight = true;}
					if(e.code == 'KeyW')	{player.controls.accelerateON = true;}
					if(e.code == 'Space')	{player.controls.brakesON = true;}

					if(e.code == 'KeyS')	{player.controls.autopilotON = !player.controls.autopilotON;}

					if(e.code == 'KeyR')	{player.controls.changetarget = true;}
					if(e.code == 'Escape')	{console.log('escape');}
				});
				document.addEventListener('keyup', (e) => {
					if(e.code == 'KeyQ')	{player.controls.turnLeft = false;}
					if(e.code == 'KeyE')	{player.controls.turnRight = false;}
					if(e.code == 'KeyW')	{player.controls.accelerateON = false;}
					if(e.code == 'Space')	{player.controls.brakesON = false;}
				});

		var camera = new Camera(gl, player);

		for(var i in objlist) {
			for(var j in objlist[i]) {				
				objlist[i][j].indexBuffer = gl.createBuffer();
				objlist[i][j].positionBuffer = gl.createBuffer();
				objlist[i][j].textureBuffer = gl.createBuffer();
				objlist[i][j].normalBuffer = gl.createBuffer();

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objlist[i][j].indexBuffer);
				setIndices(objlist[i][j], gl);

				gl.bindBuffer(gl.ARRAY_BUFFER, objlist[i][j].positionBuffer);
				setGeometry(objlist[i][j], gl);

				gl.bindBuffer(gl.ARRAY_BUFFER, objlist[i][j].textureBuffer);
				setTexcoords(objlist[i][j], gl);

				gl.bindBuffer(gl.ARRAY_BUFFER, objlist[i][j].normalBuffer);
				setNormals(objlist[i][j], gl);
			}
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		var matrixBuffer = gl.createBuffer();

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

		requestAnimationFrame(start);

		function start() { //(objlist.projectiles.instances, objlist.ships.instances, objlist.effects.instances, objlist.celestials.instances)
			render(objlist);
			physics(objlist.projectiles, objlist.effects, objlist.ships, objlist.celestials);
			camera.realign();
			requestAnimationFrame(start);
		}

		function render(objlist) {
			var o;

			resizeCanvasToDisplaySize(gl.canvas);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			gl.enable(gl.CULL_FACE);
			gl.enable(gl.DEPTH_TEST);
			gl.useProgram(program);

			gl.uniform3fv(reverseLightDirectionLocation, [0, -1, 0]);

			var projectionMatrix = m4.perspective(camera.fieldOfViewRadians, camera.aspect, camera.zNear, camera.zFar);
			var viewMatrix = m4.inverse(camera.state.matrix);
			//console.log(projectionMatrix, viewMatrix);

			gl.uniformMatrix4fv(projectionLoc, false, projectionMatrix);
			gl.uniformMatrix4fv(viewLoc, false, viewMatrix);

			var matrices;

			for(var h in objlist) {
				for(var i in objlist[h]) {
					o = objlist[h][i]; //console.log(o); //one kind of projectiles, ships, effects, celestials 
					if(o.instances.length == 0) {continue;}

					o.model.indices.length > 3 ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);

					gl.uniform1f(ambientLight, o.model.ambientlight);

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

					gl.enableVertexAttribArray(positionLocation);
					gl.bindBuffer(gl.ARRAY_BUFFER, o.positionBuffer);
						var size = 3;
						var type = gl.FLOAT;
						var normalize = false;
						var stride = 0;
						var offset = 0;
					gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

					gl.enableVertexAttribArray(texcoordLocation);
					gl.bindBuffer(gl.ARRAY_BUFFER, o.textureBuffer);
						var size = 2;
						var type = gl.FLOAT;
						var normalize = false;
						var stride = 0;
						var offset = 0;
					gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

					gl.enableVertexAttribArray(normalLocation);
					gl.bindBuffer(gl.ARRAY_BUFFER, o.normalBuffer);
						var size = 3;
						var type = gl.FLOAT;
						var normalize = false;
						var stride = 0;
						var offset = 0;
					gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);

					/*-=ANGLE_instanced_arrays=-*/
					var numvertices = o.model.indices.length;
					var numinstances = o.instances.length; //console.log(o.instances, numvertices, numinstances);

					matrices = [];
					for(var i in o.instances) {
						matrices.push(...o.instances[i].state.matrix); //console.log(i, matrices);
					} //console.log(matrices);

					gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(matrices), gl.DYNAMIC_DRAW);

					for (var i = 0; i < 4; ++i) {
						var loc = matrixLocation + i;
						gl.enableVertexAttribArray(loc);
						gl.vertexAttribPointer(
							loc,				// location
							4,					// size (num values to pull from buffer per iteration)
							gl.FLOAT,			// type of data in buffer
							false,				// normalize
							4 * 16,				// stride, num bytes to advance to get to next set of values
							i * 4 * 4,			// offset in buffer, bytes per row of 4
						);
						extension.vertexAttribDivisorANGLE(loc, 1);
					}

					extension.drawElementsInstancedANGLE(
						gl.TRIANGLES, //mode, 
						numvertices, //count, 
						gl.UNSIGNED_SHORT, //type, 
						0, //offset, 
						numinstances, //primcount
					);

					gl.bindBuffer(gl.ARRAY_BUFFER, null);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
				}
			}
		}
	}

	main();