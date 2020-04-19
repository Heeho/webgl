'use strict';
	function drafthitbox(model) {
		switch(model) {
		case 'fighter':
			return [
				-1, 0, 6,
				1, 0, 6,
				
				-1, -1, 2,
				1, -1, 2,
				
				-3, 0, 0,
				3, 0, 0,
				
				-1, 1, 0,
				1, 1, 0,
				
				2, 0, -2,
				-2, 0, -2,			
			]; break;
		case 'bolt':
			return [
				0,	0,	0,
				1,	0,	6,
				-1,	0,	6,			
			]; break;
		case 'carrier':
			return [
				0,-.5,	-2,
				0,	-1,	0, 				
				-1,	0,	0,
				1,	0,	0,
			]; break;
		}
	}
	function draftnodes(model) {
		switch(model) {
		case 'fighter':
			return [
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
			]; break;
		case 'bolt':
			return [
				0,	0,	0,
				1,	0,	6,
				-1,	0,	6,
				
				//0,	0,	0,
				//-1,	0,	6,
				//1,	0,	6,
			]; break;
		case 'throttle':
			return [				
				0,	0,	-1,
				0,	-1,	0, 				
				-1,	0,	0,
				
				0,	0,	-1,
				1,	0,	0,
				0,	-1,	0, 
				
				0,	0,	-1,
				-1,	0,	0, 				
				1,	0,	0, 	
				
				-1,	0,	0, 
				0,	-1,	0, 				
				1,	0,	0,
			]; break;
		case 'carrier':
			return [				
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
			]; break;
		}
	}
	
	function colors(model) {
		switch(model) {
		case 'fighter':
			return [
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
			]; break;
		case 'bolt':
			return [
				1, 255,  1,
				1, 255,  1,
				1, 255,  1,
				
				//1, 255,  1,
				//1, 255,  1,
				//1, 255,  1,
			]; break;
		case 'throttle':
			return [
				255, 1,  1,
				255, 1,  1,
				255, 1,  1,
				
				255, 1,  1,
				255, 1,  1,
				255, 1,  1,
				
				255, 1,  1,
				255, 1,  1,
				255, 1,  1,			

				255, 1,  1,
				255, 1,  1,
				255, 1,  1,				
			]; break;
		case 'carrier':
			return [
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
							
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
							
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,

				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,
				Math.random()*155, Math.random()*155,  Math.random()*100,		
			]; break;
		}
	}