'use strict';
function Celestial(o) {
		Thing.call(this, o);
	}
	Celestial.prototype = Object.create(Thing.prototype);
	Celestial.prototype.constructor = Celestial;
	Celestial.prototype.onCollision = function(o, pen) 
		{
			//var pn = v3.normalize(pen);
			//var repulsion = v3.multiply(pn, (-this.acceleration - 2*v3.dot(this.state.velocity, pn)));
			//this.state.velocity = v3.add(this.state.velocity, repulsion);
		}
	Celestial.prototype.act = function() 
		{
			//revolve;
		}
	
function Sun(o) {
		Celestial.call(this, o);
		this.mass = 0; //(5.97 * 10 ** 24) * 332982;
		this.state.matrix = m4.translate(this.state.matrix, models.celestials.planet.size + 4 * 10 ** 5, 1000, 15 * 10 ** 10);
		this.objlist.celestials.sun.instances.push(this);
	}
	Sun.prototype = Object.create(Celestial.prototype);
	Sun.prototype.constructor = Sun;
	
function Planet(o) {
		Celestial.call(this, o);
		this.mass = 0; //5.97 * 10 ** 24;
		this.state.matrix = m4.translate(this.state.matrix, models.celestials.planet.size + 4 * 10 ** 5, 1000, 0);
		this.objlist.celestials.planet.instances.push(this);
	}
	Planet.prototype = Object.create(Celestial.prototype);
	Planet.prototype.constructor = Planet;
	
function Moon(o) {
		Celestial.call(this, o);
		this.mass = 0; //7.36 * 10 ** 22;
		this.state.matrix = m4.translate(this.state.matrix, models.celestials.planet.size + 4 * 10 ** 5, 1000, -4 * 10 ** 8);
		//this.state.velocity = [1000 / 60, 0, 0];
		this.objlist.celestials.moon.instances.push(this);
	}
	Moon.prototype = Object.create(Celestial.prototype);
	Moon.prototype.constructor = Moon;
	
function Asteroid(o) {
		Celestial.call(this, o);
	}
	Asteroid.prototype = Object.create(Celestial.prototype);
	Asteroid.prototype.constructor = Asteroid;