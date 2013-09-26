function Segment(width, height, color, isRoot) {
	this.id = 0;//(isRoot === true ? 0 : genGuid);
	if (!isRoot){this.id = genGuid()}
	this.x = 0;
	this.y = 0;
	this.width = width;
	this.height = height;
	this.vx = 0;
	this.vy = 0;
	this.rotation = 0;
	this.selfAngle = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.color = (color === undefined) ? "#ffffff" : utils.parseColor(color);
	this.lineWidth = 1;
	this.parent = undefined;
	this.children = [];

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
	return nodes[this.parent];
};
Segment.prototype.update = function (iAngle) {
	this.selfAngle = iAngle;
	if (this.parent !== undefined) {

		this.rotation = this.getParent().rotation + this.selfAngle;
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
};

Segment.prototype.getPin = function () {
	return {
		x : this.x + Math.cos(this.rotation) * this.width,
		y : this.y + Math.sin(this.rotation) * this.width
	};
};
