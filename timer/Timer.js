var Timer = function Timer(preCallback, postCallback) {
	this.rate = 1;

	this.ticks = 0;
	var bValue = 0;
	Object.defineProperty(this, "value", {
		get : function () {
			return bValue;
		},
		set : function (newValue) {
			preCallback.call(this, newValue);
			bValue = newValue;
			postCallback.call(this, bValue);
		},
		enumerable : true,
		configurable : true
	});
	this.increment = true;
	this.enabled = false;
};
Timer.prototype.tick = function tick(del) {
	this.ticks++;
	if (this.enabled) {
		var spd = (this.rate * 60 * del) / 1000;
		if (this.increment) {
			this.value += spd;
		} else {
			this.value -= spd;
		}
	}
};
Timer.prototype.reset = function reset() {
	var oldval = this.value;
	this.ticks = 0;
	this.value = 0;
	return oldval;
};
Timer.prototype.toggle = function pause() {
	this.enabled = !this.enabled
};
Timer.prototype.rounded = function rounded() {
	return Math.round(this.value)
};