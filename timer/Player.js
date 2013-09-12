var Player = function Player(num) {
	this.number = num || 1;
	this.actions = {
		high : {
			up : new Action(100, 100, "high", "up"),
			down : new Action(100, 100, "high", "down"),
			left : new Action(100, 100, "high", "left"),
			right : new Action(100, 100, "high", "right")
		},
		medium : {
			up : new Action(100, 100, "medium", "up"),
			down : new Action(100, 100, "medium", "down"),
			left : new Action(100, 100, "medium", "left"),
			right : new Action(100, 100, "medium", "right")
		},
		low : {
			up : new Action(100, 100, "low", "up"),
			down : new Action(100, 100, "low", "down"),
			left : new Action(100, 100, "low", "left"),
			right : new Action(100, 100, "low", "right")
		}

	};
};

var Action = function Action(pwr, def, pos, dir) {
	this.power = pwr || 100;
	this.defense = def || 100;
	this.position = pos || "high"; //"med" "low"
	this.direction = dir || "up"; //"down" "left" "right"
	return this;
};
