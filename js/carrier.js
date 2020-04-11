'use strict';
	function Carrier(list) {
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
		this.currenthitbox = [];
		this.hitbox = [];
		this.drafthitbox = [
			0,-.5,	-2,
			0,	-1,	0, 				
			-1,	0,	0,
			1,	0,	0,
		];
		this.nodes = [];
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
		this.list = list;
		this.list.push(this);
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
		this.nodes = [];
		this.hitbox = [];
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
		this.list = o.list;
		o.list.push(this);
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
		this.currenthitbox = [];
		this.hitbox = [];
		this.drafthitbox = [
			-1, 0, 6,
			1, 0, 6,
			
			-1, -1, 2,
			1, -1, 2,
			
			-3, 0, 0,
			3, 0, 0,
			
			-1, 1, 0,
			1, 1, 0,
			
			2, 0, -2,
			-2, 0, -2,	
		];
		this.nodes = [];
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
		this.list = o.list;
		o.list.push(this);
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