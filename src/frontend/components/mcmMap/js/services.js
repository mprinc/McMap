(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices', ['ngResource', 'Config']);

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
				isShownOnMap: true,
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
				model_component: true
			},
			model_component: {
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
				variable: true
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

					},
					containsGrid: {

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
					containsProcess: {

					},
					containsVariableIn: {

					},
					containsVariableOut: {

					},
					containsAssumption: {

					}
				}
			},
			variable: {
				id: "variable",
				name: "variable",
				type: "variable",
				icon: "V"
			},
			assumption: {
				id: "assumption",
				name: "assumption",
				type: "assumption",
				icon: "A"
			},
			process: {
				id: "process",
				name: "process",
				type: "process",
				icon: "P",
				contains: {
					containsObject: {

					},
					containsVariableIn: {

					},
					containsVariableOut: {

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
			"containsVariableIn": {
				typeClass: "edge_contains_variable_in",
				icon: "P",
				icon_fa: "car"
			},
			"containsVariableOut": {
				typeClass: "edge_contains_variable_out",
				icon: "P",
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
				icon: "M",
				object: "model_component",
				objects: "model_components"
			},
			containsGrid: {
				id: "containsGrid",
				name: "containsGrid",
				type: "containsGrid",
				icon: "G",
				object: "grid",
				objects: "grids"
			},
			containsObject: {
				id: "containsObject",
				name: "containsObject",
				type: "containsObject",
				icon: "O",
				object: "object",
				objects: "objects"
			},
			containsProcess: {
				id: "containsProcess",
				name: "containsProcess",
				type: "containsProcess",
				icon: "P",
				object: "process",
				objects: "processes"
			},
			containsVariableIn: {
				id: "containsVariableIn",
				name: "containsVariableIn",
				type: "containsVariableIn",
				icon: "IV",
				object: "variable",
				objects: "in-vars"
			},
			containsVariableOut: {
				id: "containsVariableOut",
				name: "containsVariableOut",
				type: "containsVariableOut",
				icon: "OV",
				object: "variable",
				objects: "out-vars"
			},
			containsAssumption: {
				id: "containsAssumption",
				name: "containsAssumption",
				type: "containsAssumption",
				icon: "A",
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

mcmMapServices.provider('McmMapAssumptionService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var assumptionsDescs = [
			{
				name: "assumption_1"
			},
			{
				name: "assumption_2"
			},
			{
				name: "assumption_3"
			},
			{
				name: "assumption_12"
			},
			{
				name: "assumption_13"
			},
			{
				name: "assumption_123"
			},
			{
				name: "assumption_14"
			},
			{
				name: "assumption_145"
			},
			{
				name: "assumption_12345"
			},
			{
				name: "assumption_1235"
			},
			{
				name: "assumption_143"
			},
			{
				name: "assumption_1451"
			},
			{
				name: "assumption_1245"
			}
		];

		// var that = this;
		return {
			getAssumptionsDescs: function(){
				return assumptionsDescs;
			},

			getAssumptionsDesByName: function(nameSubStr){
				var returnedAssumptions = [];
				for(var i in assumptionsDescs){
					var assumption = assumptionsDescs[i];
					if(assumption.name.indexOf(nameSubStr) > -1){
						returnedAssumptions.push(assumption);
					}
				}
				return returnedAssumptions;
			},

		};
	}]
});

mcmMapServices.provider('McmMapVariableQuantityService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var variableQuantitysDescs = [
			{
				name: "variableQuantity_1"
			},
			{
				name: "variableQuantity_2"
			},
			{
				name: "variableQuantity_3"
			},
			{
				name: "variableQuantity_12"
			},
			{
				name: "variableQuantity_13"
			},
			{
				name: "variableQuantity_123"
			},
			{
				name: "variableQuantity_14"
			},
			{
				name: "variableQuantity_145"
			},
			{
				name: "variableQuantity_12345"
			},
			{
				name: "variableQuantity_1235"
			},
			{
				name: "variableQuantity_143"
			},
			{
				name: "variableQuantity_1451"
			},
			{
				name: "variableQuantity_1245"
			}
		];

		// var that = this;
		return {
			getVariableQuantitysDescs: function(){
				return variableQuantitysDescs;
			},

			getVariableQuantitysDesByName: function(nameSubStr){
				var returnedVariableQuantitys = [];
				for(var i in variableQuantitysDescs){
					var variableQuantity = variableQuantitysDescs[i];
					if(variableQuantity.name.indexOf(nameSubStr) > -1){
						returnedVariableQuantitys.push(variableQuantity);
					}
				}
				return returnedVariableQuantitys;
			},

		};
	}]
});

mcmMapServices.provider('McmMapVariableOperatorService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var variableOperatorsDescs = [
			{
				name: "variableOperator_1"
			},
			{
				name: "variableOperator_2"
			},
			{
				name: "variableOperator_3"
			},
			{
				name: "variableOperator_12"
			},
			{
				name: "variableOperator_13"
			},
			{
				name: "variableOperator_123"
			},
			{
				name: "variableOperator_14"
			},
			{
				name: "variableOperator_145"
			},
			{
				name: "variableOperator_12345"
			},
			{
				name: "variableOperator_1235"
			},
			{
				name: "variableOperator_143"
			},
			{
				name: "variableOperator_1451"
			},
			{
				name: "variableOperator_1245"
			}
		];

		// var that = this;
		return {
			getVariableOperatorsDescs: function(){
				return variableOperatorsDescs;
			},

			getVariableOperatorsDesByName: function(nameSubStr){
				var returnedVariableOperators = [];
				for(var i in variableOperatorsDescs){
					var variableOperator = variableOperatorsDescs[i];
					if(variableOperator.name.indexOf(nameSubStr) > -1){
						returnedVariableOperators.push(variableOperator);
					}
				}
				return returnedVariableOperators;
			},

		};
	}]
});

mcmMapServices.provider('McmMapObjectService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var objectsDescs = [
			{
				name: "object_1"
			},
			{
				name: "object_2"
			},
			{
				name: "object_3"
			},
			{
				name: "object_12"
			},
			{
				name: "object_13"
			},
			{
				name: "object_123"
			},
			{
				name: "object_14"
			},
			{
				name: "object_145"
			},
			{
				name: "object_12345"
			},
			{
				name: "object_1235"
			},
			{
				name: "object_143"
			},
			{
				name: "object_1451"
			},
			{
				name: "object_1245"
			}
		];

		// var that = this;
		return {
			getObjectsDescs: function(){
				return objectsDescs;
			},

			getObjectsDesByName: function(nameSubStr){
				var returnedObjects = [];
				for(var i in objectsDescs){
					var object = objectsDescs[i];
					if(object.name.indexOf(nameSubStr) > -1){
						returnedObjects.push(object);
					}
				}
				return returnedObjects;
			},

		};
	}]
});

mcmMapServices.provider('McmMapProcessService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var processsDescs = [
			{
				name: "process_1"
			},
			{
				name: "process_2"
			},
			{
				name: "process_3"
			},
			{
				name: "process_12"
			},
			{
				name: "process_13"
			},
			{
				name: "process_123"
			},
			{
				name: "process_14"
			},
			{
				name: "process_145"
			},
			{
				name: "process_12345"
			},
			{
				name: "process_1235"
			},
			{
				name: "process_143"
			},
			{
				name: "process_1451"
			},
			{
				name: "process_1245"
			}
		];

		// var that = this;
		return {
			getProcesssDescs: function(){
				return processsDescs;
			},

			getProcesssDesByName: function(nameSubStr){
				var returnedProcesss = [];
				for(var i in processsDescs){
					var process = processsDescs[i];
					if(process.name.indexOf(nameSubStr) > -1){
						returnedProcesss.push(process);
					}
				}
				return returnedProcesss;
			},

		};
	}]
});

mcmMapServices.provider('McmMapGridService', {
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', */
	function(/*$q, $rootScope*/) {
		var gridsDescs = [
			{
				name: "grid_1"
			},
			{
				name: "grid_2"
			},
			{
				name: "grid_3"
			},
			{
				name: "grid_12"
			},
			{
				name: "grid_13"
			},
			{
				name: "grid_123"
			},
			{
				name: "grid_14"
			},
			{
				name: "grid_145"
			},
			{
				name: "grid_12345"
			},
			{
				name: "grid_1235"
			},
			{
				name: "grid_143"
			},
			{
				name: "grid_1451"
			},
			{
				name: "grid_1245"
			}
		];

		// var that = this;
		return {
			getGridsDescs: function(){
				return gridsDescs;
			},

			getGridsDesByName: function(nameSubStr){
				var returnedGrids = [];
				for(var i in gridsDescs){
					var grid = gridsDescs[i];
					if(grid.name.indexOf(nameSubStr) > -1){
						returnedGrids.push(grid);
					}
				}
				return returnedGrids;
			},

		};
	}]
});


}()); // end of 'use strict';