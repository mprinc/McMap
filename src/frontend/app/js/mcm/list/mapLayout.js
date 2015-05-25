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
			var entityStle = this.schema.getEntityStyle(vkNode.kNode.type);
			if(! entityStle || !entityStle.isShownOnMap){
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
MapLayout.prototype.clickNode = function(d, dom, commingFromAngular, doNotBubleUp) {
	// select clicked
	var isSelected = d ? d.isSelected : false;
	if(!dom) dom = this.getDomFromDatum(d);
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
		this.mapStructure.unsetSelectedNode();
	}else{
		if(d && dom){
			// var nodeHtml = nodesHtml[0];
			domD3.classed({
				"selected": true,
				"unselected": false
			});
			d.isSelected = true;
			this.mapStructure.setSelectedNode(d);
		}else{
		this.mapStructure.unsetSelectedNode();
		}
	}

	if(!doNotBubleUp) this.clientApi.mapEntityClicked(this.mapStructure.getSelectedNode(), dom);
	//this.update(this.rootNode);
	return false;
};

MapLayout.prototype.processData = function(subtreeRoot, rootNodeX, rootNodeY) {
	if(typeof rootNodeX !== 'undefined' && typeof rootNodeY !== 'undefined'){
		this.mapStructure.rootNode.x0 = rootNodeX;
		this.mapStructure.rootNode.y0 = rootNodeY;
	}

	if(!subtreeRoot) subtreeRoot = this.mapStructure.rootNode;
	this.generateTree(subtreeRoot);
	// we need to avoid this since it interfer with mcmMap through mapStructure
	// this.clickNode(subtreeRoot);
	this.clientApi.update(subtreeRoot);
};

MapLayout.prototype.generateTree = function(subtreeRoot){
	// Compute the new tree layout.
	this.nodes = [];
	var entityDesc = this.schema.getEntityDesc(subtreeRoot.kNode.type);
	var nodeId = 0;
	for(var edgeType in entityDesc.contains){
		var label = this.schema.getEdgeDesc(edgeType).objects;
		var edgeNode = { // visualization-node that represents edge
			name: label,
			objectType: "edge",
			type: edgeType,
			depth: 1,
			parent: subtreeRoot,
			id: nodeId++
		};
		this.nodes.push(edgeNode);

		var subEntities = this.mapStructure.getChildrenNodes(subtreeRoot, edgeType);
		for(var id in subEntities){
			var subEntity = subEntities[id];
			var nodeEntity = { // visualization-node that represents entity
				name: subEntity.kNode.name,
				objectType: "entity",
				type: subEntity.kNode.type,
				depth: 2,
				parent: edgeNode,
				kNode: subEntity.kNode,
				vkNode: subEntity,
				id: nodeId++
			};
			this.nodes.push(nodeEntity);
		}
	}

	// this.nodes = this.tree.nodes(subtreeRoot);//.reverse();
	// this.links = this.tree.links(this.nodes);

	this.nodes.forEach(function(d) {
		if(d.parent && d.parent == "null"){
			d.parent = null;
		}
	});

	// this.printTree(this.nodes);
};

MapLayout.prototype.printTree = function(nodes) {
	var minX = 0, maxX = 0, minY = 0, maxY = 0;
	console.log("%d nodes", nodes.length);
	for(var i=0; i<nodes.length; i++){
		var node = nodes[i];
		var height = ('height' in node) ? node.height : 0;
		var width = ('width' in node) ? node.width : 0;
		var name = node.kNode ? node.kNode.name : "(no name)";
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