(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices');

mcmMapServices.provider('McmMapObjectService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', 'KnalledgeMapService', 'KnalledgeMapVOsService', 'KnalledgeNodeService', /*'McmMapChangesService', '$rootScope', */
	function($q, ENV, KnalledgeMapService, KnalledgeMapVOsService, KnalledgeNodeService /*, McmMapChangesService, $rootScope*/) {
		var itemsData = null;
		var itemsLoaded = false;
		var objectsDescs = [ // list of objects
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
		var objectsDescsById = {}; // object items by @id
		var objectsDescsByLabel = {}; // object items by names
		var mapVariables = null;
		var rootNodeVariable = null;

		var CREATED_BY_SYSTEM = 0;
		var CREATED_BY_USER = 1;

		// objectsDescs = [];

		var queryItemsDb = function(){
			var data = [];
			data.$resolved = false;
			data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
				var gotMap = function(map){
					console.log('gotMap:'+JSON.stringify(map));
					// window.alert("[McmMapObjectService:queryItems] Assumptions map is loaded, processing");

					KnalledgeNodeService.getById(mapVariables.rootNodeId).$promise.then(function(rootNode){
						rootNodeVariable = rootNode;

						KnalledgeMapVOsService.loadData(map).$promise.then(function(result){ //broadcasts 'modelLoadedEvent'
							for(var id in result){
								data[id] = result[id];
							}
							data.$resolved = true;
							resolve(data);
						});
					});
				};

				KnalledgeMapService.queryByType("variables").$promise.then(function(maps){
					console.log("[McmMapObjectService:queryItems] maps (%d): %s", maps.length, JSON.stringify(maps));
					if(maps.length <= 0){
						window.alert("[McmMapObjectService:queryItems] Error: There is no map of 'variables' type created")
					}else{
						mapVariables = maps[0];

						var mapId = mapVariables._id;
						console.info("[McmMapObjectService:queryItems] loading variables map: mapId: " + mapId);
						KnalledgeMapService.getById(mapId).$promise.then(gotMap);
					}
				});
			});
			return data;
		};

		var queryItemsJsonld = function(){
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

		// McmMapChangesService.getReadyPromise().then(function(){
		// 	McmMapChangesService.getChangedNodes("new_object").$promise
		// 	.then(function(newObjectsNodes){
		// 		for(var i in newObjectsNodes){
		// 			var newObjectsNode = newObjectsNodes[i];
		// 			console.log("newObjectsNode: %s", JSON.stringify(newObjectsNode));
		// 		}
		// 	});
		// });

		var parseDb = function(itemsData){
			objectsDescs.length = 0;

			var rdfTypesAll = {};
			var propertiesAll = {}; // contains all properties occured in the importing source, hash-keyed with number of occurences
			var quantitiesAll = {}; // contains all quantities hash-keyed with number of occurences
			var itemsNo = 0;

			var quantitiesNoTotal = 0;
			var quantitiesNoAvg = 0;
			var quantitiesNoMax = 0;

			var itemsWithoutQuantitiesNo = 0;
			var itemsWithoutQuantities = [];

			var dataNodes = itemsData[0];
			var dataEdges = itemsData[1];

			// TODO: taken from knalledgeMap/services.js
			// we need to extract it into a separate map accessor class
			var getNodesOfType = function(kNodeType){
				var nodes = [];
				for(var j in dataNodes){
					var kNode = dataNodes[j];
					if(kNode.type == kNodeType){
						nodes.push(kNode);
					}
				}
				return nodes;
			};

			// first parameter can be either kNode or kNodeId
			var getChildrenNodes = function(kNodeId, edgeType){
				if(typeof kNodeId == "object") kNodeId = kNodeId._id;
				var children = [];
				for(var i in dataEdges){
					var kEdge = dataEdges[i];
					if(kEdge.sourceId == kNodeId && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
						for(var j in dataNodes){
							var kNodeChild = dataNodes[j];
							if(kNodeChild._id == kEdge.targetId){
								children.push(kNodeChild);
							}
						}
					}
				}
				return children;
			};

			var variables = getChildrenNodes(mapVariables.rootNodeId, "containsVariable");

			for(var j=0; j<variables.length; j++){
				var variable = variables[j];

				var itemForExport = {};
				itemForExport.id = variable.dataContent.mcm.id;
				itemForExport.name = variable.name;
				itemForExport.quantities = variable.dataContent.mcm.quantities;
				itemForExport.kNode = variable;


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

				objectsDescsById[itemForExport.id] = itemForExport;
				objectsDescsByLabel[itemForExport.name] = itemForExport;
			}

			function SortByCategoryAndName(a, b){
				var aName = (a.category + a.name).toLowerCase();
				var bName = (b.category + b.name).toLowerCase();
				return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
			}

			objectsDescs.sort(SortByCategoryAndName);

			itemsLoaded = true;
		};

		var parseJsonld = function(itemsData){
			objectsDescs.length = 0;

			var rdfTypesAll = {};
			var propertiesAll = {}; // contains all properties occured in the importing source, hash-keyed with number of occurences
			var quantitiesAll = {}; // contains all quantities hash-keyed with number of occurences
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
						itemForExport.broader = itemFromGraph['broader'];
						itemForExport.related = itemFromGraph['related'];
						itemForExport.altLabel = itemFromGraph['skos:altLabel'];
						itemForExport.definition = itemFromGraph['skos:definition'];

						itemForExport.quantities = itemFromGraph['co:property'];
						if(typeof itemForExport.quantities === 'string'){
							if(itemForExport.quantities.length == 0){
								itemForExport.quantities = [];
							}else{
								itemForExport.quantities = [itemForExport.quantities];
							}
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
		};

		// var importType = "jsonld";
		var importType = "db";

		switch (importType){
		case "preloaded":
			break;
		case "jsonld":
			itemsData = queryItemsJsonld();
			itemsData.$promise.then(parseJsonld);
			break;
		case "db":
			itemsData = queryItemsDb();
			itemsData.$promise.then(parseDb);
			break;
		}

		return {
			CREATED_BY_SYSTEM: CREATED_BY_SYSTEM,

			CREATED_BY_USER: CREATED_BY_USER,

			getObjectsDescs: function(){
				return objectsDescs;
			},

			getObjectDescById: function(objectId){
				return objectsDescsById[objectId];
			},

			getObjectDescByLabel: function(objectLabel){
				return objectsDescsByLabel[objectLabel];
			},

			createNewVariable: function(item, mapId, parentNode, createdBy){
				var kEdge = new knalledge.KEdge();
				kEdge.type = "containsVariable";
				kEdge.mapId = mapId;
				kEdge.dataContent = {
					source: {
						created: createdBy
					}
				};

				var createdQuantities = [];
				for(var i in item.quantities){
					createdQuantities[i] = CREATED_BY_SYSTEM;
				}

				var kNode = new knalledge.KNode();
				kNode.type = "variable";
				kNode.name =  item.name;
				kNode.mapId = mapId;
				kNode.dataContent = {
					mcm: {
						id: item.id,
						quantities: item.quantities
					},
					source: {
						created: createdBy,
						createdQuantities: createdQuantities
					}
				};

				var createVariable = function(item, parentNode, edge, variableNode){
					var kEdge = KnalledgeMapVOsService.createNodeWithEdge(parentNode, edge, variableNode);
					kEdge.$promise.then(function(kEdge){
					});
					return kEdge;
				}

				return createVariable(item, parentNode, kEdge, kNode).$promise;
			},

			updateVariable: function(objDesc, updateType){
				return KnalledgeMapVOsService.updateNode(objDesc.kNode, updateType);
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

				return this.createNewVariable(itemForExport, mapVariables._id, rootNodeVariable, CREATED_BY_USER);
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
					var objectName = objectEntity.kNode.name;
					 // treat grids differently
					if(objectEntity.kNode.type == "grid_desc") objectName = "model_grid";

					fullNameList.unshift(objectName);
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
			},

			areObjectsLoaded: function(){
				return itemsLoaded;
			},
			getLoadingPromise: function(){
				return itemsData.$promise;
			},

			getMapVariables: function(){
				return mapVariables;
			},

			getRootNodeVariable: function(){
				return rootNodeVariable;
			}
		};
	}]
});

}()); // end of 'use strict';
