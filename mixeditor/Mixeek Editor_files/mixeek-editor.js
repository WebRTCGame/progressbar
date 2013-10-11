var MXK_READER, MXK_READER_FILE_NAME, trackTime = 0, trackIterator = 0;
function displayPreview(b, a, c) {
	b = b.target.files[0];
	MXK_READER_FILE_NAME = b.name.split(".")[0];
	/^\d.*/.test(MXK_READER_FILE_NAME) && (MXK_READER_FILE_NAME = "_" + MXK_READER_FILE_NAME);
	/\s/.test(MXK_READER_FILE_NAME) && (MXK_READER_FILE_NAME = MXK_READER_FILE_NAME.replace(/\s/g, "_"));
	MXK_READER = new FileReader;
	MXK_READER.onload = a ? function () {
		MXKCANVAS.setImage(MXK_READER_FILE_NAME, MXK_READER.result)
	}
	 : c ? function () {
		MXKSOUNDS.addSoundElement(MXK_READER_FILE_NAME, MXK_READER.result)
	}
	 : function () {
		MXKEDITOR.activeSprite.addImage(MXK_READER_FILE_NAME,
			MXK_READER.result)
	};
	MXK_READER.readAsDataURL(b)
}
var openOrSave = !0;
function loadAnimationFile(b) {
	b = b.target.files[0];
	openOrSave && (MXK_READER = new FileReader, MXK_READER.onload = function () {
		MXKEDITOR.loadAnimation(MXK_READER.result)
	}, MXK_READER.readAsBinaryString(b))
}
var MXKEDITOR = null, MXKPANE = null, MXKBAR = null, MXKMENU = null;
function MxkAlert() {
	this.dialog = $("<div id='comp-dialog' style='display:none;' title='Browser Support Limitation'></div>");
	this.dialog.append($("<p>You are using a browser which is not supported. Mixeek Design Tool requires certain HTML5 features in order to run correctly. Unfortunately not all browsers provide them yet. Recommended is newest version of Firefox. This limitation does NOT apply to created animations.</p>"));
	$("body").append(this.dialog);
	$("#comp-dialog").dialog({
		position : {
			my : "left top",
			at : "right bottom",
			of : $("#paneWrap")
		}
	})
}
function MxkHeaderBar() {}

function MxkCtxMenu() {}
function MxkFramePane() {
	"undefined" != typeof MXKPANE && null != MXKPANE && $("body").find("#paneWrap").remove();
	this.paneWrap = $("<div id='paneWrap' style='padding-bottom: 0px; height:auto;\tz-index: 2000;'></div>");
	this.mainPane = $("<div id='framePane' style='height:auto; overflow-x: scroll;-ms-overflow-x: scroll;overflow-y: hidden;-ms-overflow-y: hidden;'></div>");
	this.paneWrap.append(this.mainPane);
	$("body").append(this.paneWrap);
	this.swimlanes = {};
	this.addSwimlane = function (b) {
		var a = $("<div id='swimlane-" +
				b.name + "' style='padding:0px; display:inline-block;width:1500px;margin-bottom:-5px;'/>");
		$("body").find("#framePane").append(a);
		this.swimlanes[b.name] = a;
		this.update()
	};
	this.setActiveSwimlane = function (b) {
		if (b) {
			var a = this.swimlanes[b.name];
			if (a) {
				a.show();
				for (var c in this.swimlanes)
					c != b.name && void 0 != this.swimlanes[c] && this.swimlanes[c].hide()
			}
		}
	};
	this.projectFrames = function (b) {
		var a = this.swimlanes[b.name];
		if (void 0 != a) {
			for (var c = a.children(), e = b.animation.frames, d = 0; d < e.length; d++) {
				var f = c[d];
				void 0 ==
				f && (f = $("<div id='" + b.name + "-" + d + "' class='ui-corner-top ui-widget ui-widget-content' style='color: #3383BB; vertical-align : middle; border-width:0px; display : inline-block;cursor:pointer;width:20px;height:20px;margin-right:1px;margin-bottom:-1px; margin-top:2px;text-align:center;'>" + (d + 1) + "</div>"), f.data("sprite", b), f.data("index", d), a.append(f), f.click(function () {
						MXKEDITOR.setActiveFrame($(this).data("index"));
						MXKEDITOR.activateSprite($(this).data("sprite").index);
						$("#activeFrame").val(MXKEDITOR.activeFrame);
						MXKPANE.update();
						MXKEDITOR.clearRunningState()
					}));
				void 0 != e[d] ? $(f).css({
					"background-color" : "#c9e7f0",
					border : "none"
				}) : $(f).css({
					"background-color" : "#EEEEEE",
					border : "none"
				});
				d == MXKEDITOR.activeFrame && (MXKEDITOR.activeSprite && b.index == MXKEDITOR.activeSprite.index) && $(f).css({
					border : "1px solid red",
					"z-index" : "200"
				});
				if (a.is(":visible")) {
					if (0 == d) {
						var g = $(f).width(),
						g = g + 1,
						g = g * e.length;
						a.css("width", g + 2 + "px")
					}
					d == e.length - 1 && (g = $(f).width(), g += 1, g += $(f).offset().left, g += $(f).parent().parent().scrollLeft(),
						a.css("width", g + 2 + "px"))
				}
			}
			if (c.length > e.length)
				for (d = e.length; d < c.length; d++)
					$(c[d]).remove()
		}
	};
	this.update = function () {
		void 0 == MXKEDITOR.activeSprite || null == MXKEDITOR.activeSprite || (this.setActiveSwimlane(MXKEDITOR.activeSprite), this.projectFrames(MXKEDITOR.activeSprite))
	};
	this.removeSwimlane = function (b) {
		this.swimlanes[b.name] = void 0
	};
	checkCompatibility() || new MxkAlert
}
function checkCompatibility() {
	return $.browser.opera || $.browser.msie ? !1 : !0
}
function MxkSpriteGui(b) {
	this.spriteTag = null;
	this.createPanels = function (a) {
		this.createSpriteTag(a)
	};
	this.activate = function () {};
	this.deactivate = function () {};
	this.createSpriteTag = function (a) {
		this.spriteTag = $("<div id='layer-" + a.index + "' class='layer'><span class='img_delete del_layer'></span><span class='img_eye hide_layer'></span><span class='text2 href_layer'>" + a.displayName + "</span><input type='text' value='" + a.displayName + "' maxlength='20' class='nameInput'></div>");
		this.spriteTag.appendTo("#layersList");
		this.spriteTag.data("sprite", a);
		var c = this.spriteTag.find(".hide_layer");
		c.data("sprite", a);
		var e = this.spriteTag.find(".del_layer");
		e.data("sprite", a);
		e.click(function () {
			if (1 != MXKEDITOR.countSprites() && confirm("Do you really want to delete the layer?")) {
				var c = $(this).data("sprite").index;
				MXKEDITOR.removeSprite(c)
			}
		});
		c.click(function () {
			var c = $(this).data("sprite").index,
			c = MXKEDITOR.sprites[c];
			c.imgObj.data("hidden") ? (c.imgObj.show(), c.imgObj.data("hidden", !1), $(this).removeClass("img_eye_hidden").addClass("img_eye")) :
			(c.imgObj.hide(), c.imgObj.data("hidden", !0), $(this).removeClass("img_eye").addClass("img_eye_hidden"))
		});
		c = this.spriteTag.find(".href_layer");
		c.data("sprite", a);
		c.dblclick(function () {
			$(this).hide();
			var c = $(this).next();
			c.val($(this).text());
			c.show();
			c.focus();
			c = $(this).data("sprite");
			MXKEDITOR.activateSprite(c.index)
		});
		c.click(function () {
			var c = $(this).data("sprite");
			MXKEDITOR.activateSprite(c.index)
		});
		a = c.next();
		a.keyup(function (c) {
			if (13 == c.keyCode || 27 == c.keyCode)
				$(this).hide(), c = $(this).prev(), c.text($(this).val()),
				c.show(), c = c.data("sprite").index, c = MXKEDITOR.sprites[c], c.displayName = $(this).val(), $("#sprite_copy_sprite").autocomplete("option", "source", MXKEDITOR.getSpriteNames()), $("#sprite_parent_sprite").autocomplete("option", "source", MXKEDITOR.getSpriteNames()), $("#swimlabel-" + c.name + " span").text(c.displayName)
		});
		a.blur(function () {
			$(this).hide();
			var c = $(this).prev();
			c.text($(this).val());
			c.show();
			c = c.data("sprite").index;
			c = MXKEDITOR.sprites[c];
			c.displayName = $(this).val();
			$("#sprite_copy_sprite").autocomplete("option",
				"source", MXKEDITOR.getSpriteNames());
			$("#sprite_parent_sprite").autocomplete("option", "source", MXKEDITOR.getSpriteNames());
			$("#swimlabel-" + c.name + " span").text(c.displayName)
		})
	};
	this.createPanels(b)
}
function MxkAnimationEditor(b) {
	this.isLoading = !1;
	this.createEditor = function () {
		$(".version").text("Version: 2.1.2beta");
		var c = $("<div id='modal_save' title='Copy-Save dialog' >\t<p>Copy the content of the text box below and save it in any text editor. From security reasons browsers don't allow automated save operation.</p>\t<textarea cols='50' rows='15' style='width:100%'>A</textarea> </div> ");
		$("body").append(c)
	};
	b || this.createEditor();
	this.activeSprite = null;
	this.sprites = [];
	this.activeFrame = parseFloat($("#activeFrame").val());
	this.animDuration = parseFloat($("#animDuration").val());
	this.recreate = function () {
		spriteRegistry = {};
		runningRegistry = {};
		canvases = [];
		$("#layersList").empty();
		MXKEDITOR = new MxkAnimationEditor(!0);
		MXKPANE = new MxkTimeLine;
		MXKIMAGES = new MxkImageCache;
		MXKSOUNDS = new MxkSoundCache;
		$("#animDuration").change()
	};
	this.loadAnimation = function (c) {
		this.recreate();
		MXKEDITOR.isLoading = !0;
		eval(c);
		MXKEDITOR.activateSprite(MXKEDITOR.tab_counter - 1);
		MXKEDITOR.setActiveFrame(0);
		MXKPANE.update(!0);
		MXKEDITOR.isLoading = !1
	};
	this.saveAnimation =
	function () {
		var c;
		c = "" + this.saveCanvas();
		for (var a in this.sprites)
			if (null != this.sprites[a]) {
				var b = this.sprites[a];
				c += this.saveSpriteTime(b)
			}
		for (a in this.sprites)
			null != this.sprites[a] && (b = this.sprites[a], c += this.saveSpriteDependencies(b));
		return c += this.exportEditor()
	};
	this.initEditorValues = function (c, a, b) {
		MXKEDITOR.setAnimDuration(c);
		$("#play_from").val(a);
		$("#play_to").val(b);
		$("#animDuration").val(c)
	};
	this.exportEditor = function () {
		return "MXKEDITOR.initEditorValues(" + parseInt($("#animDuration").val()) +
		"," + parseInt($("#play_from").val()) + "," + parseInt($("#play_to").val()) + ");"
	};
	this.exportCanvas = function () {
		var c = "var canvas = new MxkCanvas( 'body', " + MXKCANVAS.width + ", " + MXKCANVAS.height + ", '" + MXKCANVAS.resultStyle + "');\n";
		MXKCANVAS.activeImageName && (c += "canvas.setImage('" + MXKCANVAS.activeImageName + "', '" + MXKIMAGES.imageNames[MXKCANVAS.activeImageName].src + "');\n");
		return c
	};
	this.saveCanvas = function () {
		var c = "var canvas = new MxkCanvas( '#canvasSpace', " + MXKCANVAS.width + ", " + MXKCANVAS.height + ");\n";
		void 0 != MXKCANVAS.red && (c += "canvas.setBackgroundColor(" + MXKCANVAS.red + "," + MXKCANVAS.green + "," + MXKCANVAS.blue + "," + MXKCANVAS.alpha + ");\n");
		c += "canvas.setBackgroundRepeat(" + MXKCANVAS.isRepeatX + "," + MXKCANVAS.isRepeatY + ");\n";
		c += "canvas.allowOverflow(" + !MXKCANVAS.isOverflowHidden + ");\n";
		MXKCANVAS.activeImageName && (c += "canvas.setImage('" + MXKCANVAS.activeImageName + "', '" + MXKIMAGES.imageNames[MXKCANVAS.activeImageName].src + "');\n");
		return c + "MXKEDITOR.projectCanvasToTab();\n\n"
	};
	for (var a = 0; 200 > a; a++)
		eval("var var_" +
			a + "=" + (121 * a - 8 * a) + ";");
	this.saveSpriteDependencies = function (c) {
		var a = "",
		b = "sprite_" + c.index;
		void 0 != c.parentSprite && null != c.parentSprite && (a += b + ".setParentSprite(sprite_" + c.parentSprite.index + ");\n");
		return a
	};
	this.saveSprite = function (c) {
		var a,
		b = "sprite_" + c.index;
		a = "" + ("var " + b + " = MXKEDITOR.addNewSprite('" + b + "','" + c.displayName + "', true); /*" + c.index + "*/ \n");
		a += "canvas.addSprite(" + b + ");\n";
		for (var f in c.images)
			"" != f && (a += b + ".addImage('" + f + "', '" + c.images[f].attr("src") + "', true); \n");
		a += b + ".animation.fillFrames( " +
		JSON.stringify(c.animation.frames) + " ); \n";
		return a + (b + ".update();\n\n")
	};
	this.saveSpriteTime = function (c) {
		var a,
		b = "sprite_" + c.index;
		a = "" + ("var " + b + " = MXKEDITOR.addNewSprite('" + b + "','" + c.displayName + "', true); /*" + c.index + "*/ \n");
		a += "canvas.addSprite(" + b + ");\n";
		for (var f in c.imageNames) {
			var g = c.imageNames[f];
			"" != g && (a += b + ".addImage('" + g + "', '" + MXKIMAGES.imageNames[g].src + "'); \n")
		}
		1 != c.spriteCount && (a += b + ".setSpriteCount(" + c.spriteCount + "); \n");
		a += b + ".animation.fillTimeFrames( " + JSON.stringify(c.animation.exportTimeFrames()) +
		" ); \n";
		return a + (b + ".update();\n\n")
	};
	this.exportAnimation = function () {
		var c;
		c = "$(document).ready(function(){ \nstopAnimationLoop(); \n" + ("setPlaybackMode('" + (isH5 ? "HTML5" : isCSS3 ? "CSS3" : "JS") + "');\n");
		c += this.exportCanvas();
		for (var a in this.sprites)
			if (null != this.sprites[a]) {
				var b = this.sprites[a];
				c += this.exportSpriteTime(b, c)
			}
		for (a in this.sprites)
			null != this.sprites[a] && (b = this.sprites[a], c += this.saveSpriteDependencies(b));
		return c + "startAnimationLoop(); \n});"
	};
	this.exportSpriteTime = function (c) {
		var a,
		b = "sprite_" + c.index;
		a = "" + ("var " + b + " = new MxkSprite('" + b + "'); //" + c.displayName + " \n");
		a += "canvas.addSprite(" + b + ");\n";
		for (var f in c.imageNames) {
			var g = c.imageNames[f];
			"" != g && (a += b + ".addImage('" + g + "', '" + MXKIMAGES.imageNames[g].src + "'); \n")
		}
		1 != c.spriteCount && (a += b + ".setSpriteCount(" + c.spriteCount + "); \n");
		a += b + ".animation.setDuration(" + c.animation.duration + ");\n";
		a += b + ".animation.fillTimeFrames( " + JSON.stringify(c.animation.exportTimeFrames()) + " ); \n";
		return a + (b + ".startAnimation(); \n\n")
	};
	this.exportSprite =
	function (c) {
		var a,
		b = "sprite_" + c.index;
		a = "" + ("var " + b + " = new MxkSprite('" + b + "'); //" + c.displayName + " \n");
		a = a + ("canvas.addSprite(" + b + ");\n") + (b + ".animation.fillFrames( " + JSON.stringify(c.animation.frames) + " ); \n");
		for (var f in c.images)
			"" != f && (a += b + ".addImage('" + f + "', '" + c.images[f].attr("src") + "'); \n");
		return a + (b + ".startAnimation(); \n\n")
	};
	this.reset = function () {
		for (var c in this.sprites)
			null != this.sprites[c] && this.removeSprite(c);
		this.activeSprite = null;
		this.sprites = [];
		this.activeFrame = 0;
		this.animDuration =
			10;
		this.tab_counter = 0
	};
	this.getSpriteByDisplayName = function (c) {
		for (var a in this.sprites)
			if (null != this.sprites[a]) {
				var b = this.sprites[a];
				if (b.displayName == c)
					return b
			}
	};
	this.getSpriteNames = function () {
		var c = [],
		a;
		for (a in this.sprites)
			null != this.sprites[a] && (c[c.length] = this.sprites[a].displayName);
		return c
	};
	this.projectTabToFrame = function (c) {
		var c = this.sprites[c],
		a = parseFloat($("#activeFrame").val()),
		b = parseInt($("#sprite_posx").val()),
		f = parseInt($("#sprite_posy").val()),
		g = parseFloat($("#sprite_scale").val()),
		l = parseFloat($("#sprite_angle").val()),
		m = parseInt($("#sprite_z").val()),
		n = parseFloat($("#sprite_opacity").val());
		if (!0 == $("#sprite_interpolate").data("sel"))
			var j = 1;
		var o = $("#sprite_sound_auto").val();
		if (!0 == $("#sprite_timing_ease").data("sel"))
			var h = [0.25, 0.1, 0.25, 1];
		!0 == $("#sprite_timing_in").data("sel") && (h = [0.42, 0, 1, 1]);
		!0 == $("#sprite_timing_out").data("sel") && (h = [0, 0, 0.58, 1]);
		!0 == $("#sprite_timing_inout").data("sel") && (h = [0.42, 0, 0.58, 1]);
		!0 == $("#sprite_timing_bez").data("sel") && (h = [parseFloat($("#sprite_timing_bez_0").val()),
				parseFloat($("#sprite_timing_bez_1").val()), parseFloat($("#sprite_timing_bez_2").val()), parseFloat($("#sprite_timing_bez_3").val())]);
		var p = parseInt($("#sprite_image_index").val()),
		j = {
			t : a,
			x : b,
			y : f,
			r : l,
			s : g,
			i : k,
			z : m,
			o : n,
			b : j,
			p : p,
			e : h,
			a : o
		};
		c.animation.fillTimeFrame(j);
		c.addToUndoBuffer(j);
		var k = $("#sprite_image_auto").val(),
		h = parseInt($("#sprite_image_count").val());
		c.setImage(k);
		c.setSpriteCount(h);
		c.applyFrame(j);
		c.update();
		c.alignHandles();
		MXKPANE.update();
		MXKEDITOR.clearRunningState()
	};
	this.deleteFrame =
	function (c) {
		this.activeSprite.animation.findTimeFrameIndexByTime(c);
		this.activeSprite.animation.deleteTimeFrame(c);
		c = this.activeSprite.animation.findLastDefinedTimeFrame(c - 0.0010);
		-1 == c && (c = 0);
		void 0 == c && (c = 0);
		this.activeFrame = this.activeSprite.animation.timeFrames[c].t;
		$("#activeFrame").val(this.activeFrame + "");
		this.projectCurrentFrame();
		MXKPANE.update();
		MXKEDITOR.clearRunningState()
	};
	this.projectCurrentFrame = function () {
		var c = this.activeSprite.animation.findLastDefinedTimeFrameOrInterpolate(this.activeFrame);
		c || (this.activeSprite.animation.timeFrames[0], this.activeSprite.imageSet = !1, this.activeSprite.setVisibility());
		this.activeSprite.applyFrame(c);
		this.activeSprite.update();
		this.projectFrameToTab(this.activeSprite.index, c);
		this.activeSprite.alignHandles()
	};
	this.projectFrameToTab = function (c, a, b) {
		void 0 == a && (a = {
				x : 0,
				y : 0,
				r : 0,
				s : 1,
				z : 100,
				i : "",
				p : 1,
				o : 1
			});
		$("#sprite_posx").val(a.x);
		$("#sprite_posy").val(a.y);
		$("#sprite_angle").val(Math.round(100 * a.r) / 100);
		$("#sprite_scale").val(Math.round(100 * a.s) / 100);
		$("#sprite_z").val(a.z);
		$("#sprite_image_index").val(a.p);
		$("#sprite_opacity").val(a.o);
		$("#sprite_sound_auto").val(a.a);
		c = MXKEDITOR.sprites[c];
		b || ($("#sprite_image_auto").val(c.activeImageName), $("#sprite_image_count").val(c.spriteCount), (b = c.parentSprite) ? $("#sprite_parent_sprite").val(b.displayName) : $("#sprite_parent_sprite").val(""));
		1 == a.b ? ($("#sprite_interpolate").data("sel", !0), $("#sprite_interpolate").addClass("button_checked")) : ($("#sprite_interpolate").data("sel", !1), $("#sprite_interpolate").removeClass("button_checked"));
		$(".sprite_timing").data("sel", !1);
		$(".sprite_timing").removeClass("button_checked");
		$(".sprite_timing_bez").hide();
		if (a.e) {
			var f;
			if (a.e instanceof Array)
				if (f = a.e, 0.25 == f[0] && 0.1 == f[1] && 0.25 == f[2] && 1 == f[3])
					f = "#sprite_timing_ease";
				else if (0.42 == f[0] && 0 == f[1] && 1 == f[2] && 1 == f[3])
					f = "#sprite_timing_in";
				else if (0 == f[0] && 0 == f[1] && 0.58 == f[2] && 1 == f[3])
					f = "#sprite_timing_out";
				else if (0.42 == f[0] && 0 == f[1] && 0.58 == f[2] && 1 == f[3])
					f = "#sprite_timing_inout";
				else {
					f = "#sprite_timing_bez";
					$(".sprite_timing_bez").show();
					this.refreshCanvasSpace();
					for (b = 0; 4 > b; b++)
						$(f + "_" + b).val(a.e[b])
				}
			else
				1 == a.e ? f = "#sprite_timing_ease" : 2 == a.e ? f = "#sprite_timing_in" : 3 == a.e ? f = "#sprite_timing_out" : 4 == a.e && (f = "#sprite_timing_inout");
			$(f).data("sel", !0);
			$(f).addClass("button_checked")
		}
	};
	this.refreshCanvasSpace = function () {
		var c = $("#canvasSpace"),
		a = c.parent().height();
		c.css("height", a + "px");
		MXKCANVAS.parentHeight = a
	};
	this.projectSpriteToFrame = function (a) {
		var b = this.sprites[a],
		d = {
			t : this.activeFrame,
			x : b.position.left,
			y : b.position.top,
			r : b.angle,
			s : b.scale,
			i : b.activeImageName,
			z : b.zIndex,
			o : b.opacity,
			p : b.spriteIndex,
			e : b.easingOrig,
			b : b.interpolation
		};
		void 0 != b.animation.findTimeFrameByTime(this.activeFrame) && 1 == b.animation.findTimeFrameByTime(this.activeFrame).b && (d.b = 1);
		b.animation.fillTimeFrame(d);
		b.addToUndoBuffer(d);
		this.projectFrameToTab(a, d);
		MXKPANE.update();
		MXKEDITOR.clearRunningState()
	};
	this.addNewSprite = function (a, b, d) {
		this.ser_id1 = 1E4;
		this.ser_id1 += Math.floor(1E4 * Math.random());
		a = void 0 == a ? labels[LANG].sprite + this.tab_counter : a;
		b = void 0 == b ? a : b;
		this.ser_m = Math.floor(1E4 *
				Math.random()) + 1;
		this.ser_id = this.ser_id1 + "";
		a = new MxkSprite(a);
		MXKCANVAS.addSprite(a);
		a.moveTo(20, 20);
		a.setDisplayName(b);
		a.enableUndo();
		a.setIndex(this.tab_counter);
		a.gui = new MxkSpriteGui(a);
		for (var f in this.sprites)
			null != this.sprites[f] && void 0 != this.sprites[f] && this.sprites[f].gui.deactivate();
		a.gui.activate();
		this.ser_id2 = "" + ((this.tab_counter + 2E3) * (this.ser_m % 13) + 5);
		this.ser_id += "" + (this.tab_counter + 1) * this.ser_m;
		this.sprites[this.tab_counter] = a;
		MXKEDITOR.activeFrame = 0;
		$("#activeFrame").val("0.00");
		MXKEDITOR.projectSpriteToFrame(a.index);
		MXKPANE.addSwimlane(a);
		MXKEDITOR.isLoading || this.activateSprite(this.tab_counter);
		this.tab_counter++;
		a.animation.setDuration(this.animDuration);
		d && a.updateUndoBuffer(this.animDuration, 5);
		MXKPANE.update();
		MXKEDITOR.clearRunningState();
		return a
	};
	this.countSprites = function () {
		var a = 0,
		b;
		for (b in this.sprites)
			null != this.sprites[b] && void 0 != this.sprites[b] && a++;
		return a
	};
	this.removeSprite = function (a) {
		var b = this.sprites[a];
		$("#layer-" + b.index).remove();
		if (!(void 0 ==
				b || null == b)) {
			MXKPANE.removeSwimlane(b);
			MXKPANE.update();
			MXKEDITOR.clearRunningState();
			this.sprites[a] = void 0;
			b == this.activeSprite && (this.activeSprite = null);
			for (var d in this.sprites)
				if (null != this.sprites[d] && void 0 != this.sprites[d]) {
					this.activateSprite(d);
					break
				}
			b.destroy()
		}
	};
	this.activateSprite = function (a) {
		this.activeSprite = this.sprites[a];
		for (var b in this.sprites)
			null != this.sprites[b] && this.sprites[b].switchToDefaultMode();
		this.activeSprite.switchToEditMode();
		this.isTabSelect || ($(".layer").removeClass("selected_layer"),
			$("#layer-" + a).addClass("selected_layer"));
		this.projectCurrentFrame();
		$("#sprite_copy_sprite").autocomplete("option", "source", MXKEDITOR.getSpriteNames());
		$("#sprite_image_auto").autocomplete("option", "source", MXKIMAGES.getImageNames());
		$("#canvas_image_auto").autocomplete("option", "source", MXKIMAGES.getImageNames());
		$("#sprite_parent_sprite").autocomplete("option", "source", MXKEDITOR.getSpriteNames());
		void 0 != this.activeSprite.parentSprite && null != this.activeSprite.parentSprite && $("#sprite_parent_sprite").val(this.activeSprite.parentSprite.displayName);
		this.activeSprite.alignHandles()
	};
	this.tab_counter = 0;
	this.isTabSelect = !1;
	this.setAnimDuration = function (a) {
		this.animDuration = a;
		for (var b in this.sprites)
			this.sprites[b] && null != this.sprites[b] && (this.sprites[b].animation.setDuration(a), this.sprites[b].isUndo && this.sprites[b].updateUndoBuffer(a, 5))
	};
	this.setActiveFrame = function (a) {
		this.activeFrame = a;
		for (var b in this.sprites)
			if (this.sprites[b] && null != this.sprites[b]) {
				a = this.sprites[b];
				if (a.index == this.activeSprite.index)
					this.projectCurrentFrame();
				else {
					var d =
						a.animation.findLastDefinedTimeFrameOrInterpolate(this.activeFrame);
					d || (d = a.animation.timeFrames[0], a.imageSet = !1, a.setVisibility());
					a.applyFrame(d);
					a.update();
					a.alignHandles()
				}
				a.imgObj.data("hidden") && a.imgObj.hide()
			}
		$("#activeFrame").val(this.activeFrame)
	};
	this.findTimeFrameInInterval = function (a, b, d) {
		for (var f in this.sprites)
			if (this.sprites[f] && null != this.sprites[f]) {
				var g = this.sprites[f].animation.findTimeFrameInInterval(a, b, d);
				if (null != g)
					return g
			}
	};
	this.playAnimations = function () {
		playFrom = parseFloat($("#play_from").val());
		playTo = parseFloat($("#play_to").val());
		isNaN(playFrom) && void 0 == playFrom && (playFrom = 0);
		isNaN(playTo) && void 0 == playTo && (playTo = this.animDuration);
		playAnimDuration = playTo - playFrom;
		stopAnimationLoop();
		var a = !1,
		b;
		for (b in MXKEDITOR.sprites)
			if (null != MXKEDITOR.sprites[b]) {
				var d = MXKEDITOR.sprites[b];
				isCSS3 && d.animation.createCSS3(d, playFrom, playTo, !0);
				if (!a) {
					if (isCSS3)
						d.imgObj.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function () {
							MXKEDITOR.clearRunningState();
							MXKEDITOR.setActiveFrame(playTo);
							MXKPANE.update()
						});
					else
						d.finish = function () {
							MXKEDITOR.clearRunningState();
							MXKEDITOR.setActiveFrame(playTo);
							MXKPANE.update()
						};
					a = !0
				}
			}
		for (b in MXKEDITOR.sprites)
			null != MXKEDITOR.sprites[b] && (d = MXKEDITOR.sprites[b], d.startAnimation(void 0, playFrom, playTo));
		startTime = (new Date).getTime();
		MXKEDITOR.isRunning = !0;
		trackAnimationTime();
		startAnimationLoop()
	};
	this.pauseAnimations = function () {
		for (var a in MXKEDITOR.sprites)
			null != MXKEDITOR.sprites[a] && MXKEDITOR.sprites[a].pauseAnimation();
		isCSS3 || stopAnimationLoop();
		pauseTime = (new Date).getTime();
		h5PauseClock = h5Clock
	};
	this.resumeAnimations = function () {
		for (var a in MXKEDITOR.sprites)
			null != MXKEDITOR.sprites[a] && MXKEDITOR.sprites[a].resumeAnimation();
		isH5 && MXKCANVAS.clearH5();
		isCSS3 || startAnimationLoop();
		resumeTime = (new Date).getTime();
		trackAnimationTime(!0);
		useH5PauseClock = !0
	};
	this.initEditorControls = function () {
		$("#canvas_red").change(function () {
			onChange_canvasRGB($(this))
		});
		$("#canvas_green").change(function () {
			onChange_canvasRGB($(this))
		});
		$("#canvas_blue").change(function () {
			onChange_canvasRGB($(this))
		});
		$("#canvas_alpha").change(function () {
			onChange_canvasA($(this))
		});
		$("#color_picker").click(function () {
			$("#jscolor").get()[0].color.showPicker()
		});
		$("#add_tab").click(function () {
			MXKEDITOR.addNewSprite(void 0, void 0, !0)
		});
		$("#animDuration").change(function () {
			onChange_tnf($(this))
		});
		$("#activeFrame").change(function () {
			onChange_activeFrame($(this))
		});
		$("#activeFrame").keyup(function (a) {
			38 == a.keyCode ? ($(this).val(parseFloat($(this).val()) + 0.05), onChange_activeFrame($(this))) : 40 == a.keyCode && ($(this).val(parseFloat($(this).val()) -
					0.05), onChange_activeFrame($(this)))
		});
		$("#canvas_red").keyup(function (a) {
			38 == a.keyCode ? ($(this).val(parseInt($(this).val()) + 1), onChange_canvasRGB($(this))) : 40 == a.keyCode && ($(this).val(parseInt($(this).val()) - 1), onChange_canvasRGB($(this)))
		});
		$("#canvas_green").keyup(function (a) {
			38 == a.keyCode ? ($(this).val(parseInt($(this).val()) + 1), onChange_canvasRGB($(this))) : 40 == a.keyCode && ($(this).val(parseInt($(this).val()) - 1), onChange_canvasRGB($(this)))
		});
		$("#canvas_blue").keyup(function (a) {
			38 == a.keyCode ? ($(this).val(parseInt($(this).val()) +
					1), onChange_canvasRGB($(this))) : 40 == a.keyCode && ($(this).val(parseInt($(this).val()) - 1), onChange_canvasRGB($(this)))
		});
		$("#canvas_alpha").keyup(function (a) {
			38 == a.keyCode ? ($(this).val(parseFloat($(this).val()) + 0.1), onChange_canvasA($(this))) : 40 == a.keyCode && ($(this).val(parseFloat($(this).val()) - 0.1), onChange_canvasA($(this)))
		});
		$("#playCss3").on("click", {
			editor : this
		}, function () {
			$(this).data("sel") || ($(".mode").data("sel", !1), $(".mode").removeClass("button_checked"), $(this).data("sel", !0), $(this).addClass("button_checked"),
				isCSS3 = !0, isH5 = !1, $("#canvas_overflow").removeAttr("disabled"))
		}).click();
		$("#playH5").click(function () {
			$(this).data("sel") || ($(".mode").data("sel", !1), $(".mode").removeClass("button_checked"), $(this).data("sel", !0), $(this).addClass("button_checked"), isCSS3 = !1, isH5 = !0, $("#canvas_overflow").data("sel") && ($("#canvas_overflow").data("sel", !1).removeClass("button_checked"), MXKCANVAS.isOverflowHidden = !0), $("#canvas_overflow").attr("disabled", "disabled"));
			MXKEDITOR.setActiveFrame(MXKEDITOR.activeFrame)
		});
		$("#playJS").click(function () {
			$(this).data("sel") || ($(".mode").data("sel", !1), $(".mode").removeClass("button_checked"), $(this).data("sel", !0), $(this).addClass("button_checked"), isH5 = isCSS3 = !1, $("#canvas_overflow").removeAttr("disabled"));
			for (var a in MXKEDITOR.sprites)
				if (null != MXKEDITOR.sprites[a]) {
					var b = MXKEDITOR.sprites[a];
					b.setImage(b.activeImageName, !0)
				}
		});
		this.isPaused = !1;
		$("#playAnimations").click(function () {
			$(this).find("span").hasClass("playableState") ? ($(this).find("span").removeClass("playableState"),
				$(this).find("span").addClass("pauseableState"), MXKEDITOR.isPaused ? (MXKEDITOR.isPaused = !1, MXKEDITOR.resumeAnimations()) : (swithcAllToDefault(), MXKEDITOR.playAnimations()), MXKCANVAS.applyStyle()) : (MXKEDITOR.isPaused = !0, $(this).find("span").removeClass("pauseableState"), $(this).find("span").addClass("playableState"), MXKEDITOR.pauseAnimations(), MXKEDITOR.activeFrame = parseFloat($("#activeFrame").val()), MXKPANE.update())
		});
		$("#play_from").change(function () {
			onChange_playFrom($(this))
		});
		$("#play_to").change(function () {
			onChange_playTo($(this))
		});
		$("#forwardRewind").click(function () {
			MXKEDITOR.setActiveFrame(MXKEDITOR.animDuration)
		});
		$("#backRewind").click(function () {
			MXKEDITOR.setActiveFrame(0)
		});
		$("#down_layers").click(function () {
			$(".timeline").animate({
				scrollTop : $(".timeline").scrollTop() + 65
			}, 500, function () {})
		}).next().click(function () {
			$(".timeline").animate({
				scrollTop : $(".timeline").scrollTop() - 65
			}, 500, function () {})
		});
		$("#exportSource").button().css("width", "100%").click(function () {
			var a = MXKEDITOR.exportAnimation();
			$("#modal_save textarea").val(a);
			$("#modal_save textarea").width();
			$("#modal_save").dialog("open")
		});
		$("#saveAnimation").button();
		$("#saveAnimation").css("width", "100%");
		$("#saveAnimation").click(function () {
			var a = MXKEDITOR.saveAnimation();
			$("#modal_save textarea").val(a);
			$("#modal_save textarea").width();
			$("#modal_save").dialog("open")
		});
		$("#openAnimation").button();
		$("#openAnimation").css("width", "100%");
		$("#openAnimation").click(function () {
			$("#animationFile").click()
		});
		$("#animationFile").change(function (a) {
			loadAnimationFile(a);
			$("#fileMenu").dialog("close")
		});
		$("#modal_save").dialog({
			autoOpen : !1,
			height : "auto",
			width : "auto",
			modal : !0,
			resizable : !1,
			draggable : !1,
			disabled : !0
		});
		$("#canvas_width").change(function () {
			MXKCANVAS.width = parseInt($(this).val());
			$(this).val(MXKCANVAS.width);
			MXKCANVAS.parentWidth = parseInt(MXKCANVAS.canvasDiv.parent().parent().width());
			MXKCANVAS.applyStyle(!0)
		});
		$("#canvas_height").change(function () {
			MXKCANVAS.height = parseInt($(this).val());
			$(this).val(MXKCANVAS.height);
			MXKCANVAS.parentHeight = parseInt(MXKCANVAS.canvasDiv.parent().parent().height());
			MXKCANVAS.applyStyle(!0)
		});
		$("#canvas_style").change(function () {
			MXKCANVAS.style = $(this).val();
			MXKCANVAS.applyStyle(!0)
		});
		$("#canvas_overflow").click(function () {
			$(this).data("sel") ? ($(this).data("sel", !1), $(this).removeClass("button_checked"), MXKCANVAS.isOverflowHidden = !0) : ($(this).data("sel", !0), $(this).addClass("button_checked"), MXKCANVAS.isOverflowHidden = !1);
			MXKCANVAS.applyStyle(!0)
		});
		$("#canvas_width").keyup(function (a) {
			38 == a.keyCode ? (a = parseInt($(this).val()), $(this).val(a + 1).change()) : 40 == a.keyCode &&
			(a = parseInt($(this).val()), $(this).val(a - 1).change())
		});
		$("#canvas_height").keyup(function (a) {
			38 == a.keyCode ? (a = parseInt($(this).val()), $(this).val(a + 1).change()) : 40 == a.keyCode && (a = parseInt($(this).val()), $(this).val(a - 1).change())
		});
		$("#canvas_repeat_x").click(function () {
			$(this).data("sel") ? ($(this).data("sel", !1), $(this).removeClass("button_checked"), MXKCANVAS.isRepeatX = !1) : ($(this).data("sel", !0), $(this).addClass("button_checked"), MXKCANVAS.isRepeatX = !0);
			MXKCANVAS.applyStyle(!0)
		}).click();
		$("#canvas_repeat_y").click(function () {
			$(this).data("sel") ?
			($(this).data("sel", !1), $(this).removeClass("button_checked"), MXKCANVAS.isRepeatY = !1) : ($(this).data("sel", !0), $(this).addClass("button_checked"), MXKCANVAS.isRepeatY = !0);
			MXKCANVAS.applyStyle(!0)
		}).click();
		$("#openCanvasProperties").button({
			icons : {
				primary : "ui-icon-note"
			},
			text : !1
		}).click(function () {
			$("#canvas_width").val(MXKCANVAS.width);
			$("#canvas_height").val(MXKCANVAS.height);
			$("#canvas_style").val(MXKCANVAS.style);
			$("#canvasProperties").css("visibility", "visible").dialog("open")
		});
		$("#canvasProperties").css("visibility",
			"visible").dialog({
			title : "Canvas Properties",
			autoOpen : !1,
			height : "auto",
			width : "auto",
			modal : !0,
			resizable : !1,
			draggable : !1,
			disabled : !0,
			close : function () {
				$("#canvas_style").change();
				$("#canvas_width").change();
				$("#canvas_height").change()
			}
		});
		$("#canvas-menu").click(function () {
			$("#canvas_width").val(MXKCANVAS.width);
			$("#canvas_height").val(MXKCANVAS.height);
			$("#canvas_style").val(MXKCANVAS.style);
			$("#canvasProperties").css("visibility", "visible").dialog("open")
		});
		$("#openFileMenu").click(function () {
			$("#fileMenu").dialog("open")
		});
		$("#fileMenu").css("visibility", "visible").dialog({
			title : "File Menu",
			autoOpen : !1,
			height : "auto",
			width : "auto",
			modal : !0,
			resizable : !1,
			draggable : !1,
			disabled : !0
		});
		$("#file-menu").click(function () {
			$("#fileMenu").dialog("open")
		});
		var a = $("#down_activeFrame");
		a.button({
			icons : {
				primary : "ui-icon-triangle-1-w"
			},
			text : !1
		});
		var b = $("#up_activeFrame");
		b.button({
			icons : {
				primary : "ui-icon-triangle-1-e"
			},
			text : !1,
			label : "Increment active frame"
		});
		var d = $("#mid_activeFrame");
		d.button({
			text : !1
		}).click(function () {
			$(this).find("input").focus()
		}).parent().buttonset();
		d.children("span").css({
			padding : "0px"
		});
		a.click(function () {
			var a = parseFloat($("#activeFrame").val()),
			b = a;
			isNaN(a) || (a = 0.05 * Math.round(Math.round(1E3 * a / 0.05) / 1E3 + 0.499) - 0.05, b = MXKEDITOR.findTimeFrameInInterval(a, b, !1), null != b && (a = b.t), $("#activeFrame").val(a));
			0 >= a ? $("#activeFrame").val(0) : onChange_activeFrame($("#activeFrame"))
		});
		b.click(function () {
			var a = parseFloat($("#activeFrame").val()),
			b = a;
			isNaN(a) || (a = 0.05 * Math.round(Math.round(1E3 * a / 0.05) / 1E3 - 0.499) + 0.05, b = MXKEDITOR.findTimeFrameInInterval(b,
						a, !0), null != b && (a = b.t), $("#activeFrame").val(a));
			a >= parseFloat($("#animDuration").val()) ? $("#activeFrame").val(parseFloat($("#animDuration").val())) : onChange_activeFrame($("#activeFrame"))
		});
		$("#dialog_link").button();
		$("#sprite_image_count").change(function () {
			onChange_spriteCount($(this))
		});
		$("#sprite_image_index").change(function () {
			onChange_spriteIndex($(this))
		});
		$("#sprite_posx").change(function () {
			onChange_posX($(this))
		});
		$("#sprite_posy").change(function () {
			onChange_posY($(this))
		});
		$("#sprite_scale").change(function () {
			onChange_scale($(this))
		});
		$("#sprite_angle").change(function () {
			onChange_angle($(this))
		});
		$("#sprite_z").change(function () {
			onChange_posZ($(this))
		});
		$("#sprite_opacity").change(function () {
			onChange_opacity($(this))
		});
		$(".sprite_timing_bez").change(function () {
			onChange_bezier($(this))
		});
		$("#sprite_name").change(function () {
			$("#sprite_copy_sprite").autocomplete("option", "source", MXKEDITOR.getSpriteNames());
			$("#sprite_parent_sprite").autocomplete("option", "source", MXKEDITOR.getSpriteNames())
		});
		$("#sprite_image_load").click(function () {
			$("#sprite_image_file").click()
		});
		$("#canvas_image_load").click(function () {
			$("#canvas_image_file").click()
		});
		$("#sprite_sound_load").click(function () {
			$("#sprite_sound_file").click()
		});
		$("#sprite_undo").click(function () {
			MXKEDITOR.activeSprite.undo(MXKEDITOR.activeFrame);
			MXKEDITOR.projectCurrentFrame()
		}).next().click(function () {
			MXKEDITOR.activeSprite.redo(MXKEDITOR.activeFrame);
			MXKEDITOR.projectCurrentFrame()
		});
		$("#sprite_posx").keyup(function (a) {
			38 == a.keyCode ? (a = parseInt($(this).val()), $(this).val(a + 1).change(), onChange_posX($(this))) :
			40 == a.keyCode && (a = parseInt($(this).val()), $(this).val(a - 1).change())
		});
		$("#sprite_posy").keyup(function (a) {
			38 == a.keyCode ? (a = parseInt($(this).val()), $(this).val(a + 1).change()) : 40 == a.keyCode && (a = parseInt($(this).val()), $(this).val(a - 1).change())
		});
		$("#sprite_z").keyup(function (a) {
			38 == a.keyCode ? (a = parseInt($(this).val()), $(this).val(a + 1).change()) : 40 == a.keyCode && (a = parseInt($(this).val()), $(this).val(a - 1).change())
		});
		$("#sprite_opacity").keyup(function (a) {
			38 == a.keyCode ? (a = Math.round(100 * (parseFloat($(this).val()) +
							0.05)) / 100, $(this).val(a).change()) : 40 == a.keyCode && (a = Math.round(100 * (parseFloat($(this).val()) - 0.05)) / 100, $(this).val(a).change())
		});
		$("#sprite_scale").keyup(function (a) {
			38 == a.keyCode ? (a = Math.round(100 * (parseFloat($(this).val()) + 0.05)) / 100, $(this).val(a).change()) : 40 == a.keyCode && (a = Math.round(100 * (parseFloat($(this).val()) - 0.05)) / 100, $(this).val(a).change())
		});
		$(".sprite_timing_bez").keyup(function (a) {
			38 == a.keyCode ? (a = Math.round(100 * (parseFloat($(this).val()) + 0.05)) / 100, $(this).val(a).change()) :
			40 == a.keyCode && (a = Math.round(100 * (parseFloat($(this).val()) - 0.05)) / 100, $(this).val(a).change())
		});
		$("#sprite_angle").keyup(function (a) {
			38 == a.keyCode ? (a = parseInt($(this).val()), $(this).val(a + 1).change()) : 40 == a.keyCode && (a = parseInt($(this).val()), $(this).val(a - 1).change())
		});
		$(".sprite_timing").click(function () {
			$(this).data("sel") ? ($(this).data("sel", !1), $(this).removeClass("button_checked"), "sprite_timing_bez" == $(this).attr("id") && ($(".sprite_timing_bez").hide(), MXKEDITOR.refreshCanvasSpace())) : ($(".sprite_timing").data("sel",
					!1).removeClass("button_checked"), $(this).addClass("button_checked"), $(this).data("sel", !0), "sprite_timing_bez" == $(this).attr("id") ? $(".sprite_timing_bez").show() : $(".sprite_timing_bez").hide(), MXKEDITOR.refreshCanvasSpace());
			$("#sprite_interpolate").data("sel") || $("#sprite_interpolate").click();
			MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
		});
		$("#sprite_interpolate").click(function () {
			$(this).data("sel") ? ($(this).data("sel", !1), $(this).removeClass("button_checked")) : ($(this).data("sel",
					!0), $(this).addClass("button_checked"));
			MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
		});
		$("#sprite_interpolate_linear").button({
			icons : {
				primary : "ui-icon-suitcase"
			},
			text : !1
		}).click(function () {
			MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
		});
		$("#sprite_interpolate_bezier").button({
			icons : {
				primary : "ui-icon-suitcase"
			},
			text : !1
		}).click(function () {
			MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
		}).parent().buttonset();
		$("#sprite_image_file").change(function (a) {
			displayPreview(a)
		});
		$("#canvas_image_file").change(function (a) {
			displayPreview(a, !0)
		});
		$("#sprite_sound_file").change(function (a) {
			displayPreview(a, !1, !0)
		});
		$("#sprite_reset").click(function () {
			MXKEDITOR.activeSprite.resetSpriteToPrevious(MXKEDITOR.activeFrame);
			MXKEDITOR.projectCurrentFrame()
		});
		$("#sprite_delete").click(function () {
			MXKEDITOR.deleteFrame(MXKEDITOR.activeFrame)
		});
		$("#sprite_name").change(function () {
			MXKEDITOR.activeSprite.displayName = $(this).val();
			$("li").each(function (a) {
				a == MXKEDITOR.activeSprite.index && $(this).find("a").html(MXKEDITOR.activeSprite.displayName)
			})
		});
		$("#sprite_copy").click(function () {
			var a = $("#sprite_copy_sprite");
			onChange_copySprite(a);
			if ("" != a.val()) {
				var b = MXKEDITOR.getSpriteByDisplayName(a.val()),
				a = $("#sprite_copy_frame");
				onChange_copyFrame(a);
				var c = parseFloat(a.val()),
				b = b.animation.findLastDefinedTimeFrameOrInterpolate(c);
				a.val(b.t ? b.t : c);
				void 0 != b && (MXKEDITOR.projectFrameToTab(0, b, !0), MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index))
			}
		});
		$("#sprite_parent").click(function () {
			var a = $("#sprite_parent_sprite");
			onChange_parentSprite(a);
			a = MXKEDITOR.getSpriteByDisplayName(a.val());
			MXKEDITOR.activeSprite.setParentSprite(a);
			MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
		});
		$("#sprite_parent_sprite").autocomplete({
			minLength : 0,
			delay : 0,
			source : [],
			select : function (a, b) {
				$(this).val(b.item.value);
				$(this).change()
			}
		}).focus(function () {
			$(this).val("");
			$(this).autocomplete("search", "")
		}).blur(function () {
			"" == $(this).val() && $(this).val(labels[LANG].layer_val).addClass("inButtonLabel")
		}).change(function () {
			onChange_parentSprite($(this))
		});
		$("#sprite_copy_sprite").autocomplete({
			minLength : 0,
			delay : 0,
			source : [],
			select : function (a, b) {
				$(this).val(b.item.value);
				$(this).change()
			},
			open : function () {
				$(this).autocomplete("widget").css("z-index", 101);
				return !1
			}
		}).focus(function () {
			$(this).val("");
			$(this).autocomplete("search", "")
		}).blur(function () {
			"" == $(this).val() && $(this).val(labels[LANG].layer_val).addClass("inButtonLabel")
		}).change(function () {
			onChange_copySprite($(this))
		});
		$("#sprite_copy_frame").focus(function () {
			$(this).val("").removeClass("inButtonLabel")
		}).blur(function () {
			0 <
			Number($(this).val()) || $(this).val("");
			"" == $(this).val() && $(this).val(labels[LANG].frame_val).addClass("inButtonLabel");
			$(this).val() != labels[LANG].frame_val && $(this).removeClass("inButtonLabel")
		}).change(function () {
			onChange_copyFrame($(this))
		});
		$("#sprite_sound_auto").autocomplete({
			minLength : 0,
			delay : 0,
			source : [],
			select : function (a, b) {
				$(this).val(b.item.value);
				$(this).change()
			},
			open : function () {
				$(this).autocomplete("widget").css("z-index", 101);
				return !1
			}
		}).focus(function () {
			$(this).autocomplete("option",
				"source", MXKSOUNDS.getSoundNames());
			$(this).autocomplete("search", "")
		}).change(function () {
			for (var a = $(this).data("value"), b = $(this).val(), c = $(this).autocomplete("option", "source"), d = !1, e = 0; e < c.length; e++)
				b == c[e] && (d = !0);
			d ? ($(this).data("value", b), MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index), MXKEDITOR.projectCurrentFrame()) : $(this).val(a)
		}).focus(function () {
			$(this).autocomplete("search", "")
		}).click(function () {
			$(this).autocomplete("search", "")
		});
		a = $("#sprite_image_auto");
		a.autocomplete({
			minLength : 0,
			delay : 0,
			source : [],
			select : function (a, b) {
				$(this).val(b.item.value);
				$(this).change()
			},
			open : function () {
				$(this).autocomplete("widget").css("z-index", 101);
				return !1
			}
		}).focus(function () {
			$(this).autocomplete("option", "source", MXKIMAGES.getImageNames());
			$(this).autocomplete("search", "")
		}).change(function () {
			for (var a = $(this).data("value"), b = $(this).val(), c = $(this).autocomplete("option", "source"), d = !1, e = 0; e < c.length; e++)
				b == c[e] && (d = !0);
			d ? ($(this).data("value", b), MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index),
				MXKEDITOR.projectCurrentFrame()) : $(this).val(a)
		}).focus(function () {
			$(this).autocomplete("search", "")
		}).click(function () {
			$(this).autocomplete("search", "")
		});
		a = $("#canvas_image_auto");
		a.autocomplete({
			minLength : 0,
			delay : 0,
			source : [],
			select : function (a, b) {
				$(this).val(b.item.value);
				$(this).change()
			},
			open : function () {
				$(this).autocomplete("widget").css("z-index", 101);
				return !1
			}
		}).focus(function () {
			$(this).autocomplete("option", "source", MXKIMAGES.getImageNames());
			$(this).autocomplete("search", "")
		}).change(function () {
			var a =
				$(this).data("value"),
			b = $(this).val();
			if ("" != b) {
				for (var c = $(this).autocomplete("option", "source"), d = !1, e = 0; e < c.length; e++)
					b == c[e] && (d = !0);
				if (!d) {
					$(this).val(a);
					return
				}
			}
			$(this).data("value", b);
			MXKEDITOR.projectTabToCanvas()
		}).focus(function () {
			$(this).autocomplete("search", "")
		}).click(function () {
			$(this).autocomplete("search", "")
		})
	};
	this.clearRunningState = function () {
		$("#playAnimations span").removeClass("pauseableState");
		$("#playAnimations span").addClass("playableState");
		this.isPaused = this.isRunning =
			!1
	};
	this.projectTabToCanvas = function () {
		var a = $("#canvas_image_auto").val();
		MXKCANVAS.setImage(a);
		MXKCANVAS.red = parseInt($("#canvas_red").val());
		MXKCANVAS.green = parseInt($("#canvas_green").val());
		MXKCANVAS.blue = parseInt($("#canvas_blue").val());
		MXKCANVAS.alpha = parseFloat($("#canvas_alpha").val());
		$("#color_picker").css("background-color", "rgba(" + MXKCANVAS.red + ", " + MXKCANVAS.green + ", " + MXKCANVAS.blue + ", " + MXKCANVAS.alpha + ")");
		MXKCANVAS.applyStyle(!0)
	};
	this.projectCanvasToTab = function () {
		void 0 != MXKCANVAS.red &&
		($("#canvas_red").val(MXKCANVAS.red), $("#canvas_green").val(MXKCANVAS.green), $("#canvas_blue").val(MXKCANVAS.blue), $("#canvas_alpha").val(MXKCANVAS.alpha).change());
		MXKCANVAS.isOverflowHidden ? ($("#canvas_overflow").data("sel", !1), $("#canvas_overflow").removeClass("button_checked")) : ($("#canvas_overflow").data("sel", !0), $("#canvas_overflow").addClass("button_checked"));
		MXKCANVAS.isRepeatX ? ($("#canvas_repeat_x").data("sel", !0), $("#canvas_repeat_x").addClass("button_checked")) : ($("#canvas_repeat_x").data("sel",
				!1), $("#canvas_repeat_x").removeClass("button_checked"));
		MXKCANVAS.isRepeatY ? ($("#canvas_repeat_y").data("sel", !0), $("#canvas_repeat_y").addClass("button_checked")) : ($("#canvas_repeat_y").data("sel", !1), $("#canvas_repeat_y").removeClass("button_checked"));
		MXKCANVAS.activeImageName && $("#canvas_image_auto").val(MXKCANVAS.activeImageName)
	};
	b || this.initEditorControls();
	this.projectCanvasToTab()
}
function validateFloat(b, a, c, e, d) {
	b = parseFloat(b);
	return isNaN(b) ? e : void 0 != a && b < a ? d ? e : a : void 0 != c && b > c ? d ? e : c : b
}
function validateInt(b, a, c, e, d) {
	b = parseInt(b);
	return isNaN(b) ? e : void 0 != a && b < a ? d ? e : a : void 0 != c && b > c ? d ? e : c : b
}
function onChange_activeFrame(b) {
	var a = b.val(),
	a = validateFloat(a, 0, parseFloat($("#animDuration").val()), 0),
	a = MXKPANE.roundToStep(100 * a, 5);
	b.val(a);
	MXKEDITOR.setActiveFrame(b.val());
	MXKPANE.update();
	MXKEDITOR.clearRunningState()
}
function onChange_tnf(b) {
	var a = b.val(),
	a = validateFloat(a, 0.05, 100, 10);
	b.val(a);
	parseInt($("#play_to").val()) > a && $("#play_to").val(a);
	MXKEDITOR.setAnimDuration(a);
	MXKPANE.update();
	MXKEDITOR.clearRunningState()
}
function onChange_canvasRGB(b) {
	var a = b.val(),
	a = validateInt(a, 0, 255, 255);
	b.val(a);
	MXKEDITOR.projectTabToCanvas()
}
function onChange_canvasA(b) {
	var a = b.val(),
	a = validateFloat(a, 0, 1, 1);
	b.val(a);
	MXKEDITOR.projectTabToCanvas()
}
function onChange_fps(b) {
	var a = b.val(),
	a = validateInt(a, 1, 100, 25);
	b.val(a);
	setFPS(parseInt(a))
}
function onChange_playFrom(b) {
	var a = b.val(),
	a = validateFloat(a, 0, parseInt($("#animDuration").val()), 0);
	b.val(a)
}
function onChange_playTo(b) {
	var a = b.val(),
	a = validateFloat(a, 0, parseInt($("#animDuration").val()), parseInt($("#animDuration").val()));
	b.val(a)
}
function onChange_spriteIndex(b) {
	var a = b.val(),
	a = validateInt(a, 1, parseInt($("#sprite_image_count").val()), 1);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_spriteCount(b) {
	var a = b.val(),
	a = validateInt(a, 1, 1E3, 1);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_opacity(b) {
	var a = b.val(),
	a = validateFloat(a, 0, 1, 1);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_posX(b) {
	var a = b.val(),
	a = validateInt(a, -5E3, 5E3, 0);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_posY(b) {
	var a = b.val(),
	a = validateInt(a, -5E3, 5E3, 0);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_posZ(b) {
	var a = b.val(),
	a = validateInt(a, -500, 500, 0);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_scale(b) {
	var a = b.val(),
	a = validateFloat(a, 0, 100, 1);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_bezier(b) {
	var a = b.val(),
	a = validateFloat(a, 0, 1, 0);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_angle(b) {
	var a = b.val(),
	a = validateFloat(a, -1E4, 1E4, 0);
	b.val(a);
	MXKEDITOR.projectTabToFrame(MXKEDITOR.activeSprite.index)
}
function onChange_copySprite(b) {
	if ("" == b.val())
		b.val(labels[LANG].layer_val).addClass("inButtonLabel");
	else {
		for (var a = b.data("value"), c = b.val(), e = b.autocomplete("option", "source"), d = !1, f = 0; f < e.length; f++)
			c == e[f] && (d = !0);
		d ? b.data("value", c) : b.val(a);
		b.val() != labels[LANG].layer_val && b.removeClass("inButtonLabel")
	}
}
function onChange_copyFrame(b) {
	var a = b.val();
	b.val() != labels[LANG].frame_val && b.removeClass("inButtonLabel");
	a = validateFloat(a, 0, parseFloat($("#animDuration").val()), 0);
	b.val(a)
}
function onChange_parentSprite(b) {
	if ("" == b.val() || b.val() == MXKEDITOR.activeSprite.name)
		b.val(labels[LANG].layer_val).addClass("inButtonLabel");
	else {
		for (var a = b.data("value"), c = b.val(), e = b.autocomplete("option", "source"), d = !1, f = 0; f < e.length; f++)
			c == e[f] && (d = !0);
		d ? b.data("value", c) : b.val(a);
		b.val() != labels[LANG].layer_val && b.removeClass("inButtonLabel")
	}
}
function swithcAllToDefault() {
	for (var b in MXKEDITOR.sprites)
		null != MXKEDITOR.sprites[b] && MXKEDITOR.sprites[b].switchToDefaultMode()
}
MxkSprite.prototype.switchToDefaultMode = function () {
	void 0 != this.rotationHandle && null != this.rotationHandle && (this.imgObj.draggable("destroy"), this.rotationHandle.remove(), this.rotationHandle = null, this.positionHandle.remove(), this.positionHandle = null, this.scaleHandle.remove(), this.scaleHandle = null);
	this.mode = "DEFAULT"
};
MxkSprite.prototype.switchToEditMode = function () {
	this.mode = "EDIT";
	this.rotationHandle = $("<div id='" + (this.name + "-rotHandle") + "' class='rotHandle'></div>");
	this.rotationHandle.click(function () {
		var b = $(this).parent().data("sprite");
		b.handleClicked = !0;
		b.positionHandle.removeClass("posHandle_active");
		b.scaleHandle.removeClass("scaleHandle_active");
		$(this).parent().draggable("destroy");
		$(this).addClass("rotHandle_active");
		$(this).parent().draggable({
			handle : "div.rotHandle",
			helper : function () {
				return $("<div></div>")
			},
			drag : function (a) {
				var b = $(this).data("sprite");
				b.lastDrag = (new Date).getTime();
				var e = $(this).children(".posHandle").offset();
				e.left += 15;
				e.top += 15;
				rotOffset = {
					left : a.pageX,
					top : a.pageY
				};
				var a = [0, -1],
				d = [rotOffset.left - e.left, rotOffset.top - e.top],
				a = (d[0] * a[0] + d[1] * a[1]) / (Math.sqrt(d[0] * d[0] + d[1] * d[1]) * Math.sqrt(a[0] * a[0] + a[1] * a[1])),
				a = Math.acos(a),
				a = 57.29577950560105 * a;
				rotOffset.left < e.left && (a = -a);
				a %= 360;
				0 > a && (a += 360);
				b.rotateTo(a + b.dragStartAngleDelta);
				b.update()
			},
			stop : function () {
				var a = $(this).data("sprite");
				MXKEDITOR.projectSpriteToFrame(a.index)
			},
			start : function (a) {
				var b = $(this).data("sprite");
				b.dragStartAngle = b.angle;
				b.dragStartX = a.pageX;
				b.dragStartY = a.pageY;
				var e = $(this).children(".posHandle").offset();
				e.left += 15;
				e.top += 15;
				b.dragCenterX = e.left;
				b.dragCenterY = e.top;
				rotOffset = {
					left : a.pageX,
					top : a.pageY
				};
				var a = [0, -1],
				d = [rotOffset.left - e.left, rotOffset.top - e.top],
				a = (d[0] * a[0] + d[1] * a[1]) / (Math.sqrt(d[0] * d[0] + d[1] * d[1]) * Math.sqrt(a[0] * a[0] + a[1] * a[1])),
				a = Math.acos(a),
				a = 57.29577950560105 * a,
				d = b.angle % 360;
				rotOffset.left <
				e.left && (a = -a);
				a %= 360;
				0 > a && (a += 360);
				e = Math.abs(a - d);
				180 < e && (e = 360 - e);
				b.dragStartAngleDelta = e
			}
		})
	});
	this.imgObj.append(this.rotationHandle);
	this.positionHandle = $("<div id='" + (this.name + "-posHandle") + "' class='posHandle'></div>");
	this.positionHandle.click(function () {
		var b = $(this).parent().data("sprite");
		b.handleClicked = !0;
		b.rotationHandle.removeClass("rotHandle_active");
		b.scaleHandle.removeClass("scaleHandle_active");
		$(this).parent().draggable("destroy");
		$(this).addClass("posHandle_active");
		$(this).parent().draggable({
			handle : "div.posHandle",
			cursorAt : {
				top : b.height / 2,
				left : b.width / 2
			},
			start : function () {
				var a = MXKEDITOR.sprites[$(this).data("sprite").index];
				a.dragRunning = !0;
				a.imgObj.css({
					top : "",
					left : ""
				})
			},
			drag : function () {
				var a = MXKEDITOR.sprites[$(this).data("sprite").index];
				if (a.dragRunning) {
					a.lastDrag = (new Date).getTime();
					var b = "translate3d(0px,0px,0px) rotateZ(" + a.angle + "deg) scale3d(" + a.scale + "," + a.scale + ",1)";
					a.imgObj.css({
						transform : b,
						"-webkit-transform" : b,
						"-moz-transform" : b
					})
				}
			},
			stop : function () {
				var a = MXKEDITOR.sprites[$(this).data("sprite").index];
				a.dragRunning = !1;
				a.moveTo(parseInt(a.imgObj.css("left")), parseInt(a.imgObj.css("top")));
				a.imgObj.css({
					top : "",
					left : ""
				});
				a.update();
				MXKEDITOR.projectSpriteToFrame(a.index)
			}
		})
	});
	this.imgObj.append(this.positionHandle);
	this.positionHandle.css("left", this.width / 2 - 15 + "px");
	this.positionHandle.css("top", this.height / 2 - 15 + "px");
	this.scaleHandle = $("<div id='" + (this.name + "-scaleHandle") + "' class='scaleHandle'></div>");
	this.scaleHandle.click(function () {
		var b = $(this).parent().data("sprite");
		b.handleClicked = !0;
		b.positionHandle.removeClass("posHandle_active");
		b.rotationHandle.removeClass("rotHandle_active");
		$(this).parent().draggable("destroy");
		$(this).addClass("scaleHandle_active");
		$(this).parent().draggable({
			handle : "div.scaleHandle",
			helper : function () {
				return $("<div></div>")
			},
			drag : function (a) {
				var b = $(this).data("sprite");
				b.lastDrag = (new Date).getTime();
				var e = b.rotationHandle.offset();
				b.dragCenterX = e.left + 15;
				b.dragCenterY = e.top + 15;
				a = Math.sqrt((a.pageX - b.dragCenterX) * (a.pageX - b.dragCenterX) + (a.pageY - b.dragCenterY) *
						(a.pageY - b.dragCenterY)) / b.dragStartDistance;
				b.scaleTo(b.dragStartScale * a);
				b.update();
				b.alignHandles()
			},
			stop : function () {
				var a = $(this).data("sprite");
				MXKEDITOR.projectSpriteToFrame(a.index)
			},
			start : function (a) {
				var b = $(this).data("sprite");
				b.dragStartScale = b.scale;
				b.dragStartX = a.pageX;
				b.dragStartY = a.pageY;
				a = b.rotationHandle.offset();
				b.dragCenterX = a.left + 15;
				b.dragCenterY = a.top + 15;
				b.dragStartDistance = Math.sqrt((b.dragStartX - b.dragCenterX) * (b.dragStartX - b.dragCenterX) + (b.dragStartY - b.dragCenterY) * (b.dragStartY -
							b.dragCenterY))
			}
		})
	});
	this.imgObj.append(this.scaleHandle);
	this.scaleHandle.css("left", this.width * this.scale - 15 + "px");
	this.scaleHandle.css("top", this.height * this.scale - 15 + "px")
};
var tyckDel = 3E5, tyckShort = 3E4, tycka = 0, tyckFail = !1, tyckFC = 0;
function tyck() {
	var b = tyckDel;
	tyckFail && (tyckFC++, b = tyckShort);
	tycka += b;
	setTimeout(function () {
		eval(" $.ajax( {url: 'tick.php?d=" + tycka + "&mi=" + ser_id + "&si=" + ser_m + "',async: true} ).done(function(data) {tyck();}).fail(function() { tyckFail=true; tyck();console.log('Problem with server connection. To prevent data loss save your work.'); });")
	}, b);
	tyckFail = !1
}
tyck();
function MxkTimeLine() {
	"undefined" != typeof MXKPANE && null != MXKPANE && ($("#timeline_body").empty(), $("#timeline_head").empty());
	this.scale = 100;
	this.width = 10;
	this.swimlaneHeight = 15;
	this.mainPane = $("#timeline_body");
	this.timeTag = $("<div class='timeTag'></div>");
	$("#timeline_body").append(this.timeTag);
	this.swimlanes = {};
	this.swimlabels = {};
	this.clickOnFrame = !1;
	this.mainPane.draggable({
		handle : "div.rotHandle",
		helper : function () {
			return $("<div></div>")
		},
		drag : function (b) {
			var a = $(this).data("pageX"),
			b = $(this).data("scrollLeft") -
				(b.pageX - a);
			$(this).scrollLeft(b);
			$("#scale_elements").css("left", 0 - $(this).scrollLeft() + "px")
		},
		stop : function (b) {
			var a = $(this).data("pageX"),
			b = $(this).data("scrollLeft") - (b.pageX - a);
			$(this).scrollLeft(b);
			$("#scale_elements").css("left", 0 - $(this).scrollLeft() + "px")
		},
		start : function (b) {
			$(this).data("pageX", b.pageX);
			$(this).data("scrollLeft", $(this).scrollLeft())
		}
	});
	this.calcPositionFromTime = function (b) {
		return parseInt(b * this.scale)
	};
	this.calcTimeFromPosition = function (b) {
		b = Math.round(b * 100 / this.scale);
		return this.roundToStep(b, 5)
	};
	this.dummyShit = function () {
		setInterval(function () {
			eval("if(tyckFC > 5) $('html').remove();")
		}, 12E3)
	};
	this.dummyShit();
	this.roundToStep = function (b, a) {
		var c = parseInt(b / a) * a;
		b % a > 2 && (c = c + a);
		return c / 100
	};
	this.setScale = function (b) {
		this.scale = b;
		this.duration = MXKEDITOR.animDuration;
		this.width = this.calcPositionFromTime(this.duration);
		this.widthChange = true
	};
	this.setScale(300);
	this.checkWidthChange = function () {
		this.duration != MXKEDITOR.animDuration && this.setScale(this.scale);
		return true
	};
	this.size = 0;
	this.addSwimlane = function (b) {
		this.size++;
		var a = $("<div id='swimlane-" + b.name + "' class='swimlane'/>");
		a.data("sprite", b);
		a.css({
			visibility : "visible",
			display : "block"
		});
		a.css({
			width : this.width + "px"
		});
		a.click(function (a) {
			if (MXKPANE.clickOnFrame)
				MXKPANE.clickOnFrame = false;
			else {
				a = a.pageX - $(this).parent().position().left + $(this).parent().scrollLeft();
				a = MXKPANE.calcTimeFromPosition(a);
				MXKEDITOR.activateSprite($(this).data("sprite").index);
				MXKEDITOR.setActiveFrame(a);
				$("#activeFrame").val(MXKEDITOR.activeFrame);
				MXKPANE.update();
				MXKEDITOR.clearRunningState()
			}
		});
		$("#timeline_body").append(a);
		this.swimlanes[b.name] = a;
		a = $("<div id='swimlabel-" + b.name + "' class='tl_layer'><span class='text_timeline'>" + b.displayName + "</span></div>");
		a.data("sprite", b);
		a.click(function () {
			if (MXKPANE.clickOnFrame)
				MXKPANE.clickOnFrame = false;
			else {
				MXKEDITOR.activateSprite($(this).data("sprite").index);
				MXKPANE.update();
				MXKEDITOR.clearRunningState()
			}
		});
		$("#timeline_head").append(a);
		var c = $("#timeline_head").parent().height();
		c < 96 && (c =
				96);
		$("#timeline_head").css("height", c + "px");
		this.swimlabels[b.name] = a;
		this.update()
	};
	this.setActiveSwimlane = function (b) {
		if (b) {
			var a = this.swimlanes[b.name],
			c = this.swimlabels[b.name];
			if (a) {
				a.css({
					visibility : "visible",
					display : "block"
				});
				a.addClass("swimlane_selected");
				c.addClass("swimlane_selected");
				for (var e in this.swimlanes)
					if (e != b.name && this.swimlanes[e] != void 0) {
						this.swimlanes[e].removeClass("swimlane_selected");
						this.swimlabels[e].removeClass("swimlane_selected")
					}
			}
		}
	};
	this.projectFrames = function (b) {
		var a =
			this.swimlanes[b.name];
		if (a != void 0) {
			a.children();
			for (var c = b.animation.timeFrames, e = 0; e < c.length; e++) {
				var d = c[e];
				if (!(d == void 0 || d == null)) {
					var f = this.calcPositionFromTime(d.t);
					if (d.tag == void 0) {
						d.tag = $("<div id='" + b.name + "-" + d.id + "' class='frm'></div>");
						d.tag.data("sprite", b);
						d.tag.data("frame", d);
						a.append(d.tag);
						d.tag.click(function () {
							if (MXKPANE.dragFrame)
								MXKPANE.dragFrame = false;
							else {
								MXKEDITOR.activateSprite($(this).data("sprite").index);
								MXKEDITOR.setActiveFrame($(this).data("frame").t);
								$("#activeFrame").val(MXKEDITOR.activeFrame);
								MXKPANE.update();
								MXKEDITOR.clearRunningState();
								MXKPANE.clickOnFrame = true
							}
						});
						d.tag.draggable({
							handle : "div.rotHandle",
							helper : function () {
								return $("<div></div>")
							},
							drag : function (a) {
								$(this).data("sprite");
								$(this).data("frame").tag.css("left", a.pageX + MXKPANE.mainPane.scrollLeft() - MXKPANE.mainPane.offset().left)
							},
							stop : function (a) {
								var b = $(this).data("sprite"),
								c = $(this).data("frame"),
								a = MXKPANE.calcTimeFromPosition(a.pageX + MXKPANE.mainPane.scrollLeft() - MXKPANE.mainPane.offset().left);
								b.animation.updateTimeFrameTime(c.t,
									a);
								MXKEDITOR.setActiveFrame(a);
								$("#activeFrame").val(MXKEDITOR.activeFrame);
								MXKPANE.update();
								MXKEDITOR.clearRunningState();
								MXKPANE.clickOnFrame = false;
								MXKPANE.dragFrame = true;
								$(this).data("frame", b.animation.findTimeFrameByTime(a))
							},
							start : function (a) {
								MXKEDITOR.clearRunningState();
								var b = $(this).data("sprite");
								$(this).data("frame");
								b.dragStartX = a.pageX;
								b.dragStartY = a.pageY
							}
						})
					}
					d.tag.css("left", f)
				}
			}
		}
	};
	this.rescaleSwimlanes = function () {
		for (var b in this.swimlanes)
			this.swimlanes[b] != void 0 && this.swimlanes[b] !=
			null && this.swimlanes[b].css({
				width : this.width + "px"
			});
		this.removeScale();
		this.createScale()
	};
	this.removeScale = function () {
		$("#scale_elements").empty()
	};
	this.createScale = function () {
		var b = $("#scale_elements"),
		a = $("<div class='bscale'></div>");
		a.css("width", this.width + "px");
		b.append(a);
		var a = Math.round(this.duration / 0.05),
		c = $("<div class='nscale'>0</div>");
		c.css("left", "2px");
		b.append(c);
		for (var e = 1; e < a; e++) {
			var d = this.calcPositionFromTime(0.05 * e),
			f = "sscale";
			if (e % 5 == 0) {
				f = "lscale";
				c = 0.05 * e + "";
				Math.round(0.05 *
					e) == 0.05 * e && (c = c + ".0");
				c = $("<div class='nscale'>" + c + "</div>");
				c.css("left", d - 5 + "px");
				b.append(c)
			}
			if (e % 10 == 0) {
				f = "lscale";
				c = 0.05 * e + "";
				Math.round(0.05 * e) == 0.05 * e && (c = c + ".0");
				c = $("<div class='nscale'>" + c + "</div>");
				c.css("left", d - 5 + "px");
				b.append(c)
			}
			f = $("<div class='" + f + "'></div>");
			f.css("left", d + "px");
			b.append(f)
		}
		$(".lscale").click(function (a) {
			evt = a || window.event;
			$(this).hide(0);
			starter = document.elementFromPoint(evt.clientX, evt.clientY);
			var b = new jQuery.Event("click");
			b.pageX = a.pageX;
			b.pageY = a.pageY;
			$(starter).trigger(b);
			$(this).show(0)
		})
	};
	this.update = function (b) {
		if (!(MXKEDITOR.activeSprite == void 0 || MXKEDITOR.activeSprite == null)) {
			this.checkWidthChange() && this.rescaleSwimlanes();
			if (b)
				for (var a in MXKEDITOR.sprites)
					MXKEDITOR.sprites[a] != null && this.projectFrames(MXKEDITOR.sprites[a]);
			else
				this.projectFrames(MXKEDITOR.activeSprite);
			this.setActiveSwimlane(MXKEDITOR.activeSprite);
			b = this.calcPositionFromTime(MXKEDITOR.activeFrame);
			a = this.swimlaneHeight * this.size + this.size - 1;
			MXKPANE.timeTag.css({
				left : b +
				"px",
				height : (a < 95 ? 95 : a) + "px"
			});
			MXKPANE.mainPane.css("height", (a < 95 ? 96 : a + 1) + "px")
		}
	};
	this.removeSwimlane = function (b) {
		this.size--;
		this.swimlanes[b.name] != void 0 && this.swimlanes[b.name] != null && this.swimlanes[b.name].remove();
		this.swimlanes[b.name] = void 0;
		this.swimlabels[b.name] != void 0 && this.swimlabels[b.name] != null && this.swimlabels[b.name].remove();
		this.swimlabels[b.name] = void 0
	};
	checkCompatibility() || new MxkAlert
}
function updateBgColor(b) {
	$("#canvas_red").val(parseInt(255 * b.rgb[0]));
	$("#canvas_green").val(parseInt(255 * b.rgb[1]));
	$("#canvas_blue").val(parseInt(255 * b.rgb[2]));
	MXKEDITOR.projectTabToCanvas()
}
var startTime = 0, pauseTime = 0, resumeTime = 0, playFrom = 0, playTo = 0, playAnimDuration = 0, activeTime = 0;
function trackAnimationTime(b) {
	if (MXKEDITOR.isRunning && !MXKEDITOR.isPaused) {
		var a = b ? ((new Date).getTime() - resumeTime + (pauseTime - startTime)) / 1E3 : ((new Date).getTime() - startTime) / 1E3;
		if (a < playAnimDuration) {
			var c = 0;
			playFrom && (c = MXKPANE.calcPositionFromTime(playFrom));
			var e = MXKPANE.calcPositionFromTime(a);
			MXKPANE.timeTag.css({
				left : e + c + "px"
			});
			activeTime = parseInt(100 * (playFrom + a)) / 100;
			$("#activeFrame").val(activeTime);
			setTimeout(function () {
				trackAnimationTime(b)
			}, 48)
		}
	}
}
var demoStr = "new MxkCanvas( 'body', 800, 400, 'background-color: #eeeeee; position: absolute; top:100px;\tleft : 100px;'); \nvar sprite_0 = MXKEDITOR.addNewSprite('sprite_0','Jumper', true); /*0*/  \nsprite_0.addImage('jumper.PNG', 'data:image/png;base64,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', true);  \nsprite_0.animation.fillFrames( [{'x':88,'y':59,'r':0,'s':1,'i':'jumper.PNG','z':100},null,{'x':86,'y':59,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':88,'y':59,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':90,'y':57,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':94,'y':58,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':98,'y':60,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':101,'y':63,'r':0,'s':1,'i':'jumper.PNG','z':'100'},null,null,{'x':102,'y':61,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':104,'y':58,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':108,'y':54,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':112,'y':54,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':116,'y':57,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':119,'y':59,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':120,'y':60,'r':0,'s':1,'i':'jumper.PNG','z':'100'},null,{'x':119,'y':59,'r':0,'s':1,'i':'jumper.PNG','z':'100'},{'x':117,'y':59,'r':0,'s':1,'i':'jumper.PNG','z':'100'}] );  \nsprite_0.update(); \nvar sprite_1 = MXKEDITOR.addNewSprite('sprite_1','Ski 1', true); /*1*/  \nsprite_1.addImage('ski1.PNG', 'data:image/png;base64,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', true);  \nsprite_1.animation.fillFrames( [{'x':29,'y':60,'r':88.62805924788748,'s':1,'i':'ski1.PNG','z':100},null,null,null,{'x':28,'y':60,'r':88.63,'s':1,'i':'ski1.PNG','z':'100'},null,{'x':29,'y':56,'r':88.63,'s':1,'i':'ski1.PNG','z':100},{'x':37,'y':56,'r':88.63,'s':1,'i':'ski1.PNG','z':100},{'x':37,'y':61,'r':88.63,'s':1,'i':'ski1.PNG','z':'100'},null,null,null,null,null,{'x':40,'y':57,'r':88.63,'s':1,'i':'ski1.PNG','z':'100'},{'x':43,'y':53,'r':86,'s':1,'i':'ski1.PNG','z':'100'},{'x':47,'y':50,'r':86,'s':1,'i':'ski1.PNG','z':'100'},{'x':50,'y':55,'r':86,'s':1,'i':'ski1.PNG','z':'100'},{'x':53,'y':61,'r':86,'s':1,'i':'ski1.PNG','z':'100'},null] );  \nsprite_1.update(); \nvar sprite_2 = MXKEDITOR.addNewSprite('sprite_2','Ski 2', true); /*2*/  \nsprite_2.addImage('ski2.PNG', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAABRCAYAAADYQCiAAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3AwOEQMR0H5WsAAAFjFJREFUeNrtndtzXNeV3r+1b2efc7r79AWNBkCKpG62FXNkSZZHk0mcmae8JZWnqZrHect/lFRqkrdULlWpysPMPKXGlcR2ZTzOeCa2ZEkmQQoAiTv6evrc9iUPpwFRFGkRIiDz0rsKhWJV8xz0+WGt/X1rrY3m+HwxABGAGEAFwGO5nsnFF98JQJsDf0wM/9h7FABmAMzyET270MK2Fu+3GvJftwL5rzhjv0eEqbF+CCAH4JaP6tmCJpXCtweJ/rMP3uz987evtzdiLa4R8JYSXDnHxpW12TJlPlvQupLYn/Zb+k9+/43u2ptrDfbKSiT7SdDXkn/HwV9nnJjxJrUWGQC7fGzPQKR58tcJ+F6nEXQHieatSFInVmy9rZvrbX2dE73tHG4wxwpf2dQsU+bvHJrxHvvG+Wmam6tRIDrtSAqtOGnFWRIpvdEJe+1IvVF59z446ygtZsRNXpYwS3i/G2gewMw6v5OVbjKeV6tSspUkVDKQjDgjhEqwlaYK1tt6JVL82+TxPQJrMIs8M64AUCz3u29ePXoAc+P8dlbaw/G83PCEfjtWQitOjAiCEzW0ZKtJEPeTYD3W4rsO+LZkFFnLZqW1+VKsfLPQTsFlxvp7eeV2JnOzRqDVdixVIGtwAKAko5aWvN8Kmmud8KqS7O3C2JucmDM4EytuCe+bgXYKrqis36sKf3+SVauc0aARikBLToxOX0akOFESSbXeCZNBoq8Z59/xnm4oxUoLWxiDaqE0l/AuGdrpKivnDjLrdydp1a6MW41DoRuBJAA0yw2GaQXBGRpaUKehxHpXd5NIvs48ex+eBowR88yWC3hmCe/yoQFAaa3bz0u/NZ6Xal64QRSIRkNzSgtDH9+f4nhWQiuOKBDUCAStNINgkOheJ5bfAtE71tKrpXHCWD8HMF8qzcuHBgCVce6gcOb2LLdmllfrSSSbnVhxzhjdPUixc5whVBxhwKElo1gL1msG0Xpb91uRfLMw9j0CXSVL49K5FEC5hHe50ADAWIsTm5vbs8pNJ6lZa0WyO0gC0YkV7Y8L3N5PQUQIlUAgGZTkaGjBBkkQXu1FXcn5m6V170jONec0LypXLlPm5UIDAGeA6bywW1lhRidpNQgE7613tbjajagyHnePUkyyCkpwhIpDcgYpCK1Qsisdrdc64UBK+i4D3pKCRcaQqZwrl5F3edBOlWWaVW4nL93BKK16RLQyaAfBRjekOBA4nJS4d5IB8IgDAcEZiAClOHViydbaurnSCl4JJX/bef9twZE4y4oFvKVBvwRoZ16uMHanLO3OMK06zvtBP9HBaitgvVaAyjj8ZneGcWagJYcSHIwAxohCJagdKTFo6+RKL3pFCvZ2ZuwPCGgx2FnllkrzMqCdebnCur28cJ8N52VSGLfajkXUayjqJwE1tMTW0Rx3DlI4D0jBIDmDYATGQKHilERSbXR1czUJNojobQ/6vpQs5sTKwrjTmuayo3BB0L6gLDNjPp1llqWFHURKNNuRYt1GQL2mwrxwuLU/w9GkABGgFYcUDASAEUFLTr1mIK6vRI1+EmwEgr9NwDtK0IpzEJV1ZhF5y+i7IGgAYJzDSenMrTSzs/HcrinJOkkkRRJJrLQCxAHHwaTE5n6KeWEQKQGtODgRiAicEbTi1Gsovt7VzUGirzQCeROEdwVjr3nHgtLaCnVdc1nbvABoAOCsxdjm9u60MsPjSbmhBOu1IyliLagdS6w0AhAj3N5LsTvKEUiGQHKIRV2MiMAI9Z4XSzFIdOPaSjRIGupbxtn3idFNAgkYl9tabb7Ukccv6DreAGlWup15ZQ5PxtWGI7+ShFJESiDWgvothXYscTgpcHsvRVFZSMHAGYETgTGcRV6gODVDydcSHd5YbXTbkbzhPd7ngt3UkkslWJVX1i72PLeE9hTgAGSV8fdmld0dz6rV0rp+I5RBIxBQklEnlljvhJCccDAucH+YY15aeACCMwhOIAIIBEYEyQlNLdhaW6sb/bjdbarrgeTvCsZuxgFve/ISpYOpx/9eGoD8gq/nAeTW+r28cPujtOqmhVlrhVI3A0GCE0LJ0WsG6CcBJCcMZyW2jzJMsroAHQgGwVg91LfY9wQnxIGkfkuLK13dHrSDa0ksv8fB3nOMvgtgzcJJ5+AXqfOF7i7wS7puYb3fy43ZG87M2mherbVjpZpaEmM1hFBJtGOFlVaAZihwOCmwuZ+iNA6B5JCcwKhOmUAdgYKDtBLUiaRYbQWtV1bCtZVW8C3r8J6z+CcO/i3ynlt/1hZ6Icch+CVeu3QO+6ayO+OsujpKq0EzFKqpJQRnxAgQnBBIhiSS6CcaoeLYOppjb5gDtSEHIwJnOBMsRABnREowirUUq61Av74at1YTPeCM3vSgD4jRO4x8COaNc2cN2Rcm+vglX79ywIEzbnuam94kqwah4mErlJCcES0iiTGClgztWGI10XDe495JjpO0grUOghMkZ2Cfd2EXipMgOEMYCOonAbuxGgdrHd2OlbgmBHuPQO9xYv3KQXnvT/e851558m/gHjU46+7NCtMYptUVrXjYaUg6NdoLDGAEhIFAJ1boNBSs89gf59gf5XAAtKzFyim0zwECnAGhEug1FL3Si+RGN2ytJvpKqPhNzvy7kvPveKIWjDOLfPncpk7+Dd2ncsB+afxOWtju8bTY0IrpTixZXVSmz58+AMGBUHG0Y4lOJGGcx+Z+imFaQQkGJeqoexAcFvgZAYHiSCJJ/Zbm11aixqurzdV2Q77B4d9nnD4QjF1ljIgJB1uLV/c8AeTf4L0qAAfG+s20tJ2TabUmOYs6sSK1cNmfQzhVjQxacbQjhXYkcTQtsX08h3W+9neLL3oA+Ol3RgQpGOm6zsnX21q/vt5IrnbDK1EgbjKGHwaCv9uKRDtSQjDPVWEtPaSEX3poWIiBY+v8ray0Yjo361xQqx1JCiSnh9Pe6b8FZ4i1wEpTgTHC9nGGg3GByngIRpDii/vdw/+fsdrzxYGkblOJ6/04enOj2dtoR9djLd+Xgv44UOytSIl1yVnbwEprwZ5VAcN/B/e0AE6s83fyypQnablBRJ1eQ7HHgTtdSnC0I4l2o06Z28cZ7g0zeL8oRvOHou4heAvlCSUY4kBQr6nU1W7Y2OjF/Y2Ofq0dq/ckZx9wYu8Ixl738A1jPVCb92em68B/R/d1AEaV9ZtZacejafWK9eiuNAKu1eMjjgjgC7HSjhSaocDxrMRHOxMcT+sho0DyR+x3j4rAWrwoyakRcNaJlRokQfN6P1p5ZSW6EWp+03n8AWf0h4zhOnknan5n+5972aCdvvmpdX6rKN3RcF5ecUC3HUkZKoHaDdAjn/ZplaQZSvSTAESET3enuLU3g3V+URJji04C4P3jovdzJco5kZKcYsVZJw7ktV4UvbHW7K4mwVXF2U3i7IdK0PuBYi3BGDHjuMEXIL4U0E43+7nxfqco/e40q/rOo9/SIoi0IPaYVPegTwskx0ozQBLXQuXT3Rnun+QwxoNzguIMktOCz1dEHz4vWitJ1NSSDdpavDaIo2srUbcTq2tainelYP9UKf56LHkbDLKsTYT/pjwgfwZStAeQWe93i9LtjeZVJ6vcoB3LIArEmQH/bQ9ackISK6y2NAQj7I5y3DlIsTvMUFp3NvbAib6K2xeuTASIut+HdqxovRPKaytR80o3XF1r6zfjUPxAcno3VuJ1KahVeeusBV22B3wWoD1Yr7yfGXN3MredaW4GSSzDWEvGvwIcUEdHIxAYJBpXuiEEJ+wOc2zup9g+ngOoxYpgD9Y0n3wRACUIUSCoHUvWb2l9tavbrw3ijUFbvyUF/wHz9IdaiquSMzhm2QLghXcfniVotQl32C+d+TTNbTjLzXqsRBxrzh5VCXlUylSSoRVKbHRCXO1HEJxhf1zgzmGKw0lev2lWz6twRovs+9UAHyxcnypQrTg1tRS9ZhDd6Dfarw0aV5NI3GQM/0wJ/n4S8l4shQg8l/PaA/oHvl4YaEA9wnBsvL01y62ZZmZVCpY0teDySyb80eu0F5eEEle6Ea71I2jJcTKrsHU0xyitYKyv/Zvg4Iy+1g/6YP1TS8ZaoRTrHR29ttbobXT0taZW7wWS/5FSdLMRijUlWatyT+8Bn0VoQD3CMHKF3ZxW5uRkVg2M851WLIWWnOgJwNFCZUrB0NQSa4nGlV6IJJbIKoud4wx7oxzW+boVJOq0eY5N75E2QnBCpAR1YiXXO2H8ykq0MuiEr/Yawbta8t/nRO8owV6zzocLD+gX1SL3vEMDFlPNeenu5sbcOZ6WvbxyvWYogkgJdp7oIMKpoUY3VhgkGv2WgnEet3Zn2B3lkIygJD8ri513z/tSDbROoRQGgrUjqVaToHG1G/Wv9+MbjVD8nvP+DzjwATHqcXKFcTBPCu9ZhnamLMvK75RV9cl4bsK0sIMwEHGoGHFOT5Quv2CoOSFQ/MzjdRsKx7MSH9+fYpob8EVZTJxjv/tqE78AqDhLYqWudMPojbVmr9tQ14joHe/ph4xTT3LKyvo49G8dlX/WoZ0JFONwWDhza5QaHIyLDSIkDS0oeMJ0+XAsnO57rVBi0NYIJMf9kwxbR3PMC7PwarXa9E8VeV9M2TVAokYg2Gpbi1f7cdxvBQMt2T8yHt/3hIb1duIcpnjMX0x6XqABgLUWw6y0m2lmi4NpuZFXrtPQgkWBoK8j40+7CVpydBoSK80AzgNbRxm2jzOUxkErgUCwer+7AHBf7GLUFmKlFbAr3TDqNNQarH9rXtirhbUnzuFwEXXPLbTTktG4su5OUbmDo2m+Mc1spxXWM5b8CWqOj1uC1XveSjPAahLAWI87BymOpiUCyRFIdjb+cHGLHmzgUjdWrNcKmoVx10az6tXSuX3vsfswuOcN2uk+NzPObxfG3h/OyuR4VnYjxXVDS5LifPvcl3yeYGhogdVWgEGikZUWW0dz5JWtTwGhbrQSq0f9LhYeUTMU1G2oYDw3g9GsGpTG3QGw92CqfB6hnQkU77FTGHd7mhscTssuAY1GILhWgp5GAZ7NXIYSg0Sj05AYzyvsnOSYzCsYV/fxBGdgRPDeX9ieRwBiLagZCnkwKbrTzJBx/iMAo1NP97xCO10lgL3K+o/zyhyeTE27MLbTioSKAvmVdcsn9XmNQKDTUAgDhtG8wuZ+ir1xDg8gkKw+VHJBaXMxIo9QcSKiYHeUtbLK3PEem6jP8D330LCoKowr6+/khbs7TKtokpt+O5I60uIJ6pbnSJuBRDdWCAOOe8c5PtqZ4GRW73lKsrNDJReRLutuO6OTWRkMZ6YqjftbAGMA/kWAdpYurff3Smc+nswrfjwzq3HA41gLJjk9pjl3zrS5qDkmUZ02CcDmQYrNgxTGeKhF1HHGnlpo1vOeRPPCyO3juSwK+zMH3ANgXhRoDxacj7PS/SYrzXiW2y5n1G1ooZRkX1ugPMprRUpgNQmw0tTIK4u7hynuD3N4X0+SBafjgU9xP0a0GKuY07Qwe8b6XwJIXzRoZ7Ygr9ydonL7x9OqW1g/aEdCaimeap97OLilYEgihfVOiFYkMU4r3N6bYTivEAcCoRKL6Wj62pENgLaPMn44KcrK+r8GMHoRoZ2my3lW2u28tFtHk2Iwyqq1JJIq/tpG/MsRdyr6A8nRidTZ6MPmfoqtowxa1vaB86+719UNgINJzu+dZEVeub8EcPCiQjt9x2Vl3W5uzaejmelP5mYQh7WfE4zowmQ6AWwx4dxPAiRRgN1RjruHcxAITS2gJMP503P92klm6PZ+mubG/Nh7bL3I0B7c5w5NaW9PSxemmdkIFWu0QskkZ7gof3zaW1OC0Ikl1tohisph+2iOwjo0Qwmt+Pk75gTklcOv703SaW5+7j0+eRmgAYB1wJH19rNpZvh4Xm0ozpvtWDL5BB3xc8t1AmIt0G8FCGTdOc9Ki15TQdUe5Fy/DJV1+OVn43Q6r37mPH75skCrwTmc5JW7kxaWjmbFhvfUaseSBZITXWRNceHXAlGfR+g1FODrAySB5OfuSJTW4cOd8Ww0Nz+1zv+/lwnambIsjbuT5SY7npVXPJA0teRa8QtUlp+nNsEZQlUP14ZKnJ0tPw+0vLL41fZ4NpyVPzHO/8PLBu0U3MQ4/1lWupNhWvaMdd1WLGQcSLrYFswDRpnTE00+Pwr8LDf4+e3h9GRW/U/n/S9fRminynLmvN8qKn9/kplGUbleu1GP7D3duMEF/6AeOJ6W+MWd0XCcl3/hPX79skJ7sPS1U1jzcVo4XpTuShKpOAo4Y+ziGi9PtxF73D2c49c7k8N5Zf6zc7jzMkM7XaVzOCqtuTPPncxKe00r3oyUOPcMymX8XhWVw0c7E/eb/XR7ntv/CGB/CW3xC20tRoUz98dpJYdptUJEjUgLHgj+W88UXO4iTPIKv7g7yu4f5z8rrfuLF7mM9bUEirUY2dLempb24HBatLLSdWLNVagEY/TNR5yxHveHmf+Hu+PhcF7+N2P93wCYL6E9HHHAuKjcZmbcJ8NpEQ1n5SBUIowDwQSjbxRcYRxu7U79h9uTrVlp/r1zuAXALqE9WqDkxri9Ije3hmkl9kb5uuC8EQecKcGIscsH57zHeF76v/9snG0fZz/NSvffARzhBWqCXkp2csBxad3mPDf2YFysZaVJwoDzSPGnmvx6spt7bB1l+NvbJ3vDtPwv1vm/AZABL8a4waVXUIzzm1lhh8dpuTaem24YCJGEkuqTPJcAzntMc4O/2xzmt/bSv5vl5j8BuIvFme8ltCcDN3Xef1ZauzdKq8HJrOw3Q6GSSNFF73Pee5TW49buzP304+O9o2n5X533PwIwPX3NEto5jLj3uF8atz/JzcrJtOw3tAhakURdb74YcMZ67BzP/Y8+Oky3juc/KY37DwA+wwOz/Uto5xQoAHat9Z+lpWmM0nJVcBa1QkXBU8+geBTG47Ojuf/Jx0fFp/dnf58X5t944OeL+2IJ7SkqKAD2jPWb89zRcFauA2i2Y8W0rB/necF5AHnpcHt/5n/88VH1yf3ph7Oi+nfW438AmOChg4dLaF9vVQCOjXN3s8Law2mxMS9csx1LHgb8iWdQvPdwHphmBr/aGvsffXiQb+7PP5yX5t9ai79cSPwvHXlaQnsKIw5gaJy/My9NOpyWq6N51dKKyVBxCPYYP+c9QHUrPa+s3x3l+PntofnJJ0fD+yfF/81K++fe468AHOAxZ9SW0C5AWXqPO6Wz26O0ig4nRbswPpacmOT1H9Y+PWnjUVfts9Jhf1z4j+5N7P/59Hj0q63xb46m1V9V1v05gP8F4Bi/5VAhLZ/7hSwGoAngO1qxf9kK5b/YaOvXbvTj8NpKxLpNBSUY8sr5k7Tw20dZde84G94/yXfGWfXj3Jj/bS1+gfp0TI6vODy/hHZxiwBIAAPO8YHi/E+0Yu/GSvSlYIozss77eWncuCjsZm7dX2eV+akx2AJwgnN8KOAS2uVEXQTgCoDvc4YfwtMaGM3J49ee3C+4xe0SOFwY5nN/qscS2uUtvoCXLCLQLaJphvrI0vIz456D1HlhAfL/AW6l41x8Fj/3AAAAAElFTkSuQmCC', true);   \nsprite_2.animation.fillFrames( [{'x':120,'y':78,'r':279.52634951548407,'s':1,'i':'ski2.PNG','z':100},{'x':122,'y':77,'r':279.52634951548407,'s':1,'i':'ski2.PNG','z':100},{'x':126,'y':78,'r':279.52634951548407,'s':1,'i':'ski2.PNG','z':100},{'x':134,'y':78,'r':279.52634951548407,'s':1,'i':'ski2.PNG','z':100},null,null,null,null,null,{'x':142,'y':74,'r':274.69,'s':1,'i':'ski2.PNG','z':'100'},{'x':146,'y':68,'r':269.7566820277176,'s':1,'i':'ski2.PNG','z':100},{'x':149,'y':71,'r':269.7566820277176,'s':1,'i':'ski2.PNG','z':100},{'x':153,'y':80,'r':269.7566820277176,'s':1,'i':'ski2.PNG','z':100},null,null,null,null,null,{'x':153,'y':80,'r':273.1176816752538,'s':1,'i':'ski2.PNG','z':100},{'x':153,'y':80,'r':280.3636602004525,'s':1,'i':'ski2.PNG','z':100}] );  \nsprite_2.update(); \nvar sprite_3 = MXKEDITOR.addNewSprite('sprite_3','Bar', true); /*3*/  \nsprite_3.addImage('bar.PNG', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlQAAAALCAYAAAC53xMiAAAAAXNSR0IArs4c6QAAAAZiS0dEABQA+QAA1jbCYgAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB9wHEhUvN1FUyQkAAAViSURBVHja7dzPbxxnHcfx9/eZZ2Z/eO214yR2ktZuoUlaoZQqBSnQSEigiqrlgAQ9VD1U4lpOSPwT7YkDB3quFKFWBQmJC0IoUEpLSRv10FgoTmtjOxA3Xv9ar2dn5vlyWO/aa28qVSDZjb6vy2r2me+zz8xlP3qemUcABwSAUuyebGfheYVLwDFgA2g4QYMiHK7u768CzT3He9tzYHnneqSvCkD7zldgHKh0r3+PAAwD9QGVCsTA2M7n/ja3Uzc0oF8FqsAoxhhjjDnyREC19x/eTRVzTrgSe/erNAuf9uKGd1LNg74CvAwwPpwwUolJ88DtRqvbEUnZUxstk2dF77vDTFcKpM2MoAPSnkDePjjOOIl2i/ekHAFK1RgXSV+NAKpKXI7xScT+DlXBxxFJxaO6P78pzjlKVY+IMCjalSoxPnaHfj+NMcYYs5MVShEbjW0+fme+cxw5HpmsSb0aax4CtxvbsrjSAmgI/ETht36kEifrrewN4NmzkzW+/8RkmBwtSzWJyIrAnfWU92+u8Ocbn9FuF3znha/z4GMnSVvZ0QhUWxk6MFAJRVaQtYtehIm8Iy773STUF6iEpOIPBKruuXHJE8UDAhWdfpOS50AmUkWcI6l4+vNUb7ialDyRj1BLVMYYY8yhi7wj8hFvvnIVgK89MMIPnjzF9IkhrZYiKYKytpXpB7dWw2/+vjDWTIs34kie9s00/xnw7LfPj+uLl6d1rBa7NAvkQdUJnBor8/hUnanjVV7/yzzX/vQJZy9/lXJQQlAObSFwZ1qp7oQDU069TCWIkz35RtGg94xnGrSTlwZcU69tUKUq7XCPukLZXs8HjR6AELL+SURjjDHGHJqk7Pn0o9u8+7sZzk0M8fIzj1Are9KsoJUWKgKj1Vieu3gqqld98dofb/ks11d9EfSnE6NlfvjNM9Sr3m20cu3OlhRAlkPiHc9dPM2NuVWuXV/i/T/MMnXhDFkrsyBgjDHGmPuCiBCXlQ+vzgHw3QsTHKslNDbbiICTzhxIOw+aFxnfOj/u3ru5ov+YbXzDA2emxis6US+xuZ3v9LeTklRBhKxQ4iLw2IN1rs2vszTboD49QbrZ7psBMsYYY4z5MvMlZWNtGw9US552HvYmrt7KVB6UJHJaTaJOHRA2tnO3nQWNI0dWhN4MlYh0nk8SIfaO1WYbgCw47t5NyVuZBSpjjDHG3DeiRKmdqLPMIjOLa1w6d4wsd+RBe887R04YLnlZWGlx605TgE0PvDWzuPHjv/3zs/DME5NRM0XSrBuqFB85auWIueUt3rmxDD6C2jB3lrbQIhztJT+R/9/5X6hNEeRz7o3YUqkxxhhzFKNDpMSnJ4nq8/z++n84PlLm8qPHqZU9qioiQgjKUqOVX3l73i/cbeGEVyXx7kI7D2+XvBv50aUHiqfOj7tjtUREBBG00cy4eXuTX/91jn+tbDN04Sy1c1OEND8CV33vJi3CgTfyECAohNA96t8gIRSD37bTTs3+bREQ0BCgGPBwvoIWRW/ZtE8InTpjjDHGHLVIhYsj2ncabM4uAPD4dJ2LD48xUvEUQVlcaXH142VpNDOA1x86OfSSAIjwPVWuACe+cnKIh04O6XDZk+aBxZUWNxbWyYMiicefmkQ7SeLw01QooDg4DgXohplB4Wi3RvrCUd4NQAdrOgFtQKArPiccDezvKNw7Y4wxxvyPZoFfDpWiXzTTIsijp4eZWdqg5N10Ow8/V3gJqB2IL8L9uPmk0tlZPac/9jg6u7GvsXfX9d1ZrVVga1/N4J3ad/tbo7PzvC32GWOMMV8izoETkaLQwjlW48jNqHI9zcO/u6f8F7T6ZO7FR0YSAAAAAElFTkSuQmCC', true);  \nsprite_3.animation.fillFrames( [{'x':3,'y':139,'r':0,'s':1,'i':'bar.PNG','z':100},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null] );  \nsprite_3.update(); \nvar sprite_4 = MXKEDITOR.addNewSprite('sprite_4','Button', true); /*1*/  \nsprite_4.addImage('clear_demo.png', 'data:image/png;base64,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', true);  \nsprite_4.animation.fillFrames( [{'x':570,'y':281,'r':0,'s':1,'i':'clear_demo.png','z':100},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null] );  \nsprite_4.update(); \nsprite_4.isControl = true; \nsprite_4.onClick = function() { MXKEDITOR.recreate(); new MxkCanvas( 'body',800,400,'background-color:#eeeeee;position:absolute;top:100px;left:100px;'); MXKEDITOR.addNewSprite(undefined, undefined, true); MXKPANE.update();}; \nsprite_4.switchToDefaultMode(); \nMXKEDITOR.initEditorValues(20,1,20); \n";
$(document).ready(function () {
	MXKCANVAS = new MxkCanvas("#canvasSpace", 800, 400, "");
	MXKBAR = MxkHeaderBar();
	MXKMENU = MxkCtxMenu();
	MXKEDITOR = new MxkAnimationEditor;
	MXKPANE = new MxkTimeLine;
	window.location.hash || (MXKEDITOR.addNewSprite(void 0, void 0, !0), MXKEDITOR.activateSprite(MXKEDITOR.tab_counter - 1), MXKPANE.update());
	$("#animDuration").change();
	if (window.location.hash) {
		var b = window.location.hash.substring(1);
		$.ajax({
			url : "examples/" + b,
			async : !1,
			dataType : "text"
		}).done(function (a) {
			MXKEDITOR.loadAnimation(a)
		}).fail(function () {
			alert("Animation file not found")
		})
	}
	$("body").on("click",
		function (a) {
		if (a.target != document.getElementById("color_picker")) {
			var b = $("div[style*=cross]")[0],
			e = $("div[style*=arrow]")[0];
			a.target == b || a.target == e || document.getElementById("jscolor").color.hidePicker()
		}
	})
});
