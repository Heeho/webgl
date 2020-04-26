'use strict';
	function Fighter(objects, projectiles, effects) {
		this.exists = true;
		this.isPlayer = true;
		
		this.target = null;
		this.lineoffire = null;
				
		this.turnLeft = false;
		this.turnRight = false;
		this.accelerateON = false;
		this.brakesON = false;	
		this.shootON = false;		

		this.lockedontarget = false;
		this.mousecontrol = [0, 0];
		this.autopitchwinding = 0;
		
		this.energyCap = 100;
		this.energyGain = 2;
		this.energy = this.energyCap;		
		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 15;	

		this.rotationspeed = [	
			.1, 
			.1,
			.1,
		];		
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
		this.drafthitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		setNodes(this);
		
		this.objects = objects;
		this.projectiles = projectiles;
		this.effects = effects;
		this.objects.push(this);
	}
	Fighter.prototype.onCollision = function(o, pen) {
		var pn = v3.normalize(pen);
		var repulsion = v3.multiply(pn, (-this.acceleration - 2 * v3.dot(this.velocity, pn)));
		this.velocity = v3.add(this.velocity, repulsion);
	}
	Fighter.prototype.act = function() {
		this.lineoffire = this.lineoffire == null ? null : v3.substract(this.target.location(), this.location());
		
		this.energy += this.energy < this.energyCap ? this.energyGain : this.energy > this.energyCap ? -1 : 0;		
		//console.log('energy: ', this.energy);
		
		//console.log('mouse: ', this.mousecontrol);
			
		if(this.lockedontarget) {this.autopitch();}
			
		this.rotation[0] -= this.mousecontrol[1]*this.rotationspeed[0];
		this.rotation[2] += this.mousecontrol[0]*this.rotationspeed[2];
		
		if(this.mousecontrol[0] > 0) {this.mousecontrol[0] -= 1;} 
		if(this.mousecontrol[1] > 0) {this.mousecontrol[1] -= 1;}
		if(this.mousecontrol[0] < 0) {this.mousecontrol[0] += 1;}
		if(this.mousecontrol[1] < 0) {this.mousecontrol[1] += 1;}	
		
		if(this.turnLeft) {
			this.rotation[1] = -this.rotationspeed[1];
		}
		if(this.turnRight) {
			this.rotation[1] = this.rotationspeed[1];
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
	Fighter.prototype.autopitch = function() {
		var measure = v3.dot(this.state.slice(4,7), v3.normalize(this.lineoffire));
		this.mousecontrol[1] += 
			measure >  this.rotationspeed[0]/2?  this.autopitchwinding: 
			measure < -this.rotationspeed[0]/2? -this.autopitchwinding: 
			0; //
	}
	Fighter.prototype.initautopitch = function() {
		this.autopitchwinding = v3.dot(v3.cross(this.state.slice(4,7), this.lineoffire), this.state.slice(0,3)) ? 1 : -1;
	}
	Fighter.prototype.settarget = function(o) {
		this.target = o;
		this.lineoffire = v3.substract(this.target.location(), this.location());
	}

	function Bolt(o) {
		this.exists = true;
		this.isPlayer = false;
		
		var s = o.state.slice();
		
		this.state = s;
		this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), 50));
		this.velocity = o.velocity.slice();
		
		this.size = 5;
		this.currentHitbox = [];
		this.hitbox = [];
		this.nodes = [];		
		var model = new Model('bolt');
		this.drafthitbox = model.drafthitbox;
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		this.TTL = 25;
		this.fadeRatio = 0.95;
		this.damage = 1;
		
		this.state = m4.translate(this.state, 0, 0, o.size*7);
		
		var a = (1-Math.random())*.03;
		var b = (1-Math.random())*.03;
		//console.log(a, b);
		this.state = m4.xRotate(this.state, a);
		this.state = m4.yRotate(this.state, b);
		setNodes(this);

		o.projectiles.push(this);
	}
	Bolt.prototype.act = function() {
		//if(this.TTL-- == 0) {this.exists = false;}
		if(this.TTL-- == 0 || this.size == 0) {this.exists = false;} else {
			//this.size *= this.fadeRatio;
			this.draftnodes[3] *= this.fadeRatio;
			this.draftnodes[6] *= this.fadeRatio;
			setNodes(this);
		}
	}
	Bolt.prototype.onCollision = function(o, pen) {
		//spawn visual effect on hit
		o.hitpoints -= this.damage;
		o.exists = o.hitpoints <= 0 ? false : true;
		var explosion = new Explosion(o);
		//console.log('hitpoints left: ', o.hitpoints);
		this.exists = false;
	}
	Bolt.prototype.location = function() {
		return this.state.slice(12,15);
	}
	
	function Explosion(o) {
		this.exists = true;
		this.isPlayer = false;
		
		var s = o.state.slice();
		this.state = s;
		this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), -o.acceleration));
		
		this.size = 44;
		this.nodes = [];
		
		var model = new Model('explosion');
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		this.TTL = 20;
		this.fadeRatio = 0.85;

		this.state = m4.translate(this.state, 0, 0, -o.size*2);
		setNodes(this);

		o.effects.push(this);
		//console.log(o.effects);
	} 
	Explosion.prototype.act = function() {
		if(this.TTL-- == 0 || this.size == 0) {this.exists = false;} else {
			this.size *= this.fadeRatio;
			setNodes(this);
		}
	}
	
	function Throttle(o) {
		this.exists = true;
		this.isPlayer = false;
		
		var s = o.state.slice();
		this.state = s;
		this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), -o.acceleration));
		
		this.size = 8;
		this.nodes = [];
		
		var model = new Model('throttle');
		this.draftnodes = model.draftnodes;
		this.colors = model.colors;
		
		this.TTL = 20;
		this.fadeRatio = 0.85;

		this.state = m4.translate(this.state, 0, 0, -o.size*2);
		setNodes(this);

		o.effects.push(this);
		//console.log(o.effects);
	} 
	Throttle.prototype.act = function() {
		if(this.TTL-- == 0 || this.size == 0) {this.exists = false;} else {
			this.size *= this.fadeRatio;
			setNodes(this);
		}
	}