var Pie = function Pie(settings) {
	
	this.x = settings.x || 300;
	this.y = settings.y || 100;
	this.radius = settings.r || 50;
	this.scaleRadius = settings.scaleRadius || (this.radius * 0.5);
	this.color = [
	settings.color1 || 'rgba(255,0,0,.5)',
	settings.color2 || 'rgba(0,255,0,.5)',
	settings.color3 || 'rgba(0,0,255,.5)',
	settings.color4 || 'rgba(255,0,255,.5)'
	];
	this.cpv = degreesToRadians(90);
	this.angles = [];
	this.angles[0] = degreesToRadians(45);
	this.angles[1] = this.angles[0] + this.cpv;
	this.angles[2] = this.angles[1] + this.cpv;
	this.angles[3] = this.angles[2] + this.cpv;
	this.hilight = {
		up : false,
		right : false,
		down : false,
		left : false
	};
	this.timer = new Timer(
			function (x) {

			if (x >  50) {
				//this.increment = false;
				//console.log("pie precallback " + x);
				this.enabled = false;
			}
		},
			function (x) {});
	this.timer.rate = settings.rate || 0.5;
	this.timer.enabled = false;

	return this;
};
Pie.prototype.genPath = function genPath(ctx, aA, aB, radd) {
	
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.arc(this.x, this.y, radd || this.radius, aA, aB, false);
	ctx.closePath();
};
Pie.prototype.drawPieR = function drawPieR(ctx, val) {
	
	this.genPath(ctx, this.angles[val], this.angles[val < 3 ? val + 1 : 0]);
	ctx.fillStyle = this.color[val];
	ctx.fill();
};
Pie.prototype.drawPieH = function drawPieH(ctx, val, del) {
	
	//this.timer.tick(del);
	//console.log(this.timer.value);
	this.genPath(ctx, this.angles[val], this.angles[val < 3 ? val + 1 : 0], this.radius + (this.radius * 0.5));
	ctx.fillStyle = 'rgba(255,255,255,1)';
	ctx.fill();
	ctx.lineWidth = this.timer.value;
	ctx.strokeStyle = this.color[val];
	ctx.stroke();
};
Pie.prototype.render = function render(ctx, del) {
	ctx.save();
	if (!this.hilight.down) {
		this.drawPieR(ctx, 0);
	}
	if (!this.hilight.left) {
		this.drawPieR(ctx, 1);
	}
	if (!this.hilight.up) {
		this.drawPieR(ctx, 2);
	}
	if (!this.hilight.right) {
		this.drawPieR(ctx, 3);
	}
	ctx.restore();
	ctx.save();
	
	if (this.timer.enabled) {this.timer.tick(del)};
	if (this.hilight.down) {
		this.drawPieH(ctx, 0, del);
	}
	if (this.hilight.left) {
		this.drawPieH(ctx, 1, del);
	}
	if (this.hilight.up) {
		this.drawPieH(ctx, 2, del);
	}
	if (this.hilight.right) {
		this.drawPieH(ctx, 3, del);
	}
	ctx.restore();
	ctx.fillText(this.timer.value, this.x - 100, this.y + 10);
	if (!this.timer.enabled) {
		this.hilight.up = this.hilight.down = this.hilight.left = this.hilight.right = false;
	}
};
Pie.prototype.Up = function Up() {
	this.hilight.up = true;
	this.timer.reset();
	this.timer.enabled = true;
};
Pie.prototype.Down = function Down() {
	this.hilight.down = true;
	this.timer.reset();
	this.timer.enabled = true;
};
Pie.prototype.Left = function Left() {
	this.hilight.left = true;
	this.timer.reset();
	this.timer.enabled = true;
};
Pie.prototype.Right = function Right() {
	this.hilight.right = true;
	this.timer.reset();
	this.timer.enabled = true;
};
