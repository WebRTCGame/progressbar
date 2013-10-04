var UIctrl = function (canvasElement) {
	this.element = canvasElement;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.mouse = {
		x : 0,
		y : 0,
		event : null
	};
	var bValue = 0;
	Object.defineProperty(this, "value", {
		get : function () {
			return bValue;
		},
		set : function (newValue) {
			if (typeof this.onBeforeUpdate === 'function' && bValue !== newValue) {
				this.onBeforeUpdate();
			}
			var oldval = bValue;
			bValue = newValue;
			if (typeof this.onAfterUpdate === 'function' && oldval !== newValue) {
				this.onAfterUpdate();
			}

		},
		enumerable : true,
		configurable : true
	});
};
UIctrl.prototype.render = function (context) {};
UIctrl.prototype.update = function () {
	var self = this;
	self.mouse = utils.captureMouse(self.element);
	console.log(JSON.stringify(self.mouse));
	var mouseOver = utils.containsPoint({
			x : this.x,
			y : this.y,
			width : this.width,
			height : this.height
		}, self.mouse.x, self.mouse.y);
		console.log(mouseOver);
	if (mouseOver) {
		this.element.addEventListener('mousedown', function () {
			console.log("a");
			self.element.addEventListener('mouseup', self.onMouseUp, false);
			self.element.addEventListener('mousemove', self.onMouseMove, false);
		}, false);
	}

};
UIctrl.prototype.onBeforeUpdate = function () {};
UIctrl.prototype.onAfterUpdate = function () {};
UIctrl.prototype.onMouseUp = function () {
console.log("onMouseUp");
	var self = this;
	this.element.removeEventListener('mousemove', self.onMouseMove, false);
	this.element.removeEventListener('mouseup', self.onMouseUp, false);
	this.mouseUP();
};
UIctrl.prototype.mouseUp = function(){};
UIctrl.prototype.onMouseMove = function () {};

var Button = function (canvas) {
	UIctrl.call(this, canvas);
	UIctrl.value = false;
};
Button.prototype = Object.create(UIctrl.prototype);
Button.prototype.render = function (context) {
	if (this.value) {
	context.fillStyle = 'rgba(128,128,128,1)';
	} else {
	context.fillStyle = 'rgba(255,0,0,1)';
	}
	
	context.beginPath();
	context.fillRect(this.x, this.y, this.width, this.height);
	context.closePath();
};
Button.prototype.mouseUp = function(){

this.value = !this.value;
};
