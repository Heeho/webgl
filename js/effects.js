'use strict';
function Effect(o) {
		Thing.call(this, o);
		this.TTL = 11;
		this.decay = .8;
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
		this.state.velocity = o.state.velocity;
		this.objlist.effects.explosion.instances.push(this);
	} 
	Explosion.prototype = Object.create(Effect.prototype);
	Explosion.prototype.constructor = Explosion;

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
