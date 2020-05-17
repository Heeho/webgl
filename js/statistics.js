'use strict';
	var statistics = [
		0,
		0,
		'',
	];
	
	function score() {
		statistics[1] /= 1000;
		localStorage.setItem('header', statistics[2]);
		localStorage.setItem('kills', statistics[0]);
		localStorage.setItem('time', statistics[1]);
		localStorage.setItem('kps', statistics[0] / statistics[1]); //window.alert(localStorage.getItem('time'));
		window.location.replace('score.html');
	};