(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices', ['ngResource', 'Config']);

mcmMapServices.provider('McmMapSchemaService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var entitiesStyles = {
			"model": {
				typeClass: "map_entity_model",
				icon: "M"
			},
			"object": {
				typeClass: "map_entity_object",
				icon: "O"
			},
			"process": {
				typeClass: "map_entity_process",
				icon: "P"
			}
		};

		var allowedSubEntitiesForAll = {
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

		var entitiesDescs = {
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

		var edgesDescs = {
			containsObject: {
				id: "containsObject",
				name: "containsObject",
				type: "containsObject",
				icon: "O",
				predicate: "object",
				predicates: "objects"
			},
			containsProcess: {
				id: "containsProcess",
				name: "containsProcess",
				type: "containsProcess",
				icon: "P",
				predicate: "process",
				predicates: "processes"
			},
			containsVariableIn: {
				id: "containsVariableIn",
				name: "containsVariableIn",
				type: "containsVariableIn",
				icon: "IV",
				predicate: "in-var",
				predicates: "in-vars"
			},
			containsVariableOut: {
				id: "containsVariableOut",
				name: "containsVariableOut",
				type: "containsVariableOut",
				icon: "OV",
				predicate: "out-var",
				predicates: "out-vars"
			},
			containsAssumption: {
				id: "containsAssumption",
				name: "containsAssumption",
				type: "containsAssumption",
				icon: "A",
				predicate: "assumption",
				predicates: "assumptions"
			}
		};

			// var that = this;
		return {
			// rootNodeId: "55268521fb9a901e442172f9",

			getEntitiesStyles: function(){
				return entitiesStyles;
			},

			getEntityStyle: function(entity){
				return entitiesStyles[entity];
			},

			getAllowedSubEntities: function(entity){
				return allowedSubEntitiesForAll[entity];
			},

			getEntityDesc: function(entity){
				return entitiesDescs[entity];
			},
			getEdgesDescs: function(){
				return edgesDescs;
			},

			getEdgeDesc: function(edgeType){
				return edgesDescs[edgeType];
			},

		};
	}]
});

}()); // end of 'use strict';