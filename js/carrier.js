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
		this.hitpoints = 999;
		this.currentHitbox = [];
		this.hitbox = [];
		this.draftHitbox = drafthitbox('carrier');
		this.nodes = [];
		this.draftnodes = draftnodes('carrier');
		this.colors = colors('carrier');
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
		this.currentHitbox = [];
		this.hitbox = [];
		this.draftHitbox = [
			 0,  	0,	  2,
			 0.25,  0,	  3,
			-0,25,  0, 	  3,
		];
		this.nodes = [];

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
		this.exists = true;		
		this.isPlayer = false;
		
		this.turnLeft = false;
		this.turnRight = false;
		this.accelerateON = false;
		this.brakesON = false;
		this.shootON = false;
		this.shootTimer = 0;
		this.shootDelay = 50;

		var s = o.state.slice();
		this.state = s;
		
		this.velocity = [0, 0, 0];
		this.acceleration = 4;
		this.rotationSpeed = [6, 0.15, 6];
		this.rotation = [3, 0, 0];

		this.size = 5;
		this.hitpoints = 1;
		this.currentHitbox = [];
		this.hitbox = [];
		this.nodes = [];
		
		var model = new Model('interceptor');
		this.draftHitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
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