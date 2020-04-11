'use strict';
	function Fighter(list) {
		this.isPlayer = true;
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
			0,	0,-250,	1,
		];
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
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//sides
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//hood
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//buttocks		
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//front		
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//upper jaws		
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//butt
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//bottom
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//bottom sides
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//bottom wings
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//bottom front
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			//bottom jaws
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
			Math.random()*55,Math.random()*35,Math.random()*155,
		];
		setNodes(this);
		this.list = list;
		this.list.push(this);
	}
	Fighter.prototype.act = function() {
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

	Fighter.prototype.direction = function() {
		return this.state.slice(8,11);
	} 
	Fighter.prototype.location = function() {
		return this.state.slice(12,15);
	}
	Fighter.prototype.accelerate = function() {
		this.velocity = v3.add(this.velocity, v3.multiply(this.direction(), this.acceleration));
		//gameObjects.push(new Throttle(this));
		var throttle = new Throttle(this);
	} 
	Fighter.prototype.brake = function() {
		this.velocity = v3.multiply(this.velocity, 0.9);
		//gameObjects.push(new Throttle(this));
		var throttle = new Throttle(this);
	} 		
	Fighter.prototype.shoot = function() {
		//gameObjects.push(new Bolt(this));
		var bolt = new Bolt(this);
	}

	function Bolt(o) {
		this.isPlayer = false;
		var s = o.state.slice();
		this.state = s;
		this.velocity = v3.add(o.velocity, v3.multiply(o.direction(), 100));
		this.size = 5;
		this.currenthitbox = [];
		this.hitbox = [];
		this.drafthitbox = [
			0,	0,	0,
			1,	0,	6,
			-1,	0,	6,			
		];
		this.nodes = [];
		this.draftnodes = [
			0,	0,	0,
			1,	0,	6,
			-1,	0,	6,
			
			//0,	0,	0,
			//-1,	0,	6,
			//1,	0,	6,
		];
		this.colors = [
			1, 255,  1,
			1, 255,  1,
			1, 255,  1,
			
			//1, 255,  1,
			//1, 255,  1,
			//1, 255,  1,
		];
		this.TTL = 15;
		this.exists = true;
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
	
	function Throttle(o) {
		this.isPlayer = false;
		var s = o.state.slice();
		this.state = s;
		this.size = 10;
		this.nodes = [];
		this.draftnodes = [				
			0,	0,	-1,
			0,	-1,	0, 				
			-1,	0,	0,
			
			0,	0,	-1,
			1,	0,	0,
			0,	-1,	0, 
			
			0,	0,	-1,
			-1,	0,	0, 				
			1,	0,	0, 	
			
			-1,	0,	0, 
			0,	-1,	0, 				
			1,	0,	0,
		];
		this.colors = [
			255, 1,  1,
			255, 1,  1,
			255, 1,  1,
			
			255, 1,  1,
			255, 1,  1,
			255, 1,  1,
			
			255, 1,  1,
			255, 1,  1,
			255, 1,  1,			

			255, 1,  1,
			255, 1,  1,
			255, 1,  1,				
		];
		this.TTL = 20;
		this.fadeRatio = 0.7;
		this.exists = true;
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