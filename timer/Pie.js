var Pie = function Pie() {
	this.x = 300;
	this.y = 100;
	this.radius = 50;
	this.color1 = 'rgba(255,0,0,.5)';
	this.color2 = 'rgba(0,255,0,.5)';
	this.color3 = 'rgba(0,0,255,.5)';
	this.color4 = 'rgba(255,0,255,.5)';
	var cpv = degreesToRadians(90);
	this.angleA = degreesToRadians(45);
	this.angleB = this.angleA + cpv;
	this.angleC = this.angleB + cpv;
	this.angleD = this.angleC + cpv;
	this.hilightUp = true;
	this.hilightRight = true;
	this.hilightDown = true;
	this.hilightLeft = true;
	this.timer = new Timer(
			function (x) {

			if (x > 50) {
				//this.increment = false;
				//console.log("pie precallback " + x);
				this.enabled = false;
			}
		},
			function (x) {

			if (x < 0) {
				//this.increment = true;
				//console.log("pie postcallback " + x);
			}
		});
	this.timer.rate = 0.5;
	this.timer.enabled = true;

	return this;
};
Pie.prototype.genPath = function genPath(ctx, aA, aB, radd) {
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.arc(this.x, this.y, radd || this.radius, aA, aB, false);
	ctx.closePath();
};
Pie.prototype.render = function render(ctx, del) {
	ctx.save();
	//this.timer.tick(del);
	if (!this.hilightDown) {
		this.genPath(ctx, this.angleA, this.angleB);
		ctx.fillStyle = this.color1;
		ctx.fill();
	};

	if (!this.hilightLeft) {
		this.genPath(ctx, this.angleB, this.angleC);
		ctx.fillStyle = this.color2;
		ctx.fill();
	}

	if (!this.hilightUp) {
		this.genPath(ctx, this.angleC, this.angleD);
		ctx.fillStyle = this.color3;
		ctx.fill();
	}

	if (!this.hilightRight) {
		this.genPath(ctx, this.angleD, this.angleA);
		ctx.fillStyle = this.color4;
		ctx.fill();
	}
	ctx.restore();
	ctx.save();

	if (this.hilightDown) {
		this.timer.tick(del);
		this.genPath(ctx, this.angleA, this.angleB, this.radius + (this.radius * 0.5));
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fill();
		ctx.lineWidth = this.timer.value;
		ctx.strokeStyle = this.color1; //'rgba(255,0,0,.5)';
		ctx.stroke();
	};
	if (this.hilightLeft) {
		this.timer.tick(del);
		this.genPath(ctx, this.angleB, this.angleC, this.radius + (this.radius * 0.5));
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fill();
		ctx.lineWidth = this.timer.value;
		ctx.strokeStyle = this.color2; //'rgba(255,0,0,.5)';
		ctx.stroke();
	};
	if (this.hilightUp) {
		this.timer.tick(del);
		this.genPath(ctx, this.angleC, this.angleD, this.radius + (this.radius * 0.5));
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fill();
		ctx.lineWidth = this.timer.value;
		ctx.strokeStyle = this.color3; //'rgba(255,0,0,.5)';
		ctx.stroke();
	};
	if (this.hilightRight) {
		this.timer.tick(del);
		this.genPath(ctx, this.angleD, this.angleA, this.radius + (this.radius * 0.5));
		ctx.fillStyle = 'rgba(255,255,255,1)';
		ctx.fill();
		ctx.lineWidth = this.timer.value;
		ctx.strokeStyle = this.color4; //'rgba(255,0,0,.5)';
		ctx.stroke();
	};
	ctx.restore();
	ctx.fillText(this.timer.value, this.x - 75, this.y);
	if (!this.timer.enabled) {
		this.hilightUp = this.hilightDown = this.hilightLeft = this.hilightRight = false;
	}
};
Pie.prototype.Up = function Up() {
	this.hilightUp = true;
	this.timer.reset();
	this.timer.enabled = true;
};
Pie.prototype.Down = function Down() {
	this.hilightDown = true;
	this.timer.reset();
	this.timer.enabled = true;
};
Pie.prototype.Left = function Left() {
	this.hilightLeft = true;
	this.timer.reset();
	this.timer.enabled = true;
};
Pie.prototype.Right = function Right() {
	this.hilightRight = true;
	this.timer.reset();
	this.timer.enabled = true;
};