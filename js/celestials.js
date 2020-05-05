'use strict';
function Celestial(c) {
		Thing.call(this);
		c.push(this);
	}
	Celestial.prototype = Object.create(Thing.prototype);
	Celestial.prototype.constructor = Celestial;
	Celestial.prototype.onCollision = function(o, pen) 
		{
			var pn = v3.normalize(pen);
			var repulsion = v3.multiply(pn, (-this.acceleration - 2*v3.dot(this.state.velocity, pn)));
			this.state.velocity = v3.add(this.state.velocity, repulsion);
		}
	Celestial.prototype.act = function() 
		{
			//revolve;
		}
	
function Sun(c) {
		Celestial.call(this, c);
		this.setmodel(models.sun);
		this.mass = 332982 * 5.97 * 10 ** 24;
		this.state.matrix = m4.translate(this.state.matrix, 149597870700, 0, 0);
	}
	Sun.prototype = Object.create(Celestial.prototype);
	Sun.prototype.constructor = Sun;
	
function Planet(c) {
		Celestial.call(this, c);
		this.setmodel(models.planet);
		this.mass = 5.97 * 10 ** 24;
		this.state.matrix = m4.translate(this.state.matrix, 0, 0, this.model.size + 30000);
	}
	Planet.prototype = Object.create(Celestial.prototype);
	Planet.prototype.constructor = Planet;
	
function Moon(c) {
		Celestial.call(this, c);
		this.mass = 7.36 * 10 ** 22;
	}
	Moon.prototype = Object.create(Celestial.prototype);
	Moon.prototype.constructor = Moon;
	
function Asteroid(c) {
		Celestial.call(this);
	}
	Asteroid.prototype = Object.create(Celestial.prototype);
	Asteroid.prototype.constructor = Asteroid;