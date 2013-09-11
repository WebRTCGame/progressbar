window.requestAnimationFrame = function () {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function (f) {
		window.setTimeout(f, 1e3 / 60);
	}
}
();

function colorTransition(value, maximum, start_point, end_point) {
	return start_point + (end_point - start_point) * value / maximum;
};
