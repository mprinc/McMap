(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var Schema =  mcm.Schema = function(){
	this.allowedSubEntities = {
		unselected: {
			model: true
		},
		model: {
			assumption: true,
			object: true,
			process: true,
			grid: true
		},
		object: {
			assumption: true,
			object: true,
			process: true,
			variable: true,
			grid: true
		},
		variable: {
			assumption: true,
			grid: true
		},
		process:  {
			assumption: true,
			object: true,
			grid: true
		},
		assumption: {
		}
	};

	this.entityDesc = {
		model: {
			id: "model",
			name: "model",
			type: "model",
			icon: "M"
		},
		assumption: {
			id: "assumption",
			name: "assumption",
			type: "assumption",
			icon: "A"
		},
		object: {
			id: "object",
			name: "object",
			type: "object",
			icon: "O"
		},
		variable: {
			id: "variable",
			name: "variable",
			type: "variable",
			icon: "V"
		},
		process: {
			id: "process",
			name: "process",
			type: "process",
			icon: "P"
		},
		grid: {
			id: "grid",
			name: "grid",
			type: "grid",
			icon: "G"
		}
	};
};

Schema.prototype.getSubEntities = function(entity){
	return entity;
};

}()); // end of 'use strict';