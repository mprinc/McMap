(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices');

mcmMapServices.provider('McmMapSchemaService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var entitiesStyles = {
			model_component: {
				isShownOnMap: true,
				typeClass: "entity_model",
				icon: "MC",
				icon_fa: "suitcase",
				predicate: "containsModel"
			},
			grid_desc: {
				isShownOnMap: true,
				typeClass: "entity_grid_desc",
				icon: "GD",
				icon_fa: "tablet",
				predicate: "containsGridDesc"
			},
			grid: {
				isShownOnMap: false,
				typeClass: "entity_grid",
				icon: "G",
				icon_fa: "tablet",
				predicate: "containsGrid"
			},
			object: {
				isShownOnMap: true,
				typeClass: "entity_object",
				icon: "O",
				icon_fa: "tablet",
				predicate: "containsObject"
			},
			variable: {
				isShownOnMap: false,
				typeClass: "entity_variable",
				icon: "V",
				icon_fa: "bolt",
				predicate: "containsVariable",
				predicates: ["containsVariableIn", "containsVariableOut"]
			},
			process: {
				isShownOnMap: false,
				typeClass: "entity_process",
				icon: "P",
				icon_fa: "car",
				predicate: "containsProcess"
			},
			assumption: {
				isShownOnMap: false,
				typeClass: "entity_assumption",
				icon: "A",
				icon_fa: "car",
				predicate: "containsAssumption"
			}
		};

		var allowedSubEntitiesForAll = {
			unselected: {
				model_component: true,
				grid: false,
				grid_desc: false
			},
			model_component: {
				assumption: true,
				object: true,
				grid: false,
				grid_desc: true
			},
			grid: {
				assumption: false,
				variable: false,
				object: false,
				grid: false,
				grid_desc: false
			},
			grid_desc: {
				assumption: true,
				variable: true,
				object: true,
				grid: false,
				grid_desc: false
			},
			object: {
				assumption: true,
				object: true,
				process: true,
				variable: true,
				grid: true,
				grid_desc: false
			},
			variable: {
				assumption: true,
				grid: true,
				grid_desc: false
			},
			process:  {
				assumption: true,
				object: true,
				variable: true,
				grid: false,
				grid_desc: false
			},
			assumption: {
			}
		};

		var entitiesDescs = {
			unselected: {
				id: "unselected",
				name: "unselected",
				type: "unselected",
				icon: "<?>",
				contains: {
					containsModel: {

					}
				}
			},
			model_component: {
				id: "model_component",
				name: "model_component",
				type: "model_component",
				icon: "MC",
				contains: {
					containsObject: {

					},
					containsAssumption: {

					},
					containsGridDesc: {

					}

				}
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
				icon: "O",
				contains: {
					containsObject: {

					},
					containsGrid: {

					},
					containsProcess: {

					},
					containsVariableIn: {

					},
					containsVariableOut: {

					},
					containsVariableHV: {

					},
					containsVariableCP: {

					},
					containsAssumption: {

					}
				}
			},
			variable: {
				id: "variable",
				name: "variable",
				type: "variable",
				icon: "V",
				contains: {
					containsGrid: {

					},
					containsAssumption: {

					}
				}
			},
			process: {
				id: "process",
				name: "process",
				type: "process",
				icon: "P",
				contains: {
					// containsVariableIn: {

					// },
					// containsVariableOut: {

					// },
					// containsVariableHV: {

					// },
					// containsVariableCP: {

					// },
					// containsAssumption: {

					// }
				}
			},
			grid_desc: {
				id: "grid_desc",
				name: "grid_desc",
				type: "grid_desc",
				icon: "GD",
				contains: {
					containsObject: {

					},
					containsVariableIn: {

					},
					containsVariableOut: {

					},
					containsVariableHV: {

					},
					containsVariableCP: {

					},
					containsAssumption: {

					}
				}
			},
			grid: {
				id: "grid",
				name: "grid",
				type: "grid",
				icon: "G"
			}
		};

		var edgesStyles = {
			"containsGridDesc": {
				typeClass: "edge_contains_grid_desc",
				icon: "G",
				icon_fa: "tablet"
			},
			"containsGrid": {
				typeClass: "edge_contains_grid",
				icon: "G",
				icon_fa: "tablet"
			},
			"containsObject": {
				typeClass: "edge_contains_object",
				icon: "MC",
				icon_fa: "suitcase"
			},
			"containsProcess": {
				typeClass: "edge_contains_process",
				icon: "O",
				icon_fa: "tablet"
			},
			"containsVariable": {
				typeClass: "edge_contains_variable",
				icon: "V",
				icon_fa: "car"
			},
			"containsVariableIn": {
				typeClass: "edge_contains_variable_in",
				icon: "IV",
				icon_fa: "car"
			},
			"containsVariableOut": {
				typeClass: "edge_contains_variable_out",
				icon: "OV",
				icon_fa: "car"
			},
			"containsVariableHV": {
				typeClass: "edge_contains_variable_hv",
				icon: "HV",
				icon_fa: "car"
			},
			"containsVariableCP": {
				typeClass: "edge_contains_variable_cp",
				icon: "CP",
				icon_fa: "car"
			},
			"containsAssumption": {
				typeClass: "edge_contains_assumption",
				icon: "P",
				icon_fa: "car"
			}
		};

		var edgesDescs = {
			containsModel: {
				id: "containsModel",
				name: "containsModel",
				type: "containsModel",
				icon: "MC",
				description: "Model Component",
				object: "model_component",
				objects: "model_components"
			},
			containsGridDesc: {
				id: "containsGridDesc",
				name: "containsGridDesc",
				type: "containsGridDesc",
				icon: "GD",
				description: "Grid Desc",
				object: "grid_desc",
				objects: "grids" // grid_descs
			},
			containsGrid: {
				id: "containsGrid",
				name: "containsGrid",
				type: "containsGrid",
				icon: "GR",
				description: "Grid",
				object: "grid",
				objects: "grids"
			},
			containsObject: {
				id: "containsObject",
				name: "containsObject",
				type: "containsObject",
				icon: "OB",
				description: "Object",
				object: "object",
				objects: "objects"
			},
			containsProcess: {
				id: "containsProcess",
				name: "containsProcess",
				type: "containsProcess",
				icon: "PR",
				description: "Process",
				object: "process",
				objects: "processes"
			},
			containsVariable: { /* group */
				id: "containsVariable",
				name: "containsVariable",
				type: "containsVariable",
				icon: "V",
				description: "Variable",
				object: "variable",
				objects: "variables"
			},
			containsVariableIn: {
				id: "containsVariableIn",
				name: "containsVariableIn",
				type: "containsVariableIn",
				icon: "IV",
				description: "Input Variable",
				visualGroup: "containsVariable",
				object: "variable",
				objects: "input" // in-vars
			},
			containsVariableOut: {
				id: "containsVariableOut",
				name: "containsVariableOut",
				type: "containsVariableOut",
				icon: "OV",
				description: "Output Variable",
				visualGroup: "containsVariable",
				object: "variable",
				objects: "output" // out-vars
			},
			containsVariableHV: {
				id: "containsVariableHV",
				name: "containsVariableHV",
				type: "containsVariableHV",
				icon: "SV",
				description: "Static Variable",
				visualGroup: "containsVariable",
				object: "variable",
				objects: "static" // hp-vars
			},
			containsVariableCP: {
				id: "containsVariableCP",
				name: "containsVariableCP",
				type: "containsVariableCP",
				icon: "CP",
				description: "Configuration Parameter",
				visualGroup: "containsVariable",
				object: "variable",
				objects: "config" // cp-vars
			},
			containsAssumption: {
				id: "containsAssumption",
				name: "containsAssumption",
				type: "containsAssumption",
				icon: "AS",
				description: "Assumption",
				object: "assumption",
				objects: "assumptions"
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

			getEdgesStyles: function(){
				return edgesStyles;
			},
			getEdgeStyle: function(edge){
				return edgesStyles[edge];
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
