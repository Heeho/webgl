'use strict';
	var objlist = {
		menu: {
			
		},
		ships: {
			fighter: {
				model: models.ships.fighter,
				instances: [],
			},
			carrier: {
				model: models.ships.carrier,
				instances: [],
			},
			interceptor: {
				model: models.ships.interceptor,
				instances: [],
			},
		},
		effects: {
			throttle: {
				model: models.effects.throttle,
				instances: [],
			},
			explosion: {
				model: models.effects.explosion,
				instances: [],
			},
			flash: {
				model: models.effects.flash,
				instances: [],
			},
		},
		projectiles: {
			bolt: {
				model: models.projectiles.bolt,
				instances: [],
			},
		},
		celestials: {
			sun: {
				model: models.celestials.sun,
				instances: [],
			},
			planet: {
				model: models.celestials.planet,
				instances: [],
			},
		},
	}