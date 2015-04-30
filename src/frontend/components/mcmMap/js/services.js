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
	$get: ['$q', /*'$rootScope', */ 'ENV',
	function($q, /*$rootScope*/ ENV) {
		var itemsData = null;
		var itemsLoaded = false;
		var itemsDescs = [];
		// for testing
		itemsDescs = [
			{
				name: "assumption_1"
			},
			{
				name: "assumption_2"
			},
			{
				name: "assumption_3"
			}
		];
		// itemsDescs = [];

		var queryItems = function(){
			var data = [];
			data.$promise = null;
			data.$resolved = false;

			data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
				var jsonUrl = ENV.server.frontend + "/data/assumptions.jsonld";
				$.getJSON(jsonUrl, null, function(jsonContent){
					console.log("[McmMapAssumptionService:getJSON] Loaded assumptions: %s, (@graph size: %d)", jsonUrl,
					jsonContent['@graph'].length);
					for(var id in jsonContent){
						data[id] = jsonContent[id];
					}
					data.$resolved = true;
					resolve(data);
				});
			// reject('Greeting ' + name + ' is not allowed.');
			});
			return data;
		};

		itemsData = queryItems();

		itemsData.$promise.then(function(itemsData){
			itemsDescs.length = 0;

			var rdfTypesAll = {};
			var itemCategoriesAll = {};

			for(var i in itemsData['@graph']){
				var isItem = false;
				var itemCategory = null;
				var itemFromGraph = itemsData['@graph'][i];
				var rdfTypes = itemFromGraph['rdf:type'];
				if(typeof rdfTypes === 'object' && !('length' in rdfTypes)){
					rdfTypes = [rdfTypes];
				}
				for(var j in rdfTypes){
					var rdfType = rdfTypes[j];
					var rdfTypeId = rdfType['@id'];
					if(rdfTypeId in rdfTypesAll) rdfTypesAll[rdfTypeId]++;
					else rdfTypesAll[rdfTypeId] = 1;

					if(rdfTypeId.indexOf('ontology/Assumption') >= 0){
						isItem = true;
						var id = rdfTypeId.indexOf('ontology/Assumption/');
						id += 'ontology/Assumption/'.length;
						itemCategory = rdfTypeId.substring(id);
					}
				}
				if(isItem){
					if(itemCategory in itemCategoriesAll) itemCategoriesAll[itemCategory]++;
					else itemCategoriesAll[itemCategory] = 1;

					if(!('rdfs:label' in itemFromGraph) && !('skos:prefLabel' in itemFromGraph)){
						alert("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption");
						console.warn("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption: %s", JSON.stringify(itemFromGraph));
					}
					if(('rdfs:label' in itemFromGraph) && ('skos:prefLabel' in itemFromGraph)){
						alert("Assumption loaded with both label 'rdfs:label' and 'skos:prefLabel' set");
						console.warn("Assumption loaded with both label 'rdfs:label' and 'skos:prefLabel' set: %s", JSON.stringify(itemFromGraph));
					}
					var itemName = null;
					if('rdfs:label' in itemFromGraph) itemName = itemFromGraph['rdfs:label'];
					if('skos:prefLabel' in itemFromGraph) itemName = itemFromGraph['skos:prefLabel'];

					if(itemName && itemName.length > 0){
						var itemForExport = {};
						itemForExport.id = itemFromGraph['@id'];
						itemForExport.name = itemName;
						itemForExport.category = itemCategory;
						itemsDescs.push(itemForExport);						
					}
				}
			}
			console.log("[McmMapAssumptionService] rdfTypesAll.length: %s", Object.keys(rdfTypesAll).length);
			for(var i in rdfTypesAll){
				console.log("\t%s: %d", i, rdfTypesAll[i]);				
			}
			console.log("[McmMapAssumptionService] itemCategoriesAll.length: %s", Object.keys(itemCategoriesAll).length);
			for(var i in itemCategoriesAll){
				console.log("\t%s: %d", i, itemCategoriesAll[i]);				
			}
			itemsLoaded = true;
		});

		// var that = this;
		return {
			areAssumptionsLoaded: function(){
				return itemsLoaded;
			},
			getLoadingPromise: function(){
				return itemsData.$promise;
			},
			getAssumptionsDescs: function(){
				return itemsDescs;
			},

			getAssumptionsDesByName: function(nameSubStr){
				var returnedItems = [];
				// we cannot iterate with (var i in itemsDescs) because of
				// adding $promise and $resolved
				for(var i=0; i<itemsDescs.length; i++){
					var assumption = itemsDescs[i];
					if(assumption.name.indexOf(nameSubStr) > -1){
						returnedItems.push(assumption);
					}
				}
				return returnedItems;
			},

		};
	}]
});

mcmMapServices.provider('McmMapObjectService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
		var itemsData = null;
		var itemsLoaded = false;
		var objectsDescs = [
			{
				name: "object_1"
			},
			{
				name: "object_2"
			},
			{
				name: "object_3"
			}
		];

		// objectsDescs = [];

		var queryItems = function(){
			var items = [];
			items.$promise = null;
			items.$resolved = false;

			items.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
				var jsonUrl = ENV.server.frontend + "/data/variables.jsonld";
				$.getJSON(jsonUrl, null, function(jsonContent){
					console.log("[McmMapObjectService:getJSON] Loaded variables: %s, (@graph size: %d)", jsonUrl,
					jsonContent['@graph'].length);
					for(var id in jsonContent){
						items[id] = jsonContent[id];
					}
					items.$resolved = true;
					resolve(items);
				});
			// reject('Greeting ' + name + ' is not allowed.');
			});
			return items;
		};

		itemsData = queryItems();

		itemsData.$promise.then(function(itemsData){
			objectsDescs.length = 0;

			var rdfTypesAll = {};
			var dataCategoriesAll = {};
			var propertiesAll = {};
			var quantitiesAll = {};
			var itemsNo = 0;

			var quantitiesNoTotal = 0;
			var quantitiesNoAvg = 0;
			var quantitiesNoMax = 0;

			var itemsWithoutQuantitiesNo = 0;
			var itemsWithoutQuantities = [];

			for(var itemId in itemsData['@graph']){
				var isData = false;
				var itemCategory = null;
				var itemFromGraph = itemsData['@graph'][itemId];

				var rdfTypes = itemFromGraph['rdf:type'];
				if(typeof rdfTypes === 'object' && !('length' in rdfTypes)){
					rdfTypes = [rdfTypes];
				}
				for(var j in rdfTypes){
					var rdfType = rdfTypes[j];
					var rdfTypeId = rdfType['@id'];
					if(rdfTypeId in rdfTypesAll) rdfTypesAll[rdfTypeId]++;
					else rdfTypesAll[rdfTypeId] = 1;

					if(rdfTypeId.indexOf('skos:Concept') >= 0){
						isData = true;
					}
				}
				if(isData){
					itemsNo++;
					for(var property in itemFromGraph){
						if(property in propertiesAll) propertiesAll[property]++;
						else propertiesAll[property] = 1;
					}

					if(itemCategory in dataCategoriesAll) dataCategoriesAll[itemCategory]++;
					else dataCategoriesAll[itemCategory] = 1;

					if(!('rdfs:label' in itemFromGraph) && !('skos:prefLabel' in itemFromGraph)){
						alert("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption");
						console.warn("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption: %s", JSON.stringify(itemFromGraph));
					}
					if(('rdfs:label' in itemFromGraph) && ('skos:prefLabel' in itemFromGraph)){
						alert("Assumption loaded with both label 'rdfs:label' and 'skos:prefLabel' set");
						console.warn("Assumption loaded with both label 'rdfs:label' and 'skos:prefLabel' set: %s", JSON.stringify(itemFromGraph));
					}
					var itemName = null;
					if('rdfs:label' in itemFromGraph) itemName = itemFromGraph['rdfs:label'];
					if('skos:prefLabel' in itemFromGraph) itemName = itemFromGraph['skos:prefLabel'];

					if(itemName && itemName.length > 0){
						var itemForExport = {};
						itemForExport.id = itemFromGraph['@id'];
						itemForExport.name = itemName;
						// itemForExport.category = itemCategory;
						itemForExport.id = itemFromGraph['@id'];
						itemForExport.broader = itemFromGraph['broader'];
						itemForExport.related = itemFromGraph['related'];
						itemForExport.altLabel = itemFromGraph['skos:altLabel'];
						itemForExport.definition = itemFromGraph['skos:definition'];
						
						itemForExport.quantities = itemFromGraph['co:property'];
						if(typeof itemForExport.quantities === 'string'){
							itemForExport.quantities = [itemForExport.quantities];
						}

						objectsDescs.push(itemForExport);

						if(!itemForExport.quantities){
							itemsWithoutQuantitiesNo++;
							itemsWithoutQuantities.push(itemForExport.id);
						}

						if(itemForExport.quantities){
							quantitiesNoTotal += itemForExport.quantities.length;
							if(itemForExport.quantities.length > quantitiesNoMax) quantitiesNoMax = itemForExport.quantities.length;
							for(var id in itemForExport.quantities){
								var quantity = itemForExport.quantities[id];
								if(quantity in quantitiesAll) quantitiesAll[quantity]++;
								else quantitiesAll[quantity] = 1;
							}
						}
					}
				}
			}
			console.log("[McmMapObjectService] rdfTypesAll.length: %s", Object.keys(rdfTypesAll).length);
			for(var i in rdfTypesAll){
				console.log("\t%s: %d", i, rdfTypesAll[i]);				
			}
			console.log("[McmMapObjectService] dataCategoriesAll.length: %s", Object.keys(dataCategoriesAll).length);
			for(var i in dataCategoriesAll){
				console.log("\t%s: %d", i, dataCategoriesAll[i]);				
			}

			console.log("[McmMapObjectService] propertiesAll.length: %s", Object.keys(propertiesAll).length);
			for(var i in propertiesAll){
				console.log("\t%s: %d", i, propertiesAll[i]);				
			}

			console.log("[McmMapObjectService] quantitiesAll.length: %s", Object.keys(quantitiesAll).length);
			for(var i in quantitiesAll){
				console.log("\t%s: %d", i, quantitiesAll[i]);				
			}
			quantitiesNoAvg = quantitiesNoTotal/itemsNo;
			console.log("[McmMapObjectService] quantitiesAll.length: %s, quantitiesNoTotal: %s, quantitiesNoMax: %s, quantitiesNoAvg:%s", Object.keys(quantitiesAll).length, quantitiesNoTotal, quantitiesNoMax, quantitiesNoAvg);

			itemsLoaded = true;
		});

		// var that = this;
		return {
			getObjectsDescs: function(){
				return objectsDescs;
			},

			getObjectsDesByName: function(nameSubStr, fromStart, onlyTheNextObject){
				if(typeof fromStart === 'undefined') fromStart = false;
				var returnedObjects = [];
				for(var i in objectsDescs){
					var shouldAdd = false;
					var object = objectsDescs[i];
					var id = object.name.indexOf(nameSubStr);
					if(fromStart){
						if(id == 0){
							shouldAdd = true;
						}
					}else{
						if(id >= 0){
							shouldAdd = true;
						}
					}
					if(onlyTheNextObject && object.name.indexOf("_", id + nameSubStr.length) >= 0){
						shouldAdd = false;
					}

					if(shouldAdd) returnedObjects.push(object);
				}
				return returnedObjects;
			},

			getFullObjectName: function(objectEntity){
				var fullNameInEntity = false;
				if(fullNameInEntity) return objectEntity.kNode.name;

				var fullNameList = [];
				while(objectEntity && objectEntity.kNode.type != "model_component"){
					fullNameList.unshift(objectEntity.kNode.name);
					objectEntity = objectEntity.parent;
				}
				var fullNameStr = fullNameList.join("_");
				return fullNameStr;
			},

			// it supports both objectEntity and name as an input parameter
			getBaseObjectName: function(objectEntity){
				var name = (typeof objectEntity === 'object') ? objectEntity.kNode.name : objectEntity;
				var id = name.lastIndexOf("_");
				var baseName = null;

				if(id<0) baseName = name;
				else baseName = name.substring(id+1);

				return baseName;
			}
		};
	}]
});

mcmMapServices.provider('McmMapVariableQuantityService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
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
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
		var variableOperatorsAreSeparate = false;

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
			areVariableOperatorsSeparate: function(){
				return variableOperatorsAreSeparate;
			},

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

mcmMapServices.provider('McmMapProcessService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
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
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
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