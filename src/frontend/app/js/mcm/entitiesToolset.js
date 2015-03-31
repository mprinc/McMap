(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var EntitiesToolset =  mcm.EntitiesToolset = function(config, client){
	this.config = config;
	this.client = client;
};

EntitiesToolset.prototype.init = function() {
	// var that = this;

	var manipulationEnded = function(){
		console.log("tool:manipulationEnded");
	};

	var draggingConfig = {
		draggTargetElement: true,
		target: {
			refCategory: '.draggable_tool',
			opacity:  0.5,
			zIndex: 10,
			cloningContainer: this.client.getContainer().get(0), // getting native dom element from jQuery selector
			leaveAtDraggedPosition: false,
			callbacks: {
				onend: manipulationEnded
			}
		},
		debug: {
			origVsClone: false
		}
	};

	interaction.MoveAndDrag.InitializeDragging(draggingConfig);
	this.update();
};

EntitiesToolset.prototype.update = function() {
	// var that = this;
	var offset = 0;
	var positionItems = function(){
		var data = this.client.getData();
		var views = d3.select(this.client.getContainer().get(0)).selectAll("li");
		views.data(data);

		console.log("[positionItems]");
		d3.select(this.client.getContainer().get(0)).selectAll("li")
			.style("top", function(){
				var position = offset + "px";
				offset += 50;
				return position;
			});
	};

	this.client.timeout(positionItems.bind(this), 10);
};

}()); // end of 'use strict';