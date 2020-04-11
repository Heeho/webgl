'use strict';
	function process(o) {
		hitboxes(o);	
		for(var i = 0; i < o.length; i++) {
			if(!o[i].exists) {o.splice(i, 1);} else {
				if(o[i].act !== undefined) {o[i].act();}
				move(o[i]);
			}
		}
	}
	
	function hitboxes(o) {
		if(o.hitbox !== undefined) {
			for(var i = 0; i < o.length; i++) {
				for(var j = 0; j < o[i].hitbox.length; j += 3) {
					o[i].currenthitbox = m4.mv(o[i].state, o[i].hitbox);
				}
			}
		}
	}
	
	function collide(o) {
		
	}	
	
	function move(o) {
		if(o.velocity !== [0,0,0] && o.velocity !== undefined) { 
			o.state[12] += o.velocity[0];
			o.state[13] += o.velocity[1];
			o.state[14] += o.velocity[2];
		}
		if(o.rotation !== [0,0,0] && o.rotation !== undefined) {
			o.state = m4.zRotate(o.state, o.rotation[2]); o.rotation[2] = 0;
			o.state = m4.xRotate(o.state, o.rotation[0]); o.rotation[0] = 0;
			o.state = m4.yRotate(o.state, o.rotation[1]); o.rotation[1] = 0;
		}
	}