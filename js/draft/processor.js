'use strict';
function process(o) {
	move(o);
}
	
function move(o) {
	if(o.isPlayer) {
		if(o.turnLeft) {
			o.rotation[1] = o.rotationSpeed[1];
		}
		if(o.turnRight) {
			o.rotation[1] = -o.rotationSpeed[1];
		}
		if(o.accelerateON) {
			o.accelerate();
		}
		if(o.shootON) {
			o.shoot();
		}	
	}
	if(o.velocity !== [0,0,0] && o.velocity !== undefined) { 
		o.state = m4.translate(o.state, o.velocity[0], o.velocity[1], o.velocity[2]);
	}
	if(o.rotation !== [0,0,0] && o.rotation !== undefined) {
		o.state = m4.zRotate(o.state, o.rotation[2]); o.rotation[2] = 0;
		o.state = m4.xRotate(o.state, o.rotation[0]); o.rotation[0] = 0;
		o.state = m4.yRotate(o.state, o.rotation[1]); o.rotation[1] = 0;
	}
}
