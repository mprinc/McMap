(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MapVisualization =  mcm.list.MapVisualization = function(parentDom, clientApi, mapStructure, configTransitions, configNodes, configEdges, schema, services){
	this.dom = {
		parentDom: parentDom,
		divList: null
	};

	this.clientApi = clientApi;
	this.mapStructure = mapStructure;
	this.mapLayout = null;
	this.schema = schema;

	this.configTransitions = configTransitions;
	this.configNodes = configNodes;
	this.configEdges = configEdges;
	this.editingNodeHtml = null;
	this.services = services;
};

MapVisualization.prototype.init = function(mapLayout, callback){
	this.mapLayout = mapLayout;
	var that = this;

	this.dom.divList = this.dom.parentDom.select(".list")
		.on("click", function(){
			that.mapLayout.clickNode(null, this);
			// cancle bubbling up
			// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
			d3.event.cancelBubble = true;
			//d3.event.sourceEvent.stopPropagation();
		});
	this.clientApi.timeout(function(){
		if(callback) callback();
	}, 25);

};

MapVisualization.prototype.getDom = function(){
	return this.dom;
};

MapVisualization.prototype.update = function(source, callback) {
	this.mapLayout.generateTree(source);
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

MapVisualization.prototype.changeSettingsState = function(d, settingsDom, closeOrOpen) {
	if(closeOrOpen === true || d.settingsOpen){
		// acting on "div.settings"
		d3.select(settingsDom).style("right", null);
		d.settingsOpen = false;
	}else if(closeOrOpen === false || !d.settingsOpen){
		d3.select(settingsDom).style("right", "50%");
		d.settingsOpen = true;
	}
};

MapVisualization.prototype.deleteEntity = function(d, settingsDom) {
	this.clientApi.deleteNode(d.vkNode);
	this.changeSettingsState(d, settingsDom, true);
	this.clientApi.update(d.parent.parent);

};

// calculate number of children for the edge (d).
// if the edge is group (it has edgeTypes property) than it summs up all edgeTypes in it
MapVisualization.prototype._getChildrenCountForEdgeType = function(d) {
	var childrenCount = this.mapStructure.getChildrenNodes(d.parent, d.type).length;
	if('edgeTypes' in d){
		for(var edgeType in d.edgeTypes){
			childrenCount += this.mapStructure.getChildrenNodes(d.parent, edgeType).length;
		}
	}
	return childrenCount;
};

MapVisualization.prototype.updateHtml = function(source) {
	var that = this;

	this.dom.divList.selectAll("div." + this.configNodes.html.refCategory).remove();
	var nodesFiltered  = this.mapLayout.nodes.filter(function(d){
		switch(d.objectType){
			case "entity":
				if(that.schema.getEntityStyle(d.type)) return true;
				break;
			case "edge":
				if(that.schema.getEdgeStyle(d.type)) return true;
				break;
		}
		return false;
	});

	var nodeHtml = this.dom.divList.selectAll("div." + this.configNodes.html.refCategory)
		.data(nodesFiltered, function(d) {
			return d.id;
		});

	// Enter the nodes
	var nodeHtmlEnter = nodeHtml.enter().append("div")
		.attr("class", function(d){
			var classes = that.configNodes.html.refCategory +
			" node_unselected dropzone entity ";
			// that.schema.getEntityStyle(d.type).typeClass;

			switch(d.objectType){
				case "entity":
					classes += that.schema.getEntityStyle(d.type).typeClass;
					break;
				case "edge":
					classes += that.schema.getEdgeStyle(d.type).typeClass;
					break;
			}

			return classes;
		});
		// .on("dblclick", this.clickDoubleNode.bind(this))
		// .on("click", this.clickNode.bind(this));

	nodeHtmlEnter.classed({
		"text-not-selectable": true
	});

	nodeHtmlEnter.filter(function(d) {
		// not selectable if not entity or if it has no any entity type that it CAN potentialy contain
		if(d.objectType != "entity") return false;
		var mapEntityDesc = that.schema.getEntityDesc(d.type);
		if(!mapEntityDesc || !mapEntityDesc.contains) return false;
		return (Object.keys(mapEntityDesc.contains).length > 0);
	})
		.classed({
		"selectable": true
	});

	// adds expandable class if the node is edge and it has at least one child
	nodeHtmlEnter.filter(function(d) {
		// not expandable if it is not edge or it doesn't contain any entity
		if(d.objectType != "edge") return false;
		return (that._getChildrenCountForEdgeType(d) > 0);
	})
		.classed({
		"expandable": true
	});


	// position node on enter at the source position
	// (it is either parent or another precessor)
	nodeHtmlEnter
		.on("click", function(d){
			// cancle bubbling up
			// http://stackoverflow.com/questions/11674886/stoppropagation-with-svg-element-and-g
			d3.event.cancelBubble = true;
			if(d.objectType != "entity") return;
			that.clientApi.childClicked(d);
		})
		.style("margin-left", function(d) {
			var width = d.depth * 5;
			return width + "px";
		});

	// Name
	nodeHtmlEnter
		.append("div")
			.attr("class", "container")
			.append("div")
				.attr("class", "name")
				.append("span");

	// Input Variables
	nodeHtmlEnter.select(".container").each(function(d) {
		var container = d3.select(this);
		switch(d.type){
			case 'variable':
			case 'process':
			case 'grid':
			case 'grid_desc':
			case 'object':
			case 'assumption':
				container.append("div")
					.attr("class", "settings");
				break;
		}
	});

	// Name
	nodeHtml.select(".name span")
		.html(function(d){
			switch(d.objectType){
				case "entity":
					// var children = that.mapStructure.getChildrenNodes(d.parent, d.type);
					// return '<i style="margin:6px;" class="fa fa-'+that.schema.getEdgeStyle(d.type).icon_fa+'"></i>' + d.name + 
					// 	((children.length > 0) ? " <b>(" + children.length + ")</b>" : "");
					var label = "";
					switch(d.type){
						case "variable":
							if(d.name) label += d.name;
							if(d.kNode.dataContent && d.kNode.dataContent.entity && ('operators' in d.kNode.dataContent.entity)){
								label += /* "__" + */ d.kNode.dataContent.entity.operators;
							}
							if(d.kNode.dataContent && d.kNode.dataContent.entity && ('quantity' in d.kNode.dataContent.entity)){
								label += "_" + d.kNode.dataContent.entity.quantity;
							}
							if(label === ""){
								label = "...";
							}
							break;
						default:
							label = d.name;
							break;
					}
					if(d.typeIcon){
						label += " (<span class='icon-type'>"+d.typeIcon+"</span>)";
					}
					return label;
				case "edge":
					var childrenCount = that._getChildrenCountForEdgeType(d);
					return '<i style="margin:6px;" class="fa fa-'+that.schema.getEdgeStyle(d.type).icon_fa+'"></i>' + d.name + 
						((childrenCount > 0) ? " <b>(" + childrenCount + ")</b>" : "");
			}
		});
	// on click event for expandable edges (with at least one child)
	nodeHtml.filter(function(d) {
		return d3.select(this).classed("expandable");
	})
		.on("click", function(d){
			// edgeTypesOpen is a way to communicate between layout and visualizaiton part if
			// children of the edge should be visible or not
			// here we set the edge to true/false and in layout we inject children in the tree or not
			if(! d.parent.kNode.edgeTypesOpen){
				d.parent.kNode.edgeTypesOpen = {};
			}
			if(!(d.type in d.parent.kNode.edgeTypesOpen) || !d.parent.kNode.edgeTypesOpen[d.type]){
				// close all other categories
				for(var i in d.parent.kNode.edgeTypesOpen){
					d.parent.kNode.edgeTypesOpen[i] = false;
				}
				d.parent.kNode.edgeTypesOpen[d.type] = true;
			}else{
				d.parent.kNode.edgeTypesOpen[d.type] = false;
			}

			that.update(d.parent);

			// d.event.cancelBubble = true;
		})

	// Settings
	nodeHtml.select(".settings")
		// http://stackoverflow.com/questions/18205034/d3-adding-data-attribute-conditionally
		// http://grokbase.com/t/gg/d3-js/13bc0xr5s8/drawing-circles-conditionally#20131112vgo76k6bofdnloldcihh642t7i
		.on("click", function(d){
			d3.event.cancelBubble = true;
		})
		.each(function(d) {

			var settings = d3.select(this);

			settings.append("span")
				.attr("class", "setting")
				.html(function(d){
					var content = "";
					content = '<i style="margin:0.2em;" class="fa fa-pencil"></i>';
					return content;
				})
				.on("click", function(d){
					d3.event.cancelBubble = true;
					that.changeSettingsState(d, this.parentElement);
				});

			switch(d.type){
				case 'variable':
					settings.append("span")
						.attr("class", "setting setting_ic")
						.style("opacity", function(d){
							return (d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.ic) ? "1.0" : "0.25";
						})
						.html(function(d){
							var content = 'IC';
							return content;
						})
						.on("click", function(d){
							if(d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.ic){
								// acting on "div.settings"
								d3.select(this).style("opacity", "0.25");
								d.kNode.dataContent.entity.ic = false;
							}else{
								d3.select(this).style("opacity", "1.0");
								if(!d.kNode.dataContent) d.kNode.dataContent = {};
								if(!d.kNode.dataContent.entity) d.kNode.dataContent.entity = {};
								d.kNode.dataContent.entity.ic = true;
							}
							that.mapStructure.updateNode(d, that.mapStructure.UPDATE_DATA_CONTENT);
						});
					settings.append("span")
						.attr("class", "setting setting_bc")
						.style("opacity", function(d){
							return (d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.bc) ? "1.0" : "0.25";
						})
						.html(function(d){
							var content = "BC";
							return content;
						})
						.on("click", function(d){
							if(d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.bc){
								// acting on "div.settings"
								d3.select(this).style("opacity", "0.25");
								d.kNode.dataContent.entity.bc = false;
							}else{
								d3.select(this).style("opacity", "1.0");
								if(!d.kNode.dataContent) d.kNode.dataContent = {};
								if(!d.kNode.dataContent.entity) d.kNode.dataContent.entity = {};
								d.kNode.dataContent.entity.bc = true;
							}
							that.mapStructure.updateNode(d, that.mapStructure.UPDATE_DATA_CONTENT);
						});
					settings.append("span")
						.attr("class", "setting setting_sd")
						.style("opacity", function(d){
							return (d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.sd) ? "1.0" : "0.25";
						})
						.html(function(d){
							var content = "SD";
							return content;
						})
						.on("click", function(d){
							if(d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.sd){
								// acting on "div.settings"
								d3.select(this).style("opacity", "0.25");
								d.kNode.dataContent.entity.sd = false;
							}else{
								d3.select(this).style("opacity", "1.0");
								if(!d.kNode.dataContent) d.kNode.dataContent = {};
								if(!d.kNode.dataContent.entity) d.kNode.dataContent.entity = {};
								d.kNode.dataContent.entity.sd = true;
							}
							that.mapStructure.updateNode(d, that.mapStructure.UPDATE_DATA_CONTENT);
						});

					if(that.services.McmMapVariableOperatorService.areVariableOperatorsSeparate()){
						settings.append("span")
							.attr("class", "setting setting_o")
							.style("opacity", function(d){
								return (d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.operators) ? "1.0" : "0.25";
							})
							.html(function(d){
								var content = "O";
								return content;
							})
							.on("click", function(d){
								that.changeSettingsState(d, this.parentElement, false); // close
							});
					}

					settings.append("span")
						.attr("class", "setting setting_q")
						.style("opacity", function(d){
							return 1.0; // (d.kNode.dataContent && d.kNode.dataContent.entity && d.kNode.dataContent.entity.quantity) ? "1.0" : "0.25";
						})
						.html(function(d){
							var content = "Q";
							return content;
						})
						.on("click", function(d){
							that.changeSettingsState(d, this.parentElement, false); // close
							that.clientApi.dialogues.selectVariableQuantity(d);
						});
					break;
			}
			settings.append("span")
				.attr("class", "setting")
				.html(function(d){
					var content = '<i style="margin:0.2em;" class="fa fa-trash-o"></i>';
					return content;
				})
				.on("click", function(d){
					that.deleteEntity(d, this.parentElement);
				});
		});

	var nodeHtmlDatasets = {
		elements: nodeHtml,
		enter: nodeHtmlEnter,
		exit: null
	};
	return nodeHtmlDatasets;
};

/*
*/
MapVisualization.prototype.updateHtmlTransitions = function(source, nodeHtmlDatasets){
	if(!this.configNodes.html.show) return;
	var that = this;

	var nodeHtml = nodeHtmlDatasets.elements;
	// var nodeHtmlEnter = nodeHtmlDatasets.enter;

	// Transition nodes to their new (final) position
	// it happens also for entering nodes (http://bl.ocks.org/mbostock/3900925)
	var nodeHtmlUpdate = nodeHtml;
	var nodeHtmlUpdateTransition = nodeHtmlUpdate;
	if(this.configTransitions.update.animate.position || this.configTransitions.update.animate.opacity){
		nodeHtmlUpdateTransition = nodeHtmlUpdate.transition()
			.duration(this.configTransitions.update.duration);
	}

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

	// this.dom.divList.selectAll("div.node_html").each(function(d) {
	// 	// Get centroid(this.d)
	// 	d.width = parseInt(d3.select(this).style("width"));
	// 	d.height = parseInt(d3.select(this).style("height"));
	// 	// d3.select(this).style("top", function(d) { 
	// 	// 	return "" + that.mapLayout.getHtmlNodePosition(d) + "px";
	// 	// })
	// });
};

}()); // end of 'use strict';