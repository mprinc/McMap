(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var EntitiesToolset =  mcm.EntitiesToolset = function(config, client){
	this.config = config;
	this.client = client;
};

EntitiesToolset.prototype.init = function() {
	// var that = this;

	var manipulationEnded = function(targetD3, relatedTargetD3, draggedIn){
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
	var that = this;
	var offset = 0;
	var positionItems = function(){
		var that = this;
		var data = this.client.getData();
		var viewsSelect = d3.select(this.client.getContainer().get(0)).selectAll("li");

		// unbinding (deleting __data__ attribute from views)
		this.client.getContainer().find("li").removeAttr("__data__");
		if(viewsSelect.length>0){
			for(var i=0; i<viewsSelect[0].length; i++){
				var viewsSelectElem = viewsSelect[0][i];
				console.log(viewsSelectElem["__data__"]);
				delete viewsSelectElem["__data__"];
				console.log(viewsSelectElem["__data__"]);
			}
		}
		viewsSelect.attr("__data__", null);

		viewsSelect = d3.select(this.client.getContainer().get(0)).selectAll("li");
		var views = viewsSelect.data(data);

		console.log("[positionItems]");
		views.enter();
		views
			.style("top", function(d){
				var position = offset + "px";
				offset += 50;
				console.log("tool position (%s): %s", d.id, position);
				return position;
			})
			.on("click", function(d){
				that.client.toolEntityClicked(d);
			});

		// workaround for wrongly arranged tools after first sorting (problem with mapping items in D3 + angular creating/reordering items through the ng-repeat directive)
		window.setTimeout(function() {
			// rejoining since it seems the top join after deleting didn't work well :(
			var viewsSelect = d3.select(that.client.getContainer().get(0)).selectAll("li");
			var views = viewsSelect.data(data);
			var offset = 0;
			views.enter();
			views.style("top", function(d){
				var position = offset + "px";
				offset += 50;
				console.log("(2) tool position (%s): %s", d.id, position);
				return position;
			})
		}, 10);
	};

	this.client.timeout(positionItems.bind(this), 10);
};

}()); // end of 'use strict';