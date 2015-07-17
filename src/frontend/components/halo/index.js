// declare namespace
if(typeof interaction === 'undefined'){
	interaction = {};
}

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';


var halo =  interaction.Halo = function(){
};

/**
 * @ngdoc object
 * @name initializeManipulation
 * @function
 *
 * @description
 * Initializes support for manipulation of objects of specified class
 * reference: // http://stackoverflow.com/questions/4679785/graphael-bar-chart-with-text-x-axis
 * @param {Object} config contains all parameters relevant for the initialization
**/

halo.HALO_VIEW_ID = "halo_view_id";

halo.prototype.init = function (config, callback) {
	this.config = config;
	this.callback = callback;

	var staticPlaceholder = null;
	var movingPlaceholder = null;

	console.log("[init]");
};

halo.prototype.destroy = function () {
	d3.select("#"+interaction.Halo.HALO_VIEW_ID).remove();
};

halo.prototype.create = function (objectDom, options) {
	var that = this;
	var objectView = d3.select(objectDom);
	var haloView = null;
	if(this.config.exclusive){
		this.destroy();
	}
	switch(this.config.createAt){
	case "sibling":
		haloView = d3.select(objectView.node().parentNode).append("div");
		break;
	}
	if(this.config.exclusive){
		haloView.attr("id", interaction.Halo.HALO_VIEW_ID);
	}
	haloView
		.classed({
			halo: true})
		.style("top", objectView.style("top"))
		.style("left", objectView.style("left"))
		.style("width", objectView.style("width"))
		.style("height", objectView.style("height"))
		.style("position", "absolute")
		.style("z-index", 1001);
	// haloView.text("Hello Halo!");

	var iconBgView = haloView.append("div");
	iconBgView
		.classed({
			icon: true,
			w: true
			})
		.append("i")
			.style("margin", "0.2em")
		.classed({
			'fa fa-pencil': true})
	iconBgView.on("click", function(){
		if(typeof that.callback == 'function') {
			var event = {
				action: "settings",
				source: objectView
			};
			that.callback(event);
		}
	});

	var iconBgView = haloView.append("div");
	iconBgView
		.classed({
			icon: true,
			e: true
			})
		.append("i")
			.style("margin", "0.2em")
		.classed({
			'fa fa-trash-o': true})
	iconBgView.on("click", function(){
		if(typeof that.callback == 'function') {
			var event = {
				action: "delete",
				source: objectView
			};
			that.callback(event);
		}
	});

	var iconBgView = haloView.append("div");
	iconBgView
		.classed({
			icon: true,
			e: true
			})
		.append("i")
			.style("margin", "0.2em")
		.classed({
			'fa fa-trash-o': true})
	iconBgView.on("click", function(){
		if(typeof that.callback == 'function') {
			var event = {
				action: "delete",
				source: objectView
			};
			that.callback(event);
		}
	});


	var iconBgView = haloView.append("div");
	iconBgView
		.classed({
			icon: true,
			n: true
			})
		.append("i")
			.style("margin", "0.2em")
		.classed({
			'fa fa-plus-circle': true})
	iconBgView.on("click", function(){
		if(typeof that.callback == 'function') {
			var event = {
				action: "add",
				source: objectView
			};
			that.callback(event);
		}
	});
};

}()); // end of 'use strict';