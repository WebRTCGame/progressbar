function Nodes(){
this.n = {};
this.selected = "";
};
Nodes.prototype.selectNext = function(){
if (this.n[selected].isRoot){

}
};
Nodes.prototype.selectParent = function(){
if (!this.n[selected].isRoot){
this.selected = this.n[selected].parent;
}
};
Nodes.prototype.once = function(){
console.log("whateva");
};
Nodes.prototype.get = function(id){
return this.n[id];
};
Nodes.prototype.add = function(bone){
this.n[bone.id] = bone;

return this.n[bone.id];
};
Nodes.prototype.remove = function(bone){
delete this.n[bone.id];
};
Nodes.prototype.each = function(func){
for (var i in this.n)
{
func(this.n[i]);
}
};
var nodes = new Nodes();