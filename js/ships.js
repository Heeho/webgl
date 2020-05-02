'use strict';
function Ship(objects, projectiles, effects) {
		//primary
		Thing.call(this);

		this.isPlayer = false;
		
		this.target = null;
		this.autopilotwinding = 0;
		this.lineoffire = null;
		
		this.controls = new Controls();

		//engine
		this.acceleration = 4;
		
		//energy
		this.energyCap = 100;
		this.energyGain = 2;
		this.energy = this.energyCap;		
		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 15;	

		//put
		this.objects = objects;
		this.projectiles = projectiles;
		this.effects = effects;
		this.objects.push(this);
	}
	Ship.prototype = Object.create(Thing.prototype);
	Ship.prototype.constructor = Ship;
	Ship.prototype.onCollision = function(o, pen) 
		{
			var pn = v3.normalize(pen);
			var repulsion = v3.multiply(pn, (-this.acceleration*2 - 2 * v3.dot(this.state.velocity, pn)));
			this.state.velocity = v3.add(this.state.velocity, repulsion);
		}
	Ship.prototype.settarget = function(o) 			
		{		
			this.target = o;
			this.lineoffire = v3.substract(this.target.state.location(), this.state.location());
		}
	Ship.prototype.accelerate = function() 
		{
			this.state.velocity = v3.add(this.state.velocity, v3.multiply(this.state.direction(), this.acceleration));
			var t = new Throttle(this);
		}
	Ship.prototype.brake = function() 
		{
			this.state.velocity = v3.multiply(this.state.velocity, 0.9);
			var t = new Throttle(this);
		}
	Ship.prototype.shoot = function() 
		{
			
		}
	Ship.prototype.initautopilot = function() 
		{
		}
	Ship.prototype.autopilot = function() 
		{
			this.autopilotwinding = v3.dot(v3.cross(this.state.Y(), this.lineoffire), this.state.X()) > 0 ? 1 : -1;
			
			var measure = v3.dot(this.state.Y(), v3.normalize(this.lineoffire));
			console.log('measure: ', measure);
			this.controls.mousepos[1] += measure == 0 ? 0 : measure*this.autopilotwinding;
		}
		
function Fighter(objects, projectiles, effects) {
		this.setmodel(models.fighter);
		Ship.call(this, objects, projectiles, effects);
	}
	Fighter.prototype = Object.create(Ship.prototype);
	Fighter.prototype.constructor = Fighter;
	Fighter.prototype.act = function() 
		{
			this.lineoffire = this.lineoffire == null ? null : v3.substract(this.target.state.location(), this.state.location());
			
			this.energy += this.energy < this.energyCap ? this.energyGain : this.energy > this.energyCap ? -1 : 0;		

			if(this.controls.lockedontarget) {
				this.autopilot();
			}
			
			this.state.rotation[0] -= this.controls.mousepos[1]*this.controls.rotationspeed[0];			
			this.state.rotation[2] += this.controls.mousepos[0]*this.controls.rotationspeed[2];
			
			if(this.controls.mousepos[0] > 0) {this.controls.mousepos[0] -= 1;} 
			if(this.controls.mousepos[0] < 0) {this.controls.mousepos[0] += 1;}
			
			if(this.controls.mousepos[1] < 1 && this.controls.mousepos[1] > -1) {this.controls.mousepos[1] = 0;}
			if(this.controls.mousepos[1] > 0) {this.controls.mousepos[1] -= 1;}
			if(this.controls.mousepos[1] < 0) {this.controls.mousepos[1] += 1;}	
			
			
			if(this.controls.turnLeft) {
				this.state.rotation[1] = -this.controls.rotationspeed[1];
			}
			if(this.controls.turnRight) {
				this.state.rotation[1] = this.controls.rotationspeed[1];
			}
			if(this.controls.accelerateON && this.energy > this.accelerateCost) {
				this.energy -= this.accelerateCost;
				this.accelerate();
			}
			if(this.controls.shootON && this.energy >= this.shootCost) {
				this.energy -= this.shootCost;
				this.shoot();
			}	
			if(this.controls.brakesON && this.energy >= this.brakesCost) {
				this.energy -= this.brakesCost;
				this.brake();
			}
		}
	Fighter.prototype.accelerate = function() 
		{
			this.state.velocity = v3.add(this.state.velocity, v3.multiply(this.state.direction(), this.acceleration));
			var t = new Throttle(this);
		}
	Fighter.prototype.brake = function() 
		{
			this.state.velocity = v3.multiply(this.state.velocity, 0.9);
			var t = new Throttle(this);
		}
	Fighter.prototype.shoot = function()
		{
			var b = new Bolt(this);
		}
		
function Carrier(objects, projectiles, effects) {
		this.setmodel(models.carrier);
		Ship.call(this, objects, projectiles, effects);
		
		this.controls.secondaryON = true;
		this.energyCap = 1000;
		this.energyGain = 1;
		this.energy = this.energyCap;
		
		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 15;	
		this.secondaryCost = 1000;	
				
		this.acceleration = 1;
		this.hitpoints = 999;		
		
		this.state.matrix = [
			1,	0,	0,	0,
			0,	1,	0,	0,
			0,	0,	1,	0,
			0,	0,-10000,1,
		];		
	}
	Carrier.prototype = Object.create(Ship.prototype);
	Carrier.prototype.constructor = Carrier;
	
	Carrier.prototype.act = function() 
		{
			this.energy += this.energy < this.energyCap ? this.energyGain : this.energy > this.energyCap ? -1 : 0;
			//console.log(this.energy);
			if(this.controls.secondaryON && this.energy >= this.secondaryCost) {
				this.energy -= this.secondaryCost;
				this.secondary();
			}	
		}
	Carrier.prototype.shoot = function() 
		{
			var b = new Blaster(this);
		}
	Carrier.prototype.secondary = function() 
		{
			//console.log('carrier secondary');
			var i = new Interceptor(this);
			//console.log(i);
		}
	
function Interceptor(o) {
		this.setmodel(models.interceptor);
		Ship.call(this, o.objects, o.projectiles, o.effects);
		
		this.state.matrix = m4.translate(o.state.matrix, 0, 0, o.model.size + this.model.size);
		
		this.target = o.target;
		this.reaction = 0;
		this.reactionCap = 10;
		
		this.acceleration = 4;
		this.speed = 40;
		this.controls.rotationspeed = [6, 0.15, 6];		
		this.hitpoints = 5;
		
		this.model = models.interceptor;
		
		this.state.matrix = m4.translate(this.state.matrix, 0, 0, this.model.size*12);		
	}
	Interceptor.prototype = Object.create(Ship.prototype);
	Interceptor.prototype.constructor = Interceptor;
	Interceptor.prototype.act = function() 
		{
			var destination = this.target.state.location();
			var direction = v3.normalize(v3.substract(destination, this.state.location()));
			
			if(v3.dot(this.target.state.velocity, direction) > 0) {}
			if(v3.dot(this.target.state.direction(), this.state.direction()) > 0) {}
		}
	Interceptor.prototype.shoot = function() 
		{
			//shoot beam
		}