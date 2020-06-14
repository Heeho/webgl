'use strict';
function Effect(o) {
		Thing.call(this, o);
		this.TTL = 22;
		this.decay = .9;
	}
	Effect.prototype = Object.create(Thing.prototype);
	Effect.prototype.constructor = Effect;
	Effect.prototype.act = function() 
		{			
			if(this.TTL == 0) {this.exists = false;} else {
				this.state.matrix = m4.scale(this.state.matrix, this.decay, this.decay, this.decay);
				this.TTL--;
			}
		}

function Explosion(o) {	
		Effect.call(this, o);
		this.state.matrix = o.state.matrix.slice();
		this.state.matrix = m4.scale(this.state.matrix, o.model.size, o.model.size, o.model.size);
		this.state.velocity = o.state.velocity;
		this.objlist.effects.explosion.instances.push(this);
	} 
	Explosion.prototype = Object.create(Effect.prototype);
	Explosion.prototype.constructor = Explosion;

function Forcefield(o, projectile) {	
		Effect.call(this, o);
		this.TTL = 2;
		this.decay = .8;
		this.state.matrix = o.state.matrix.slice();
		this.state.matrix = m4.yRotate(m4.lookAt(o.state.location(), projectile.state.location(), [0,1,0,]), degToRad(180));
		this.state.matrix = m4.scale(this.state.matrix, o.model.size, o.model.size, o.model.size);
		this.state.velocity = o.state.velocity;
		this.objlist.effects.forcefield.instances.push(this);
	} 
	Forcefield.prototype = Object.create(Effect.prototype);
	Forcefield.prototype.constructor = Shield;
	Forcefield.prototype.act = function() 
		{			
			if(this.TTL == 0) {this.exists = false;} else {
				this.state.matrix = m4.scale(this.state.matrix, this.decay, this.decay, 1);
				//this.state.matrix = m4.xRotate(this.state.matrix, 1);
				//this.state.matrix = m4.yRotate(this.state.matrix, 1);
				//this.state.matrix = m4.zRotate(this.state.matrix, 1);
				this.TTL--;
			}
		}

function Throttle(o) {
		Effect.call(this, o);
		this.state.matrix = o.state.matrix.slice();
		this.state.matrix = m4.translate(this.state.matrix, 0, 0, o.rear);
		this.state.velocity = v3.add(o.state.velocity, v3.multiply(o.state.direction(), -o.acceleration));
		this.objlist.effects.throttle.instances.push(this);
	} 
	Throttle.prototype = Object.create(Effect.prototype);
	Throttle.prototype.constructor = Throttle;

function Flash(o) {
		Effect.call(this, o);
		this.state.matrix = o.state.matrix.slice();
		this.state.matrix = m4.translate(this.state.matrix, 0, 0, o.rear);
		this.state.velocity = v3.add(o.state.velocity, v3.multiply(o.state.direction(), -o.acceleration));
		this.objlist.effects.flash.instances.push(this);
	} 
	Flash.prototype = Object.create(Effect.prototype);
	Flash.prototype.constructor = Flash;
