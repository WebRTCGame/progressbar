function Nodes(){
this.n = {};
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