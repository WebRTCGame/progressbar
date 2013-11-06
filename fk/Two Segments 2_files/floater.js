
function Floater(min, max, value, imageSrc, parentBoneId) {
	this.min = (min === undefined) ? 0 : min;
	this.max = (max === undefined) ? 100 : max;
	this.value = (value === undefined) ? 100 : value;
	if (this.value > this.max) {
		this.value = this.max
	}
	if (this.value < this.min) {
		this.value = this.min
	}
	this.onchange = null;
	this.parentId = parentBoneId;
	this.x = 0;
	this.y = 0;
	this.width = 40;
	this.height = 40;
	this.image = new Image();
	this.image.src = imageSrc || "rotate.png";
	this.enabled = true;
}

Floater.prototype.getParent = function () {
	return nodes.get(this.parentId);
};

Floater.prototype.draw = function (context) {
	context.save();
	context.translate(this.x, this.y);
	context.beginPath();
	context.rect(0, 0, this.width, this.height);
	context.closePath();
	context.strokeStyle = 'rgba(0,0,0,1)';
	context.lineWidth = 2;
	context.stroke();
	context.drawImage(this.image, 0, 0, this.width, this.height);
	context.fillText(this.value, 20, 0);
	context.restore();
};

Floater.prototype.updateValue = function (newValue) {
	var nv = newValue;
	if (this.value != nv) {
		if (nv > this.max) {
			nv = this.max
		}
		if (nv < this.min) {
			nv = this.min
		}
this.value = nv;
	};
};

Floater.prototype.captureMouse = function (element) {
	var self = this,
	mouse = utils.captureMouse(element),
	bounds = {};
	var oldMouse;

	setHandleBounds();

	element.addEventListener('mousedown', function () {
		if (utils.containsPoint(bounds, mouse.x, mouse.y)) {
			oldMouse = {
				x : mouse.x,
				y : mouse.y
			};
			element.addEventListener('mouseup', onMouseUp, false);
			element.addEventListener('mousemove', onMouseMove, false);
		}
	}, false);

	function onMouseUp() {
		element.removeEventListener('mousemove', onMouseMove, false);
		element.removeEventListener('mouseup', onMouseUp, false);
		setHandleBounds();
	};

	function onMouseMove() {

		
		var oldval = self.value;
		if (mouse.y < oldMouse.y) {
			self.updateValue(oldval -= 1);
		}
		if (mouse.y > oldMouse.y) {
			self.updateValue(oldval += 1);
		}
		self.getParent().update(self.value * Math.PI / 180);


	};

	function setHandleBounds() {
		bounds.x = self.x;
		bounds.y = self.y;
		bounds.width = self.width;
		bounds.height = self.height;
	};
};
