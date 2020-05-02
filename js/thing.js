'use strict';
	function Thing() {
		this.exists = true;
		this.state = new State();
	}
	Thing.prototype.setmodel = function(m) 
		{
			this.model = m;
			this.nodes = m.nodesbank[0];
			if(m.drafthitbox != undefined) {
				this.hitbox = m.hitboxbank[0];
				this.currenthitbox = [];
			}
			if(m.TTL != undefined) {
				this.TTL = this.model.TTL;
			}
		}
	Thing.prototype.act = function() {}