'use strict';
		function Carrier() {
			this.isPlayer = false;
			this.turnLeft = false;
			this.turnRight = false;
			this.accelerateON = false;
			this.shootON = false;
			this.shootTimer = 0;
			this.shootDelay = 5;
			this.brakesON = false;
			this.state = [
				1,	0,	0,	0,
				0,	1,	0,	0,
				0,	0,	1,	0,
				0,	0,-1500,1,
			];
			this.velocity = [0, 0, 0,];
			this.acceleration = 1;
			this.size = 50;
			this.nodes = [0];
			this.draftnodes = [				
				0,-.5,	-2,
				0,	-1,	0, 				
				-1,	0,	0,
				
				0,-.5,	-2,
				1,	0,	0,
				0,	-1,	0, 
				
				0,-.5,	-2,
				-1,	0,	0, 				
				1,	0,	0, 	
				
				-1,	0,	0, 
				0,	-1,	0, 				
				1,	0,	0,
			];
			this.colors = [
				155, 155,  100,
				155, 155,  100,
				155, 155,  100,
							
				155, 155,  100,
				155, 155,  100,
				155, 155,  100,
							
				155, 155,  100,
				155, 155,  100,
				155, 155,  100,		

				155, 155,  100,
				155, 155,  100,
				155, 155,  100,			
			];
			this.exists = true;
			setNodes(this);
		}
		Carrier.prototype.shoot = function() {
				//gameObjects.push(new Blaster(offset));
		}
		Carrier.prototype.accelerate = function() {
				this.velocity = v3.add(this.velocity, v3.multiply(this.direction,this.acceleration));
				//gameObjects.push(new Throttle(offset));
		}
		Carrier.prototype.direction = function() {
			return [this.state[8], this.state[9], this.state[10]];
		}

		function Blaster() {
			this.state = shofixti.state;
			this.velocity = v3.add(shofixti.velocity, v3.multiply(shofixti.direction, 5));
			this.size = 10;
			this.draftnodes = [
				 0,  	0,	  2,
				 0.25,  0,	  3,
				-0,25,  0, 	  3,
			];
			this.colors = [
				255,  1, 1,
				255,  1, 1,
				255,  1, 1,
			];
			this.TTL = 30;
			this.exists = true;
			setNodes(this);
		}
		Blaster.prototype.fade = function() {
			if(this.TTL-- == 0) {this.exists = false;}
		}