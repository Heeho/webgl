'use strict';
function Ship(objects, projectiles, effects) {
		//primary
		Thing.call(this);

		this.mass = this.mass * this.model.size;
		
		this.isPlayer = false;
		
		this.target = null;
		this.autopilotwinding = [];
		this.autopilotrange2 = 6400 ** 2;
		this.lineoffire = null;
		
		this.controls = new Controls();

		//engine
		this.acceleration = 2;
		
		//energy
		this.energyCap = 100;
		this.energyGain = 2;
		this.energy = this.energyCap;		
		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 10;	

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
			var repulsion = v3.multiply(pn, (-this.acceleration - 2*v3.dot(this.state.velocity, pn)));
			this.state.velocity = v3.add(this.state.velocity, repulsion);
		}
	Ship.prototype.accelerate = function(e) 
		{
			if(this.energy >= this.accelerateCost) {
				this.energy -= this.accelerateCost;
				this.state.velocity = v3.add(this.state.velocity, v3.multiply(this.state.direction(), this.acceleration));
			}
		}
	Ship.prototype.brake = function(e) 
		{
			if(this.energy >= this.brakesCost) {
				this.energy -= this.brakesCost;
				this.state.velocity = v3.multiply(this.state.velocity, 0.9);
			}
		}
	Ship.prototype.shoot = function() 
		{
			if(this.energy >= this.shootCost) {
				this.energy -= this.shootCost;
				var p = new Bolt(this);
			}
		}
	Ship.prototype.autopilotX = function() 
		{
			var correction = v3.multiply(v3.substract(this.target.state.velocity, this.state.velocity), 11);
			this.autopilotwinding[0] = v3.dot(v3.cross(this.state.X(), this.lineoffire), this.state.Y()) > 0 ? -1 : 1;			
			this.controls.mousepos[0] += v3.dot(this.state.X(), v3.normalize(v3.add(this.lineoffire, correction))) * this.autopilotwinding[0];
			//console.log('measure: ', measure);
		}
	Ship.prototype.autopilotY = function() 
		{	
			var correction = v3.multiply(v3.substract(this.target.state.velocity, this.state.velocity), 11);
			this.autopilotwinding[1] = v3.dot(v3.cross(this.state.Y(), this.lineoffire), this.state.X()) > 0 ? 1 : -1;			
			this.controls.mousepos[1] += v3.dot(this.state.Y(), v3.normalize(v3.add(this.lineoffire, correction))) * this.autopilotwinding[1];
			//console.log('measure: ', measure);
		}
	Ship.prototype.updateenergy = function() 
		{
			this.energy += this.energy < this.energyCap ? this.energyGain : this.energy > this.energyCap ? -1 : 0;
		}
	Ship.prototype.updatelineoffire = function() 
		{
			this.lineoffire = this.target == null ? null : v3.substract(this.target.state.location(), this.state.location());
		}		
	Ship.prototype.changetarget = function() 
		{
			var offset = 1;
			var i = this.objects.indexOf(this.target);
			i = i == -1 ? 0 : i;
			this.target = i + 1 < this.objects.length ? this.objects[i + 1] : this.objects[offset];
			this.controls.changetarget = false;
		}
	Ship.prototype.ai = function() 
		{
			var up = [0,1,0];
			this.state.matrix = m4.yRotate(m4.lookAt(this.state.location(), this.target.state.location(), up), degToRad(180));	
			
			var outofrange = v3.vlength2(this.lineoffire) > this.autopilotrange2 / 6;
			var wrongdirection = v3.dot(v3.normalize(this.state.velocity), v3.normalize(this.lineoffire)) < 0;
			var toofast = v3.vlength(this.state.velocity) > 22;
			
			if(outofrange) {
				if(wrongdirection) {
					if(toofast) {
						this.brake();
					} else {
						this.accelerate(new Flash(this));
					}
				} else {
					this.accelerate(new Flash(this));
				}
			} else {
				this.shoot();
			}
				
			var onlineoffire = v3.dot(v3.normalize(this.lineoffire), this.target.state.X()) > this.model.radius2;
		}
		
function Fighter(objects, projectiles, effects) {
		this.setmodel(models.fighter);
		Ship.call(this, objects, projectiles, effects);
	}
	Fighter.prototype = Object.create(Ship.prototype);
	Fighter.prototype.constructor = Fighter;
	Fighter.prototype.act = function() 
		{
			this.state.rotation[0] -= this.controls.mousepos[1] * this.controls.rotationspeed[0];			
			this.state.rotation[2] += this.controls.mousepos[0] * this.controls.rotationspeed[2];
			this.controls.updatemousepos();
			this.updatelineoffire();
			this.updateenergy();
			
			this.controls.lockedontarget = (!this.autopilotON && v3.vlength2(this.lineoffire) > this.autopilotrange2) ? false : true;
			
			if(this.controls.autopilotON && this.controls.lockedontarget) {
				this.autopilotY();
			}	
			if(this.controls.changetarget) {
				this.changetarget();
			}
			
			this.state.rotation[1] = 
				this.controls.turnLeft ? -this.controls.rotationspeed[1] :
				this.controls.turnRight ? this.controls.rotationspeed[1] :
				this.controls.lockedontarget ? this.controls.mousepos[0] * this.controls.rotationspeed[2] :
				this.state.rotation[1];
			
			if(this.controls.accelerateON)	{this.accelerate(new Throttle(this));}
			if(this.controls.brakesON)		{this.brake(new Throttle(this));}
			if(this.controls.shootON)		{this.shoot();}	
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

		this.target = o.target;
		this.controls.autopilotNO = true;
		this.controls.lockedontarget = true;
		
		this.acceleration = 1;	
		this.hitpoints = 1;
		this.beamrange2 = this.autopilotrange2 / 3;
		this.shootCost = 30;
		
		this.state.matrix = m4.translate(this.state.matrix, 0, 0, this.model.size*12);
	}
	Interceptor.prototype = Object.create(Ship.prototype);
	Interceptor.prototype.constructor = Interceptor;
	Interceptor.prototype.act = function() 
		{
			this.updatelineoffire();
			this.updateenergy();		
						
			this.ai();
			
			//var destination = this.target.state.location();
			//var direction = v3.normalize(this.lineoffire);
		}