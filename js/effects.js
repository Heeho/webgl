'use strict';
function Effect(o) {
		Thing.call(this);
		o.effects.push(this);
	}
	Effect.prototype = Object.create(Thing.prototype);
	Effect.prototype.constructor = Effect;
	Effect.prototype.act = function() 
		{			
			if(this.TTL == 0) {this.exists = false;} else {
				this.nodes = this.model.nodesbank[this.model.nodesbank.length - this.TTL];
				this.TTL--;
			}
		}	

function Explosion(o) {	
		Effect.call(this, o);	
		this.state.matrix = o.state.matrix.slice();
		this.state.velocity = v3.add(o.state.velocity, v3.multiply(o.state.direction(), -o.acceleration));
		
		this.setmodel(models.explosion);

		//this.state.matrix = m4.translate(this.state.matrix, 0, 0, -o.model.size*2);
	} 
	Explosion.prototype = Object.create(Effect.prototype);
	Explosion.prototype.constructor = Explosion;	
	
function Throttle(o) {
		Effect.call(this, o);
		this.state.matrix = o.state.matrix.slice();
		this.state.velocity = v3.add(o.state.velocity, v3.multiply(o.state.direction(), -o.acceleration));
		
		this.setmodel(models.throttle);

		this.state.matrix = m4.translate(this.state.matrix, 0, 0, -o.model.size*2);
	} 
	Throttle.prototype = Object.create(Effect.prototype);
	Throttle.prototype.constructor = Throttle;	
