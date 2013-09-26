var nodes = {};
nodes.prototype.add = function(bone){
nodes[bone.id] = bone;
};
nodes.prototype.remove = function(bone){
delete nodes[bone.id];
};