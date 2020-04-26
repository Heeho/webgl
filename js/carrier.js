'use strict';
	function Carrier(objects, projectiles, effects) {
		this.exists = true;
		this.isPlayer = false;
		
		this.turnLeft = false;
		this.turnRight = false;
		this.accelerateON = false;
		this.brakesON = false;
		this.shootON = false;
		this.launchON = true;

		this.energyCap = 1000;
		this.energyGain = 1;
		this.energy = this.energyCap;
		
		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 15;	
		this.launchCost = 1000;	

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
		this.nodes = [];
		
		var model = new Model('carrier');
		this.drafthitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;		

		setNodes(this);
		this.objects = objects;
		this.projectiles = projectiles;
		this.effects = effects;
		this.objects.push(this);
	}
	Carrier.prototype.onCollision = function(o, pen) {
	
	}
	Carrier.prototype.act = function() {
		this.energy += this.energy < this.energyCap ? this.energyGain : this.energy > this.energyCap ? -1 : 0;
		//console.log(this.energy);
		if(this.launchON && this.energy >= this.launchCost) {
			this.energy -= this.launchCost;
			this.launch();
		}	
	}
	Carrier.prototype.shoot = function() {
		this.list.push(new Blaster(this));
	}
	Carrier.prototype.launch = function() {
		var interceptor = new Interceptor(this);
	}
	Carrier.prototype.accelerate = function() {
		this.velocity = v3.add(this.velocity, v3.multiply(this.direction(), this.acceleration));
		var throttle = new Throttle(this);
	}
	Carrier.prototype.direction = function() {
		return this.state.slice(8, 11);
	}
	Carrier.prototype.location = function() {
		return this.state.slice(12,15);
	}
	
	function Blaster(o) {
		this.exists = true;
		var s = o.state.slice();
		this.state = s;
		this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), 5));
		
		this.size = 10;
		this.currentHitbox = [];
		this.hitbox = [];
		this.nodes = [];

		var model = new Model('Blaster');
		this.drafthitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		this.TTL = 30;
		this.damage = 20;
		
		setNodes(this);

		o.projectiles.push(this);
	}
	Blaster.prototype.fade = function() {
		if(this.TTL-- == 0) {this.exists = false;}
	}
	
	function Interceptor(o) {
		this.exists = true;		
		this.isPlayer = false;
		
		this.target = o.objects[0];
		this.reaction = 0;
		this.reactionCap = 10;
		
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
		this.speed = 40;
		this.rotationspeed = [6, 0.15, 6];
		this.rotation = [3, 0, 0];

		this.size = 10;
		this.hitpoints = 5;
		this.currentHitbox = [];
		this.hitbox = [];
		this.nodes = [];
		
		var model = new Model('interceptor');
		this.drafthitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		this.state = m4.translate(this.state, 0, 0, this.size*12);
		setNodes(this);
		
		this.objects = o.objects;
		this.projectiles = o.projectiles;
		this.effects = o.effects;
		o.objects.push(this);
	}
	Interceptor.prototype.act = function() {
		if(++this.reaction == this.reactionCap) {
			this.reaction = 0;
			var direction = v3.substract(this.target.location(), this.location());
			//this.velocity = v3.multiply(v3.normalize(direction), this.speed);
			if(v3.vlength(v3.substract(this.target.location(), this.location())) > 500) {
				this.velocity = v3.multiply(v3.normalize(direction), this.speed);
				//this.velocity = v3.add(this.velocity, v3.multiply(v3.normalize(direction), this.acceleration));
			} else {
				this.velocity = [0,0,0];
				//this.velocity = v3.substract(this.velocity, v3.multiply(v3.normalize(direction), this.acceleration*2));
			}
		}
		//if(this.turnLeft) {
		//	this.rotation[1] = -this.rotationspeed[1];
		//}
		//if(this.turnRight) {
		//	this.rotation[1] = this.rotationspeed[1];
		//}
		//if(this.accelerateON) {
		//	this.accelerate();
		//}
		//if(this.shootON && this.shootTimer++ == this.shootDelay) {
		//	this.shoot();
		//	this.shootTimer = 0;
		//}	
		//if(this.brakesON) {
		//	this.brake();
		//}
	}
	Interceptor.prototype.onCollision = function(o, pen) {
		var pn = v3.normalize(pen);
		var repulsion = v3.multiply(pn, (-this.acceleration - 2 * v3.dot(this.velocity, pn)));
		this.velocity = v3.add(this.velocity, repulsion);
	}
	Interceptor.prototype.brake = function() {
		this.velocity = v3.multiply(this.velocity, 0.9);
		objects.push(new Throttle(this));
	} 
	Interceptor.prototype.direction = function() {
		return this.state.slice(8,11);
	} 
	Interceptor.prototype.location = function() {
		return this.state.slice(12,15);
	}
	Interceptor.prototype.accelerate = function() {
		this.velocity = v3.add(this.velocity, v3.multiply(this.direction(), this.acceleration));
		objects.push(new Throttle(this));
	} 
	Interceptor.prototype.shoot = function() {
		//shoot beam
		//objects.push(new Beam(this));
	}