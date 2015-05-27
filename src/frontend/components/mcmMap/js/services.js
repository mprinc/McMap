(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices', ['ngResource', 'Config', 'knalledgeMapServices']);

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
				icon: "Model Component",
				object: "model_component",
				objects: "model_components"
			},
			containsGridDesc: {
				id: "containsGridDesc",
				name: "containsGridDesc",
				type: "containsGridDesc",
				icon: "Grid Desc",
				object: "grid_desc",
				objects: "grid_descs"
			},
			containsGrid: {
				id: "containsGrid",
				name: "containsGrid",
				type: "containsGrid",
				icon: "Grid",
				object: "grid",
				objects: "grids"
			},
			containsObject: {
				id: "containsObject",
				name: "containsObject",
				type: "containsObject",
				icon: "Object",
				object: "object",
				objects: "objects"
			},
			containsProcess: {
				id: "containsProcess",
				name: "containsProcess",
				type: "containsProcess",
				icon: "Process",
				object: "process",
				objects: "processes"
			},
			containsVariableIn: {
				id: "containsVariableIn",
				name: "containsVariableIn",
				type: "containsVariableIn",
				icon: "Input Variable",
				object: "variable",
				objects: "in-vars"
			},
			containsVariableOut: {
				id: "containsVariableOut",
				name: "containsVariableOut",
				type: "containsVariableOut",
				icon: "Output Variable",
				object: "variable",
				objects: "out-vars"
			},
			containsVariableHV: {
				id: "containsVariableHV",
				name: "containsVariableHV",
				type: "containsVariableHV",
				icon: "Static Variable",
				object: "variable",
				objects: "hp-vars"
			},
			containsVariableCP: {
				id: "containsVariableCP",
				name: "containsVariableCP",
				type: "containsVariableCP",
				icon: "Configuration Parameter",
				object: "variable",
				objects: "cp-vars"
			},
			containsAssumption: {
				id: "containsAssumption",
				name: "containsAssumption",
				type: "containsAssumption",
				icon: "Assumption",
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
		var itemCategoriesAll = {};
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
					if(!('rdfs:label' in itemFromGraph) && !('skos:prefLabel' in itemFromGraph)){
						// alert("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption");
						console.warn("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption: %s", JSON.stringify(itemFromGraph));
					}
					if(('rdfs:label' in itemFromGraph) && ('skos:prefLabel' in itemFromGraph)){
						// alert("Assumption loaded with both label 'rdfs:label' and 'skos:prefLabel' set");
						console.warn("Assumption loaded with both label 'rdfs:label' and 'skos:prefLabel' set: %s", JSON.stringify(itemFromGraph));
					}
					var itemName = null;
					if('skos:prefLabel' in itemFromGraph) itemName = itemFromGraph['skos:prefLabel'];
					if(!itemName && 'rdfs:label' in itemFromGraph) itemName = itemFromGraph['rdfs:label'];
					if(!itemName && '@id' in itemFromGraph) itemName = itemFromGraph['@id'].substring(itemFromGraph['@id'].lastIndexOf("/")+1);

					// filtering out CF_Convention_Assumption categories
					if(itemCategory == "CF_Convention_Assumption") continue;

					if(itemName && itemName.length > 0){
						var itemForExport = {};
						itemForExport.id = itemFromGraph['@id'];
						itemForExport.name = itemName;
						itemForExport.category = itemCategory;
						itemsDescs.push(itemForExport);

						if(!(itemCategory in itemCategoriesAll)){
							itemCategoriesAll[itemCategory] = {
								name: itemCategory,
								items: []
							}
						}
						itemCategoriesAll[itemCategory].items.push(itemForExport);
					}
				}
			}

			function SortByCategoryAndName(a, b){
				var aName = (a.category + a.name).toLowerCase();
				var bName = (b.category + b.name).toLowerCase(); 
				return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
			}

			itemsDescs.sort(SortByCategoryAndName);

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
			getAssumtionsCategories: function(){
				return itemCategoriesAll;
			},
			getAssumptionsDescs: function(){
				return itemsDescs;
			},

			getAssumptionsDesByName: function(nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedItems = [];
				// we cannot iterate with (var i in itemsDescs) because of
				// adding $promise and $resolved
				for(var i=0; i<itemsDescs.length; i++){
					var assumption = itemsDescs[i];
					if(assumption.name.toLowerCase().indexOf(nameSubStr) > -1 || assumption.category.toLowerCase().indexOf(nameSubStr) > -1){
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
	$get: ['$q', 'ENV', 'McmMapChangesService', /*'$rootScope', */
	function($q, ENV, McmMapChangesService/*, $rootScope*/) {
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
		var objectsDescsById = {};
		var objectsDescsByLabel = {};

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

		McmMapChangesService.getReadyPromise().then(function(){
			McmMapChangesService.getChangedNodes("new_object").$promise
			.then(function(newObjectsNodes){
				for(var i in newObjectsNodes){
					var newObjectsNode = newObjectsNodes[i];
					console.log("newObjectsNode: %s", JSON.stringify(newObjectsNode));
				}
			});
		});

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
						// alert("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption");
						console.warn("Missing both label 'rdfs:label' and 'skos:prefLabel' for loaded assumption: %s", JSON.stringify(itemFromGraph));
					}
					if(('rdfs:label' in itemFromGraph) && ('skos:prefLabel' in itemFromGraph)){
						// alert("Assumption loaded with both label 'rdfs:label' and 'skos:prefLabel' set");
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
					objectsDescsById[itemForExport.id] = itemForExport;
					objectsDescsByLabel[itemForExport.name] = itemForExport;
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

			function SortByName(a, b){
				var aName = (a.name).toLowerCase();
				var bName = (b.name).toLowerCase(); 
				return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
			}

			objectsDescs.sort(SortByName);

		});

		// var that = this;
		return {
			getObjectsDescs: function(){
				return objectsDescs;
			},

			getObjectDescById: function(objectId){
				return objectsDescsById[objectId];
			},

			getObjectDescByLabel: function(objectLabel){
				return objectsDescsByLabel[objectLabel];
			},

			addNewObject: function(name){
				var itemForExport = {};
				itemForExport.id = "new_obj:" + name;
				itemForExport.name = name;
				// itemForExport.category = itemCategory;
				// itemForExport.broader = itemFromGraph['broader'];
				// itemForExport.related = itemFromGraph['related'];
				// itemForExport.altLabel = itemFromGraph['skos:altLabel'];
				// itemForExport.definition = itemFromGraph['skos:definition'];
				
				itemForExport.quantities = [];
				objectsDescs.push(itemForExport);
				objectsDescsById[itemForExport.id] = itemForExport;
				objectsDescsByLabel[itemForExport.name] = itemForExport;
			},

			getObjectsDesByName: function(nameSubStr, fromStart, onlyTheNextObject){
				nameSubStr = nameSubStr.toLowerCase();
				if(typeof fromStart === 'undefined') fromStart = false;
				var returnedObjects = [];
				for(var i in objectsDescs){
					var shouldAdd = false;
					var object = objectsDescs[i];
					var id = object.name.toLowerCase().indexOf(nameSubStr);
					if(fromStart){
						if(id == 0){
							shouldAdd = true;
						}
					}else{
						if(id >= 0){
							shouldAdd = true;
						}
					}

					// avoid it if the object contains more than one subobject level from the level of the observer object
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
	$get: ['$q', 'ENV', 'McmMapObjectService', 'McmMapChangesService'/*, '$rootScope'*/,
	function($q, ENV, McmMapObjectService, McmMapChangesService/*, $rootScope*/) {
		var variableQuantitysDescs = [
			{
				name: "variableQuantity_1"
			},
			{
				name: "variableQuantity_2"
			},
			{
				name: "variableQuantity_3"
			}
		];

		McmMapChangesService.getReadyPromise().then(function(){
			McmMapChangesService.getChangedNodes("new_quantity").$promise
			.then(function(newQuantityNodes){
				for(var i in newQuantityNodes){
					var newQuantityNode = newQuantityNodes[i];
					console.log("newQuantityNode: %s", JSON.stringify(newQuantityNode));
				}
			});
		});

		// var that = this;
		return {
			getVariableQuantitysDescs: function(objectEntity){
				return variableQuantitysDescs;
			},

			addNewQuantity: function(objectEntity, quantityName){
				var objeLabel = McmMapObjectService.getFullObjectName(objectEntity);
				if(objectEntity.kNode.type == "grid_desc"){
					// TODO: FIX
					objeLabel = "model_grid";
				}
				var objDesc = McmMapObjectService.getObjectDescByLabel(objeLabel);
				if(objDesc && objDesc.quantities) objDesc.quantities.push(quantityName);
			},

			getVariableQuantitysDesInObjectByName: function(objectEntity, nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();

				var objeLabel = McmMapObjectService.getFullObjectName(objectEntity);
				if(objectEntity.kNode.type == "grid_desc"){
					// TODO: FIX
					objeLabel = "model_grid";
				}
				var objDesc = McmMapObjectService.getObjectDescByLabel(objeLabel);
				var returnedVariableQuantitys = [];
				if(objDesc){
					for(var i in objDesc.quantities){
						var variableQuantityName = objDesc.quantities[i];
						if(variableQuantityName.toLowerCase().indexOf(nameSubStr) > -1){
							var variableQuantity = {
								name: variableQuantityName
							};
							returnedVariableQuantitys.push(variableQuantity);
							returnedVariableQuantitys.sort();
						}
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
				nameSubStr = nameSubStr.toLowerCase();
				var returnedVariableOperators = [];
				for(var i in variableOperatorsDescs){
					var variableOperator = variableOperatorsDescs[i];
					if(variableOperator.name.toLowerCase().indexOf(nameSubStr) > -1){
						returnedVariableOperators.push(variableOperator);
					}
				}
				return returnedVariableOperators;
			},

		};
	}]
});

mcmMapServices.provider('McmMapChangesService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', 'KnalledgeMapService', 'KnalledgeNodeService',
	function($q, ENV, KnalledgeMapService, KnalledgeNodeService) {

		var mapChanges = null;
		var rootNodeChanges = null;

		var readyPromise = $q(function(resolve, reject) { /*jshint unused:false*/

			var result = KnalledgeMapService.queryByType("mcm_changes");
			result.$promise.then(function(maps){
				console.log("maps (%d): %s", maps.length, JSON.stringify(maps));
				if(maps.length > 0){
					mapChanges = maps[0];

					KnalledgeNodeService.getById(mapChanges.rootNodeId).$promise.then(function(rootNode){
						rootNodeChanges = rootNode;
						resolve();
					});
				}else{
					console.warn("There is no 'mcm_changes' map found");
				}
			});
		});

		// var that = this;
		return {
			getReadyPromise: function(){
				return readyPromise;
			},

			addChangeNodeEdge: function(kNode, kEdge){
				// readyPromise.then(function(){
				// });
				if(mapChanges && rootNodeChanges){
					var kEdge = KnalledgeMapVOsService.createNodeWithEdge(rootNodeChanges, kEdge, kNode);
					kEdge.$promise.then(function(kEdge){
						// item.status = "created";
					});
					return kEdge;
				}else{
					console.error("There is no 'mcm_changes' map found");
					return null;
				}
			},

			addChange: function(kNodeType, kNodeName, kEdgeType, kEdgeName){
				// readyPromise.then(function(){
				// });

				if(mapChanges && rootNodeChanges){
					var kEdge = new knalledge.KEdge();
					kEdge.type = kEdgeType;
					kEdge.name = kEdgeName;
					kEdge.mapId = mapChanges._id;

					var kNode = new knalledge.KNode();
					kNode.type = kNodeType;
					kNode.name =  kNodeName;
					kNode.mapId = mapChanges._id;

					return this.addChangeNodeEdge(kNode, kEdge);
				}else{
					console.error("There is no 'mcm_changes' map found");
					return null;
				}
			},
			getChangedNodes: function(kNodeType){
				if(mapChanges && rootNodeChanges){
					var kNodes = KnalledgeNodeService.getInMapNodesOfType(mapChanges._id, kNodeType);
					kNodes.$promise.then(function(kNodes){
						// item.status = "created";
					});
					return kNodes;
				}else{
					console.error("There is no 'mcm_changes' map found");
					return null;
				}
			}
		};
	}]
});

// http://csdms.colorado.edu/wiki/CSN_Process_Quantity_Names
mcmMapServices.provider('McmMapProcessService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
		var itemsData = null;
		var itemsLoaded = false;
		var itemsDescs = [];
		// for testing
		var itemsDescs = [
			{
				name: "process_1"
			},
			{
				name: "process_2"
			},
			{
				name: "process_3"
			}
		];
		// itemsDescs = [];

		var queryItems = function(){
			var data = [];
			data.$promise = null;
			data.$resolved = false;

			data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
				// http://jsonformatter.curiousconcept.com/
				var jsonUrl = ENV.server.frontend + "/data/processes.json";
				$.getJSON(jsonUrl, null, function(jsonContent){
					console.log("[McmMapAssumptionService:getJSON] Loaded processes: %s, (size: %d)", jsonUrl,
					jsonContent.length);
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

			for(var i=0; i<itemsData.length; i++){
				var isItem = true; // always for processes
				var itemCategory = null;
				var itemFromList = itemsData[i];
				if(isItem){
					var itemName = itemFromList.name;

					var itemForExport = {};
					itemForExport.id = itemName;
					itemForExport.name = itemName;
					itemForExport.verb = itemFromList.verb;
					itemForExport.description = itemFromList.description;
					itemsDescs.push(itemForExport);						
				}
			}
			itemsLoaded = true;
		});
		// var that = this;
		return {
			getItemsDescs: function(){
				return itemsDescs;
			},

			getProcesssDesByName: function(nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedProcesss = [];
				for(var i in itemsDescs){
					var process = itemsDescs[i];
					if(process.name.toLowerCase().indexOf(nameSubStr) > -1){
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
	$get: ['$q', 'ENV', 'KnalledgeMapVOsService', /*'$rootScope', */
	function($q, ENV, KnalledgeMapVOsService/*, $rootScope*/) {
		var gridsDescs = [
			{
				name: "grid_1"
			},
			{
				name: "grid_2"
			},
			{
				name: "grid_3"
			}
		];

		// var that = this;
		return {
			getGridsDescs: function(){
				var gridDescItems = [];
				var gridDescKNodes = KnalledgeMapVOsService.getNodesOfType("grid_desc");
				for(var i=0; i<gridDescKNodes.length; i++){
					var gridDescKNode = gridDescKNodes[i];
					gridDescItems.push({
						name: gridDescKNode.name
					});
				}
				return gridDescItems;
			},

			getMaxGridNum: function(){
				var gridMaxNum = 0;
				var gridsDescs = this.getGridsDescs();
				for(var i in gridsDescs){
					var grid = gridsDescs[i];
					var gridId = parseInt(grid.name.substring(2));
					if(gridId > gridMaxNum){
						gridMaxNum = gridId;
					}
				}
				return gridMaxNum;
			},

			getGridsDesByName: function(nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedGrids = [];
				var gridsDescs = this.getGridsDescs();
				for(var i in gridsDescs){
					var grid = gridsDescs[i];
					if(grid.name.toLowerCase().indexOf(nameSubStr) > -1){
						returnedGrids.push(grid);
					}
				}
				return returnedGrids;
			}
		};
	}]
});

mcmMapServices.provider('McmMapVisualService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', '$rootScope', '$compile', 'McmMapAssumptionService', 'McmMapObjectService', 'McmMapProcessService', 'McmMapVariableOperatorService', 'KnalledgeMapVOsService',
	function($q, ENV, $rootScope, $compile, McmMapAssumptionService, McmMapObjectService, McmMapProcessService, McmMapVariableOperatorService, KnalledgeMapVOsService) {
		var mcmMap, $scope, $element;

		var dialogues = {
			selectVariableQuantity: function(mapEntity){
				var realMapEntity = KnalledgeMapVOsService.mapStructure.getVKNodeByKId(mapEntity.kNode._id);
				var parentEntities = KnalledgeMapVOsService.mapStructure.getParentNodes(mapEntity);
				var parentEntity = (parentEntities.length>0) ? parentEntities[0] : null;

				this._selectVariableQuantity(parentEntity, realMapEntity, this._selectionOfSubpropertiesFinished);
			},

			selectAssumption: function(mapEntity){
				_selectAssumption(mapEntity, _selectionOfSubpropertiesFinished);
			},

			selectVariableOperator: function(mapEntity){
				selectVariableOperator(mapEntity.parent, mapEntity, _selectionOfSubpropertiesFinished);						
			},
			selectObject: function(mapEntity){
				_selectObject(mapEntity.parent, mapEntity, _selectionOfSubpropertiesFinished);
			},
			selectProcess: function(mapEntity){
				_selectProcess(mapEntity, _selectionOfSubpropertiesFinished);
			},
			selectGrid: function(mapEntity){
				_selectGrid(mapEntity, _selectionOfSubpropertiesFinished);
			},

			_selectionOfSubpropertiesFinished: function(vkAddedInNode, subproperty){
				mcmMap.update(null, function(){
					// that.clientApi.setSelectedNode(null); //TODO: set to parent
				});
				var eventName = "modelMapStructureChanged";
				$rootScope.$broadcast(eventName, vkAddedInNode);
			},

			_selectAssumption: function(mapEntity, callback){
				// we need this to avoid double calling
				// the first on dragging in and second on clicking on the tool entity
				console.log("selecting assumption");
				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive mcmMapSelectAssumption
				var directiveLink = $compile("<div mcm_map_select_assumption class='mcm_map_select_assumption'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				directiveScope.mapEntity = mapEntity;
				directiveScope.selectingCanceled = function(){
					console.log("[selectAssumption]: selectingCanceled");
				},
				directiveScope.selectedAssumption = function(assumption){
					console.log("[selectAssumption]: Added entity to addingInEntity: %s", JSON.stringify(assumption));
					mapEntity.kNode.name = assumption.name;
					if(typeof callback === 'function') callback(mapEntity.parent, assumption);

				}.bind(this);
			},
			_selectVariableQuantity: function(parentMapEntity, mapEntity, callback){
				// we need this to avoid double calling
				// the first on dragging in and second on clicking on the tool entity
				console.log("selecting VariableQuantity");

				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive
				// mcmMapSelectVariableQuantity
				var directiveLink = $compile("<div mcm_map_select_variable_quantity class='mcm_map_select_variable_quantity'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				directiveScope.parentMapEntity = parentMapEntity;
				directiveScope.mapEntity = mapEntity;
				directiveScope.selectingCanceled = function(){
					console.log("selectingCanceled");
				},
				directiveScope.selectedVariableQuantity = function(variableQuantity){
					console.log("Added variableQuantity to addingInEntity: %s", JSON.stringify(variableQuantity));
					mapEntity.kNode.name = variableQuantity.name;
					if(typeof callback === 'function') callback(mapEntity.parent, variableQuantity);
				}.bind(this);
			},
			_selectVariableOperator: function(parentMapEntity, mapEntity, callback){
				// we need this to avoid double calling
				// the first on dragging in and second on clicking on the tool entity
				console.log("selecting VariableOperator");
				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive
				var directiveLink = $compile("<div mcm_map_select_variable_operator class='mcm_map_select_variable_operator'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				directiveScope.mapEntity = mapEntity;
				directiveScope.selectingCanceled = function(){
					console.log("selectingCanceled");
				},
				directiveScope.selectedVariableOperator = function(variableOp){
					console.log("Added entity to addingInEntity: %s", JSON.stringify(variableOp));
					if(typeof callback === 'function') callback(mapEntity.parent, variableOp);
				}.bind(this);
			},
			_selectObject: function(parentMapEntity, mapEntity, callback){
				// we need this to avoid double calling
				// the first on dragging in and second on clicking on the tool entity
				console.log("selecting Object");
				var parentFullObjectName = McmMapObjectService.getFullObjectName(parentMapEntity);
				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive
				// mcmMapSelectObject
				var directiveLink = $compile("<div mcm_map_select_object class='mcm_map_select_object'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				directiveScope.mapEntity = mapEntity;
				directiveScope.parentFullObjectName = parentFullObjectName;
				directiveScope.selectingCanceled = function(){
					console.log("selectingCanceled");
				},
				directiveScope.selectedObject = function(object){
					console.log("Added entity to addingInEntity: %s", JSON.stringify(object));
					var baseName = McmMapObjectService.getBaseObjectName(object.name);
					mapEntity.kNode.name = baseName;
					if(typeof callback === 'function') callback(mapEntity.parent, object);
				}.bind(this);
			},
			_selectProcess: function(mapEntity, callback){
				// we need this to avoid double calling
				// the first on dragging in and second on clicking on the tool entity
				console.log("selecting Process");
				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive
				var directiveLink = $compile("<div mcm_map_select_process class='mcm_map_select_process'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				directiveScope.mapEntity = mapEntity;
				directiveScope.selectingCanceled = function(){
					console.log("selectingCanceled");
				},
				directiveScope.selectedProcess = function(process){
					console.log("Added entity to addingInEntity: %s", JSON.stringify(process));
					mapEntity.kNode.name = process.name;
					if(typeof callback === 'function') callback(mapEntity.parent, process);
				}.bind(this);
			},
			_selectGrid: function(mapEntity, callback){
				// we need this to avoid double calling
				// the first on dragging in and second on clicking on the tool entity
				console.log("selecting Grid");
				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive
				// mcmMapSelectGrid
				var directiveLink = $compile("<div mcm_map_select_grid class='mcm_map_select_grid'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				directiveScope.mapEntity = mapEntity;
				directiveScope.selectingCanceled = function(){
					console.log("selectingCanceled");
				},
				directiveScope.selectedGrid = function(gridDesc){
					console.log("Added entity to addingInEntity: %s", JSON.stringify(gridDesc));
					mapEntity.kNode.name = gridDesc.name;
					if(typeof callback === 'function') callback(mapEntity.parent, gridDesc);
				}.bind(this);
			}
		};

		// var that = this;
		return {
			init: function(_mcmMap, _$scope, _$element){
				mcmMap = _mcmMap;
				$scope = _$scope;
				$element = _$element;
			},

			getDialogues: function(){
				return dialogues;
			}
		};
	}]
});

mcmMapServices.provider('McmMapViewService', {
	// privateData: "privatno",
	$get: [/*'$q', 'ENV', '$rootScope', */
	function(/*$q , ENV, $rootScope*/) {

				// var that = this;
		var provider = {
			config: {
				entities: {
					showCounts: true
				}
			}
		};

		return provider;
	}]
});

}()); // end of 'use strict';