console.log("fuck");

var Game = {};
Game.five = 5;
console.log(Game.five);
Game.run = function () {
	console.log("wowwere");

	var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	mouse = utils.captureMouse(canvas),
	segUpArm = new Segment(80, 30, 'rgba(255,0,0,.5)'),
	segForeArm = new Segment(80, 30, 'rgba(0,0,255,.5)'),
	segHand = new Segment(40, 10, 'rgba(0,255,0,.5)'), //1
	segFing = new Segment(45, 5, 'yellow'); //0
	segNeck = new Segment(40, 30, 'orange');
	var mouseLock = true;
	var oldMouse = {
		x : 0,
		y : 0
	};
	
//canvas.onmousedown = myDown;
canvas.addEventListener('mousedown',myDown,false);
  canvas.onmouseup = myUp;
  canvas.ondblclick = myDblClick;
  
  var myDown = function(e){console.log(e)};
  var myUp = function(e){console.log(e)};
  var myDblClick = function(e){console.log(e)};
  
	context.font = "12px Verdana";

	segUpArm.x = canvas.width / 2;
	segUpArm.y = canvas.height / 2;

	function reach(segment, xpos, ypos) {
		var dx = xpos - segment.x,
		dy = ypos - segment.y;
		segment.rotation = Math.atan2(dy, dx);
		var w = segment.getPin().x - segment.x,
		h = segment.getPin().y - segment.y;
		return {
			x : xpos - w,
			y : ypos - h
		};
	};

	function position(segmentA, segmentB) {
		segmentA.x = segmentB.getPin().x;
		segmentA.y = segmentB.getPin().y;
	};

	(function drawFrame() {
		window.requestAnimationFrame(drawFrame, canvas);
		if (mouseLock) {
			oldMouse.x = mouse.x;
			oldMouse.y = mouse.y
		};
		
		context.clearRect(0, 0, canvas.width, canvas.height);
		//console.log(mouse.event);
		var dx = oldMouse.x - segUpArm.x,
		dy = oldMouse.y - segUpArm.y,
		dist = Math.sqrt(dx * dx + dy * dy),
		a = 100,
		b = 100,
		c = Math.min(dist, a + b),
		B = Math.acos((b * b - a * a - c * c) / (-2 * a * c)),
		C = Math.acos((c * c - a * a - b * b) / (-2 * a * b)),
		D = Math.atan2(dy, dx),
		E = D + B + Math.PI + C;
		//other side: E = D - B + Math.PI - C;

		segUpArm.rotation = (D + B);
		//other side: segUpArm.rotation = (D - B);

		var target = segUpArm.getPin();
		segForeArm.x = target.x;
		segForeArm.y = target.y;
		segForeArm.rotation = E;

		segNeck.x = segUpArm.x;
		segNeck.y = segUpArm.y;

		//var target = reach(segment3, mouse.x, mouse.y);
		//reach(segment0, target.x, target.y);
		//position(segment3, segment0);

		segForeArm.draw(context);
		segUpArm.draw(context);

		var wrist = segForeArm.getPin();
		context.fillText("wrist", wrist.x - 10, wrist.y + 20);

		var elbo = segUpArm.getPin();
		context.fillText("elbo", elbo.x - 10, elbo.y + 20);

		var shoulder = {
			x : segUpArm.x,
			y : segUpArm.y
		};
		context.fillText("shoulder", shoulder.x - 10, shoulder.y + 20);

		segHand.x = wrist.x;
		segHand.y = wrist.y;

		var handAt = {
			x : 400,
			y : 100
		};
		var target = reach(segFing, handAt.x, handAt.y);
		reach(segHand, target.x, target.y);
		position(segFing, segHand);

		segHand.draw(context);
		segFing.draw(context);
		segNeck.draw(context);

		context.beginPath();
		context.arc(handAt.x, handAt.y, 10, 0, (Math.PI * 2), true);
		context.closePath();
		context.stroke();

		var tips = segFing.getPin();

		context.beginPath();
		context.moveTo(tips.x, tips.y);
		context.lineTo(handAt.x, handAt.y);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.arc(oldMouse.x, oldMouse.y, 10, 0, (Math.PI * 2), true);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.moveTo(oldMouse.x, oldMouse.y);
		context.lineTo(wrist.x, wrist.y);
		context.closePath();
		context.stroke();

	}
		());
};
