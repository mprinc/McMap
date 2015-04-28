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
				isShownOnMap: true,
				typeClass: "entity_model",
				icon: "MC",
				icon_fa: "suitcase"
			},
			"object": {
				isShownOnMap: true,
				typeClass: "entity_object",
				icon: "O",
				icon_fa: "tablet"
			},
			"variable": {
				isShownOnMap: false,
				typeClass: "entity_variable",
				icon: "V",
				icon_fa: "bolt"
			},
			"process": {
				isShownOnMap: true,
				typeClass: "entity_process",
				icon: "P",
				icon_fa: "car"
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
				variable: true
			},
			assumption: {
			}
		};

		var entitiesDescs = {
			model: {
				id: "model",
				name: "model",
				type: "model",
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


}()); // end of 'use strict';