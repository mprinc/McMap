(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Map =  mcm.list.Map = function(parentDom, config, clientApi, schema, mapService){
	this.config = config;
	this.clientApi = clientApi;
	this.entityStyles = schema.entityStyles;
	this.parentDom = parentDom;
	this.mapService = mapService;
	this.schema = schema;

	// this.state = new knalledge.State();
	this.mapStructure = new knalledge.MapStructure();
	var mapVisualizationApi = {
		timeout: this.clientApi.timeout
	};
	this.mapVisualization = new mcm.list.MapVisualization(this.parentDom, mapVisualizationApi, this.mapStructure, 
		this.config.transitions, this.config.nodes, this.config.edges, this.schema);

	var mapLayoutApi = {
		update: this.mapVisualization.update.bind(this.mapVisualization),
		getDom: this.mapVisualization.getDom.bind(this.mapVisualization),
		mapEntityClicked: this.clientApi.mapEntityClicked
	};
	this.mapLayout = new mcm.list.MapLayout(this.mapStructure, this.config.view, this.config.nodes, this.config.tree, mapLayoutApi, this.schema);

	// this.keyboardInteraction = null;
};

Map.CONTAINS_OBJECT = "containsObject";
Map.CONTAINS_PROCESS = "containsProcess";
Map.CONTAINS_VARIABLE_IN = "containsVariableIn";
Map.CONTAINS_VARIABLE_OUT = "containsVariableOut";
Map.CONTAINS_ASSUMPTION = "containsAssumption";

Map.prototype.init = function(callback) {
	this.mapStructure.init(this.mapService);
	// http://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element
	var mapSize = [this.parentDom.node().getBoundingClientRect().height, this.parentDom.node().getBoundingClientRect().width];
	// inverted since tree is rotated to be horizontal
	// related posts
	//	http://stackoverflow.com/questions/17847131/generate-multilevel-flare-json-data-format-from-flat-json
	//	http://stackoverflow.com/questions/20940854/how-to-load-data-from-an-internal-json-array-rather-than-from-an-external-resour
	this.mapVisualization.init(this.mapLayout, callback);
	this.mapLayout.init(mapSize);
	// this.initializeKeyboard();
	// this.initializeManipulation();
};

Map.prototype.update = function(node) {
	this.mapVisualization.update(node);
};

Map.prototype.processData = function(mapData) {
	this.mapStructure.processData(mapData, 0, this.parentDom.attr("height") / 2);
	this.mapLayout.processData();
};

Map.prototype.changeSubtreeRoot = function(subtreeRoot) {
	this.mapLayout.processData(subtreeRoot);
};

// http://interactjs.io/
// http://interactjs.io/docs/#interactables
Map.prototype.initializeManipulation = function() {
	var that = this;

	var manipulationEnded = function(targetD3){
		var d = targetD3 ? targetD3.datum() : null;
		console.log("map_entity:manipulationEnded [%s]", d ? d.kNode.name : null);
		that.update(that.mapStructure.rootNode);
	};

	var draggAndDropEnded = function(targetD3, relatedTargetD3, draggedIn){
		var d = targetD3 ? targetD3.datum() : null;
		var dRelated = relatedTargetD3 ? relatedTargetD3.datum() : null;
		console.log("draggAndDropEnded [%s into %s]: %s", dRelated ? dRelated.name : null, d ? d.name : null, draggedIn);
		if(draggedIn){
			that.clientApi.mapEntityDraggedIn(d, dRelated);
			that.update(that.mapStructure.rootNode);
		}
	};

	this.draggingInConfig = this.config.interaction.draggingInConfig;
	this.draggingInConfig.draggable.callbacks.onend = draggAndDropEnded;

	interaction.MoveAndDrag.InitializeDraggingIn(this.draggingInConfig);
};

}()); // end of 'use strict';