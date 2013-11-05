function Nodes() {
	this.n = {};
	this.selected = "";
};
Nodes.prototype.selectNext = function () {
	if (this.n[selected].isRoot) {}
};
Nodes.prototype.selectParent = function () {
	if (!this.n[selected].isRoot) {
		this.selected = this.n[selected].parent;
	}
};
Nodes.prototype.select = function(bone){
this.unSelectAll();
this.selected = bone.id;
this.getSelected.selected = true;
//this.n[bone.id].selected = true;
console.log(bone.id);
//bone.selected = true;

};
Nodes.prototype.getSelected = function(){
return this.get(this.selected);
};
Nodes.prototype.once = function () {
	console.log("whateva");
};
Nodes.prototype.get = function (id) {
	return this.n[id];
};
Nodes.prototype.add = function (bone) {
	this.n[bone.id] = bone;

	return this.n[bone.id];
};
Nodes.prototype.remove = function (bone) {
	delete this.n[bone.id];
};
Nodes.prototype.each = function (func) {
	for (var i in this.n) {
		func(this.n[i]);
	}
};
Nodes.prototype.unSelectAll = function(){
this.each(function(x){x.selected = false});
};
var nodes = new Nodes();