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
	this.ikPoint = {x:0,y:0};
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

	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.rotation);
	context.rect(0, -this.height*2, this.width, 10);
	var grd = context.createLinearGradient(0, -this.height*2, this.width, 10);
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

};

Segment.prototype.getPin = function () {
	return {
		x : this.x + Math.cos(this.rotation) * this.width,
		y : this.y + Math.sin(this.rotation) * this.width
	};
};
