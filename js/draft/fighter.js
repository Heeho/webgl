'use strict';
function Fighter() {
	this.isPlayer = true;
	this.turnLeft = false;
	this.turnRight = false;
	this.accelerateON = false;
	this.shootON = false;
	this.state = [
		1,	0,	0,	0,
		0,	1,	0,	0,
		0,	0,	1,	0,
		0,	0,-350,	1,
	];
	this.velocity = [0, 0, 1,];
	this.acceleration = 0.01;
	this.rotationSpeed = [4, 0.2, 4];
	this.rotation = [0, 0, 0];
	this.exists = true;
	this.size = 1;
	this.nodes = [0];
	this.draftnodes = [
		//front wings
		-1, 0, 6,
		-3, 0, 0,
		-1, -1, 2,
		
		1, 0, 6,
		1, -1, 2,
		3, 0, 0,
		
		//sides
		-3, 0, 0,
		0, -1, -2,
		-1, -1, 2,
					
		3, 0, 0,
		1, -1, 2,
		0, -1, -2,
		
		//hood
		-1, -1, 2,
		0, -1, -2,
		1, -1, 2,
		
		//buttocks
		0, -1, -2,
		-3, 0, 0,
		-2, 0, -2,
					
		0, -1, -2,
		2, 0, -2,
		3, 0, 0,
		
		//front
		-1, 0, 4,
		-1, -1, 2,
		1, 0, 4,
		
		1, 0, 4,
		-1, -1, 2,
		1, -1, 2,
		
		//upper jaws
		-1, 0, 4,
		-1, 0, 6,
		-1, -1, 2,
		
		1, 0, 4,
		1, -1, 2,
		1, 0, 6,
		
		//butt
		-2, 0, -2,		
		2, 0, -2,
		0, -1, -2,
		
		//bottom
		-1, 1, 0,
		2, 0, -2,
		-2, 0, -2,
		
		-1, 1, 0,
		1, 1, 0,
		2, 0, -2,
		
		//bottom sides
		-1, 1, 0,
		-2, 0, -2,
		-3, 0, 0,
		
		1, 1, 0,
		3, 0, 0,
		2, 0, -2,
		
		//bottom wings
		-1, 1, 0,
		-3, 0, 0,
		-1, 0, 6,
		
		1, 1, 0,
		1, 0, 6,
		3, 0, 0,
		
		//bottom front
		-1, 1, 0,
		-1, 0, 4,
		1, 0, 4,
		
		1, 1, 0,
		-1, 1, 0,
		1, 0, 4,	
		
		//bottom jaws
		-1, 1, 0,
		-1, 0, 6,
		-1, 0, 4,
		
		1, 1, 0,
		1, 0, 4,
		1, 0, 6,		
	];
	this.colors = [
		//front wings
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//sides
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//hood
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//buttocks		
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//front		
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//upper jaws		
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//butt
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom sides
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom wings
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom front
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		//bottom jaws
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
		Math.random()*55,Math.random()*35,Math.random()*155,
	];
	setNodes(this);
} Fighter.prototype = {
	direction: function() {
		return [this.state[2], this.state[6], this.state[10]];
	},
	getNodesCount: function() {
		return draftnodes.length; 
	},
	shoot: function() {
		//gameObjects.push(new Bolt(offset));
	},
	accelerate: function() {
		this.velocity = v3.add(this.velocity, v3.multiply(this.direction,this.acceleration));
		//gameObjects.push(new Throttle(offset));
	}
}

function Bolt() {
	this.state = fighter.state;
	this.velocity = v3.add(fighter.velocity, v3.multiply(fighter.direction, 5));
	this.size = 10;
	this.draftnodes = [
		 0,  	0,	  2,
		 0.25,  0,	  3,
		-0,25,  0, 	  3,
	];
	this.colors = [
		1, 255,  1,
		1, 255,  1,
		1, 255,  1,
	];
	this.TTL = 30;
	this.exists = true;
	setNodes(this);
} Bolt.prototype.fade = function() {
	if(this.TTL-- == 0) {
		this.exists = false;
	}
}

function Throttle() {
	this.state = fighter.state;
	this.size = 5;
	this.draftnodes = [
		-1,  0,  0,
		 1,  0,  0,
		 0,  0, -1,
	];
	this.colors = [
		255, 1,  1,
		255, 1,  1,
		255, 1,  1,
	];
	this.TTL = 20;
	this.fadeRatio = size / TTL;
	this.exists = true;
	setNodes(this);
} Throttle.prototype.fade = function() {
	this.TTL-- == 0 ? this.exists = false : this.size -= fadeRatio;
}