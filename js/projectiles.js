'use strict';
function Projectile(o) {
		Thing.call(this);
		this.damage = 1;
		o.projectiles.push(this);
	}
	Projectile.prototype = Object.create(Thing.prototype);
	Projectile.prototype.constructor = Projectile;
	Projectile.prototype.act = function() 
		{
			if(this.TTL == 0) {this.exists = false;} else {
				this.TTL--;
			}
		}
	Projectile.prototype.onCollision = function(o, pen) 
		{
			o.hitpoints -= this.damage;
			o.exists = o.hitpoints <= 0 ? false : true;
			var e = new Explosion(o);
			this.exists = false;
		}
	
function Bolt(o) {
		Projectile.call(this, o);
		this.setmodel(models.bolt);		
		var a = (Math.random() - .5)*33;
		var b = (Math.random() - .5)*33;		
		this.state.matrix = m4.translate(o.state.matrix, a, b, o.model.size*10 + this.model.TTL*o.acceleration);			
		this.state.velocity = v3.add(o.state.velocity, v3.multiply(o.state.direction(), 50));
	}
	Bolt.prototype = Object.create(Projectile.prototype);
	Bolt.prototype.constructor = Bolt;