(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapLayout =  mcm.MapLayout = function(structure, configView, configNodes, configTree, clientApi, state, schema){
	var that = this;
	this.structure = structure;
	this.configView = configView;
	this.configNodes = configNodes;
	this.configTree = configTree;
	this.clientApi = clientApi;
	this.state = state;
	this.schema = schema;
	this.nodes = null;
	this.links = null;
	this.dom = null;
	this.tree = null;

	var heloOptions = {
		exclusive: true,
		createAt: "sibling"
	};
	this.helo = new mcmInteraction.Halo();
	this.helo.init(heloOptions, function(event){
		var d = d3.select(event.source).data();
		if( Object.prototype.toString.call( d ) === '[object Array]' ) {
			d = d[0];
		}

		switch(event.action){
		case "delete":
			that.clientApi.deleteNode(d);
			that.clientApi.update(d);
			break;
		case "settings":
			window.alert("No settings for the entity");
			break;
		case "add":
			// window.alert("Adding entity");
			// that.clientApi.addEntity(d);
			// showing entity types icons
			var haloAddEntityOptions = {
				icons: [
					{
						position: "w",
						iconText: "OB",
						action: "add-entity:object"
					},
					{
						position: "e",
						iconText: "GR",
						action: "add-entity:grid"
					},
					{
						position: "n",
						iconText: "PR",
						action: "add-entity:process"
					},
					{
						position: "s",
						iconText: "AS",
						action: "add-entity:assumption"
					}
				]
			};
			that.helo.create(event.source, haloAddEntityOptions);
			break;
		case "add-entity:object":
			that.helo.destroy();
			break;
		case "add-entity:grid":
			that.helo.destroy();
			break;
		case "add-entity:process":
			that.helo.destroy();
			break;
		case "add-entity:assumption":
			that.helo.destroy();
			break;
		}
	});
};

MapLayout.CONTAINS_OBJECT = "containsObject";
MapLayout.CONTAINS_PROCESS = "containsProcess";
MapLayout.CONTAINS_VARIABLE_IN = "containsVariableIn";
MapLayout.CONTAINS_VARIABLE_OUT = "containsVariableOut";
MapLayout.CONTAINS_ASSUMPTION = "containsAssumption";

MapLayout.prototype.getChildren = function(d){
	var children = [];
	// TODO: Maybe support closing nodes
	//if(!d.isOpen) return children;

	for(var i in this.structure.edgesById){
		if(this.structure.edgesById[i].kEdge.sourceId == d.kNode._id){
			var vkNode = this.structure.getVKNodeByKId(this.structure.edgesById[i].kEdge.targetId);
			var entityStle = this.schema.getEntityStyle(vkNode.kNode.type);
			if(! entityStle || !entityStle.isShownOnMap){
				continue;
			}
			children.push(vkNode);
		}
	}
	return children;
};

MapLayout.prototype.init = function(mapSize){
	this.dom = this.clientApi.getDom();

	this.tree = d3.layout.tree()
		.size(mapSize);

	this.tree.children(this.getChildren.bind(this));
};

MapLayout.prototype.getAllNodesHtml = function(){
	return this.dom.divMapHtml.selectAll("div." + this.configNodes.html.refCategory);
};

// Returns view representation (dom) from datum d
MapLayout.prototype.getDomFromDatum = function(d) {
	if(!d) return null;
	var dom = this.getAllNodesHtml()
		.data([d], function(d){return d.id;});
	if(dom.size() != 1) return null;
	else return dom;
};

// Select node on node click
MapLayout.prototype.clickNode = function(d, dom, commingFromAngular, doNotBubleUp) {
	// select clicked
	var isSelected = d ? d.isSelected : false;
	var domD3;
	if(dom){
		domD3 = d3.select(dom);
	}else{
		domD3 = this.getDomFromDatum(d);
		if(domD3) dom = domD3.node();
	}

	// unselect all nodes
	var nodesHtml = this.dom.divMapHtml.selectAll("div." + this.configNodes.html.refCategory);
	nodesHtml.classed({
		"selected": false,
		"unselected": true
	});

	var haloOptions = {
		icons: [
			{
				position: "w",
				iconClass: "fa-pencil",
				action: "settings"
			},
			{
				position: "e",
				iconClass: "fa-trash-o",
				action: "delete"
			},
			{
				position: "n",
				iconClass: "fa-plus-circle",
				action: "add"
			}
		]
	};
	if(this.nodes) this.nodes.forEach(function(d){d.isSelected = false;});

	if(isSelected){
		if(d) d.isSelected = false;
		this.structure.unsetSelectedNode();
		this.helo.destroy();
	}else{
		if(d && dom){
			// var nodeHtml = nodesHtml[0];
			domD3.classed({
				"selected": true,
				"unselected": false
			});
			d.isSelected = true;
			this.structure.setSelectedNode(d);
			this.helo.create(dom, haloOptions);
		}else{
			this.structure.unsetSelectedNode();
			this.helo.destroy();
		}
	}

	if(!doNotBubleUp) this.clientApi.mapEntityClicked(this.structure.getSelectedNode(), dom);
	//this.update(this.rootNode);
	return false;
};

// // Toggle children on node double-click
// MapLayout.prototype.clickDoubleNode = function(d) {
// 	this.structure.toggle(d);
// 	this.clientApi.update(d);
// };

// // react on label click.
// MapLayout.prototype.clickLinkLabel = function() {
// 	// console.log("Label clicked: " + JSON.stringify(d.target.name));

// 	// just as a click indicator
// 	if(d3.select(this).style("opacity") < 0.75){
// 		d3.select(this).style("opacity", 1.0);
// 	}else{
// 		d3.select(this).style("opacity", 0.5);
// 	}
// };

// MapLayout.prototype.viewspecChanged = function(target){
// 	if (target.value === "viewspec_tree") this.configTree.viewspec = "viewspec_tree";
// 	else if (target.value === "viewspec_manual") this.configTree.viewspec = "viewspec_manual";
// 	this.clientApi.update(this.structure.rootNode);
// };

MapLayout.prototype.processData = function(rootNodeX, rootNodeY) {
	if(typeof rootNodeX !== 'undefined') this.structure.rootNode.x0 = rootNodeX;
	if(typeof rootNodeY !== 'undefined') this.structure.rootNode.y0 = rootNodeY;

	this.generateTree(this.structure.rootNode);
	this.clickNode(this.structure.rootNode);
	this.clientApi.update(this.structure.rootNode);
};

MapLayout.prototype.generateTree = function(source){
	var that = this;

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

	var viewspec = this.configView.viewspec;
	var sizes = this.configNodes.html.dimensions.sizes;
	this.nodes.forEach(function(d) {
		if(d.parent && d.parent == "null"){
			d.parent = null;
		}

		if(viewspec == "viewspec_manual"){
			// update x and y to manual coordinates if present
			if('xM' in d){
				d.x = d.xM;
			}
			if('yM' in d){
				d.y = d.yM;
			}

			// update width and height to manual values if present
			if('widthM' in d){
				d.width = d.widthM;
			}else{
				d.width = sizes.width;
			}
			if('heightM' in d){
				d.height = d.heightM;
			}else{
				d.height = sizes.height;
			}

			// make it sure that x0 and y0 exist for newly entered nodes
			if(!("x0" in d) || !("y0" in d)){
				d.x0 = d.x;
				d.y0 = d.y;
			}
			// make it sure that width0 and height0 exist for newly entered nodes
			if(!("width0" in d)){
				d.width0 = d.width;
			}
			if(!("height0" in d)){
				d.height0 = d.height;
			}
		}
	});

	if(that.configView.childsRelativePositions){
		var updateChildrenDimensions = function(vkNode){
			var vkChildren = that.getChildren(vkNode);
			var widthA = 0;
			var heightA = 0;
			for (var i in vkChildren){
				var vkChild = vkChildren[i];
				vkChild.xA = that.configNodes.html.dimensions.margines.left + vkNode.xA + vkChild.x;
				vkChild.yA = that.configNodes.html.dimensions.margines.top + vkNode.yA + vkChild.y;

				updateChildrenDimensions(vkChild);

				if(widthA < vkChild.x + vkChild.widthA){
					widthA = vkChild.x + vkChild.widthA +
						that.configNodes.html.dimensions.margines.left +
						that.configNodes.html.dimensions.margines.right;
				}
				if(heightA < vkChild.y + vkChild.heightA){
					heightA = vkChild.y + vkChild.heightA +
						that.configNodes.html.dimensions.margines.top +
						that.configNodes.html.dimensions.margines.bottom;
				}
			}
			if(widthA < that.configNodes.html.dimensions.sizes.width){
				widthA = that.configNodes.html.dimensions.sizes.width;
			}
			if(heightA < that.configNodes.html.dimensions.sizes.height){
				heightA = that.configNodes.html.dimensions.sizes.height;
			}
			vkNode.widthA = widthA;
			vkNode.heightA = heightA;
		};
		that.structure.rootNode.xA = that.structure.rootNode.x;
		that.structure.rootNode.yA = that.structure.rootNode.y;
		updateChildrenDimensions(that.structure.rootNode);

		that.nodes.forEach(function(d){
			d.x = d.xA;
			d.y = d.yA;
			d.width = d.widthA;
			d.height = d.heightA;
		});
	}
	this.printTree(this.nodes);
};

MapLayout.prototype.updateDatumPosition = function(d, dx, dy){
	if(d.xM + dx < 0){
		dx += -d.xM;
	}
	if(d.yM + dy < 0){
		dy += -d.yM;
	}
	d.xM += dx;
	d.yM += dy;

	// update manual values for datum
	d.x += dx;
	d.y += dy;
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

// MapLayout.prototype.getHtmlNodePosition = function(d) {
// 	var x = null;
// 	if(this.configNodes.html.show){
// 		x = d.x - d.height/2;
// 	}else{
// 		x = d.x;
// 	}

// 	if (isNaN(x) || x === null){
// 		x = d.x;
// 	}
// 	return x;
// };

}()); // end of 'use strict';
