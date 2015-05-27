(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Map =  mcm.Map = function(parentDom, config, clientApi, schema, mapService, mapStructureExternal, mcmMapViewService){
	this.config = config;
	this.clientApi = clientApi;
	this.entityStyles = schema.entityStyles;
	this.parentDom = parentDom;
	this.mapService = mapService;
	this.schema = schema;
	this.mapStructureExternal = mapStructureExternal;
	this.mcmMapViewService = mcmMapViewService;

	// this.state = new knalledge.State();
	this.mapStructure = this.mapStructureExternal ? this.mapStructureExternal : new knalledge.MapStructure();
	var mapVisualizationApi = {
		timeout: this.clientApi.timeout,
		dialogues: this.clientApi.dialogues
	};
	this.mapVisualization = new mcm.MapVisualization(this.parentDom, mapVisualizationApi, this.mapStructure, this.config.view, this.config.transitions, this.config.nodes, this.config.edges, this.config.interaction.resizingConfig, this.schema, this.mcmMapViewService);
	var mapLayoutApi = {
		update: this.mapVisualization.update.bind(this.mapVisualization),
		getDom: this.mapVisualization.getDom.bind(this.mapVisualization),
		mapEntityClicked: this.clientApi.mapEntityClicked,
	};
	this.mapLayout = new mcm.MapLayout(this.mapStructure, this.config.view, this.config.nodes, this.config.tree, mapLayoutApi, this.state, this.schema);

	this.keyboardInteraction = null;
};

Map.prototype.init = function(callback) {
	// we do this only if we created an mapStructure in our class
	if(!this.mapStructureExternal) this.mapStructure.init(this.mapService);
	// http://stackoverflow.com/questions/21990857/d3-js-how-to-get-the-computed-width-and-height-for-an-arbitrary-element
	var mapSize = [this.parentDom.node().getBoundingClientRect().height, this.parentDom.node().getBoundingClientRect().width];
	// inverted since tree is rotated to be horizontal
	// related posts
	//	http://stackoverflow.com/questions/17847131/generate-multilevel-flare-json-data-format-from-flat-json
	//	http://stackoverflow.com/questions/20940854/how-to-load-data-from-an-internal-json-array-rather-than-from-an-external-resour
	this.mapVisualization.init(this.mapLayout, callback);
	this.mapLayout.init(mapSize);
	this.initializeKeyboard();
	this.initializeManipulation();
};

Map.prototype.update = function(node, callback) {
	this.mapVisualization.update(node, callback);
};

Map.prototype.processData = function(mapData) {
	// we do this only if we created an mapStructure in our class
	if(!this.mapStructureExternal) this.mapStructure.processData(mapData);
	this.mapLayout.processData(0, this.parentDom.attr("height") / 2);
};

Map.prototype.initializeKeyboard = function() {
	// var that = this;

	if(!this.config.keyboardInteraction.enabled) return;

	var keyboardClientInterface = {
		getSelectedNode: function(){
			return this.mapStructure.getSelectedNode();
		}.bind(this),
		update: this.mapVisualization.update.bind(this.mapVisualization),
		deleteNode: this.mapStructure.deleteNode.bind(this.mapStructure)
	};

	this.keyboardInteraction = new interaction.Keyboard(keyboardClientInterface);
	this.keyboardInteraction.init();
};

// http://interactjs.io/
// http://interactjs.io/docs/#interactables
Map.prototype.initializeManipulation = function() {
	var that = this;

	var manipulationEnded = function(targetD3){
		var d = targetD3 ? targetD3.datum() : null;
		that.mapStructure.updateNode(d, knalledge.MapStructure.UPDATE_NODE_DIMENSIONS);

		console.log("map_entity:manipulationEnded [%s]", d ? d.kNode.name : null);
		that.update(that.mapStructure.rootNode);
	};

	this.draggingConfig = this.config.interaction.draggingConfig;
	this.draggingConfig.target.cloningContainer =  that.mapVisualization.dom.divMapHtml.node();
	this.draggingConfig.target.updateDatumPosition = this.mapLayout.updateDatumPosition.bind(this.mapLayout);
	this.draggingConfig.target.callbacks.onend = manipulationEnded;

	interaction.MoveAndDrag.InitializeDragging(this.draggingConfig);

	this.resizingConfig = this.config.interaction.resizingConfig;
	this.resizingConfig.target.cloningContainer = that.mapVisualization.dom.divMapHtml.node();
	this.resizingConfig.target.callbacks.onend = manipulationEnded;

	interaction.MoveAndDrag.InitializeResizing(this.resizingConfig);

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