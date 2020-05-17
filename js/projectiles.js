'use strict';
function Projectile(o) {
		Thing.call(this, o);
		this.damage = 2;
		this.TTL = 3;
		this.decay = .95;
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
			if(o.exists) {o.getdamage(this);}
			this.exists = false;
		}

function Bolt(o) {
		Projectile.call(this, o);
		var xdeviation = 11;
		var ydeviation = 11;
		var rand = 2 * (Math.random() - .5);

		this.state.matrix = o.state.matrix.slice();
		this.state.matrix = m4.translate(this.state.matrix, rand * xdeviation, rand * ydeviation, o.front + this.TTL * o.acceleration * 2);
		this.state.velocity = v3.add(o.state.velocity, v3.multiply(o.state.direction(), this.TTL * o.acceleration));

		this.objlist.projectiles.bolt.instances.push(this);
	}
	Bolt.prototype = Object.create(Projectile.prototype);
	Bolt.prototype.constructor = Bolt;