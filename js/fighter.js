'use strict';
	function Fighter(list) {
		this.exists = true;
		this.isPlayer = true;
		
		this.turnLeft = false;
		this.turnRight = false;
		this.accelerateON = false;
		this.brakesON = false;
		
		this.shootON = false;
		
		this.energyCap = 100;
		this.energyGain = 2;
		this.energy = this.energyCap;		
		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 15;	

		this.rotationSpeed = [6, 0.15, 6];		
		this.rotation = [3, 0, 0];		
		
		this.state = [
			1,	0,	0,	0,
			0,	1,	0,	0,
			0,	0,	1,	0,
			0,	0,-250,	1,
		];
		this.velocity = [0, 0, 0];
		this.acceleration = 4;
		
		this.size = 10;
		this.currentHitbox = [];
		this.hitbox = [];
		this.nodes = [];
		
		var model = new Model('fighter');
		this.draftHitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		setNodes(this);
		this.list = list;
		this.list.push(this);
	}
	Fighter.prototype.onCollision = function(o, pen) {
		var pn = v3.normalize(pen);
		var repulsion = v3.multiply(pn, (-this.acceleration - 2 * v3.dot(this.velocity, pn)));
		this.velocity = v3.add(this.velocity, repulsion);
	}
	Fighter.prototype.act = function() {
		
		this.energy += this.energy < this.energyCap ? this.energyGain : this.energy > this.energyCap ? -1 : 0;
		
		//console.log('energy: ', this.energy);
		
		if(this.turnLeft) {
			this.rotation[1] = -this.rotationSpeed[1];
		}
		if(this.turnRight) {
			this.rotation[1] = this.rotationSpeed[1];
		}
		if(this.accelerateON && this.energy > this.accelerateCost) {
			this.energy -= this.accelerateCost;
			this.accelerate();
		}
		if(this.shootON && this.energy >= this.shootCost) {
			this.energy -= this.shootCost;
			this.shoot();
		}	
		if(this.brakesON && this.energy >= this.brakesCost) {
			this.energy -= this.brakesCost;
			this.brake();
		}
	}
	Fighter.prototype.direction = function() {
		return this.state.slice(8,11);
	} 
	Fighter.prototype.location = function() {
		return this.state.slice(12,15);
	}
	Fighter.prototype.accelerate = function() {
		this.velocity = v3.add(this.velocity, v3.multiply(this.direction(), this.acceleration));
		var throttle = new Throttle(this);
	} 
	Fighter.prototype.brake = function() {
		this.velocity = v3.multiply(this.velocity, 0.9);
		var throttle = new Throttle(this);
	} 		
	Fighter.prototype.shoot = function() {
		var bolt = new Bolt(this);
	}

	function Bolt(o) {
		this.exists = true;
		this.isPlayer = false;
		
		var s = o.state.slice();
		this.state = s;
		this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), 100));
		
		this.size = 5;
		this.currentHitbox = [];
		this.hitbox = [];
		this.nodes = [];
		
		var model = new Model('bolt');
		this.draftHitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		this.TTL = 15;
		this.damage = 1;
		
		this.state = m4.translate(this.state, 0, 0, o.size*6);
		setNodes(this);
		this.list = o.list;
		o.list.push(this);
	}
	Bolt.prototype.act = function() {
		if(this.TTL-- == 0) {
			this.exists = false;
		}
	}
	Bolt.prototype.onCollision = function(o, pen) {
		this.exists = false;
		if(o.hitpoints !== undefined) {
			//spawn visual effect on hit
			o.hitpoints -= this.damage;
			o.exists = o.hitpoints <= 0 ? false : true;
			//console.log('hitpoints left: ', o.hitpoints);
		}
	}
	Bolt.prototype.location = function() {
		return this.state.slice(12,15);
	}
	
	function Throttle(o) {
		this.exists = true;
		this.isPlayer = false;
		
		var s = o.state.slice();
		this.state = s;
		this.size = 10;
		this.nodes = [];
		
		var model = new Model('throttle');
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		this.TTL = 20;
		this.fadeRatio = 0.7;

		this.state = m4.translate(this.state, 0, 0, -o.size*2);
		setNodes(this);
		this.list = o.list;
		o.list.push(this);
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