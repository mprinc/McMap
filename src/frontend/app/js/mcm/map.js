(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Map =  mcm.Map = function(config, client, entityStyles){
	this.config = config;
	this.client = client;
	this.entityStyles = entityStyles;

	this.mapContainer = null;
	this.model = null;
	this.nodeViewList = [];
	this.edgeViewList = [];
	this.mapSvgD3 = null;
	this.mapHtmlD3 = null;
	this.selectedNode = null;
};

Map.prototype.init = function() {
	var that = this;
	var mcmMapInitialize = function() {
		var checkMapCanvas = function(){
			this.mapContainer = this.client.getContainer();
			// TODO: map-container object is created if $scope.config.showMap is set to true which is happening in this current code iteration
			// so it is still not processed and rendered in DOM, therefore we need to sleep and wait for the next iteration
			// solution to avoid this could be to put setting $scope.config.showMap in compile/link function, but only if it is not too early to make decission then

			if(!this.mapContainer || this.mapContainer.length <= 0){
				this.client.timeout(checkMapCanvas.bind(this), 10);
			}else{
				if(this.config.nodes.html.show){
					this.mapSvgD3 = d3.select(this.mapContainer.get(0)).append("svg")
						.attr("class", "map_svg")
						.on("click", function(){
							that.clickNode(null, this);
							// cancle bubbling up
							// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
							d3.event.cancelBubble = true;
							//d3.event.sourceEvent.stopPropagation();
						});
				}

				if(this.config.nodes.html.show){
					this.mapHtmlD3 = d3.select(this.mapContainer.get(0)).append("div")
						.attr("class", "map_html")
						.on("click", function(){
							that.clickNode(null, this);
							// cancle bubbling up
							// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
							d3.event.cancelBubble = true;
							//d3.event.sourceEvent.stopPropagation();
						});
				}

				this.placeModels(this.model);
			}
		};
		checkMapCanvas.bind(this)();
	};

	// var placeEdge = function(edgeView, delay){
	// 	// var edges = this.mapSvgD3.append("line")
	// 	// 	.attr("x1", 5)
	// 	// 	.attr("y1", 5)
	// 	// 	.attr("x2", 50)
	// 	// 	.attr("y2", 50)
	// 	// 	.attr("stroke-width", 2)
	// 	// 	.attr("stroke", "black");
	// };

	mcmMapInitialize.bind(this)();

	var manipulationEnded = function(targetD3){
		var d = targetD3 ? targetD3.datum() : null;
		console.log("map_entity:manipulationEnded [%s]", d ? d.name : null);
		that.update(that.model.nodes[0]);
	};

	var draggingConfig = {
		draggTargetElement: true,
		target: {
			refCategory: '.draggable_map_entity',
			opacity:  0.5,
			zIndex: 10,
			cloningContainer: this.mapHtmlD3.node(), // getting native dom element from jQuery selector
			leaveAtDraggedPosition: true,
			callbacks: {
				onend: manipulationEnded
			}
		},
		debug: {
			origVsClone: false
		}
	};

	interaction.MoveAndDrag.InitializeDragging(draggingConfig);

	var draggAndDropEnded = function(targetD3, relatedTargetD3, draggedIn){
		var d = targetD3 ? targetD3.datum() : null;
		var dRelated = relatedTargetD3 ? relatedTargetD3.datum() : null;
		console.log("draggAndDropEnded [%s into %s]: %s", dRelated ? dRelated.name : null, d ? d.name : null, draggedIn);
		if(draggedIn){
			if(d) d.draggedInNo++;
			that.update(that.model.nodes[0]);
		}
	};

	var draggingInConfig = {
		dropzone: {
			refCategory: '.dropzone',
			overlap: 0.5,
			dragenteredClass: 'drop-target',
			activeClass: 'drop-active'
		},
		draggable: {
			refCategory: '.yes-drop',
			candropClass: 'can-drop',
			messages: {
				in: 'Dragged in',
				out: 'Dragged out',
				dropped: 'Dropped'
			},
			callbacks: {
				onend: draggAndDropEnded
			}
		},
		debug: {
			draggingStatus: false
		}
	};

	interaction.MoveAndDrag.InitializeDraggingIn(draggingInConfig);
};

// Select node on node click
Map.prototype.clickNode = function(d, dom) {
	// select clicked
	var isSelected = d ? d.isSelected : false;
	var domD3 = d3.select(dom);

	// unselect all nodes
	var nodesHtml = this.mapHtmlD3.selectAll("div." + this.config.nodes.html.refCategory);
	nodesHtml.classed({
		"selected": false,
		"unselected": true
	});
	this.model.nodes.forEach(function(d){d.isSelected = false;});

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

	this.client.mapEntityClicked(this.selectedNode ? d : null, dom);
	//this.update(this.rootNode);
	return false;
};

Map.prototype.placeModels = function(model){
	this.model = model;

	if(!this.mapSvgD3 || !model) return;
	this.update(this.model.nodes[0]);
};

Map.prototype.processNodes = function(nodes){
	if(nodes){
		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
		    if(!('draggedInNo' in d)) d.draggedInNo = 0;
			// Stash the old positions and widths for transition.
		    if('x' in d) d.x0 = d.x;
		    if('y' in d) d.y0 = d.y;
		    if('width' in d) d.width0 = d.width;
		    if('height' in d) d.height0 = d.height;
		});
	}

	var viewspec = this.config.view.viewspec;
	var sizes = this.config.nodes.html.dimensions.sizes;
	nodes.forEach(function(d) {
		if(d.parent && d.parent == "null"){
			d.parent = null;
		}

		if(viewspec == "viewspec_manual"){
			// update x and y to manual coordinates if present
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "x" in d.visual.dimensions.sizes){
				d.x = d.visual.dimensions.sizes.x;
			}
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "y" in d.visual.dimensions.sizes){
				d.y = d.visual.dimensions.sizes.y;
			}

			// update width and height to manual values if present
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "width" in d.visual.dimensions.sizes){
				d.width = d.visual.dimensions.sizes.width;
			}else{
				d.width = sizes.width;
			}
			if(d.visual && d.visual.dimensions && d.visual.dimensions.sizes && "height" in d.visual.dimensions.sizes){
				d.height = d.visual.dimensions.sizes.height;
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
};

Map.prototype.hasChildren = function(/*d*/){
	return false;
};

Map.prototype.getHtmlNodePosition = function(d){
	return d.x;
};

Map.prototype.update = function(source, callback) {
	// this.generateTree(this.rootNode);
	var that = this;
	this.processNodes(this.model.nodes);
	var nodeHtmlDatasets = this.updateHtml(this.model.nodes, source); // we need to update html nodes to calculate node heights in order to center them verticaly
	this.client.timeout(function() {
		// that.updateNodeDimensions();
		that.updateHtmlTransitions(source, nodeHtmlDatasets); // all transitions are put here to be in the same time-slot as links, labels, etc
		// that.updateSvgNodes(source);
		// that.updateLinks(source);
		// that.updateLinkLabels(source);
		if(callback){
			callback();
		}
	}, 25);
};

Map.prototype.updateHtml = function(nodes, source) {
	var that = this;
	if(!this.config.nodes.html.show) return;

	var nodeHtml = this.mapHtmlD3.selectAll("div." + this.config.nodes.html.refCategory)
		.data(nodes, function(d) { return d.id; });

	// Enter the nodes
	// we create a div that will contain both visual representation of a node (circle) and text
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", function(d){
			return that.config.nodes.html.refCategory +
			" node_unselected draggable_map_entity dropzone " +
			that.entityStyles[d.type].typeClass;
		});
		// .on("dblclick", this.clickDoubleNode.bind(this))
		// .on("click", this.clickNode.bind(this));

	// position node on enter at the source position
	// (it is either parent or another precessor)
	nodeHtmlEnter
		.on("click", function(d){
			that.clickNode(d, this);
			// cancle bubbling up
			// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
			d3.event.cancelBubble = true;
			// d3.event.sourceEvent.stopPropagation();
		})
		.style("left", function(d) {
			var x = null;
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
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
			if(that.config.transitions.enter.animate.position){
				if(that.config.transitions.enter.referToToggling){
					y = source.y0;
				}else{
					y = d.parent ? d.parent.y0 : d.y0;
				}
			}else{
				y = d.y;
			}
			return y + "px";
		})
		.style("width", function(d) {
			var width = null;
			if(that.config.transitions.enter.animate.position){
				width = 0;
			}else{
				width = d.width;
			}
			// console.log("[nodeHtmlEnter] d: %s, width: %s", d.name, width);
			return width + "px";
		})
		.style("height", function(d) {
			var height = null;
			if(that.config.transitions.enter.animate.position){
				height = 0;
			}else{
				height = d.height;
			}
			// console.log("[nodeHtmlEnter] d: %s, height: %s", d.name, height);
			return height + "px";
		});

	nodeHtmlEnter[0].forEach(function(nodeHtmlPlain){
		if(!nodeHtmlPlain) return;

		var nodeHtml = d3.select(nodeHtmlPlain);
		nodeHtml.classed({
			has_children: (!nodeHtml.datum().isOpen && that.hasChildren(nodeHtml.datum())),
			has_no_children: !(!nodeHtml.datum().isOpen && that.hasChildren(nodeHtml.datum()))
		});
	});

	nodeHtmlEnter
		.append("div")
			.attr("class", "status")
				.html(function(d){
					return "" + d.draggedInNo;
				});
	nodeHtmlEnter
		.append("div")
			.attr("class", "type")
				.html(function(d){
					return "" + that.entityStyles[d.type].icon;
				});

	nodeHtmlEnter
		.append("div")
			.attr("class", "name")
			.append("span")
				.html(function(d) {
					return d.name;
				});

	if(this.config.transitions.enter.animate.opacity){
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

Map.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
	if(!this.config.nodes.html.show) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	// var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// var nodeHtml = divMapHtml.selectAll("div.node_html")
	// 	.data(nodes, function(d) { return d.id; });

	// Transition nodes to their new (final) position
	// it happens also for entering nodes (http://bl.ocks.org/mbostock/3900925)
	var nodeHtmlUpdate = nodeHtml;
	var nodeHtmlUpdateTransition = nodeHtmlUpdate;
	if(this.config.transitions.update.animate.position || this.config.transitions.update.animate.opacity){
		nodeHtmlUpdateTransition = nodeHtmlUpdate.transition()
			.duration(this.config.transitions.update.duration);
	}

	nodeHtmlUpdate
		.select(".status")
			.style("background-color", function(d){
				return (d.draggedInNo != d3.select(this).html()) ? "red" : "yellow";
			})
			.style("padding-right", function(d){
				return (d.draggedInNo != d3.select(this).html()) ? "5px" : "2px";
			})
			.html(function(d){
				return "" + d.draggedInNo;
			});

	(this.config.transitions.update.animate.position ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
		.style("top", function(d){
			return d.y + "px";
		})
		// .each("start", function(d){
		// 	console.log("[nodeHtmlUpdateTransition] STARTED: d: %s, xCurrent: %s", d.name, d3.select(this).style("top"));
		// })
		.style("left", function(d){
			var x = that.getHtmlNodePosition(d);
			// x = d.x;
			// console.log("[nodeHtmlUpdateTransition] d: %s, xCurrent: %s, xNew: %s", d.name, d3.select(this).style("top"), x);
			return x + "px";
		});
	(this.config.transitions.update.animate.opacity ? nodeHtmlUpdateTransition : nodeHtmlUpdate)
		.select(".status")
			.style("background-color", "yellow")
			.style("padding-right", "2px");

	if(this.config.transitions.update.animate.opacity){
		nodeHtmlUpdateTransition
			.style("opacity", 1.0);
	}

	nodeHtmlUpdate[0].forEach(function(nodeHtmlPlain){
		if(!nodeHtmlPlain) return;

		var nodeHtml = d3.select(nodeHtmlPlain);
		nodeHtml.classed({
			has_children: (!nodeHtml.datum().isOpen && that.hasChildren(nodeHtml.datum())),
			has_no_children: !(!nodeHtml.datum().isOpen && that.hasChildren(nodeHtml.datum()))
		});
	});

	// Transition exiting nodes
	var nodeHtmlExit = nodeHtml.exit();
	var nodeHtmlExitTransition = nodeHtmlExit;
	nodeHtmlExit.on("click", null);
	nodeHtmlExit.on("dblclick", null);

	if(this.config.transitions.exit.animate.position || this.config.transitions.exit.animate.opacity){
		nodeHtmlExitTransition = nodeHtmlExit.transition()
			.duration(this.config.transitions.exit.duration);
	}

	if(this.config.transitions.exit.animate.opacity){
		nodeHtmlExitTransition
			.style("opacity", 1e-6);
	}

	if(this.config.transitions.exit.animate.position){
		nodeHtmlExitTransition
			.style("left", function(d){
				// Transition nodes to the toggling node's new position
				if(that.config.transitions.exit.referToToggling){
					return source.y + "px";					
				}else{ // Transition nodes to the parent node's new position
					return (d.parent ? d.parent.y : d.y) + "px";
				}
			})
			.style("top", function(d){
				if(that.config.transitions.exit.referToToggling){
					return source.x + "px";
				}else{
					return (d.parent ? d.parent.x : d.x) + "px";
				}
			});
	}
	nodeHtmlExitTransition.remove();
};

}()); // end of 'use strict';