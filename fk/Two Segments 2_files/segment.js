function Segment(width, height, color, isRoot) {

	this.id = 0; //(isRoot === true ? 0 : genGuid);
	this.isRoot = isRoot;
	
	if (!this.isRoot) {
		this.id = genGuid()
	}
	this.x = 0;
	this.y = 0;
	this.fkWeight = 1.0;
	this.ikWeight = 0.25;
	this.ikUseLOC = false;
	this.ikLOCRH = true;
	this.ikPoint = {
		x : 0,
		y : 0
	};
	this.width = width;
	this.height = height;
	//this.vx = 0;
	//this.vy = 0;
	this.rotation = 0;
	this.selfAngle = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.color = (color === undefined) ? "#ffffff" : utils.parseColor(color);
	this.lineWidth = 1;
	this.parent = undefined;
	this.children = [];
	this.zIndex = 0;
	this.angleConstraintMin = -75;
	this.angleConstrainttMax = 75;
	this.useAngleConstraint = true;
	this.imageFit = false;
	this.imageRot = true;
	this.selected = false;
	this.highlight = false;
	this.boundingPoly = [];
	this.savedPin = {
		x : 0,
		y : 0
	};
	this.savedBounds = {
		x : 0,
		y : 0,
		width : 0,
		height : 0
	};
	this.distBounds = 1000;
	this.rotateImage = new Image();
	this.rotateImage.src = "rotate.png";
	
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};

	// then to call it, plus stitch in '4' in the third group
	function genGuid() {
		return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	};
}
Segment.prototype.isRoot = function () {
	return this.id = 0;
};
Segment.prototype.setParent = function (parentSegment) {
	this.parent = parentSegment.id;
	this.getParent().children.push(this.id);
};
Segment.prototype.getParent = function () {

	return nodes.get(this.parent);
};
Segment.prototype.update = function (iAngle) {
	var aAngle = iAngle;

	if (this.useAngleConstraint) {

		var vmin = this.angleConstraintMin * (Math.PI / 180);

		var vmax = this.angleConstrainttMax * (Math.PI / 180);

		aAngle = Math.min(Math.max(iAngle, vmin), vmax);
	}

	this.selfAngle = aAngle;
	if (this.parent !== undefined) {

		this.rotation = (this.getParent().rotation * this.fkWeight) + this.selfAngle;
	} else {

		this.rotation = this.selfAngle;
	}
	this.savedPin = this.getPin();
	this.savedBounds = {
		x : this.x,
		y : this.y,
		width : this.savedPin.x - this.x,
		height : this.savedPin.y - this.y
	};
	var self = this;
	this.distBounds = window.utils.dotLineLength(mouse.x,mouse.y,self.x,self.y,self.savedPin.x,self.savedPin.y,true);
};

Segment.prototype.draw = function (context) {
	if (this.parent !== undefined) {
		this.x = this.getParent().getPin().x;
		this.y = this.getParent().getPin().y;
	};

	var h = this.height,
	d = this.width + h, //top-right diagonal
	cr = h / 2; //corner radius



	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.rotation);
	context.scale(this.scaleX, this.scaleY);

	context.lineWidth = this.lineWidth;
	context.fillStyle = this.color;

	context.moveTo(0, 0);
	//var pinPoint = this.getPin();
	context.lineTo(this.width, 0);
	context.rect(0, -cr, this.width, 10);

	if (this.highlight) {
		context.fill();
	}
	context.stroke();
	/*
	context.beginPath();
	context.moveTo(0, -cr);
	context.lineTo(d - 2 * cr, -cr);
	context.quadraticCurveTo(-cr + d, -cr, -cr + d, 0);
	context.lineTo(-cr + d, h - 2 * cr);
	context.quadraticCurveTo(-cr + d, -cr + h, d - 2 * cr, -cr + h);
	context.lineTo(0, -cr + h);
	context.quadraticCurveTo(-cr, -cr + h, -cr, h - 2 * cr);
	context.lineTo(-cr, 0);
	context.quadraticCurveTo(-cr, -cr, 0, -cr);
	context.closePath();

	context.fill();
	 */
	if (this.lineWidth > 0) {
		context.stroke();
	}

	//draw the 2 "pins"
	context.beginPath();
	context.arc(0, 0, 2, 0, (Math.PI * 2), true);
	context.closePath();
	context.stroke();

	context.beginPath();
	context.arc(this.width, 0, 2, 0, (Math.PI * 2), true);
	context.closePath();
	context.stroke();

	context.restore();

	if (this.selected) {
	
	context.drawImage(this.rotateImage,this.x - 20,this.y - 20,20,20);
	
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.rect(0, -this.height * 2, this.width, 10);
		var grd = context.createLinearGradient(0, -this.height * 2, this.width, 10);
		grd.addColorStop(0, 'red');
		grd.addColorStop(this.fkWeight, 'rgba(0,0,0,0)');
		context.fillStyle = grd;
		context.fill();
		context.restore();

		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.rect(0, this.height, this.width, 10);
		var grd = context.createLinearGradient(0, this.height, this.width, 10);
		grd.addColorStop(0, 'blue');
		grd.addColorStop(this.ikWeight, 'rgba(0,0,0,0)');
		context.fillStyle = grd;
		context.fill();
		context.restore();
	}

	if (this.selected) {
		context.save();
		context.translate(this.x, this.y);

		if (!this.isRoot) {
			context.rotate(this.getParent().rotation * this.fkWeight);

		}

		context.beginPath();
		context.arc(0, 0, this.width, this.angleConstraintMin * (Math.PI / 180), this.angleConstrainttMax * (Math.PI / 180), false);

		context.lineWidth = 1;
		context.strokeStyle = 'rgba(0,0,0,0.25)';
		context.fillStyle = 'rgba(255,255,0,.1)';
		context.stroke();
		context.fill();
		context.closePath();

		context.restore();
	}
};

Segment.prototype.getPin = function () {
	return {
		x : this.x + Math.cos(this.rotation) * this.width,
		y : this.y + Math.sin(this.rotation) * this.width
	};
};

Segment.prototype.captureMouse = function (element) {
	
	var self = this,
	mouse = utils.captureMouse(element);
	//bounds = {},
	//dist = 1000;

	//setHandleBounds();

	element.addEventListener('mousedown', function () {
	//var dist = window.utils.dotLineLength(mouse.x,mouse.y,self.x,self.y,self.savedPin.x,self.savedPin.y,true);
		if (self.distBounds < 5){
		//if (utils.containsPoint(bounds, mouse.x, mouse.y)) {
		console.log("segment mouse down");
			element.addEventListener('mouseup', onMouseUp, false);
			element.addEventListener('mousemove', onMouseMove, false);
		//}
		}
		
	}, false);

	function onMouseUp() {
	console.log("segment mouse up");
		element.removeEventListener('mousemove', onMouseMove, false);
		element.removeEventListener('mouseup', onMouseUp, false);
		nodes.unSelectAll();
		self.selected = true;
		//setHandleBounds();
		//nodes.select(self);
	};

	function onMouseMove() {
	console.log("segment mouse move");
		//var pos_y = mouse.y - self.y;
		//self.handleY = Math.min(self.height - self.handleHeight, Math.max(pos_y, 0));
		//self.updateValue();
	};
/*
	function setHandleBounds() {
	dist = window.utils.dotLineLength(mouse.x,mouse.y,self.x,self.y,self.savedPin.x,self.savedPin.y,true);
	
	bounds.x = self.x;
		bounds.y = self.y + self.handleY;
		bounds.width = self.width;
		bounds.height = self.handleHeight;
		
	};
	*/
};
