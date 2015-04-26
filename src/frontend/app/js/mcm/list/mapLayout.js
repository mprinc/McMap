(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayout =  mcm.list.MapLayout = function(structure, configView, configNodes, configTree, clientApi, schema){
	this.structure = structure;
	this.configView = configView;
	this.configNodes = configNodes;
	this.configTree = configTree;
	this.clientApi = clientApi;
	this.schema = schema;
	this.nodes = null;
	this.links = null;
	this.dom = null;
	this.tree = null;
};

MapLayout.prototype.getChildren = function(d){
	var children = [];
	// TODO: Maybe support closing nodes
	//if(!d.isOpen) return children;

	for(var i in this.structure.edgesById){
		if(this.structure.edgesById[i].kEdge.sourceId == d.kNode._id){
			var vkNode = this.structure.getVKNodeByKId(this.structure.edgesById[i].kEdge.targetId);
			if(! (vkNode.kNode.type in this.schema.getEntitiesStyles())){
				continue;
			}
			children.push(vkNode);
		}
	}
	return children;
};

MapLayout.prototype.getAllNodesHtml = function(){
	return this.dom.divList.selectAll("div.node_html");
};

// Returns view representation (dom) from datum d
MapLayout.prototype.getDomFromDatum = function(d) {
	var dom = this.getAllNodesHtml()
		.data([d], function(d){return d.id;});
	if(dom.size() != 1) return null;
	else return dom;
};

MapLayout.prototype.init = function(mapSize){
	this.dom = this.clientApi.getDom();

	this.tree = d3.layout.tree()
		.size(mapSize);

	this.tree.children(this.getChildren.bind(this));
};


// Select node on node click
MapLayout.prototype.clickNode = function(d, dom) {
	// select clicked
	var isSelected = d ? d.isSelected : false;
	var domD3 = d3.select(dom);

	// unselect all nodes
	var nodesHtml = this.dom.divList.selectAll("div." + this.configNodes.html.refCategory);
	nodesHtml.classed({
		"selected": false,
		"unselected": true
	});
	this.nodes.forEach(function(d){d.isSelected = false;});

	if(isSelected){
		if(d) d.isSelected = false;
		this.selectedNode = null;
	}else{
		if(d && dom){
			// var nodeHtml = nodesHtml[0];
			domD3.classed({
				"selected": true,
				"unselected": false
			});
			d.isSelected = true;
			this.selectedNode = d;
		}else{
			this.selectedNode = null;
		}
	}

	this.clientApi.mapEntityClicked(this.selectedNode ? d : null, dom);
	//this.update(this.rootNode);
	return false;
};

MapLayout.prototype.processData = function() {
	this.generateTree(this.structure.rootNode);
	this.clickNode(this.structure.rootNode);
	this.clientApi.update(this.structure.rootNode);
};

MapLayout.prototype.generateTree = function(source){
	if(this.nodes){
		// Normalize for fixed-depth.
		this.nodes.forEach(function(d) {
		    if(!('draggedInNo' in d)) d.draggedInNo = 0;
			// Stash the old positions and widths for transition.
		    if('x' in d) d.x0 = d.x;
		    if('y' in d) d.y0 = d.y;
		    if('width' in d) d.width0 = d.width;
		    if('height' in d) d.height0 = d.height;
		});
	}

	// Compute the new tree layout.
	this.nodes = this.tree.nodes(source);//.reverse();
	this.links = this.tree.links(this.nodes);

	this.nodes.forEach(function(d) {
		if(d.parent && d.parent == "null"){
			d.parent = null;
		}
	});

	this.printTree(this.nodes);
};

MapLayout.prototype.printTree = function(nodes) {
	var minX = 0, maxX = 0, minY = 0, maxY = 0;
	console.log("%d nodes", nodes.length);
	for(var i=0; i<nodes.length; i++){
		var node = nodes[i];
		var height = ('height' in node) ? node.height : 0;
		var width = ('width' in node) ? node.width : 0;
		var name = node.kNode ? node.kNode.name : "(no name)"
		console.log("\tnode [%d] \"%s\": x:%s, y:%s, width:%s, height: %s)", i, name, node.x, node.y, node.width, node.height);
		if(node.x - height/2 < minX) minX = node.x - height/2;
		if(node.x + height/2 > maxX) maxX = node.x + height/2;
		if(node.y - width/2 < minY) minY = node.y - width/2;
		if(node.y + width/2 > maxY) maxY = node.y + width/2;
	}
	console.log("Dimensions: (minX: %s, maxX: %s, minY: %s, maxY: %s)", minX, maxX, minY, maxY);
};

MapLayout.prototype.getHtmlNodePosition = function(d){
	return d.x;
};

}()); // end of 'use strict';