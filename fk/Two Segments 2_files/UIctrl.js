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
UIctrl.prototype.update = function (injection) {
	var self = this;
	this.mouse = utils.captureMouse(self.element);
	if (typeof injection === 'function') {
		injection();
	}
	this.element.addEventListener('mousedown', function () {
		if (utils.containsPoint({
				x : this.x,
				y : this.y,
				width : this.width,
				height : this.height
			}, self.mouse.x, self.mouse.y)) {
			self.element.addEventListener('mouseup', self.onMouseUp, false);
			self.element.addEventListener('mousemove', self.onMouseMove, false);
		}
	}, false);
};
UIctrl.prototype.onBeforeUpdate = function () {};
UIctrl.prototype.onAfterUpdate = function () {};
UIctrl.prototype.onMouseUp = function (injection) {
	var self = this;
	this.element.removeEventListener('mousemove', self.onMouseMove, false);
	this.element.removeEventListener('mouseup', self.onMouseUp, false);
	if (typeof injection === 'function') {
		injection();
	}
};
UIctrl.prototype.onMouseMove = function () {};
