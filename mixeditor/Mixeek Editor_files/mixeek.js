/*
Copyright 2012 Stepan Kukal

This file is part of Mixeek Engine.

Mixeek Engine is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Mixeek Engine is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Mixeek Engine.  If not, see <http://www.gnu.org/licenses/>.
 */

window.originalSetInterval = window.setInterval;
window.originalClearInterval = window.clearInterval;
window.activeIntervals = 0;
window.setInterval = function (b, a) {
	if (b && a) {
		window.activeIntervals++
	}
	return window.originalSetInterval(b, a)
};
window.clearInterval = function (a) {
	if (a !== true) {
		window.activeIntervals--
	}
	return window.originalClearInterval(a)
};
var isWebKit = false;
var isIE = false;
var isIE6 = false;
var isIE7 = false;
var isIE8 = false;
var isIE9 = false;
var isIE10 = false;
var isSafari = false;
var isOpera = false;
var isMozilla = false;
var browserPrefix = "";
var DEF_FPS = 100;
function checkBrowser() {
	if ($.browser.msie) {
		isIE = true;
		if ($.browser.version == "6.0") {
			isIE6 = true
		} else {
			if ($.browser.version == "7.0") {
				isIE7 = true
			} else {
				if ($.browser.version == "8.0") {
					isIE8 = true
				} else {
					if ($.browser.version == "9.0") {
						isIE9 = true
					} else {
						if ($.browser.version == "10.0") {
							isIE10 = true
						}
					}
				}
			}
		}
		browserPrefix = "-ms-"
	} else {
		if ($.browser.webkit || $.browser.safari) {
			isWebKit = true;
			browserPrefix = "-webkit-"
		} else {
			if ($.browser.safari) {
				isSafari = true;
				browserPrefix = "-webkit-"
			} else {
				if ($.browser.opera) {
					isOpera = true;
					browserPrefix = "-o-"
				} else {
					if ($.browser.mozilla) {
						isMozilla = true;
						browserPrefix = "-moz-"
					}
				}
			}
		}
	}
}
checkBrowser();
var isH5 = false;
var isCSS3 = false;
var css3Counter = 0;
jQuery.fn.redraw = function () {
	this.hide();
	this.show()
};
function setPlaybackMode(a) {
	if (a == "HTML5" || a == "html5") {
		isH5 = !(isIE6 || isIE7 || isIE8);
		if (!isH5) {
			a = "CSS3"
		} else {
			isCSS3 = false
		}
	}
	if (a == "CSS3" || a == "css3") {
		isCSS3 = !(isIE6 || isIE7 || isIE8 || isIE9)
	} else {
		if (a == "JS" || a == "js") {
			isCSS3 = false
		}
	}
}
setPlaybackMode("CSS3");
var MXKCANVAS = null;
var MXKIMAGES = null;
var MXKSOUNDS = null;
function MxkSoundCache() {
	this.lImgs = 0;
	this.sounds = [];
	this.soundNames = {};
	this.addSoundElement = function (b, a) {
		if (this.soundNames[b]) {
			return
		}
		$("<audio preload='auto' id='sound_" + b + "'><source src='" + a + "' type='audio/mpeg'></source></audio>").appendTo("body");
		this.soundNames[b] = {
			src : a
		}
	};
	this.getSoundNames = function () {
		var a = this.soundNames;
		var c = [];
		for (var b in a) {
			c[c.length] = b
		}
		return c
	};
	this.playSound = function (a) {
		if (a) {
			$("#sound_" + a)[0].play()
		}
	}
}
function MxkImageCache() {
	this.lImgs = 0;
	this.images = [];
	this.styleBlock = $("<style type='text/css'></style>").appendTo("head");
	this.addImage = function (a, b) {
		this.images[a] = b
	};
	this.imageNames = {};
	this.addImageClass = function (c, b, d, a) {
		if (this.imageNames[c]) {
			return
		}
		var e = "." + c + "{background-image:url('" + b + "'); width:" + d + "px; height:" + a + "px;}";
		this.styleBlock.append(e);
		this.imageNames[c] = {
			width : d,
			height : a,
			src : b
		}
	};
	this.heights = {};
	this.addHeightClass = function (b, a) {
		if (this.heights[b]) {
			return
		}
		var c = "." + b + "{height:" + a + "px;}";
		this.styleBlock.append(c);
		this.heights[b] = b
	};
	this.getImageNames = function () {
		var a = isIE8 ? this.images : this.imageNames;
		var c = [];
		for (var b in a) {
			c[c.length] = b
		}
		return c
	};
	this.getImage = function (a) {
		return this.images[a]
	}
}
var spriteRegistry = {};
var spriteRegistryH5 = [];
var runningRegistry = {};
var loop;
var ix = 0;
var h5ClockStart, h5Clock, h5ClockFirst, h5PauseClock, useH5PauseClock;
var FPS_INV;
var FPS;
function setFPS(a) {
	FPS = a;
	FPS_INV = 1000 / a
}
setFPS(DEF_FPS);
var isAnimationLoop = false;
function startAnimationLoop() {
	if (isAnimationLoop && !isCSS3) {
		return
	}
	if (MXKIMAGES.lImgs != 0) {
		setTimeout(function () {
			startAnimationLoop()
		}, 10);
		return
	}
	isAnimationLoop = true;
	if (isH5) {
		for (var c in canvases) {
			canvases[c].applyStyle()
		}
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = (function () {
				return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e, d) {
					window.setTimeout(e, 17)
				}
			})()
		}
		if (!h5ClockFirst) {
			h5ClockFirst = true
		}
		requestAnimationFrame(animationLoopH5)
	} else {
		if (isCSS3) {
			for (var a in runningRegistry) {
				var b = runningRegistry[a];
				b.animation.createCSS3(b, b.playFrom, b.playTo);
				b.animation.startCss3(b.animation.css3KeyframesNames[b.playFrom + "-" + b.playTo + "-" + parseInt(b.canvas.GLOBAL_SCALE * 100)], b.duration)
			}
			for (var a in runningRegistry) {
				var b = runningRegistry[a];
				b.update();
				b.imgObj.removeClass("css3Paused");
				b.imgObj.css(b.styleToPlay)
			}
			runningRegistry = {}

		} else {
			loop = setInterval("animationLoop()", FPS_INV)
		}
	}
}
function stopAnimationLoop() {
	isAnimationLoop = false;
	clearInterval(loop)
}
var bak = [];
function animationLoop() {
	ix++;
	bak.length = 0;
	for (var a in runningRegistry) {
		bak[a] = runningRegistry[a]
	}
	for (var a in bak) {
		bak[a].animate()
	}
	for (var a in bak) {
		if (bak[a].ix == ix) {
			bak[a].update(false, true)
		}
	}
	MXKCANVAS.getPosition()
}
function animationLoopH5() {
	sortH5(spriteRegistryH5);
	if (h5ClockFirst) {
		h5ClockFirst = false;
		h5ClockStart = new Date().getTime();
		h5Clock = 0;
		for (var b in canvases) {
			canvases[b].isH5Redraw = true
		}
		redrawH5(true)
	} else {
		if (h5PauseClock && useH5PauseClock) {
			h5Clock = h5PauseClock;
			h5ClockStart = new Date().getTime() - h5Clock;
			useH5PauseClock = false
		} else {
			h5Clock = new Date().getTime() - h5ClockStart
		}
	}
	ix++;
	bak.length = 0;
	for (var a in runningRegistry) {
		bak[a] = runningRegistry[a]
	}
	for (var a in bak) {
		bak[a].animateH5();
		bak[a].checkH5Redraw()
	}
	redrawH5();
	if (isAnimationLoop) {
		requestAnimationFrame(animationLoopH5)
	}
}
function redrawH5(c) {
	if (h5Clock || c) {
		for (var b in canvases) {
			if (canvases[b].isH5Redraw || c) {
				canvases[b].clearH5()
			}
		}
	}
	for (var a in spriteRegistryH5) {
		if (!spriteRegistryH5[a].parentSprite) {
			spriteRegistryH5[a].updateH5()
		}
	}
	if (!c) {
		for (var b in canvases) {
			canvases[b].isH5Redraw = false
		}
	}
}
var isEditP = null;
function isEdit() {
	if (isEditP == null) {
		isEditP = (typeof MXKEDITOR != "undefined")
	}
	return isEditP
}
var canvas_counter = 0;
var canvases = [];
function MxkCanvas(e, d, a, c, b) {
	canvases.push(this);
	this.scaleToParent = b;
	this.id = "mxkcanvas_" + (canvas_counter++);
	if (typeof MXKCANVAS != "undefined" && MXKCANVAS != null) {
		MXKCANVAS.destroy()
	}
	this.parent = $(e);
	this.width = d;
	this.height = a;
	this.origWidth = d;
	this.origHeight = a;
	this.GLOBAL_SCALE = 1;
	this.calcScale = function () {
		var j = false;
		var l;
		var f = parseInt(this.parent.width());
		var k = parseInt(this.parent.height());
		if (f == 0 && k == 0) {
			l = 1;
			if (this.GLOBAL_SCALE != l) {
				j = true
			}
			this.GLOBAL_SCALE = l
		} else {
			if (k == 0) {
				l = f / d;
				if (this.GLOBAL_SCALE != l) {
					j = true
				}
				this.GLOBAL_SCALE = l
			} else {
				var g = d / a;
				var h = f / k;
				if (g < h) {
					l = k / a
				} else {
					l = f / d
				}
				if (this.GLOBAL_SCALE != l) {
					j = true
				}
				this.GLOBAL_SCALE = l
			}
		}
		if (this.GLOBAL_SCALE != 1) {
			this.width = this.origWidth * this.GLOBAL_SCALE;
			this.height = this.origHeight * this.GLOBAL_SCALE
		}
		return j
	};
	if (this.scaleToParent) {
		this.calcScale()
	}
	this.createDiv = function () {
		this.canvasDiv = $("<div id='" + this.id + "' class='mxkcanvas'></div>");
		this.parent.append(this.canvasDiv);
		this.style = c ? c : "";
		this.canvasH5 = $("<canvas id='h5_" + this.id + "'></canvas>").appendTo(this.canvasDiv);
		if (isEdit()) {
			this.parentWidth = parseInt(this.canvasDiv.parent().parent().width());
			this.parentHeight = parseInt(this.canvasDiv.parent().parent().height());
			var g = this.width / 2;
			if (g > this.parentWidth / 2 - 10) {
				g = this.parentWidth / 2 - 10
			}
			var f = this.height / 2;
			if (f > this.parentHeight / 2 - 10) {
				f = this.parentHeight / 2 - 10
			}
			this.canvasDiv.css("margin-left", (-g) + "px");
			this.canvasDiv.css("margin-top", (-f) + "px");
			this.canvasDiv.parent().css("width", this.parentWidth + "px");
			this.canvasDiv.parent().css("height", this.parentHeight + "px")
		}
	};
	this.createDiv();
	this.getPosition = function () {
		return this.canvasDiv.offset()
	};
	this.setBackgroundColor = function (j, g, f, h) {
		this.red = j;
		this.green = g;
		this.blue = f;
		this.alpha = h
	};
	this.setBackgroundRepeat = function (g, f) {
		this.isRepeatX = g;
		this.isRepeatY = f
	};
	this.allowOverflow = function (f) {
		this.isOverflowHidden = !f
	};
	this.applyStyle = function (f) {
		var o = this.style.replace(/\s/g, "");
		var n = o.split(";");
		var h = "";
		for (var l in n) {
			if (n[l] == "") {
				continue
			}
			var m = n[l].split(":");
			h += m[0] + ":" + m[1] + ";"
		}
		h += "width:" + this.width + "px;";
		h += "height:" + this.height + "px";
		if (this.isOverflowHidden != undefined) {
			if (this.isOverflowHidden) {
				h += ";overflow:hidden"
			} else {
				h += ";overflow:visible"
			}
		}
		if (this.isRepeatX != undefined) {
			h += ";background-repeat:";
			if (this.isRepeatX && this.isRepeatY) {
				h += "repeat"
			} else {
				if (this.isRepeatX) {
					h += "repeat-x"
				} else {
					if (this.isRepeatY) {
						h += "repeat-y"
					} else {
						h += "no-repeat"
					}
				}
			}
		}
		if (this.red != undefined) {
			h += ";background-color:rgb(" + this.red + "," + this.green + "," + this.blue + ")";
			h += ";background-color:rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")"
		}
		this.canvasDiv.css("cssText", h + ";position:relative");
		if (this.canvasH5 && !f) {
			this.canvasH5.remove();
			if (isH5) {
				this.canvasDiv.children().hide();
				var j = this.width + "px";
				var p = this.height + "px";
				this.canvasH5 = $("<canvas id='h5_" + this.id + "' width='" + this.width + "' height='" + this.height + "'></canvas>").appendTo(this.canvasDiv)
			} else {
				if (isEdit()) {
					this.canvasDiv.children().show()
				}
			}
		}
		this.resultStyle = h;
		if (isEdit()) {
			var k = this.width / 2;
			if (k > this.parentWidth / 2 - 10) {
				k = this.parentWidth / 2 - 10
			}
			var g = this.height / 2;
			if (g > this.parentHeight / 2 - 10) {
				g = this.parentHeight / 2 - 10
			}
			this.canvasDiv.css("margin-left", (-k) + "px");
			this.canvasDiv.css("margin-top", (-g) + "px");
			this.canvasDiv.parent().css("width", this.parentWidth + "px");
			this.canvasDiv.parent().css("height", this.parentHeight + "px")
		}
	};
	this.propagateToUI = function () {
		$("#canvas_width").val(this.width);
		$("#canvas_height").val(this.height);
		$("#canvas_style").val(this.style)
	};
	this.applyStyle();
	this.propagateToUI();
	this.destroy = function () {
		$("#" + this.id).remove()
	};
	this.removeImage = function () {
		if (this.activeImageName) {
			this.canvasDiv.removeClass(this.activeImageName)
		}
		this.activeImageName = undefined
	};
	this.addImage = function (f, h, j) {
		MXKIMAGES.lImgs++;
		MXKIMAGES.loadStarted = true;
		var g = $("<img id='" + f + "_tmp' src='' class='" + f + "' style='position:absolute; left:-5000px; top:0px'/>");
		g.data("canvas", this);
		g.load(function (k) {
			if (!(isIE8 || isIE7 || isIE6)) {
				loadImageCanvas($(this), false)
			}
		});
		g.attr("src", h);
		$("body").append(g);
		if ((isIE8 || isIE7 || isIE6)) {
			setTimeout(function () {
				loadImageCanvas(g, true)
			}, 10)
		}
	};
	this.setImage = function (g, h) {
		if (!g || g == "") {
			this.removeImage();
			return
		}
		if (!MXKIMAGES.imageNames[g]) {
			this.addImage(g, h, false);
			return
		}
		if (!this.imageSet) {
			if (g != undefined && (g != "" || isEdit())) {
				this.imageSet = true
			}
		}
		if (!g) {
			g = ""
		}
		if (g == this.activeImageName) {
			return
		}
		if (g != "") {
			var f = MXKIMAGES.imageNames[g];
			this.imageWidth = f.width;
			this.imageHeight = f.height;
			if (this.activeImageName) {
				this.canvasDiv.removeClass(this.activeImageName)
			}
			this.canvasDiv.addClass(g)
		}
		this.activeImageName = g
	};
	this.sprites = {};
	this.addSprite = function (f) {
		this.canvasDiv.append(f.imgObj);
		f.canvas = this;
		this.sprites[f.name] = f
	};
	this.removeSprite = function (f) {
		f.imgObj.detach();
		delete this.sprites[f.name]
	};
	this.clearH5 = function () {
		var f = this.canvasH5[0].getContext("2d");
		f.save();
		f.setTransform(1, 0, 0, 1, 0, 0);
		f.clearRect(0, 0, this.width, this.height);
		f.restore()
	};
	MXKCANVAS = this
}
function MxkSprite(a) {
	this.name = a;
	this.index = spriteRegistryH5.length;
	this.displayName = a;
	this.mode = "DEFAULT";
	this.imgObj = $("<div id='" + this.name + "' class='sprite' ></div>");
	if (isIE8) {
		this.imgObjSub = $("<div id='" + this.name + "_ie8' class='sprite_ie8' ></div>");
		this.imgObj.append(this.imgObjSub)
	}
	this.images = {};
	this.firstLoad = true;
	if (isEdit()) {
		this.animation = new MxkAnimation(MXKEDITOR.numOfFrames)
	} else {
		this.animation = new MxkAnimation(20)
	}
	this.animation.sprite = this;
	this.animations = [this.animation];
	this.setIndex = function (b) {
		this.index = b
	};
	this.setDisplayName = function (b) {
		this.displayName = b
	};
	this.enableUndo = function () {
		this.isUndo = true;
		this.updateUndoBuffer(5)
	};
	this.setDefaultImage = function () {
		if (!MXKIMAGES.images[""]) {
			var b = $("<img src='select_image.png' class='sprite_image' />");
			b.data("width", this.width);
			b.data("height", this.height);
			MXKIMAGES.addImage("", b)
		}
		this.setImage("")
	};
	this.imageNames = [];
	this.addImage = function (b, d, f) {
		if (isIE8) {
			if (this.images[b]) {
				this.setImage(b);
				return
			}
		} else {
			if (MXKIMAGES.imageNames[b]) {
				this.setImage(b);
				return
			}
		}
		MXKIMAGES.lImgs++;
		MXKIMAGES.loadStarted = true;
		this.hide();
		var c = $("<img id='" + b + "_tmp" + this.name + "' src='' class='" + b + "' style='position:absolute; left:-5000px; top:0px'/>");
		c.data("sprite", this);
		if (isIE8) {
			var e = $("<img id='" + b + "' src='" + d + "' class='sprite_image' />")
		}
		if (isIE8 && d.substring(0, 20).indexOf("png") != -1) {
			e.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src='" + d + "')")
		}
		if (isIE8) {
			e.hide();
			this.images[b] = e
		} else {
			this.imageNames = [];
			this.imageNames[this.imageNames.length] = b
		}
		c.load(function (g) {
			if (!(isIE8 || isIE7 || isIE6)) {
				loadImage($(this), e, false, f)
			}
		});
		c.attr("src", d);
		$("body").append(c);
		if ((isIE8 || isIE7 || isIE6)) {
			setTimeout(function () {
				loadImage(c, e, true, f)
			}, 10)
		}
	};
	this.spriteCount = 1;
	this.setSpriteCount = function (c) {
		this.spriteCount = c;
		this.height = parseInt(this.imageHeight / c);
		var g = (c * 100) + "%";
		for (var b in this.images) {
			this.images[b].css("height", g)
		}
		var e = "h_" + this.height;
		var f = this.imgObj.attr("class").split(/\s+/);
		for (var b = 0; b < f.length; b++) {
			var d = f[b];
			if (d.substring(0, 2) == "h_") {
				this.imgObj.removeClass(d)
			}
		}
		MXKIMAGES.addHeightClass(e, this.height);
		this.imgObj.addClass(e);
		this.imgObj.css({
			width : "",
			height : ""
		})
	};
	this.imageSet = false;
	this.setImage = function (c, e) {
		if (!this.imageSet) {
			if (c != undefined && (c != "" || isEdit())) {
				this.imageSet = true
			}
		}
		if (!c) {
			c = ""
		}
		if (!e && c == this.activeImageName) {
			return
		}
		if (isEdit()) {
			var g = false;
			for (var d in this.imageNames) {
				if (this.imageNames[d] == "") {
					continue
				}
				if (this.imageNames[d] == c) {
					g = true
				}
			}
			if (!g) {
				this.imageNames = [];
				this.imageNames[this.imageNames.length] = c
			}
		}
		if (isIE8) {
			this.diagHalf = undefined;
			this.diagAngle = undefined;
			var f = this.images[c];
			if (!f) {
				f = MXKIMAGES.getImage(c);
				if (f == undefined) {
					return
				}
				f = f.clone(true);
				this.images[c] = f;
				this.imgObj.append(f)
			}
			this.imageWidth = f.data("width");
			this.imageHeight = f.data("height");
			this.width = f.data("width");
			this.setSpriteCount(this.spriteCount);
			this.scaleTo(this.scale, true);
			this.alignHandles();
			if (this.activeImage) {
				this.activeImage.hide()
			}
			f.show();
			if ($.browser.msie) {
				f.css({
					visibility : "visible",
					display : "block"
				})
			}
			this.activeImage = f
		} else {
			if (c != "") {
				var b = MXKIMAGES.imageNames[c];
				this.imageWidth = b.width;
				this.imageHeight = b.height;
				this.width = b.width;
				this.setSpriteCount(this.spriteCount);
				this.scaleTo(this.scale, true);
				this.alignHandles();
				if (this.activeImageName) {
					this.imgObj.removeClass(this.activeImageName)
				}
				this.imgObj.addClass(c)
			}
			this.activeImage = MXKIMAGES.getImage(c)
		}
		if (isH5) {
			var f = MXKIMAGES.getImage(c);
			if (f == undefined) {
				return
			}
			this.imageWidth = f.data("width");
			this.imageHeight = f.data("height");
			this.width = f.data("width");
			this.setSpriteCount(this.spriteCount);
			this.scaleTo(this.scale, true);
			this.activeImage = f
		}
		this.activeImageName = c
	};
	this.imgObj.data("sprite", this);
	this.imgObj.click(function () {
		var c = $(this).data("sprite");
		if (!c.isControl && isEdit() && c.mode != "EDIT") {
			var b = c.index;
			MXKEDITOR.activateSprite(b);
			MXKPANE.update()
		} else {
			if (c.mode == "EDIT" && !c.handleClicked) {
				c.switchToDefaultMode()
			} else {
				c.onClick()
			}
		}
		c.handleClicked = false
	});
	this.spriteIndexApply = false;
	this.positionApply = true;
	this.angleApply = false;
	this.scaleApply = false;
	this.opacityApply = false;
	this.zIndexApply = false;
	this.visibilityApply = false;
	this.position = {
		top : 0,
		left : 0
	};
	this.angle = 0;
	this.scale = 1;
	this.opacity = 1;
	this.spriteIndex = 1;
	this.width = 68;
	this.height = 68;
	this.imageWidth = 68;
	this.imageHeight = 68;
	this.visibility = true;
	this.destroy = function () {
		this.imgObj.remove()
	};
	this.hide = function () {
		this.imgObj.hide()
	};
	this.show = function () {
		this.imgObj.css({
			visibility : "visible",
			display : "block"
		})
	};
	this.fadeTo = function (b) {
		if (b == undefined || this.opacity == b) {
			this.opacityApply = false;
			return
		}
		this.opacity = b;
		this.opacityApply = true
	};
	this.moveTo = function (b, c) {
		if (b == undefined || c == undefined) {
			return
		}
		if (this.position.left == b && this.position.top == c) {
			this.positionApply = false;
			return
		}
		this.position.left = b;
		this.position.top = c;
		this.positionApply = true
	};
	this.move = function (c, b) {
		if (c == 0 && b == 0) {
			return
		}
		this.moveTo(this.position.left + c, this.position.top + b)
	};
	this.rotateTo = function (b) {
		if (b == undefined || this.angle == b) {
			this.angleApply = false;
			return
		}
		this.angle = b;
		this.angleApply = true
	};
	this.rotate = function (b) {
		if (b == undefined || b == 0) {
			return
		}
		this.rotateTo(this.angle + b)
	};
	this.zIndex = 0;
	this.setZIndex = function (b) {
		if (b == undefined || this.zIndex == b) {
			this.zIndexApply = false;
			return
		}
		if (isNaN(b)) {
			this.zIndex = parseInt(b)
		} else {
			this.zIndex = b
		}
		this.zIndexApply = true
	};
	this.setZIndex(100);
	this.scaleTo = function (b, c) {
		if (b == undefined || (!c && this.ratio == b)) {
			this.scaleApply = false;
			return
		}
		this.scale = b;
		this.scaleApply = true
	};
	this.scaleTo(0.99);
	this.scaleTo(1);
	this.setSpriteIndex = function (b) {
		if (b == undefined || this.spriteIndex == b) {
			this.spriteIndexApply = false;
			return
		}
		this.spriteIndex = b;
		this.spriteIndexApply = true
	};
	this.setEasing = function (b) {
		this.easingOrig = b;
		this.easing = b;
		this.easingName = undefined;
		if (b instanceof Array) {
			this.easing = 5;
			this.easingName = "cubic-bezier";
			this.bezier = b
		} else {
			if (b == 1) {
				this.easingName = "ease";
				this.bezier = [0.25, 0.1, 0.25, 1]
			} else {
				if (b == 2) {
					this.easingName = "ease-in";
					this.bezier = [0.42, 0, 1, 1]
				} else {
					if (b == 3) {
						this.easingName = "ease-out";
						this.bezier = [0, 0, 0.58, 1]
					} else {
						if (b == 4) {
							this.easingName = "ease-in-out";
							this.bezier = [0.42, 0, 0.58, 1]
						}
					}
				}
			}
		}
	};
	this.setInterpolation = function (b) {
		this.interpolation = b
	};
	this.setSound = function (b) {
		this.sound = b
	};
	this.setVisibility = function (b) {
		if (b == undefined) {
			if (this.imageSet && this.visibility == false) {
				this.visibility = true;
				this.visibilityApply = true
			} else {
				if (!this.imageSet && this.visibility == true) {
					this.visibility = false;
					this.visibilityApply = true
				}
			}
			return
		}
		if (this.visibility != b) {
			this.visibility = b;
			this.visibilityApply = true
		}
	};
	this.getWidth = function () {
		if (this.parentSprite) {
			return this.width * this.getInheritedScale()
		} else {
			return this.width * this.scale
		}
	};
	this.getHeight = function () {
		if (this.parentSprite) {
			return this.height * this.getInheritedScale()
		} else {
			return this.height * this.scale
		}
	};
	this.getRotation = function () {
		var j = this.imgObj.css("-webkit-transform") || this.imgObj.css("-moz-transform") || this.imgObj.css("-ms-transform") || this.imgObj.css("-o-transform") || this.imgObj.css("transform") || "fail...";
		var n = j.split("(")[1];
		n = n.split(")")[0];
		n = n.split(",");
		var m = n[0];
		var l = n[1];
		var h = n[2];
		var g = n[3];
		var f = Math.sqrt(m * m + l * l);
		var k = l / f;
		var e = Math.round(Math.atan2(l, m) * (180 / Math.PI));
		return e
	};
	this.delay = 100;
	this.isRunning = false;
	this.startAnimation = function (d, e, c) {
		if (c == 0) {
			c = 0.0001
		}
		if (isCSS3) {
			delete runningRegistry[this.name];
			if (this.isRunning == true) {
				this.isRunning = false;
				this.animation.reset();
				this.onAnimationStop();
				this.isStopAnimation = false
			}
			if (d != undefined && d != null) {
				this.animation = d;
				this.animation.reset()
			}
			this.playFrom = e;
			this.playTo = c;
			this.duration = this.animation.duration;
			if (c != undefined) {
				this.animation.setEndFrame(c);
				this.duration = c
			}
			if (e != undefined) {
				this.animation.setFrame(e);
				this.duration -= e
			}
			this.isRunning = true;
			if (d != undefined && d != null) {
				this.animation = d;
				this.animation.reset();
				if (this.animation.sprite && this.animation.sprite != this) {
					//alert("Error: running single animation instance on multiple sprites")
				}
				this.animation.sprite = this
			}
			if (!isEdit()) {
				this.applyFrame(this.animation.findLastDefinedTimeFrameOrInterpolate(e));
				this.update()
			}
			this.onAnimationStart();
			this.imageSet = false;
			if (this.isPaused) {
				this.resumeAnimation()
			}
			runningRegistry[this.name] = this;
			if (isAnimationLoop) {
				startAnimationLoop()
			}
		} else {
			if (isH5) {
				if (this.isRunning == true) {
					delete runningRegistry[this.name];
					this.isRunning = false;
					this.animation.reset();
					this.onAnimationStop();
					this.isStopAnimation = false
				}
				if (d != undefined && d != null) {
					this.animation = d;
					this.animation.reset()
				}
				if (e != undefined) {
					var b = this.animation.calcIndexFromTime(e);
					this.animation.setFrame(b)
				}
				if (c != undefined) {
					var b = this.animation.calcIndexFromTime(c);
					this.animation.setEndFrame(b)
				}
				this.isRunning = true;
				this.onAnimationStart();
				runningRegistry[this.name] = this;
				this.imageSet = false;
				this.animation.h5Start = 0;
				startAnimationLoop()
			} else {
				if (this.isRunning == true) {
					delete runningRegistry[this.name];
					this.isRunning = false;
					this.animation.reset();
					this.onAnimationStop();
					this.isStopAnimation = false
				}
				if (d != undefined && d != null) {
					this.animation = d;
					this.animation.reset()
				}
				if (e != undefined) {
					var b = this.animation.calcIndexFromTime(e);
					this.animation.setFrame(b)
				}
				if (c != undefined) {
					var b = this.animation.calcIndexFromTime(c);
					this.animation.setEndFrame(b)
				}
				this.isRunning = true;
				this.onAnimationStart();
				runningRegistry[this.name] = this;
				this.imageSet = false;
				startAnimationLoop()
			}
		}
	};
	this.isStopAnimation = false;
	this.animate = function () {
		if (this.isRunning == false) {
			return
		}
		if (this.onDrawFrame != undefined) {
			this.onDrawFrame()
		}
		if (this.isStopAnimation) {
			delete runningRegistry[this.name];
			this.isRunning = false;
			this.animation.reset();
			this.onAnimationStop();
			this.isStopAnimation = false;
			return
		}
		var c = this.animation.isNextFrame();
		if (!c) {
			delete runningRegistry[this.name];
			this.isRunning = false;
			if (isEdit() && Object.keys(runningRegistry).length == 0) {
				var b = this.animation.index - 1;
				MXKEDITOR.setActiveFrame(b);
				$("#activeFrame").val(b + 1).change();
				MXKPANE.update()
			}
			this.animation.reset();
			this.finish();
			this.onAnimationEnd();
			return
		}
		var d = this.animation.getNextFrame();
		if (d != undefined && d != null) {
			this.ix = ix;
			this.applyFrame(d)
		} else {
			if (this.animation.index == 1) {
				this.imageSet = false;
				this.setVisibility();
				this.ix = ix
			}
		}
	};
	this.animateH5 = function () {
		if (this.isRunning == false) {
			return
		}
		if (this.onDrawFrame != undefined) {
			this.onDrawFrame()
		}
		var c = this.animation;
		if (this.isStopAnimation) {
			delete runningRegistry[this.name];
			this.isRunning = false;
			c.reset();
			this.onAnimationStop();
			this.isStopAnimation = false;
			if (isEdit()) {
				stopAnimationLoop()
			}
			return
		}
		if (!c.h5Start) {
			c.h5Start = h5Clock
		}
		c.h5Time = (h5Clock - c.h5Start) / 1000;
		var b = c.isNextFrameH5();
		if (!b) {
			delete runningRegistry[this.name];
			this.isRunning = false;
			if (isEdit()) {
				stopAnimationLoop();
				MXKCANVAS.clearH5();
				MXKEDITOR.setActiveFrame(c.calcTimeFromIndex(c.endIndex));
				MXKPANE.update()
			}
			c.reset();
			this.finish();
			this.onAnimationEnd();
			return
		}
		var d = c.getNextFrameH5();
		if (d != undefined && d != null) {
			this.ix = ix;
			this.applyFrame(d)
		} else {
			if (this.animation.index == 1) {
				this.imageSet = false;
				this.setVisibility();
				this.ix = ix
			}
		}
	};
	this.css3AnimationEnd = function () {
		if (this.animation.isEndIndex) {
			var b = this.animation.findLastDefinedTimeFrameOrInterpolate(this.animation.endIndex)
		} else {
			var b = this.animation.findLastDefinedTimeFrame(1000000)
		}
		this.applyFrame(b);
		this.update();
		delete runningRegistry[this.name];
		this.isRunning = false;
		this.animation.reset();
		this.finish();
		this.onAnimationEnd()
	};
	this.finish = function () {};
	if (isCSS3) {
		this.imgObj.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function (c) {
			var b = $(this).data("sprite");
			b.css3AnimationEnd();
			return false
		})
	}
	this.pauseAnimation = function () {
		delete runningRegistry[this.name];
		if (isCSS3) {
			this.imgObj.css({
				"animation-play-state" : "paused",
				"-webkit-animation-play-state" : "paused"
			});
			this.isPaused = true
		}
	};
	this.resumeAnimation = function () {
		if (isCSS3) {
			this.imgObj.css({
				"animation-play-state" : "running",
				"-webkit-animation-play-state" : "running"
			});
			this.isPaused = false
		}
		runningRegistry[this.name] = this
	};
	this.findLastDefinedFrame = function (b) {
		return this.animation.findLastDefinedFrame(b)
	};
	this.setParentSprite = function (c) {
		if (!this.parentSprite && !c) {
			return
		}
		if (this.parentSprite && !c) {
			if (!isIE8) {
				this.imgObj.detach();
				this.canvas.addSprite(this)
			}
			for (var b = 0; b < c.children.length; b++) {
				if (c.children[b] == this) {
					c.children.splice(b, 1)
				}
			}
			this.parentSprite = undefined;
			return
		}
		if (!isIE8) {
			this.imgObj.detach();
			c.imgObj.append(this.imgObj)
		}
		c.children.push(this);
		this.parentSprite = c
	};
	this.update = function (x, p) {
		var o = "";
		var g = "";
		var q = "";
		var t = 0;
		var d = 0;
		if (this.isUndo) {
			this.updateUndoBuffer(5)
		}
		var y = (this.parentSprite != undefined);
		var k = y && isIE8;
		if (this.spriteIndexApply || this.positionApply || this.angleApply || this.scaleApply || this.opacityApply || this.zIndexApply || this.visibilityApply || this.firstLoad || k) {
			var m = this.canvas.GLOBAL_SCALE;
			if (this.opacity != 1) {
				o += "opacity:" + this.opacity + ";"
			}
			this.opacityApply = false;
			if (isWebKit) {
				g += "-webkit-transform:"
			} else {
				if (isMozilla) {
					g += "-moz-transform:"
				} else {
					if (isOpera) {
						g += "-o-transform:"
					} else {
						if (isIE9) {
							g += "-ms-transform:"
						}
					}
				}
			}
			if (!(isIE8 || isIE7 || isIE9)) {
				q += "transform:"
			}
			var f,
			e,
			l;
			if (m == 1 || y) {
				f = this.position.left;
				e = this.position.top;
				l = this.scale
			} else {
				f = (this.position.left * m) + (this.width * (m - 1)) / 2;
				e = (this.position.top * m) + (this.height * (m - 1)) / 2;
				l = this.scale * m
			}
			if (isWebKit || isMozilla || isIE10) {
				var s = " translate3d(" + f + "px, " + e + "px, 0px) rotateZ(" + this.angle + "deg) scale3d(" + l + "," + l + ",1);";
				g += s;
				q += s
			} else {
				if (isIE9 || isOpera) {
					g += " translate(" + f + "px, " + e + "px) rotate(" + this.angle + "deg) scale(" + l + ");"
				} else {
					if (isIE6 || isIE7 || isIE8) {
						if (k) {
							var v = (this.getInheritedAngle())
						} else {
							var v = this.angle
						}
						if (v > 90 && v <= 180) {
							v = 180 - v
						} else {
							if (v > 180 && v <= 270) {
								v -= 180
							} else {
								if (v > 270 && v <= 360) {
									v = 360 - v
								}
							}
						}
						if (k) {
							var z = this.getInheritedAngle() * (Math.PI / 180)
						} else {
							var z = this.angle * (Math.PI / 180)
						}
						var c = Math.cos(z);
						var b = Math.sin(z);
						if (isIE6 || isIE7) {
							o += "filter: progid:DXImageTransform.Microsoft.Matrix(filtertype='bilinear', sizingMethod='auto expand', M11=" + c + ", M12=" + (-b) + ", M21=" + b + ", M22=" + c + ");"
						} else {
							o += "-ms-filter: \"progid:DXImageTransform.Microsoft.Matrix(filtertype='bilinear', SizingMethod='auto expand', M11=" + c + ", M12=" + (-b) + ", M21=" + b + ", M22=" + c + ')";'
						}
						z = v * (Math.PI / 180);
						var n = this.getWidth();
						var u = this.getHeight();
						var r = Math.sqrt(n * n + u * u) / 2;
						t = r * Math.sin(Math.atan(u / n) + z) - (u / 2);
						d = r * Math.sin(Math.atan(n / u) + z) - (n / 2);
						o += "width:" + (parseInt(this.width * this.scale)) + "px; height:" + (parseInt(this.height * this.scale)) + "px;"
					}
				}
			}
			this.angleApply = false;
			this.scaleApply = false;
			if (this.zIndex != 0 || k) {
				if (k) {
					o += "z-index:" + this.getInheritedZIndex() + ";"
				} else {
					o += "z-index:" + this.zIndex + ";"
				}
			}
			this.zIndexApply = false;
			if (k) {
				this.getChildPosition();
				o += "top:" + (this.childPosition.top - t) + "px; left:" + (this.childPosition.left - d) + "px;"
			}
			this.positionApply = false;
			if (isIE8) {
				var j = "margin-top:" + (-this.height * this.spriteIndex) + "px;";
				this.imgObjSub.css("cssText", j)
			} else {
				o += "background-position: 0px " + (-this.height * (this.spriteIndex - 1)) + "px;"
			}
			this.spriteIndexApply = false;
			o += g + q
		}
		if (x) {
			return o
		}
		if (o != "") {
			this.imgObj.css("cssText", o)
		}
		if (this.firstLoad) {
			this.show();
			this.firstLoad = false
		}
		if (isIE8 && this.children.length > 0) {
			this.updateChildren()
		}
		if (p) {
			MXKSOUNDS.playSound(this.sound)
		}
	};
	this.updateCss3Sprite = function (b) {
		if (b.p) {
			return "background-position: 0px " + (-this.height * (this.spriteIndex - 1)) + "px;"
		}
		return ""
	};
	this.updateCss3Easing = function () {
		if (this.easing) {
			var b = this.easingName;
			if (this.easing == 5) {
				b += "(" + this.bezier[0] + "," + this.bezier[1] + "," + this.bezier[2] + "," + this.bezier[3] + ")"
			}
		} else {
			b = "linear"
		}
		if (isWebKit) {
			return "-webkit-animation-timing-function:" + b + ";"
		} else {
			if (isMozilla) {
				return "-moz-animation-timing-function:" + b + ";"
			} else {
				return "animation-timing-function:" + b + ";"
			}
		}
	};
	this.updateCss3 = function (n) {
		var f = "";
		var j = "";
		var c = "";
		if (this.isUndo) {
			this.updateUndoBuffer(5)
		}
		var l = (this.parentSprite != undefined);
		var g = l && isIE8;
		if (this.spriteIndexApply || this.positionApply || this.angleApply || this.scaleApply || this.opacityApply || this.zIndexApply || this.visibilityApply || this.firstLoad || g) {
			var h = this.canvas.GLOBAL_SCALE;
			if (n.o) {
				f += "opacity:" + this.opacity + ";"
			}
			this.opacityApply = false;
			if (n.t) {
				if (isWebKit) {
					j += "-webkit-transform: "
				} else {
					if (isMozilla) {
						j += "-moz-transform: "
					} else {
						if (isOpera) {
							j += "-o-transform: "
						} else {
							if (isIE9) {
								j += "-ms-transform: "
							}
						}
					}
				}
				if (!(isIE8 || isIE7)) {
					c += "transform: "
				}
				var d,
				b,
				e;
				if (h == 1 || l) {
					d = this.position.left;
					b = this.position.top;
					e = this.scale
				} else {
					d = (this.position.left * h) + (this.width * (h - 1)) / 2;
					b = (this.position.top * h) + (this.height * (h - 1)) / 2;
					e = this.scale * h
				}
				if (isWebKit || isMozilla || isIE10) {
					var m = "";
					m += " translate3d(" + d + "px, " + b + "px, 0px) ";
					m += "rotateZ(" + this.angle + "deg) ";
					m += "scale3d(" + e + "," + e + ",1)";
					m += ";";
					j += m;
					c += m
				} else {
					if (isIE9 || isOpera) {
						var m = "";
						m += " translate(" + d + "px, " + b + "px) ";
						m += "rotate(" + this.angle + "deg) ";
						m += "scale(" + e + ")";
						m += ";";
						j += m;
						c += m
					}
				}
			}
			this.angleApply = false;
			this.scaleApply = false;
			this.positionApply = false;
			if (n.z) {
				if (g) {
					f += "z-index:" + this.getInheritedZIndex() + ";"
				} else {
					f += "z-index:" + this.zIndex + ";"
				}
			}
			this.zIndexApply = false;
			if (n.v) {
				if (this.visibility == false) {
					f += "display:none;";
					this.visibilityApply = false
				}
			}
			if (isIE8) {
				var k = "margin-top:" + (-this.height * this.spriteIndex) + "px;";
				this.imgObjSub.css("cssText", k)
			} else {}

			this.spriteIndexApply = false;
			f += j + c
		}
		if (this.firstLoad) {
			this.show();
			this.firstLoad = false
		}
		return f
	};
	this.checkH5Redraw = function (b) {
		if (this.spriteIndexApply || this.positionApply || this.angleApply || this.scaleApply || this.opacityApply || this.zIndexApply || this.visibilityApply || this.firstLoad) {
			this.canvas.isH5Redraw = true;
			return true
		}
		return false
	};
	this.updateH5 = function () {
		if (this.isUndo) {
			this.updateUndoBuffer(5)
		}
		if (!this.canvas.isH5Redraw) {
			return
		}
		var f = this.canvas.GLOBAL_SCALE;
		var c = (this.parentSprite != undefined);
		var e = this.canvas.canvasH5[0].getContext("2d");
		e.save();
		e.webkitImageSmoothingEnabled = true;
		e.mozImageSmoothingEnabled = true;
		var b = this.getHeight();
		var h = this.getWidth();
		if (c) {
			var d = toRad(this.getInheritedAngle());
			e.globalAlpha = this.getInheritedOpacity();
			this.getCenter();
			e.translate(this.center.left * f, this.center.top * f);
			e.rotate(d)
		} else {
			e.globalAlpha = this.opacity;
			e.translate((this.position.left + this.width / 2) * f, (this.position.top + this.height / 2) * f);
			e.rotate(toRad(this.angle))
		}
		if (this.spriteCount > 1) {
			e.drawImage(this.activeImage[0], 0, (this.spriteIndex - 1) * this.height, this.width, this.height, (-h * f) / 2, (-b * f) / 2, h * f, b * f)
		} else {
			e.drawImage(this.activeImage[0], -h * f / 2, -b * f / 2, h * f, b * f)
		}
		e.restore();
		this.opacityApply = false;
		this.angleApply = false;
		this.scaleApply = false;
		this.positionApply = false;
		this.zIndexApply = false;
		this.visibilityApply = false;
		this.spriteIndexApply = false;
		if (this.firstLoad) {
			this.firstLoad = false
		}
		if (this.children.length) {
			sortH5(this.children);
			for (var g in this.children) {
				this.children[g].updateH5()
			}
		}
	};
	this.applyFrame = function (b) {
		if (b) {
			this.moveTo(b.x, b.y);
			this.rotateTo(b.r);
			this.scaleTo(b.s);
			this.setZIndex(b.z);
			this.fadeTo(b.o);
			this.setVisibility(b.v);
			this.setSpriteIndex(b.p);
			this.setEasing(b.e);
			this.setInterpolation(b.b);
			this.setSound(b.a)
		}
	};
	this.stopAnimation = function () {
		if (this.isRunning == true) {
			this.isStopAnimation = true
		}
	};
	this.resetSpriteToPrevious = function (c) {
		var d = this.animation.findTimeFrameIndexByTime(c);
		if (d == 0) {
			return
		}
		var b = this.animation.findLastDefinedTimeFrame(c);
		if (b > -1) {
			this.copyTimeFrame(b, d, c)
		}
		MXKPANE.update()
	};
	this.copyTimeFrame = function (b, f, d) {
		var c = this.animation.timeFrames[b];
		var e = {
			x : c.x,
			y : c.y,
			z : c.z,
			i : c.i,
			s : c.s,
			r : c.r,
			b : c.b,
			p : c.p,
			e : c.e,
			t : d
		};
		this.animation.fillTimeFrame(e);
		this.addToUndoBuffer(e);
		MXKPANE.update()
	};
	this.onDrawFrame = undefined;
	this.onAnimationStart = function () {};
	this.onAnimationEnd = function () {};
	this.onAnimationStop = function () {};
	this.onClick = function () {};
	this.hoverStart = function () {};
	this.hoverEnd = function () {};
	this.imgObj.hover(function () {
		$(this).data("sprite").hoverStart()
	}, function () {
		$(this).data("sprite").hoverEnd()
	});
	spriteRegistry[a] = this;
	spriteRegistryH5.push(this);
	this.scaleTo(1);
	this.dragStartDistance = 0;
	this.dragCenterX = 0;
	this.dragCenterY = 0;
	this.dragStartAngle = 0;
	this.dragStartScale = 0;
	this.dragStartX = 0;
	this.dragStartY = 0;
	this.alignHandles = function () {
		if (this.scaleHandle) {
			this.scaleHandle.css("left", (this.width - 15) + "px");
			this.scaleHandle.css("top", (this.height - 15) + "px");
			this.scaleHandle.css("transform", "scale(" + (1 / this.getInheritedScale()) + ")");
			this.positionHandle.css("left", ((this.width) / 2 - 15) + "px");
			this.positionHandle.css("top", ((this.height) / 2 - 15) + "px");
			this.positionHandle.css("transform", "scale(" + (1 / this.getInheritedScale()) + ")");
			this.rotationHandle.css("transform", "scale(" + (1 / this.getInheritedScale()) + ")")
		}
	};
	this.undoBuffer = [];
	this.updateUndoBuffer = function (d) {
		var c = 0;
		if (this.undoBuffer != undefined) {
			var b = new Array(this.animation.timeFrames.length);
			for (i = 0; i < this.undoBuffer.length; i++) {
				b[i] = this.undoBuffer[i]
			}
			c = this.undoBuffer.length;
			this.undoBuffer = b
		} else {
			this.undoBuffer = new Array(this.animation.timeFrames.length)
		}
		for (i = c; i < this.undoBuffer.length; i++) {
			this.undoBuffer[i] = new Array(d);
			this.undoBuffer[i][0] = 1
		}
	};
	this.isUndo = false;
	if (this.isUndo) {
		this.updateUndoBuffer(this.animation.frames.length, 5)
	}
	this.addToUndoBuffer = function (g) {
		this.updateUndoBuffer(5);
		var d = this.animation.findTimeFrameIndexByTime(g.t);
		var b = this.undoBuffer[d];
		var f = b[0];
		if (f == 1) {
			for (var e = b.length - 1; e > 1; e--) {
				b[e] = b[e - 1]
			}
			b[1] = g;
			return
		}
		if (f > 1) {
			var h = f - 2;
			for (var c = f; c < b.length; c++) {
				b[c - h] = b[c];
				if (c >= b.length - h) {
					b[c] = undefined
				}
			}
			b[0] = 1;
			b[1] = g
		}
	};
	this.undo = function (e) {
		var c = this.animation.findTimeFrameIndexByTime(e);
		var b = this.undoBuffer[c];
		var d = b[0];
		if (d == b.length - 1 || b[d + 1] == undefined) {
			return false
		}
		d = ++b[0];
		var f = b[d];
		if (f) {
			f.t = e;
			this.animation.fillTimeFrame(f);
			return true
		}
		return false
	};
	this.redo = function (e) {
		var c = this.animation.findTimeFrameIndexByTime(e);
		var b = this.undoBuffer[c];
		var d = b[0];
		if (d == 1) {
			return false
		}
		d = --b[0];
		var f = b[d];
		if (f) {
			f.t = e;
			this.animation.fillTimeFrame(f);
			return true
		}
	};
	if (isEdit() && !MXKEDITOR.isLoading) {
		this.setDefaultImage("")
	}
	this.children = [];
	this.updateChildren = function () {
		var b;
		for (i = 0; i < this.children.length; i++) {
			b = this.children[i];
			if (b.ix != ix) {
				b.update()
			}
		}
	};
	this.getInheritedPositionH5 = function () {
		if (this.parentSprite) {
			var c = this.parentSprite.getInheritedPositionH5();
			var b = toRad(this.parentSprite.getInheritedAngle())
		} else {
			return this.position
		}
	};
	this.getInheritedZIndex = function () {
		return ((this.zIndex != undefined) ? parseInt(this.zIndex) : 0) + ((this.parentSprite != undefined) ? this.parentSprite.getInheritedZIndex() : 0)
	};
	this.getInheritedAngle = function () {
		this.inheritedAngle = this.angle + ((this.parentSprite != undefined) ? this.parentSprite.getInheritedAngle() : 0);
		return this.inheritedAngle
	};
	this.getInheritedOpacity = function () {
		return this.opacity * ((this.parentSprite != undefined) ? this.parentSprite.getInheritedOpacity() : 1)
	};
	this.getInheritedScale = function () {
		return this.scale * ((this.parentSprite != undefined) ? this.parentSprite.getInheritedScale() : 1)
	};
	this.getDiagonalHalf = function () {
		if (!this.diagHalf) {
			this.diagHalf = Math.sqrt(this.width * this.width + this.height * this.height) / 2
		}
		return this.diagHalf
	};
	this.getDiagonalAngleRad = function () {
		if (!this.diagAngle) {
			this.diagAngle = Math.atan(this.height / this.width)
		}
		return this.diagAngle
	};
	this.center = {};
	this.getCenter = function () {
		if (!this.parentSprite) {
			this.center.top = this.position.top + this.height / 2;
			this.center.left = this.position.left + this.width / 2;
			return this.center
		}
		var b = this.parentSprite.getCenter();
		var j = this.parentSprite.getInheritedScale();
		var g = this.width * j / 2;
		var l = this.height * j / 2;
		var e = this.parentSprite.getWidth() / 2;
		var h = this.parentSprite.getHeight() / 2;
		var k = this.parentSprite.getInheritedAngle();
		var f = toRad(k);
		var m = Math.sin(f);
		var c = Math.cos(f);
		var d = this.getInheritedScale();
		this.center.top = b.top + c * (-h + l + this.position.top * j) + m * (-e + g + this.position.left * j);
		this.center.left = b.left - m * (-h + l + this.position.top * j) + c * (-e + g + this.position.left * j);
		return this.center
	};
	this.getChildPosition = function () {
		if (!this.childPosition) {
			this.childPosition = {
				top : this.position.top,
				left : this.position.left
			}
		}
		if (!this.parentSprite) {
			this.childPosition.top = this.position.top;
			this.childPosition.left = this.position.left;
			return
		}
		this.parentSprite.getChildPosition();
		var c = this.parentSprite.childPosition.left;
		var g = this.parentSprite.childPosition.top;
		var e = this.parentSprite.getDiagonalHalf();
		var f = this.parentSprite.getDiagonalAngleRad();
		var b = toRad(this.parentSprite.getInheritedAngle());
		c += Math.cos(f) * e - Math.cos(b + f) * e;
		g += Math.sin(f) * e - Math.sin(b + f) * e;
		c += Math.cos(b) * this.position.left - Math.sin(b) * this.position.top;
		g += Math.sin(b) * this.position.left + Math.cos(b) * this.position.top;
		if (isIE8) {
			var e = this.getDiagonalHalf();
			var f = this.getDiagonalAngleRad();
			c += Math.cos(b + f) * e - Math.cos(f) * e;
			g += Math.sin(b + f) * e - Math.sin(f) * e
		}
		this.childPosition.top = g;
		this.childPosition.left = c
	}
}
function MxkAnimation(b) {
	this.fps = FPS;
	this.duration = b;
	this.numOfFrames = 0;
	this.frames = new Array();
	this.timeFrames = new Array();
	this.framesInterpolated = new Array();
	this.time = 0;
	this.index = 0;
	this.endIndex = 0;
	this.isEndIndex = false;
	this.setNumOfFrames = function (d) {
		this.numOfFrames = d;
		var c = new Array(d);
		for (var e in this.frames) {
			if (e < c.length) {
				c[e] = this.frames[e]
			} else {
				break
			}
		}
		this.frames = c
	};
	this.isNextFrameH5 = function () {
		if (this.framesInterpolated.length == 0) {
			return false
		}
		if (this.isEndIndex && this.calcIndexFromTime(this.h5Time) > this.endIndex) {
			return false
		}
		if (this.calcIndexFromTime(this.h5Time) > this.framesInterpolated.length) {
			return false
		}
		return true
	};
	this.isNextFrame = function () {
		if (this.framesInterpolated.length == 0) {
			return false
		}
		if (this.index > this.framesInterpolated.length) {
			return false
		}
		if (this.isEndIndex && this.index > this.endIndex) {
			return false
		}
		return true
	};
	this.getNextFrameH5 = function () {
		var d = this.findLastDefinedTimeFrameOrInterpolate(this.h5Time);
		if (d) {
			var c = this.framesInterpolated[d.iix + 1]
		}
		return d
	};
	this.getNextFrame = function () {
		var c = this.framesInterpolated[this.index];
		this.index++;
		return c
	};
	this.setFrame = function (c) {
		this.index = c
	};
	this.setEndFrame = function (c) {
		this.endIndex = c;
		this.isEndIndex = true
	};
	this.reset = function () {
		if (isCSS3) {
			this.sprite.imgObj.css({
				animation : "",
				"animation-name" : "",
				"animation-duration" : "",
				"animation-timing-function" : "",
				"-webkit-animation" : "",
				"-webkit-animation-name" : "",
				"-webkit-animation-duration" : "",
				"-webkit-animation-timing-function" : ""
			});
			this.sprite.imgObj.redraw()
		} else {
			this.index = 0;
			this.isEndIndex = false
		}
	};
	var a = 0;
	this.fillTimeFrame = function (f) {
		if (f.t == undefined || f.t == null) {
			//alert("key-frame TIMESTAMP not specified");
			return false
		}
		if (f.e) {
			if (f.e == 1) {
				f.e = [0.25, 0.1, 0.25, 1]
			} else {
				if (f.e == 2) {
					f.e = [0.42, 0, 1, 1]
				} else {
					if (f.e == 3) {
						f.e = [0, 0, 0.58, 1]
					} else {
						if (f.e == 4) {
							f.e = [0.42, 0, 0.58, 1]
						}
					}
				}
			}
			preCalcBez(f.e)
		}
		var d = this.findTimeFrameIndexByTime(f.t);
		if (d == null) {
			f.id = a++;
			this.timeFrames[this.timeFrames.length] = f
		} else {
			if (isEdit()) {
				var c = this.timeFrames[d].tag;
				f.tag = c
			}
			this.timeFrames[d] = f
		}
		var e = this.calcIndexFromTime(f.t);
		this.sortTimeFrames();
		this.fillFrame(e, f);
		if (f.t == 0 && this.sprite) {
			this.sprite.applyFrame(f)
		}
	};
	this.sortTimeFrames = function () {
		var g = [];
		for (var e = 0; e < this.timeFrames.length; e++) {
			var f = this.timeFrames[e];
			if (f != undefined) {
				g[g.length] = f
			}
		}
		for (var e = 0; e < g.length - 1; e++) {
			for (var c = 0; c < g.length - e - 1; c++) {
				if (g[c].t > g[c + 1].t) {
					var d = g[c];
					g[c] = g[c + 1];
					g[c + 1] = d
				}
			}
		}
		this.timeFrames = g
	};
	this.calcIndexFromTime = function (c) {
		return parseInt(c * this.fps)
	};
	this.calcTimeFromIndex = function (c) {
		return parseInt(c / this.fps)
	};
	this.updateTimeFrameTime = function (g, e) {
		var d = this.calcIndexFromTime(g);
		this.deleteFrame(d);
		var c = this.findTimeFrameIndexByTime(g);
		this.timeFrames[c].t = e;
		var f = this.calcIndexFromTime(e);
		this.fillFrame(f, this.timeFrames[c]);
		this.sortTimeFrames()
	};
	this.setDuration = function (d) {
		this.duration = d;
		var c = parseInt(this.duration * this.fps);
		this.setNumOfFrames(c)
	};
	this.fillFrame = function (c, d) {
		this.frames[c] = d;
		this.refreshInterpolations()
	};
	this.exportTimeFrames = function () {
		var c = [];
		for (var d = 0; d < this.timeFrames.length; d++) {
			var e = this.timeFrames[d];
			if (e) {
				var f = {
					t : e.t,
					x : e.x,
					y : e.y,
					r : e.r,
					s : e.s,
					z : e.z,
					o : e.o,
					b : e.b,
					p : e.p,
					e : e.e
				};
				c[c.length] = f
			}
		}
		return c
	};
	this.fillTimeFrames = function (d) {
		for (var c = 0; c < d.length; c++) {
			if (d[c]) {
				this.fillTimeFrame(d[c])
			}
		}
	};
	this.fillFrames = function (c) {
		this.frames = c;
		this.refreshInterpolations()
	};
	this.findLastDefinedTimeFrameOrInterpolate = function (c) {
		var d = this.framesInterpolated[this.calcIndexFromTime(c)];
		if (d) {
			return d
		}
		return this.timeFrames[this.findLastDefinedTimeFrame(c)]
	};
	this.findLastDefinedTimeFrame = function (c) {
		if (c == 0) {
			return -1
		}
		var d = 0;
		var f = 0;
		for (var e = 0; e < this.timeFrames.length; e++) {
			var g = this.timeFrames[e];
			if (g != undefined) {
				if (g.t <= c && g.t >= d) {
					matTime = g.t;
					f = e
				}
			}
		}
		return f
	};
	this.findTimeFrameByTime = function (d) {
		var c = this.findTimeFrameIndexByTime(d);
		return this.timeFrames[c]
	};
	this.findTimeFrameInInterval = function (k, l, f) {
		if (f) {
			var g = 10000;
			var j = 0;
			for (var h = 0; h < this.timeFrames.length; h++) {
				var d = this.timeFrames[h];
				if (d != undefined) {
					if (d.t > k && d.t < g && d.t < l) {
						g = d.t;
						j = h
					}
				}
			}
			if (g == 10000) {
				return null
			}
			return this.timeFrames[j]
		} else {
			var c = -1;
			var e = 0;
			for (var h = 0; h < this.timeFrames.length; h++) {
				var d = this.timeFrames[h];
				if (d != undefined) {
					if (d.t > k && d.t > c && d.t < l) {
						c = d.t;
						e = h
					}
				}
			}
			if (c == -1) {
				return null
			}
			return this.timeFrames[e]
		}
		return null
	};
	this.findTimeFrameIndexByTime = function (d) {
		for (var c = 0; c < this.timeFrames.length; c++) {
			if (this.timeFrames[c] != undefined && this.timeFrames[c].t == d) {
				return c
			}
		}
		return null
	};
	this.findLastDefinedFrame = function (d) {
		for (var c = d; c >= 0; c--) {
			if (this.frames[c] != undefined) {
				return c
			}
		}
		return -1
	};
	this.deleteFrame = function (c) {
		this.frames[c] = undefined
	};
	this.deleteTimeFrame = function (e) {
		var d = this.findTimeFrameIndexByTime(e);
		if (this.timeFrames[d].tag != undefined) {
			this.timeFrames[d].tag.remove();
			this.timeFrames[d].tag = undefined
		}
		this.timeFrames[d] = undefined;
		var c = this.calcIndexFromTime(e);
		this.deleteFrame(c);
		this.refreshInterpolations()
	};
	this.refreshInterpolations = function () {
		for (var o = 0; o < this.frames.length; o++) {
			if (this.frames[o] != undefined) {
				if (this.frames[o].b == 1) {
					var p = this.findLastDefinedFrame(o - 1);
					if (p == -1) {
						continue
					}
					var e = this.frames[p];
					var g = this.frames[o];
					var w = o - p;
					var c = 1 / w;
					if (g.x != undefined) {
						var n = (g.x - e.x)
					}
					if (g.y != undefined) {
						var l = (g.y - e.y)
					}
					if (g.z != undefined) {
						var k = (g.z - e.z)
					}
					if (g.r != undefined) {
						var u = (g.r - e.r)
					}
					if (g.s != undefined) {
						var s = (g.s - e.s)
					}
					if (g.o != undefined) {
						var v = (g.o - e.o)
					}
					var h = 1;
					var t = 0;
					for (var m = p + 1; m < o; m++) {
						var r = t * c;
						t++;
						if (g.e) {
							r = getBY(g.e[0], g.e[1], g.e[2], g.e[3], r)
						}
						g = {
							x : (n == undefined) ? undefined : e.x + r * n,
							y : (l == undefined) ? undefined : e.y + r * l,
							z : (k == undefined) ? undefined : parseInt(e.z + r * k),
							r : (u == undefined) ? undefined : e.r + r * u,
							s : (s == undefined) ? undefined : e.s + r * s,
							o : (v == undefined) ? undefined : e.o + r * v,
							p : e.p,
							b : g.b,
							e : g.e
						};
						g.iix = m;
						this.framesInterpolated[m] = g;
						h++
					}
				} else {
					var p = this.findLastDefinedFrame(o - 1);
					for (var m = p + 1; m < o; m++) {
						this.framesInterpolated[m] = undefined
					}
				}
			}
			var q = this.frames[o];
			if (q) {
				q.iix = o
			}
			this.framesInterpolated[o] = q
		}
		for (var o = this.frames.length - 1; o > 0; o--) {
			if (this.frames[o] != undefined) {
				break
			}
			this.framesInterpolated[o] = undefined
		}
	};
	this.css3Keyframes = "";
	this.css3KeyframesName = "";
	this.css3KeyframesNames = [];
	this.css3KeyframesBodies = [];
	this.createCSS3 = function (s, H, j, d) {
		var D = parseInt(s.canvas.GLOBAL_SCALE * 100);
		var F = H + "-" + j + "-" + D;
		if (!d && !isOpera) {
			if (this.css3KeyframesNames[F]) {
				return
			}
		}
		this.css3KeyframesName = "anim" + s.name + "c" + css3Counter + "cx" + D;
		this.css3KeyframesNames[F] = this.css3KeyframesName;
		css3Counter++;
		var G = "";
		if (isWebKit) {
			G = "-webkit-"
		}
		var h = "@" + G + "keyframes " + this.css3KeyframesName + " {\n\t";
		if (isOpera && !d) {
			var m = this.css3KeyframesBodies[F];
			if (m) {
				this.css3Keyframes = h + m;
				if (isEdit() && this.styleBlock) {
					this.styleBlock.remove()
				}
				this.styleBlock = $("<style type='text/css'>" + this.css3Keyframes + "</style>").appendTo("head");
				return
			}
		}
		var l = "";
		var u = "";
		var w = 10000;
		var g = 0;
		var E = 0;
		var n = 0;
		var C = null;
		var v = null;
		var t = null;
		var p = null;
		if (H == undefined) {
			H = 0
		}
		if (j == undefined) {
			j = this.duration
		}
		var e = {};
		var r = null;
		for (var x = 0; x < this.timeFrames.length; x++) {
			var o = this.timeFrames[x];
			if (o != undefined && o.t >= H && o.t <= j) {
				if (!r) {
					r = o
				} else {
					if (r.x != o.x || r.y != o.y) {
						e.t = true
					}
					if (r.r != o.r) {
						e.t = true
					}
					if (r.s != o.s) {
						e.t = true
					}
					if (r.z != o.z) {
						e.z = true
					}
					if (r.o != o.o) {
						e.o = true
					}
					if (r.v != o.v) {
						e.v = true
					}
					if (r.p != o.p) {
						e.p = true
					}
				}
			}
		}
		for (var x = 0; x < this.timeFrames.length; x++) {
			var B = "";
			var o = this.timeFrames[x];
			if (o != undefined && o.t >= H && o.t <= j) {
				var q = this.timeFrames[x + 1];
				var c = (o.t - H) / (j - H);
				c = Math.round(c * 10000) / 100;
				B += c + "% {\n\t";
				s.applyFrame(o);
				var z = s.updateCss3(e);
				var A = s.updateCss3Sprite(e);
				var y = "";
				if (q) {
					s.applyFrame(q);
					var y = s.updateCss3Easing()
				}
				B += z + A + y;
				B += "}\n";
				if (o.t > E) {
					E = o.t;
					n = x
				}
				if (o.t < w) {
					w = o.t;
					g = x
				}
				if (!o.b && c != 0) {
					c = c - 0.01;
					u += c + "% {\n\t";
					u += C + v;
					u += "}\n"
				} else {
					if (p && o.p != p.p && c != 0) {
						c = c - 0.01;
						u += c + "% {\n\t";
						u += z + v;
						u += "}\n"
					}
				}
				u += B;
				p = o;
				C = z;
				v = A;
				t = y
			}
		}
		var o = this.timeFrames[n];
		if (o.t != j) {
			o = this.findLastDefinedTimeFrameOrInterpolate(j);
			u += "100% {\n\t";
			s.applyFrame(o);
			var z = s.updateCss3(e);
			var A = s.updateCss3Sprite(e);
			u += z + A;
			u += "}\n"
		}
		var o = this.timeFrames[g];
		if (o.t != H) {
			o = this.findLastDefinedTimeFrameOrInterpolate(H);
			l += "0% {\n\t";
			s.applyFrame(o);
			var z = s.updateCss3(e);
			var A = s.updateCss3Sprite(e);
			l += z + A;
			l += "}\n"
		}
		u += "}\n";
		var m = l + u;
		this.css3Keyframes = h + m;
		if (isOpera) {
			this.css3KeyframesBodies[F] = m
		}
		if (isEdit() && this.styleBlock) {
			this.styleBlock.remove()
		}
		this.styleBlock = $("<style type='text/css'>" + this.css3Keyframes + "</style>").appendTo("head")
	};
	this.startCss3 = function (c, d) {
		if (!isAnimationLoop) {
			this.sprite.imgObj.addClass("css3Paused")
		}
		this.sprite.styleToPlay = {
			animation : c + " " + d + "s linear",
			"-webkit-animation" : c + " " + d + "s linear"
		}
	}
}
function loadImage(c, e, d, f) {
	var a = c.data("sprite");
	a.width = c.width();
	a.height = c.height();
	a.scaleTo(a.scale, true);
	if (d) {
		a.imgObj.append(e)
	}
	var b = c.attr("class");
	c.remove();
	a.alignHandles();
	c.data("width", a.width);
	c.data("height", a.height);
	MXKIMAGES.addImage(b, c);
	MXKIMAGES.addImageClass(b, c.attr("src"), a.width, a.height);
	if (isEdit()) {
		$(".sprite_image_auto").autocomplete("option", "source", MXKIMAGES.getImageNames());
		$("#sprite_image_auto").val(b);
		MXKEDITOR.sprites[a.index].setImage(b);
		a.update()
	} else {
		a.setImage(b);
		a.update()
	}
	MXKIMAGES.lImgs--
}
function loadImageCanvas(e, f) {
	var b = e.data("canvas");
	var d = e.attr("class");
	if (f) {
		var c = e.get()[0].width;
		var a = e.get()[0].height
	} else {
		var c = e.width();
		var a = e.height()
	}
	e.remove();
	MXKIMAGES.addImageClass(d, e.attr("src"), c, a);
	if (isEdit()) {
		$("#sprite_image_auto").autocomplete("option", "source", MXKIMAGES.getImageNames());
		$("#canvas_image_auto").autocomplete("option", "source", MXKIMAGES.getImageNames());
		$("#canvas_image_auto").val(d)
	}
	b.setImage(d);
	MXKIMAGES.lImgs--
}
function toRad(a) {
	return a * (Math.PI / 180)
}
var mxkSrc = null;
function getOriginalSources() {
	var a = $("#mxk_animation").attr("src");
	if (!a) {
		return
	}
	$.ajax({
		url : a,
		type : "GET",
		dataType : "script",
		success : function (b) {
			mxkSrc = b
		},
		error : function (b) {
			console.log("[Mixeek] Failed to load animation script on resize")
		}
	})
}
var isFullReload = false;
var isReloadQueued = false;
function bindResize() {
	$(document).ready(function () {
		if (isCSS3) {
			getOriginalSources()
		}
	});
	$(window).resize(function () {
		console.log("RESIZE");
		if (isCSS3) {
			var a = false;
			for (var d in canvases) {
				if (canvases[d].scaleToParent && canvases[d].calcScale()) {
					a = true;
					break
				}
			}
			if (a && canvases.length) {
				fullReload()
			}
		} else {
			for (var d in canvases) {
				var e = canvases[d];
				if (e.scaleToParent && e.calcScale()) {
					e.applyStyle();
					if (isH5) {
						for (var b in e.sprites) {
							var c = e.sprites[b];
							c.positionApply = true
						}
						redrawH5(true)
					} else {
						stopAnimationLoop();
						for (var b in e.sprites) {
							var c = e.sprites[b];
							c.positionApply = true;
							c.update()
						}
						startAnimationLoop()
					}
				}
			}
		}
	})
}
function fullReload() {
	if (isFullReload) {
		colole.log("RELOADING");
		if (isReloadQueued) {
			colole.log("QUEUED");
			return
		} else {
			colole.log("PUT QUEUE");
			isReloadQueued = true;
			setTimeout(function () {
				fullReload()
			}, 200)
		}
	}
	isFullReload = true;
	isReloadQueued = false;
	if (!mxkSrc) {
		return
	}
	if (!canvases.length) {
		return
	}
	for (var i in canvases) {
		canvases[i].canvasDiv.remove()
	}
	canvases = [];
	spriteRegistry = {};
	runningRegistry = {};
	MXKIMAGES = new MxkImageCache();
	MXKSOUNDS = new MxkSoundCache();
	eval(mxkSrc);
	$(document).ready(function () {
		console.log("finish reload");
		isFullReload = false
	})
}
function sortH5(d) {
	for (var c = 0; c < d.length - 1; c++) {
		for (var a = 0; a < d.length - c - 1; a++) {
			if (d[a].zIndex > d[a + 1].zIndex) {
				var b = d[a];
				d[a] = d[a + 1];
				d[a + 1] = b
			}
		}
	}
}
var beziers = {};
var bCount = 400;
var a1 = [0, 0];
var a2 = [1, 1];
function getBKey(b, d, a, c) {
	return "" + b + d + a + c
}
function preCalcBez(d) {
	var b = d[0];
	var f = d[1];
	var a = d[2];
	var e = d[3];
	if (!(d instanceof Array)) {
		//alert('Frame easing "e" is supported only as cubic-bezier array format since 2.1 release, e.g. "e":[0.25,0.1,0.25,1] as a replacement for "ease"');
		return
	}
	var j = [];
	for (var c = 0; c < bCount; c++) {
		var g = cubicBezier([b, f], [a, e], c / bCount);
		j[Math.round(g[0] * bCount)] = g[1]
	}
	j[bCount - 1] = 1;
	var h = getBKey(b, f, a, e);
	beziers[h] = j
}
function getBY(c, l, b, k, a) {
	var n = getBKey(c, l, b, k);
	var o = beziers[n];
	var f = Math.round(a * bCount);
	var h = o[f];
	if (h != undefined) {
		return h
	}
	var e,
	d,
	m,
	l;
	for (e = f - 1; e >= 0; e--) {
		m = o[e];
		if (m) {
			break
		}
	}
	for (d = f + 1; d < bCount; d++) {
		l = o[d];
		if (l) {
			break
		}
	}
	var g = (f - e) / (d - e);
	return m + (l - m) * g
}
function cubicBezier(d, c, b) {
	var a = bezierC(b, a1, d, c, a2);
	return a
}
function bezierC(b, g, e, d, c) {
	var a = Math.pow(1 - b, 3) * g[0] + 3 * Math.pow(1 - b, 2) * b * e[0] + 3 * (1 - b) * b * b * d[0] + b * b * b * c[0];
	var f = Math.pow(1 - b, 3) * g[1] + 3 * Math.pow(1 - b, 2) * b * e[1] + 3 * (1 - b) * b * b * d[1] + b * b * b * c[1];
	return [a, f]
}
function bezier(d, f, e, c, b) {
	var a = Math.pow(d, 3) * (e[0] + 3 * (c[0] - b[0]) - f[0]) + 3 * Math.pow(d, 2) * (f[0] - 2 * c[0] + b[0]) + 3 * d * (c[0] - f[0]) + f[0];
	var g = Math.pow(d, 3) * (e[1] + 3 * (c[1] - b[1]) - f[1]) + 3 * Math.pow(d, 2) * (f[1] - 2 * c[1] + b[1]) + 3 * d * (c[1] - f[1]) + f[1];
	return [a, g]
}
$(document).ready(function () {
	MXKIMAGES = new MxkImageCache();
	MXKSOUNDS = new MxkSoundCache();
	bindResize()
});
