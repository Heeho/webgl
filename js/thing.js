'use strict';
	function Thing(o) {
		this.exists = true;
		this.state = new State();
		this.mass = 1;
		this.objlist = o.objlist;
		this.currenthitbox = [];
	}
	Thing.prototype.act = function() {}