console.log("init");
var bigtreedata = [{
		id : "root",
		value : "Films data",
		open : true,
		data : [{
				id : "1",
				open : true,
				value : "The Shawshank Redemption",
				data : [
					"page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page", "page"
				]
			}, {
				id : "2",
				open : true,
				value : "The Godfather",
				data : [{
						id : "2.1",
						value : "Part 1"
					}, {
						id : "2.2",
						value : "Part 2"
					}
				]
			}
		]
	}
];
var run = function () {
	console.log("initasdf");
	webix.ui({
		type : "layout_div",
		id : "page",
		cols : [{
				header : "Bones",
				body : {
				container : "testA",
				
				view : "tree",

				select : 'multiselect',
				drag : true,

				data : bigtreedata,
				width : 200
			}
				
			},  {
				
				header : "fun",
				body: "left 2"
			}, {
				rows : [
					propertysheet_1
				]
			}
		]
	});

	$$("sets").setValues({
		width : 250,
		height : 480,
		url : "http://webix.com/data",
		type : "json",
		col1 : "#46C200",
		col2 : "#07FF2A",
		col3 : "#000000"
	});
};
var propertysheet_1 = {
	view : "property",
	id : "sets",
	width : 300,
	elements : [{
			label : "Layout"
		}, {
			label : "Width",
			type : "text",
			id : "width"
		}, {
			label : "Height",
			type : "text",
			id : "height"
		}, {
			label : "Color"
		}, {
			label : "Background",
			type : "color",
			id : "col",
			cols : 20,
			rows : 20
		}, {
			label : "BorderColor",
			type : "color",
			id : "col2"
		}, {
			label : "FontColor",
			type : "color",
			id : "col3",
			cols : 5,
			rows : 5
		}
	]
};

console.log("endinit");
