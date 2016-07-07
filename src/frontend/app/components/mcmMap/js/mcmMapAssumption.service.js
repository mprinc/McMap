(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices');

mcmMapServices.provider('McmMapAssumptionService', {
	// privateData: "privatno",
	$get: ['$q', /*'$rootScope', */ 'ENV', 'KnalledgeMapVOsService', 'KnalledgeMapService',
	function($q, /*$rootScope*/ ENV, KnalledgeMapVOsService, KnalledgeMapService) {
		var itemsData = null;
		var itemsLoaded = false;
		var itemCategoriesAll = {};
		var itemsDescs = [];
		var mapAssumptions = null;

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

		var queryItemsDb = function(){
			var data = {};
			data.$resolved = false;
			data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
				var gotMap = function(map){
					console.log('gotMap:'+JSON.stringify(map));
					// window.alert("[McmMapAssumptionService:queryItems] Assumptions map is loaded, processing");
					KnalledgeMapVOsService.loadData(map).$promise.then(function(result){ //broadcasts 'modelLoadedEvent'
						for(var id in result){
							data[id] = result[id];
						}
						data.$resolved = true;
						resolve(data);
					});
				};

				KnalledgeMapService.queryByType("assumptions").$promise.then(function(maps){
					console.log("[McmMapAssumptionService:queryItems] maps (%d): %s", maps.length, JSON.stringify(maps));
					if(maps.length <= 0){
						window.alert("[McmMapAssumptionService:queryItems] Error: There is no map of 'assumptions' type created")
					}else{
						mapAssumptions = maps[0];

						var mapId = mapAssumptions._id;
						console.info("[McmMapAssumptionService:queryItems] loading assumptions map: mapId: " + mapId);
						KnalledgeMapService.getById(mapId).$promise.then(gotMap);
					}
				});
			});
			return data;
		};

		var queryItemsJsonld = function(){
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

		var parseDb = function(itemsData){
			itemsDescs.length = 0;
			// TODO: taken from knalledgeMap/services.js
			// we need to extract it into a separate map accessor class
			var dataNodes = itemsData[0];
			var dataEdges = itemsData[1];

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

			var getChildrenNodes = function(kNode, edgeType){
				var children = [];
				for(var i in dataEdges){
					var kEdge = dataEdges[i];
					if(kEdge.sourceId == kNode._id && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
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

			var categories = getNodesOfType("assumptionCategory");
			for(var i=0; i<categories.length; i++){
				var category = categories[i];
				var itemCategory = category.name;

				if(!(itemCategory in itemCategoriesAll)){
					itemCategoriesAll[itemCategory] = {
						name: itemCategory,
						kNode: category,
						items: []
					}
				}

				var assumptions = getChildrenNodes(category, "containsAssumption");

				for(var j=0; j<assumptions.length; j++){
					var assumption = assumptions[j];

					var itemForExport = {};
					itemForExport.id = assumption.dataContent.mcm.id;
					itemForExport.name = assumption.name;
					itemForExport.category = category.name;
					itemForExport.kNode = assumption;

					itemsDescs.push(itemForExport);
					itemCategoriesAll[itemCategory].items.push(itemForExport);
				}
			}

			function SortByCategoryAndName(a, b){
				var aName = (a.category + a.name).toLowerCase();
				var bName = (b.category + b.name).toLowerCase();
				return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
			}

			itemsDescs.sort(SortByCategoryAndName);

			itemsLoaded = true;
		};

		var parseJsonld = function(itemsData){
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


			console.log("[McmMapAssumptionService] rdfTypesAll.length: %s", Object.keys(rdfTypesAll).length);
			for(var i in rdfTypesAll){
				console.log("\t%s: %d", i, rdfTypesAll[i]);
			}
			console.log("[McmMapAssumptionService] itemCategoriesAll.length: %s", Object.keys(itemCategoriesAll).length);
			for(var i in itemCategoriesAll){
				console.log("\t%s: %d", i, itemCategoriesAll[i]);
			}

			function SortByCategoryAndName(a, b){
				var aName = (a.category + a.name).toLowerCase();
				var bName = (b.category + b.name).toLowerCase();
				return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
			}

			itemsDescs.sort(SortByCategoryAndName);
			itemsLoaded = true;
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
			createNewAssumption: function(category, name){

				var parentNode = category.kNode;

				var kEdge = new knalledge.KEdge();
				kEdge.type = "containsAssumption";
				kEdge.mapId = category.mapId;
				kEdge.dataContent = {
					source: {
						created: 1
					}
				};

				var kNode = new knalledge.KNode();
				kNode.type = "assumption";
				kNode.name =  name;
				kNode.mapId = category.mapId;
				kNode.dataContent = {
					mcm: {
						id: null
					},
					source: {
						created: 1 // manual
					}
				};

				// Add to local storage
				var assumption = {};
				assumption.id = null;
				assumption.name = name;
				assumption.category = category.name;

				itemsDescs.push(assumption);
				category.items.push(assumption);

				var createAssumption = function(parentNode, edge, assumptionNode){
					var kEdge = KnalledgeMapVOsService.createNodeWithEdge(parentNode, edge, assumptionNode);
					return kEdge;
				}

				return createAssumption(parentNode, kEdge, kNode);
			},
			areAssumptionsLoaded: function(){
				return itemsLoaded;
			},
			getLoadingPromise: function(){
				return itemsData.$promise;
			},
			getAssumptionsCategories: function(){
				return itemCategoriesAll;
			},
			getAssumptionsCategoriesByName: function(nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedItems = [];
				// we cannot iterate with (var i in itemsDescs) because of
				// adding $promise and $resolved
				for(var i in itemCategoriesAll){
					var item = itemCategoriesAll[i];
					if(item.name.toLowerCase().indexOf(nameSubStr) > -1){
						returnedItems.push(item);
					}
				}
				return returnedItems;
			},
			getAssumptionsDescs: function(category){
				if(category){
					return category.items;
				}else{
					return itemsDescs;
				}
			},

			getAssumptionsDesByName: function(nameSubStr, category){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedItems = [];
				// we cannot iterate with (var i in itemsDescs) because of
				// adding $promise and $resolved
				var items = category ? category.items : itemsDescs;
				for(var i=0; i<items.length; i++){
					var item = items[i];
					if(category){
						if(item.name.toLowerCase().indexOf(nameSubStr) > -1){
							returnedItems.push(item);
						}
					}else{
						if(item.name.toLowerCase().indexOf(nameSubStr) > -1 || item.category.toLowerCase().indexOf(nameSubStr) > -1){
							returnedItems.push(item);
						}
					}
				}
				return returnedItems;
			},

		};
	}]
});

}()); // end of 'use strict';
