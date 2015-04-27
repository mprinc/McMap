(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayout =  mcm.list.MapLayout = function(mapStructure, configView, configNodes, configTree, clientApi, schema){
	this.mapStructure = mapStructure;
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

	for(var i in this.mapStructure.edgesById){
		if(this.mapStructure.edgesById[i].kEdge.sourceId == d.kNode._id){
			var vkNode = this.mapStructure.getVKNodeByKId(this.mapStructure.edgesById[i].kEdge.targetId);
			if(! (vkNode.kNode.type in this.schema.getEntitiesStyles())){
				continue;
			}
			children.push(vkNode);
		}
	}
	return children;
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

MapLayout.prototype.processData = function(subtreeRoot) {
	if(!subtreeRoot) subtreeRoot = this.mapStructure.rootNode;
	this.generateTree(subtreeRoot);
	this.clickNode(subtreeRoot);
	this.clientApi.update(subtreeRoot);
};

MapLayout.prototype.generateTree = function(subtreeRoot){
	// Compute the new tree layout.
	this.nodes = [];
	var entityDesc = this.schema.getEntityDesc(subtreeRoot.kNode.type);
	var id = 0;
	for(var edgeType in entityDesc.contains){
		var label = this.schema.getEdgeDesc(edgeType).predicates;
		var node = {
			name: label,
			type: edgeType,
			depth: 1,
			parent: subtreeRoot,
			id: id++
		};
		this.nodes.push(node);

		var subEntities = this.mapStructure.getChildrenNodes(subtreeRoot, edgeType);
		for(var subEntityName in subEntities){
			var node = {
				name: label,
				type: edgeType,
				depth: 2,
				parent: node,
				id: id++
			};
			this.nodes.push(node);
		}
	}

	// this.nodes = this.tree.nodes(subtreeRoot);//.reverse();
	// this.links = this.tree.links(this.nodes);

	this.nodes.forEach(function(d) {
		if(d.parent && d.parent == "null"){
			d.parent = null;
		}
	});
};

MapLayout.prototype.getHtmlNodePosition = function(d){
	return d.x;
};

}()); // end of 'use strict';