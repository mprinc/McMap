(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Structure =  mcm.Structure = function(storageApi){
	this.mapId = "552678e69ad190a642ad461c";
	this.storageApi = storageApi;

	this.rootNode = null;
	this.selectedNode = null;
	this.nodesById = {};
	this.edgesById = {};
	this.properties = {};
};

Structure.prototype.init = function(){
};

Structure.prototype.unsetSelectedNode = function(){
	this.selectedNode = null;
};

Structure.prototype.setSelectedNode = function(selectedNode){
	this.selectedNode = selectedNode;
};

Structure.prototype.getSelectedNode = function(){
	return this.selectedNode;
};

Structure.prototype.hasChildren = function(d){
	for(var i in this.edgesById){
		if(this.edgesById[i].sourceId == d._id){
			return true;
		}
	}
	return false;
};

Structure.prototype.getEdge = function(sourceId, targetId){
	for(var i in this.edgesById){
		if(this.edgesById[i].sourceId == sourceId && this.edgesById[i].targetId == targetId){
			return this.edgesById[i];
		}
	}
	return null;
};

// collapses children of the provided node
Structure.prototype.collapse = function(d) {
	d.isOpen = false;
};

// toggle children of the provided node
Structure.prototype.toggle = function(d) {
	d.isOpen = !d.isOpen;
};

//should be migrated to some util .js file:
Structure.prototype.cloneObject = function(obj){
	return (JSON.parse(JSON.stringify(obj)));
};
	
Structure.prototype.createNode = function() {
	
	var nodeCreated = function(nodeFromServer) {
		console.log("[Map] nodeCreated" + JSON.stringify(nodeFromServer));
		var edgeUpdatedNodeRef = function(edgeFromServer){
			console.log("[Map] edgeUpdatedNodeRef" + JSON.stringify(edgeFromServer));
		};
		
		// updating all references to node on fronted with server-created id:
		var oldId = newNode._id;
		delete this.nodesById.oldId;//		this.nodesById.splice(oldId, 1);
		this.nodesById[nodeFromServer._id] = newNode; //TODO: we should set it to 'nodeFromServer'?! But we should synchronize also local changes from 'newNode' happen in meantime
		newNode._id = nodeFromServer._id; //TODO: same as above
		
		//fixing edges:: sourceId & targetId:
		for(var i in this.edgesById){
			var changed = false;
			var edge = this.edgesById[i];
			if(edge.sourceId == oldId){edge.sourceId = nodeFromServer._id; changed = true;}
			if(edge.targetId == oldId){edge.targetId = nodeFromServer._id; changed = true;}
			if(changed){
				//TODO: should we clone it or call vanilla object creation:
				this.storageApi.updateEdge(edge, edgeUpdatedNodeRef.bind(this)); //saving changes in edges's node refs to server
			}
		}
	};
	
	console.log("[Map] createNode");
	var maxId = -1;
	for(var i in this.nodesById){
		if(maxId < this.nodesById[i]._id){
			maxId = this.nodesById[i]._id;
		}
	}
	
	var newNode = {
		"_id": maxId+1,
		"name": "name ...",
		"isOpen": false,
		"mapId": this.mapId
	};

	this.nodesById[newNode._id] = newNode;
	var nodeCloned = this.cloneObject(newNode);
	delete nodeCloned._id;
	this.storageApi.createNode(nodeCloned, nodeCreated.bind(this)); //saving on server service.
	return newNode;
};

Structure.prototype.updateNode = function(node) {
	this.storageApi.updateNode(node); //updating on server service
};

Structure.prototype.createEdge = function(startNodeId, endNodeId) {
	
	var edgeCreated = function(edgeFromServer) {
		console.log("[Map] edgeCreated" + JSON.stringify(edgeFromServer));
		
		// updating all references to edge on fronted with server-created id:
		var oldId = newEdge._id;
		delete this.edgesById[oldId];//		this.nodesById.splice(oldId, 1);
		this.edgesById[edgeFromServer._id] = newEdge; //TODO: we should set it to 'edgeFromServer'?! But we should synchronize also local changes from 'newEdge' happen in meantime
		newEdge._id = edgeFromServer._id; //TODO: same as above
	};
	
	console.log("[Map] createEdge");
	var maxId = -1;
	for(var i in this.edgesById){
		if(maxId < this.edgesById[i]._id){
			maxId = this.edgesById[i]._id;
		}
	}
	var newEdge = {
		"_id": maxId+1,
		"name": "Hello Links",
		"sourceId": startNodeId,
		"targetId": endNodeId,
		"mapId": this.mapId
	};

	this.edgesById[newEdge._id] = newEdge;
	
	//preparing and saving on server service:
	var edgeCloned = this.cloneObject(newEdge);
	delete edgeCloned._id;
	delete edgeCloned.targetId; // this is still not set to real DV ids
	this.storageApi.createEdge(edgeCloned, edgeCreated.bind(this));
	
	return newEdge;
};

Structure.prototype.processData = function(treeData, rootNodeX, rootNodeY) {
	//this.properties = treeData.properties;
	var rootId = "HMMM?!?!?";
	var i=0;
	var node = null;
	var edge = null;
	for(i=0; i<treeData.nodes.length; i++){
		node = treeData.nodes[i];
		if(!("isOpen" in node)){
			node.isOpen = false;
		}
		this.nodesById[node._id] = node;
	}

	for(i=0; i<treeData.edges.length; i++){
		edge = treeData.edges[i];
		this.edgesById[edge._id] = edge;
	}

	// this.rootNode = this.nodesById[this.properties.rootNodeId];
	this.rootNode = this.nodesById[rootId];
	this.rootNode.x0 = rootNodeY;
	this.rootNode.y0 = rootNodeX;

	this.selectedNode = this.rootNode;

	// this.clickNode(this.rootNode);
	// this.update(this.rootNode);
};


}()); // end of 'use strict';