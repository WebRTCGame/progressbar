var PB = function PB(ix, iy, iw, ih, zeroCallback, fullCallback) {
	this.pos = {
		x : ix || 20,
		y : iy || 20,
		w : iw || 300,
		h : ih || 34
	};

	var bValue = 0;
	Object.defineProperty(this, "percentage", {
		get : function () {
			return bValue;
		},
		set : function (newValue) {
			//console.log("j");
			bValue = newValue;
			//console.log("i");
			if (bValue >= 100) {
				fullCallback();
			}
			if (bValue <= 0) {
				zeroCallback();
			}
		},
		enumerable : true,
		configurable : true
	});

	this.font = "24px Verdana";
	this.bgcolor = 'rgba(100,100,100,0.5)';
	this.fgcolor = 'rgba(0,0,100,0.5)';
	this.fontcolor = 'white';
	this.leftToRight = true;
	this.textAlign = 'follow'; //left,right,center

	this.calcpos = function (perc) {
		return (this.pos.w / 100) * this.percentage;
	};
};
PB.prototype.add = function add(percent) {
	this.value += percent;
};
PB.prototype.sub = function sub(percent) {
	this.value -= percent;
};
PB.prototype.render = function render(ictx) {
	var calcval = this.calcpos();
	ictx.clearRect(this.pos.x, this.pos.y, this.pos.w, this.pos.h);

	ictx.save();
	ictx.font = this.font;
	ictx.fillStyle = this.bgcolor;
	ictx.fillRect(this.pos.x, this.pos.y, this.pos.w, this.pos.h);
	ictx.fillStyle = this.fgcolor;

	ictx.fillRect(this.leftToRight ? this.pos.x : this.pos.x + this.pos.w - calcval, this.pos.y, calcval, this.pos.h);

	ictx.fillStyle = this.fontcolor;
	
	var text_width = ictx.measureText(this.percentage + "%").width;
	var text_x = 0;
	if (this.leftToRight) {
		text_x = this.pos.x;
		if (this.pos.x + calcval > (this.pos.x + text_width)){
		text_x = (this.pos.x + calcval)-text_width;
		}
	} else {
		text_x = this.pos.x + this.pos.w - calcval;
	}

	ictx.textBaseline = 'middle';
	ictx.fillText(this.percentage + "%", text_x, this.pos.y + (this.pos.h / 2));

	ictx.restore();

};