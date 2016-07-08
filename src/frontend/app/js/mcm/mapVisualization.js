(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapVisualization =  mcm.MapVisualization = function(parentDom, clientApi, mapStructure, configView, configTransitions, configNodes, configEdges, resizingConfig, schema, mcmMapViewService){
	this.destroyed = false;

	this.dom = null;

	this.clientApi = null;
	this.mapStructure = null;
	this.mapLayout = null;
	this.schema = null;
	this.mcmMapViewService = null;

	this.configView = null;
	this.configTransitions = null;
	this.configNodes = null;
	this.configEdges = null;
	this.resizingConfig = null;
	this.editingNodeHtml = null;
};

MapVisualization.prototype.init = function(mapLayout, callback){
	this.mapLayout = mapLayout;
	var that = this;

	if(this.configNodes.html.show){
		this.dom.divMapSvg = this.dom.parentDom.append("svg")
			.attr("class", "map_svg")
			.on("click", function(){
				that.mapLayout.clickNode(null, this);
				// cancle bubbling up
				// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
				d3.event.cancelBubble = true;
				//d3.event.sourceEvent.stopPropagation();
			});
	}

	if(this.configNodes.html.show){
		this.dom.divMapHtml = this.dom.parentDom.append("div")
			.attr("class", "map_html")
			.on("click", function(){
				that.mapLayout.clickNode(null, this);
				// cancle bubbling up
				// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
				d3.event.cancelBubble = true;
				//d3.event.sourceEvent.stopPropagation();
			});
	}
	this.clientApi.timeout(function(){
		if(callback) callback();
	}, 25);

};

MapVisualization.prototype.destroy = function(){
	this.destroyed = true;
	this.dom = null;
	this.clientApi = null;
	this.mapStructure = null;
	this.mapLayout = null;
	this.schema = null;
	this.mcmMapViewService = null;

	this.configView = configView;
	this.configTransitions = configTransitions;
	this.configNodes = configNodes;
	this.configEdges = configEdges;
	this.resizingConfig = resizingConfig;
	this.editingNodeHtml = null;
};

MapVisualization.prototype.getDom = function(){
	return this.dom;
};

MapVisualization.prototype.update = function(source, callback) {
	this.mapLayout.generateTree(this.mapStructure.rootNode);
	var that = this;
	// this.mapLayout.generateTree(this.mapStructure.rootNode);
	var nodeHtmlDatasets = this.updateHtml(source); // we need to update html nodes to calculate node heights in order to center them verticaly
	this.clientApi.timeout(function() {
		// that.updateNodeDimensions();
		that.updateHtmlTransitions(source, nodeHtmlDatasets); // all transitions are put here to be in the same time-slot as links, labels, etc
		if(callback){
			callback();
		}
	}, 25);

};

MapVisualization.prototype.updateHtml = function(source) {
	var that = this;
	if(!this.configNodes.html.show) return;

	var nodeHtml = this.dom.divMapHtml.selectAll("div." + this.configNodes.html.refCategory)
		.data(this.mapLayout.nodes, function(d) { return d.id; });

	// Enter the nodes
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", function(d){
			return that.configNodes.html.refCategory +
			" node_unselected draggable_map_entity dropzone " +
			that.schema.getEntityStyle(d.kNode.type).typeClass +
			" " + that.resizingConfig.target.refClass;
		});
		// .on("dblclick", this.clickDoubleNode.bind(this))
		// .on("click", this.clickNode.bind(this));

	// position node on enter at the source position
	// (it is either parent or another precessor)
	nodeHtmlEnter
		.on("click", function(d){
			that.mapLayout.clickNode(d, this);
			// cancle bubbling up
			// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
			d3.event.cancelBubble = true;
			// d3.event.sourceEvent.stopPropagation();
		})
		.style("left", function(d) {
			var x = null;
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
					x = source.x0;
				}else{
					x = d.parent ? d.parent.x0 : d.x0;
				}
			}else{
				x = d.x;
			}
			// console.log("[nodeHtmlEnter] d: %s, x: %s", d.name, x);
			return x + "px";
		})
		.style("top", function(d) {
			var y = null;
			if(that.configTransitions.enter.animate.position){
				if(that.configTransitions.enter.referToToggling){
					y = source.y0;
				}else{
					y = d.parent ? d.parent.y0 : d.y0;
				}
			}else{
				y = d.y;
			}
			return y + "px";
		})
		.style("min-width", function(d) {
			var width = null;
			if(that.configTransitions.enter.animate.position){
				width = 0;
			}else{
				width = d.width;
			}
			// console.log("[nodeHtmlEnter] d: %s, width: %s", d.name, width);
			return width + "px";
		})
		.style("height", function(d) {
			var height = null;
			if(that.configTransitions.enter.animate.position){
				height = 0;
			}else{
				height = d.height;
			}
			// console.log("[nodeHtmlEnter] d: %s, height: %s", d.name, height);
			return height + "px";
		});

	// Name
	nodeHtmlEnter
		.append("div")
			.attr("class", "name")
			.append("span");

	// Status
	nodeHtmlEnter
		.append("div")
			.attr("class", "status");

	// Type
	nodeHtmlEnter
		.append("div")
			.attr("class", "type");

	// Input Variables
	nodeHtmlEnter
		.append("div")
			.attr("class", "var_in");

	// Output Variables
	nodeHtmlEnter
		.append("div")
			.attr("class", "var_out");
	// Processes
	nodeHtmlEnter
		.append("div")
			.attr("class", "process");

// nodeHtml
	// Name
	nodeHtml.select(".name span")
		.html(function(d){
			return d.kNode.name;
		});

	// Status
	nodeHtml.select(".status")
		.html(function(d){
			var assumptions = that.mapStructure.getChildrenNodes(d, mcm.MapLayout.CONTAINS_ASSUMPTION);
			return "" + assumptions.length;
		});

	// Type
	nodeHtml.select(".type")
		.html(function(d){
			return "" + that.schema.getEntityStyle(d.kNode.type).icon;
		});

	// Input Variables
	nodeHtml.select(".var_in")
		.style("display", function(d){
			return (that.mcmMapViewService.config.entities.showCounts) ? "block" : "none";
		})
		.html(function(d){
			var varIns = that.mapStructure.getChildrenNodes(d, mcm.MapLayout.CONTAINS_VARIABLE_IN);
			return "" + varIns.length;
		});

	// Output Variables
	nodeHtml.select(".var_out")
		.style("display", function(d){
			return (that.mcmMapViewService.config.entities.showCounts) ? "block" : "none";
		})
		.html(function(d){
			var varOuts = that.mapStructure.getChildrenNodes(d, mcm.MapLayout.CONTAINS_VARIABLE_OUT);
			return "" + varOuts.length;
		});

	// Processes
	nodeHtml.select(".process")
		.style("display", function(d){
			return (that.mcmMapViewService.config.entities.showCounts) ? "block" : "none";
		})
		.html(function(d){
			var processes = that.mapStructure.getChildrenNodes(d, mcm.MapLayout.CONTAINS_PROCESS);
			return "" + processes.length;
		});

	if(this.configTransitions.enter.animate.opacity){
		nodeHtmlEnter
			.style("opacity", 1e-6);
	}

	var nodeHtmlDatasets = {
		elements: nodeHtml,
		enter: nodeHtmlEnter,
		exit: null
	};
	return nodeHtmlDatasets;
};

MapVisualization.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
	if(!this.configNodes.html.show) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	// var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_html")
	// 	.data(nodes, function(d) { return d.id; });

	// Transition nodes to their new (final) position
	// it happens also for entering nodes (http://bl.ocks.org/mbostock/3900925)
	var nodeHtmlUpdate = nodeHtml;
	var nodeHtmlUpdateTransition = nodeHtmlUpdate;
	if(this.configTransitions.update.animate.position || this.configTransitions.update.animate.opacity){
		nodeHtmlUpdateTransition = nodeHtmlUpdate.transition()
			.duration(this.configTransitions.update.duration);
	}

	nodeHtmlUpdate
		.select(".status")
			// .style("background-color", function(d){
			// 	return (d.draggedInNo != d3.select(this).html()) ? "red" : "yellow";
			// })
			.style("padding-right", function(d){
				return (d.draggedInNo != d3.select(this).html()) ? "5px" : "2px";
			})
			.html(function(d){
				var assumptions = that.mapStructure.getChildrenNodes(d, mcm.MapLayout.CONTAINS_ASSUMPTION);
				return "" + assumptions.length;
			});

	(this.configTransitions.update.animate.position ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
		.style("top", function(d){
			return d.y + "px";
		})
		// .each("start", function(d){
		// 	console.log("[nodeHtmlUpdateTransition] STARTED: d: %s, xCurrent: %s", d.name, d3.select(this).style("top"));
		// })
		.style("left", function(d){
			var x = d.x;
			// x = d.x;
			// console.log("[nodeHtmlUpdateTransition] d: %s, xCurrent: %s, xNew: %s", d.name, d3.select(this).style("top"), x);
			return x + "px";
		})
		.style("min-width", function(d) {
			var width = d.width;
			// console.log("[nodeHtmlEnter] d: %s, width: %s", d.name, width);
			return width + "px";
		})
		.style("height", function(d) {
			var height = d.height;
			// console.log("[nodeHtmlEnter] d: %s, height: %s", d.name, height);
			return height + "px";
		});

	(this.configTransitions.update.animate.opacity ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
		.select(".status")
			// .style("background-color", "yellow")
			.style("padding-right", "2px");

	if(this.configTransitions.update.animate.opacity){
		nodeHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	// nodeHtmlUpdate[0].forEach(function(nodeHtmlPlain){
	// 	if(!nodeHtmlPlain) return;

	// 	var nodeHtml = d3.select(nodeHtmlPlain);
	// 	nodeHtml.classed({
	// 		has_children: (!nodeHtml.datum().isOpen && that.hasChildren(nodeHtml.datum())),
	// 		has_no_children: !(!nodeHtml.datum().isOpen && that.hasChildren(nodeHtml.datum()))
	// 	});
	// });

	// Transition exiting nodes
	var nodeHtmlExit = nodeHtml.exit();
	var nodeHtmlExitTransition = nodeHtmlExit;
	nodeHtmlExit.on("click", null);
	nodeHtmlExit.on("dblclick", null);

	if(this.configTransitions.exit.animate.position || this.configTransitions.exit.animate.opacity){
		nodeHtmlExitTransition = nodeHtmlExit.transition()
			.duration(this.configTransitions.exit.duration);
	}

	if(this.configTransitions.exit.animate.opacity){
		nodeHtmlExitTransition
			.style("opacity", 1e-6);
	}

	if(this.configTransitions.exit.animate.position){
		nodeHtmlExitTransition
			.style("left", function(d){
				// Transition nodes to the toggling node's new position
				if(that.configTransitions.exit.referToToggling){
					return source.x + "px";
				}else{ // Transition nodes to the parent node's new position
					return (d.parent ? d.parent.x : d.x) + "px";
				}
			})
			.style("top", function(d){
				if(that.configTransitions.exit.referToToggling){
					return source.y + "px";
				}else{
					return (d.parent ? d.parent.y : d.y) + "px";
				}
			});
	}
	nodeHtmlExitTransition.remove();
};

MapVisualization.prototype.updateName = function(/* nodeView */){
	// var nodeSpan = nodeView.select("span");
	// var newName = nodeSpan.text();
	// var d = nodeView.datum();
	// this.mapStructure.updateName(d, newName);
};

MapVisualization.prototype.updateNodeDimensions = function(){
	// if(!this.configNodes.html.show) return;
	// // var that = this;

	// this.dom.divMapHtml.selectAll("div.node_html").each(function(d) {
	// 	// Get centroid(this.d)
	// 	d.width = parseInt(d3.select(this).style("width"));
	// 	d.height = parseInt(d3.select(this).style("height"));
	// 	// d3.select(this).style("top", function(d) {
	// 	// 	return "" + that.mapLayout.getHtmlNodePosition(d) + "px";
	// 	// })
	// });
};

}()); // end of 'use strict';
