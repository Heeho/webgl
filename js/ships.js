'use strict';
function Ship(o) {
		//primary
		Thing.call(this, o);
		//this.mass = 10;

		this.isPlayer = false;

		this.target = null;
		this.autopilotwinding = [];
		this.autopilotrange2 = 6400 ** 2;
		this.lineoffire = null;

		//controls
		this.controls = new Controls();

		//engine
		this.acceleration = 2;

		//energy
		this.energyCap = 100;
		this.energyGain = 2;
		this.energy = this.energyCap;
		
		//energy cost
		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 10;

		//shield
		this.shield = new Shield();
		
		//hull
		this.hitpoints = 1;
	}
	Ship.prototype = Object.create(Thing.prototype);
	Ship.prototype.constructor = Ship;
	Ship.prototype.onCollision = function(o, pen) 
		{
			var pn = v3.normalize(pen);
			var repulsion = v3.multiply(pn, (-this.acceleration - 2*v3.dot(this.state.velocity, pn)));
			this.state.velocity = v3.add(this.state.velocity, repulsion);
		}
	Ship.prototype.accelerate = function(effect) 
		{
			if(this.energy >= this.accelerateCost) {
				this.energy -= this.accelerateCost;
				this.state.velocity = v3.add(this.state.velocity, v3.multiply(this.state.direction(), this.acceleration));
			}
		}
	Ship.prototype.brake = function(effect) 
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
	Ship.prototype.secondary = function() 
		{		

		}
	Ship.prototype.autopilotX = function() 
		{
			var correction = v3.multiply(v3.substract(this.target.state.velocity, this.state.velocity), 11);
			this.autopilotwinding[0] = v3.dot(v3.cross(this.state.X(), this.lineoffire), this.state.Y()) > 0 ? -1 : 1;
			this.controls.mousepos[0] += v3.dot(this.state.X(), v3.normalize(v3.add(this.lineoffire, correction))) * this.autopilotwinding[0]; //console.log('measure: ', measure);
		}
	Ship.prototype.autopilotY = function() 
		{	
			var correction = v3.multiply(v3.substract(this.target.state.velocity, this.state.velocity), 11);
			this.autopilotwinding[1] = v3.dot(v3.cross(this.state.Y(), this.lineoffire), this.state.X()) > 0 ? 1 : -1;
			this.controls.mousepos[1] += v3.dot(this.state.Y(), v3.normalize(v3.add(this.lineoffire, correction))) * this.autopilotwinding[1]; //console.log('measure: ', measure);
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
			var offset = 0;
			
			var list = [];
			list = this.objlist.ships.interceptor.instances.concat(this.objlist.ships.carrier.instances); /*
			for(var i in this.objlist.ships) {
				list = list.concat(this.objlist.ships[i].instances);
			} //console.log(list);
			//*/
			
			var i = list.indexOf(this.target);
			i = i == -1 ? 0 : i;
			this.target = i + 1 < list.length ? list[i + 1] : list[offset]; //console.log(list, i);
			
			this.controls.changetarget = (!this.target.exists || this.target == undefined || this == this.target) ? true : false;
		}
	Ship.prototype.ai = function() 
		{
			var up = [0,1,0];
			this.state.matrix = m4.yRotate(m4.lookAt(this.state.location(), this.target.state.location(), up), degToRad(180));

			var outofrange = v3.vlength2(this.lineoffire) > this.autopilotrange2 / 6;
			var wrongdirection = v3.dot(v3.normalize(this.state.velocity), v3.normalize(this.lineoffire)) < 0;
			var toofast = v3.vlength(this.state.velocity) > 22;

			//chase, aim, shoot
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
			
			//strafe
			var frontanglecos = .5;
			var infront = v3.dot(v3.normalize(this.lineoffire), this.target.state.direction()) < frontanglecos; //console.log(infront);
			var onleft = v3.dot(v3.normalize(this.lineoffire), this.target.state.X()) >= 0;
			if(infront) {
				var strafedirection = v3.cross(v3.normalize(this.lineoffire), this.target.state.Y());
				var strafe = v3.multiply(strafedirection , this.acceleration/2);
				if(onleft) {
					this.state.velocity = v3.add(this.state.velocity, v3.inverse(strafe)); //v3.dot(this.lineoffire, target.state.direction()) -1 +- 
					this.accelerate(new Flash(this));
				} else {
					this.state.velocity = v3.add(this.state.velocity, strafe);
				}
			}		
		}
	Ship.prototype.getdamage = function(o) 
		{
			if(this.shield.amount >= o.damage) {
				this.shield.amount -= o.damage;
				var e = new Forcefield(this, o);
			} else {
				this.shield.amount = 0;
				this.hitpoints -= o.damage - this.shield.amount;
				var e = new Explosion(this);
			}
			if(this.hitpoints <= 0) {this.die();} //console.log(this, 'hitpoints, shield: ', this.hitpoints, this.shield.amount);
		}
	Ship.prototype.die = function() 
		{
			this.exists = false;
			statistics[0] ++;
		}

function Fighter(o) {
		Ship.call(this, o);
		this.model = models.ships.fighter;
		this.front = this.model.radius;
		this.rear = -this.model.radius / 3;
		this.hitpoints = 4;
		this.controls.autopilotON = true; //this.controls.changetarget = true;
		this.objlist.ships.fighter.instances.push(this);
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
			this.shield.regenerate(); //console.log(this.shield.amount);

			this.controls.lockedontarget = (!this.autopilotON && v3.vlength2(this.lineoffire) > this.autopilotrange2) ? false : true;

			if(this.controls.autopilotON && this.controls.lockedontarget) {
				this.autopilotY();
			}	
			if(this.controls.changetarget || !this.target.exists || this.target == undefined) {
				this.changetarget();
			}
			//this.ai();/*
			this.state.rotation[1] = 
				this.controls.turnLeft ? -this.controls.rotationspeed[1] :
				this.controls.turnRight ? this.controls.rotationspeed[1] :
				this.controls.lockedontarget ? this.controls.mousepos[0] * this.controls.rotationspeed[2] :
				this.state.rotation[1];

			if(this.controls.shootON)		{this.shoot();}	
			if(this.controls.accelerateON)	{this.accelerate(new Throttle(this));}
			if(this.controls.brakesON)		{this.brake(new Throttle(this));}//*/
		}
	Fighter.prototype.die = function() 
		{
			this.exists = false;
			score(`Eventually you sucked!`);
		}

function Carrier(o) {
		Ship.call(this, o);
		this.model = models.ships.carrier;
		this.front = this.model.radius;
		this.rear = -this.model.radius / 2;

		this.controls.secondaryON = true;
		this.energyCap = 666;
		this.energyGain = 1;
		this.energy = this.energyCap;

		this.accelerateCost = 2;
		this.brakesCost = 2;
		this.shootCost = 15;
		this.secondaryCost = 666;

		this.acceleration = 1;
		this.hitpoints = 999;
		
		this.shield.capacity = 10;
		
		this.state.matrix = [
			1,	0,	0,	0,
			0,	1,	0,	0,
			0,	0,	1,	0,
			20000,0,0,  1,
		];

		this.gunpoint = v3.add(this.state.location(), v3.multiply(this.state.direction(), models.ships.carrier.size));
		this.objlist.ships.carrier.instances.push(this);
	}
	Carrier.prototype = Object.create(Ship.prototype);
	Carrier.prototype.constructor = Carrier;

	Carrier.prototype.act = function() 
		{
			this.shield.regenerate();
			
			this.energy += this.energy < this.energyCap ? this.energyGain : this.energy > this.energyCap ? -1 : 0; //console.log(this.energy);
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
		{ //console.log('carrier secondary');
			var i = new Interceptor(this); //console.log(i);
		}

function Interceptor(o) {
		Ship.call(this, o);
		this.model = models.ships.interceptor;
		this.front = this.model.radius;
		this.rear = -this.model.radius / 3;

		this.target = o.target;
		this.controls.autopilotNO = true;
		this.controls.lockedontarget = true;

		this.acceleration = 2;
		this.hitpoints = 1;
		this.beamrange2 = this.autopilotrange2 / 3;
		this.shootCost = 30;

		this.state.matrix = m4.translate(o.state.matrix, 0, 0, o.rear);

		this.state.velocity = v3.add(o.state.velocity, v3.multiply(o.state.direction(), 50));

		this.gunpoint = v3.add(this.state.location(), v3.multiply(this.state.direction(), models.ships.interceptor.size));
		this.objlist.ships.interceptor.instances.push(this);
	}
	Interceptor.prototype = Object.create(Ship.prototype);
	Interceptor.prototype.constructor = Interceptor;
	Interceptor.prototype.act = function() 
		{
			this.updatelineoffire();
			this.updateenergy();

			this.ai();
		}