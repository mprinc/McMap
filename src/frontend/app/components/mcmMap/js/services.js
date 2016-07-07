(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices', ['ngResource', 'Config', 'knalledgeMapServices']);

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
				// TODO
				GlobalEmitterServicesArray.get(eventName).broadcast('McmMapVisualService', vkAddedInNode);
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

// Exported
// mcmMapServices.provider('McmMapViewService', {
// 	// privateData: "privatno",
// 	$get: [/*'$q', 'ENV', '$rootScope', */
// 	function(/*$q , ENV, $rootScope*/) {
//
// 				// var that = this;
// 		var provider = {
// 			config: {
// 				visualDiagram: {
// 					visible: true
// 				},
// 				entities: {
// 					showCounts: true
// 				}
// 			}
// 		};
//
// 		return provider;
// 	}]
// });

}()); // end of 'use strict';
