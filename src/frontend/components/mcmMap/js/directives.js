(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('mcmMapDirectives', ['Config'])
	.directive('mcmContainer', ['$rootScope', '$timeout', 'ConfigMapToolset', 'McmMapViewService',
		function($rootScope, $timeout, ConfigMapToolset, McmMapViewService){
		return {
			restrict: 'AE',
			scope: {
			},
			templateUrl: '../components/mcmMap/partials/mcm-container.tpl.html',
			controller: function ( $scope, $element ) {
				$scope.config = McmMapViewService.config;
    		}
    	};
	}])
	.directive('mcmMap', ['$timeout', '$rootScope', '$routeParams', 'ConfigMap', '$compile', 'McmMapSchemaService', 'KnalledgeMapVOsService', 'KnalledgeMapService', 'KnalledgeMapViewService', 'McmMapVisualService', 'McmMapVariableOperatorService', 'McmMapGridService', 'McmMapViewService',
		function($timeout, $rootScope, $routeParams, ConfigMap, $compile, McmMapSchemaService, KnalledgeMapVOsService, KnalledgeMapService, KnalledgeMapViewService, McmMapVisualService, McmMapVariableOperatorService, McmMapGridService, McmMapViewService){

		// http://docs.angularjs.org/guide/directive
		// console.log("[mcmMap] loading directive");
		return {
			restrict: 'EA',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap.tpl.html',
			controller: function ( $scope, $element) {
				var toolEntityClicked = null;
				var mapEntityClicked = null;
				var inMapEntityDraggedIn = false;
				var model = null;
				var mcmMap = null;

				if(typeof $routeParams.id === "undefined"){
					window.alert("mapId not provided. You will be redirected to screen for map selection.");
					//TODO:
					return;
				}
				var mapId = $routeParams.id;
				console.log("mcmMapDirectives::mapId: " + mapId);

				var dialogues = McmMapVisualService.getDialogues();

				var mcmMapClientInterface = {
					getContainer: function(){
						return $element.find('.map-container');
					},
					addEntity: function(){
						;
					},
					mapEntityClicked: function(mapEntity /*, mapEntityDom*/){
						$scope.$apply(function () {
							mapEntityClicked = mapEntity;
							if(mapEntity){
								console.log("[mcmMap directive::mapEntityClicked] mapEntity (%s->%s): (%s) %s", 
									mapEntity.kNode._id, mapEntity.id, mapEntity.kNode.type, mapEntity.kNode.name);
							}
							var eventName = "mapEntitySelectedEvent";
							$rootScope.$broadcast(eventName, {mapEntity: mapEntity, emittingScope: $scope});
						});
					},
					mapEntityDraggedIn: function(mapEntity, decoratingEdge){
						// we need this to avoid double calling
						// the first on dragging in and second on clicking on the tool entity
						inMapEntityDraggedIn = true;
						$scope.$apply(function () {
							toolEntityClicked = null;

							console.log("Adding entity");
							var directiveScope = $scope.$new(); // $new is not super necessary
							// create popup directive
							var directiveLink = $compile("<div mcm_map_select_sub_entity class='mcm_map_select_sub_entity'></div>");
							// link HTML containing the directive
							var directiveElement = directiveLink(directiveScope);
							$element.append(directiveElement);

							directiveScope.map = mcmMap;
							directiveScope.entityRoot = mapEntity;
							directiveScope.decoratingEdge = decoratingEdge;
							directiveScope.addigCanceled = function(){
								inMapEntityDraggedIn = false;
							},
							directiveScope.addedEntity = function(vkAddedInEntity){
								if(!vkAddedInEntity) return;

								console.log("Added entity to vkAddedInEntity (%s): %s", vkAddedInEntity.kNode.type, vkAddedInEntity.kNode.name);

								vkAddedInEntity.draggedInNo++;

								var kEdgeRelationship = new knalledge.KEdge();
								kEdgeRelationship.name = "";
								kEdgeRelationship.type = decoratingEdge.name;
								var vkEdgeRelationship = new knalledge.VKEdge();
								vkEdgeRelationship.kEdge = kEdgeRelationship;

								var bottom = 0;
								var right = 0;
								if(McmMapSchemaService.getEntityStyle(decoratingEdge.object).isShownOnMap){
									// offseting bottom-right from the top bottom-right node
									var entityStyles = McmMapSchemaService.getEntitiesStyles();
									var vkNodes = mcmMap.mapStructure.getChildrenNodes(vkAddedInEntity);
									for(var i=0; i<vkNodes.length; i++){
										var vkNode = vkNodes[i];
										if(!(vkNode.kNode.type in entityStyles)  || !entityStyles[vkNode.kNode.type].isShownOnMap) continue;
										if(vkNode.kNode.visual){
											if(right < vkNode.kNode.visual.xM + vkNode.width) right = vkNode.kNode.visual.xM + vkNode.width;
											if(bottom < vkNode.kNode.visual.yM + vkNode.height) bottom = vkNode.kNode.visual.yM + vkNode.height;										
										}
									}
								}


								var kNodeEntity = new knalledge.KNode();
								kNodeEntity.name = decoratingEdge.object;
								kNodeEntity.type = decoratingEdge.object;
								kNodeEntity.visual = {};
								kNodeEntity.visual.xM = right;
								kNodeEntity.visual.yM = bottom;
								var vkNodeEntity = new knalledge.VKNode();
								vkNodeEntity.xM = right;
								vkNodeEntity.yM = bottom;
								vkNodeEntity.kNode = kNodeEntity;


								// KnalledgeMapVOsService.createNodeWithEdge(vkAddedInEntity.kNode, kEdgeRelationship, kNodeEntity)
								// vkAddedInEntity is a vk node in subTree, not in the map, we need a node in map
								var vkAddedInNode = mcmMap.mapStructure.getVKNodeByKId(vkAddedInEntity.kNode._id);
								vkNodeEntity.parent = vkAddedInNode;

								var selectionOfSubpropertiesFinished = function(subproperty){
									var vkEdge = mcmMap.mapStructure.createNodeWithEdge(vkAddedInNode, vkEdgeRelationship, vkNodeEntity);
									vkEdge.kEdge.$promise.then(function(){
										dialogues._selectionOfSubpropertiesFinished(vkNodeEntity, subproperty);
									});
								};

								console.log("Selecting subproperties for the vkNodeEntity (%s): %s ", vkNodeEntity.kNode.type, vkNodeEntity.kNode.name);

								switch(vkNodeEntity.kNode.type){
									case "variable":
										dialogues._selectVariableQuantity(vkAddedInNode, vkNodeEntity, function(variableQuantity){
											if(McmMapVariableOperatorService.areVariableOperatorsSeparate()){
												dialogues._selectVariableOperator(
													vkAddedInNode, vkNodeEntity, selectionOfSubpropertiesFinished);
											}else{
												if(typeof selectionOfSubpropertiesFinished === 'function') selectionOfSubpropertiesFinished(variableQuantity);
											}
										});
										break;
									case "assumption":
										dialogues._selectAssumption(vkNodeEntity, selectionOfSubpropertiesFinished);
										break;
									case "object":
										dialogues._selectObject(vkAddedInNode, vkNodeEntity, selectionOfSubpropertiesFinished);
										break;
									case "process":
										dialogues._selectProcess(vkNodeEntity, selectionOfSubpropertiesFinished);
										break;
									case "grid_desc":
										var gridName = "G_" + (McmMapGridService.getMaxGridNum()+1);
										vkNodeEntity.kNode.name = gridName;
										selectionOfSubpropertiesFinished({
											name: gridName
										});
										break;
									case "grid":
										dialogues._selectGrid(vkNodeEntity, selectionOfSubpropertiesFinished);											
										break;
									default:
										break;
								}
							}.bind(this);
						});
					},
					timeout: $timeout,
					dialogues: dialogues
				};

				KnalledgeMapViewService.config.nodes.showTypes = false;
				KnalledgeMapViewService.config.edges.showNames = false;
				KnalledgeMapViewService.config.edges.showTypes = false;

				mcmMap = new mcm.Map(d3.select($element.find(".map-container").get(0)),
					ConfigMap, mcmMapClientInterface, McmMapSchemaService, KnalledgeMapVOsService, KnalledgeMapVOsService.mapStructure, McmMapViewService);
				McmMapVisualService.init(mcmMap, $scope, $element);

				var gotMap = function(map){		
					console.log('gotMap:'+JSON.stringify(map));
					KnalledgeMapVOsService.loadAndProcessData(map); //broadcasts 'modelLoadedEvent'
				};

				// initiating loading map data from server
				KnalledgeMapService.getById(mapId).$promise.then(gotMap);


				// var map = {
				// 	name: "Anna's Model",
				// 	date: "2015.03.22.",
				// 	authors: "Anna Kelbert",
				// 	mapId: "ec2bf9409b8b80284c2e72c8",
				// 	rootNodeId: "5532f5fb98b4e4789002d290"
				// };

				model = null;

				var eventName = "modelLoadedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					// not the map type we are interested in
					if(eventModel.properties.type != 'mcm_map') return;

					console.log("[mcmMap.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.map.nodes.length, JSON.stringify(eventModel.map.nodes));
					console.log("[mcmMap.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));

					mcmMap.init(function(){
						mcmMap.processData(eventModel);
						model = eventModel;
					});
				});

				eventName = "mapToolEntityClickedEvent";
				$scope.$on(eventName, function(e, toolEntity) {
					toolEntityClicked = toolEntity;
					if(mapEntityClicked && toolEntityClicked && !inMapEntityDraggedIn){
						mcmMapClientInterface.mapEntityDraggedIn(mapEntityClicked, toolEntityClicked);
					}
				});

				eventName = "modelMapStructureChanged";
				$scope.$on(eventName, function(e, mapEntity) {
					mcmMap.update();
				});

				eventName = "mapEntitySelectedEvent";
				$scope.$on(eventName, function(e, eventObj) {
					if(eventObj.emittingScope == $scope) return;

					mcmMap.mapLayout.clickNode(eventObj.mapEntity, null, true, true);
					mcmMap.update();
				});

				var mapStylingChangedEventName = "mapStylingChangedEvent";
				$scope.$on(mapStylingChangedEventName, function(e) {
					console.log("[mcmMap.controller::$on] event: %s", mapStylingChangedEventName);
					mcmMap.update();
				});

			}
    	};
	}])
	.directive('mcmMapSelectAssumption', ['McmMapAssumptionService', function(McmMapAssumptionService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectAssumption.tpl.html',
			controller: function ( $scope, $element) {

				$scope.selectedItem = null;
				$scope.title = "Select assumption";
				$scope.path = "Name";
				$scope.item = {
					name: null
				};

				$scope.selectedCategory = {
					id: null,
					title: "+ category",
					status: "unselected",
					item: null
				};

				$scope.addNewEntityLabel = "Create New";

				$scope.addNewEntity = function(){
					if(!$scope.selectedCategory.item){
						window.alert("You need to select assumption category before adding a new assumption");
					}
					//alert("addNewEntity: " + newQuantityName);
					$scope.addNewEntityLabel = "Saving ...";
					// TODO: FIX

					McmMapAssumptionService.createNewAssumption($scope.selectedCategory.item, $scope.item.name)
					.$promise.then(function(){
						$scope.addNewEntityLabel = "Create New";
						$scope.nameChanged();
					});
				}

				$scope.selectCategory = function(){
					switch($scope.selectedCategory.status){
					case "selected":
						$scope.items = McmMapAssumptionService.getAssumptionsDescs();
						$scope.selectedCategory.status = "unselected";
						$scope.selectedCategory.title = "+ category";						
						$scope.item.name = "";
						$scope.selectedCategory.item =  null;
						break;
					case "unselected":
						$scope.items = McmMapAssumptionService.getAssumptionsCategories();
						$scope.selectedCategory.status = "selecting";
						$scope.selectedCategory.title = "< cancel selecting category";						
						$scope.item.name = "";
						break;
					case "selecting":
						$scope.items = McmMapAssumptionService.getAssumptionsDescs();
						$scope.selectedCategory.status = "unselected";
						$scope.selectedCategory.title = "+ category";
						$scope.item.name = "";
						break;
					}
					$element.find(".assumption_name").focus();
				};

				$scope.selectItem = function(item) {
					switch($scope.selectedCategory.status){
					case "selecting":
						$scope.selectedCategory.status = "selected";
						$scope.selectedCategory.title = "- c:" + item.name;
						$scope.item.name = "";
						$scope.selectedCategory.item =  item;
						$scope.items = McmMapAssumptionService.getAssumptionsDescs($scope.selectedCategory.item);
						$element.find(".assumption_name").focus();

						break;
					case "unselected":
					default:
					    $scope.selectedItem = item;
					    console.log("$scope.selectedItem = " + JSON.stringify(item));
					    break;
					}
				};

				var populateItems = function(subName){
					console.log("getAssumptionsDesByName(%s)", subName);

					//console.log("New searching assumption name: %s", $scope.item.name);
					switch($scope.selectedCategory.status){
					case "selecting":
						$scope.items = McmMapAssumptionService.getAssumptionsCategoriesByName(subName);
						break;
					default:
						$scope.items = McmMapAssumptionService.getAssumptionsDesByName(subName, $scope.selectedCategory.item);
						break;
					}
					// console.log("$scope.items IN: " + $scope.items);

					// items.length = 0;
					// for(var i in itemsFull){
					// 	var item = itemsFull[i];
					// 	if(!subName || item.name.indexOf(subName) >= 0){
					// 		items.push(item);
					// 	}
					// }
				};

				populateItems("");

				$scope.nameChanged = function(){
					//console.log("New searching assumption name: %s", $scope.item.name);
					populateItems($scope.item.name);
					// console.log("$scope.items: " + $scope.items);
				};
				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove(); //TODO: sta je ovo?
					$scope.selectingCanceled();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						$scope.selectedAssumption($scope.selectedItem);
						$element.remove();
					}
					else{
						window.alert('Please, select an Assumption');
					}
				};
				$scope.listTitle = "Assumptions are still loading ...";
				McmMapAssumptionService.getLoadingPromise().then(function(){
					$scope.listTitle = "Assumptions are loaded ...";
					populateItems("");
				});

    		}
    	};
	}])
	// mcm_map_select_variable_quantity
	.directive('mcmMapSelectVariableQuantity', ['McmMapVariableQuantityService', 'McmMapObjectService',
	function(McmMapVariableQuantityService, McmMapObjectService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectVariableQuantity.tpl.html',
			controller: function ( $scope, $element) {

				
				$scope.selectedItem = null;
				$scope.title = "Select Variable Quantity";
				$scope.path = "Name";
				$scope.item = {
					name: null
				};
				
				$scope.addNewEntityLabel = "Create New";

				$scope.addNewEntity = function(){
					var fullName = McmMapObjectService.getFullObjectName($scope.parentMapEntity);

					var newQuantityName = fullName + "_" + $scope.item.name;
					//alert("addNewEntity: " + newQuantityName);
					$scope.addNewEntityLabel = "Saving ...";
					// TODO: FIX
					McmMapVariableQuantityService.addNewQuantity($scope.parentMapEntity, $scope.item.name)
					.$promise.then(function(){
						$scope.addNewEntityLabel = "Create New";
						$scope.nameChanged();
					});
				}


				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + JSON.stringify(item));
				};

				var populateItems = function(subName){
					console.log("getVariableQuantitysDesByName(%s)", subName);

					$scope.items = McmMapVariableQuantityService.getVariableQuantitysDesInObjectByName($scope.parentMapEntity, subName);
					console.log("$scope.items IN: " + $scope.items);
				};

				populateItems("");

				$scope.nameChanged = function(){
					//console.log("New searching VariableQuantity name: %s", $scope.item.name);
					populateItems($scope.item.name);
					console.log("$scope.items: " + $scope.items);
				};
				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove(); //TODO: sta je ovo?
					$scope.selectingCanceled();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						$scope.selectedVariableQuantity($scope.selectedItem);
						$element.remove();
					}
					else{
						window.alert('Please, select an Variable Quantity');
					}
				};
    		}
    	};
	}])
	.directive('mcmMapSelectVariableOperator', ['McmMapVariableOperatorService', function(McmMapVariableOperatorService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectVariableOperator.tpl.html',
			controller: function ( $scope, $element) {

				
				$scope.selectedItem = null;
				$scope.title = "Select Variable Operator";
				$scope.path = "Name";
				$scope.item = {
					name: null
				};
				

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + JSON.stringify(item));
				};

				var populateItems = function(subName){
					console.log("getAssumptionsDesByName(%s)", subName);
					$scope.items = McmMapVariableOperatorService.getVariableOperatorsDesByName(subName);
					console.log("$scope.items IN: " + $scope.items);

					// items.length = 0;
					// for(var i in itemsFull){
					// 	var item = itemsFull[i];
					// 	if(!subName || item.name.indexOf(subName) >= 0){
					// 		items.push(item);
					// 	}
					// }
				};

				populateItems("");

				$scope.nameChanged = function(){
					//console.log("New searching VariableOperator name: %s", $scope.item.name);
					populateItems($scope.item.name);
					console.log("$scope.items: " + $scope.items);
				};
				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove(); //TODO: sta je ovo?
					$scope.selectingCanceled();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						$scope.selectedVariableOperator($scope.selectedItem);
						$element.remove();
					}
					else{
						window.alert('Please, select a Variable Operator');
					}
				};
    		}
    	};
	}])
	.directive('mcmMapSelectObject', ['McmMapObjectService', function(McmMapObjectService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectObject.tpl.html',
			controller: function ( $scope, $element) {

				$scope.selectedItem = null;
				$scope.title = "Select Object";
				$scope.path = "Name";
				$scope.item = {
					name: null
				};

				$scope.addNewEntityLabel = "Create New";

				$scope.addNewEntity = function(){
					var fullName = $scope.parentFullObjectName; // McmMapObjectService.getFullObjectName($scope.parentMapEntity);
					var newEntityName = (fullName && fullName.length > 0) ? fullName + "_" + $scope.item.name : $scope.item.name;
					var result = window.confirm("Are you sure you want to create a new object:\n" + newEntityName);
					if(!result) return;

					//alert("addNewEntity: " + newEntityName);
					$scope.addNewEntityLabel = "Saving ...";

					McmMapObjectService.addNewObject(newEntityName).then(function(){
						$scope.addNewEntityLabel = "Create New";						
						$scope.nameChanged();
					});
				}

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + JSON.stringify(item));
				};

				var populateItems = function(subName){
					console.log("getObjectsDesByName(%s)", subName);
					var fullName = ($scope.parentFullObjectName && $scope.parentFullObjectName.length > 0) ? 
						$scope.parentFullObjectName + "_" + subName : subName;
					$scope.items = McmMapObjectService.getObjectsDesByName(fullName, true, true);
					console.log("$scope.items IN: " + $scope.items);

					// items.length = 0;
					// for(var i in itemsFull){
					// 	var item = itemsFull[i];
					// 	if(!subName || item.name.indexOf(subName) >= 0){
					// 		items.push(item);
					// 	}
					// }
				};

				populateItems("");

				$scope.nameChanged = function(){
					//console.log("New searching Object name: %s", $scope.item.name);
					populateItems($scope.item.name);
					console.log("$scope.items: " + $scope.items);
				};
				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove(); //TODO: sta je ovo?
					$scope.selectingCanceled();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						$scope.selectedObject($scope.selectedItem);
						$element.remove();
					}
					else{
						window.alert('Please, select an Object');
					}
				};
    		}
    	};
	}])
	.directive('mcmMapSelectProcess', ['McmMapProcessService', function(McmMapProcessService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectProcess.tpl.html',
			controller: function ( $scope, $element) {

				
				$scope.selectedItem = null;
				$scope.title = "Select Process";
				$scope.path = "Name";
				$scope.item = {
					name: null
				};
				

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + JSON.stringify(item));
				};

				var populateItems = function(subName){
					console.log("getProcesssDesByName(%s)", subName);
					$scope.items = McmMapProcessService.getProcesssDesByName(subName);
					console.log("$scope.items IN: " + $scope.items);

					// items.length = 0;
					// for(var i in itemsFull){
					// 	var item = itemsFull[i];
					// 	if(!subName || item.name.indexOf(subName) >= 0){
					// 		items.push(item);
					// 	}
					// }
				};

				populateItems("");

				$scope.nameChanged = function(){
					//console.log("New searching Process name: %s", $scope.item.name);
					populateItems($scope.item.name);
					console.log("$scope.items: " + $scope.items);
				};
				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove(); //TODO: sta je ovo?
					$scope.selectingCanceled();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						$scope.selectedProcess($scope.selectedItem);
						$element.remove();
					}
					else{
						window.alert('Please, select a Process');
					}
				};
    		}
    	};
	}])
	// mcm_map_select_grid
	.directive('mcmMapSelectGrid', ['McmMapGridService', function(McmMapGridService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectGrid.tpl.html',
			controller: function ( $scope, $element) {

				
				$scope.selectedItem = null;
				$scope.title = "Select Grid";
				$scope.path = "Name";
				$scope.item = {
					name: null
				};
				

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + JSON.stringify(item));
				};

				var populateItems = function(subName){
					console.log("getGridsDesByName(%s)", subName);
					$scope.items = McmMapGridService.getGridsDesByName(subName);
					console.log("$scope.items IN: " + $scope.items);

					// items.length = 0;
					// for(var i in itemsFull){
					// 	var item = itemsFull[i];
					// 	if(!subName || item.name.indexOf(subName) >= 0){
					// 		items.push(item);
					// 	}
					// }
				};

				populateItems("");

				$scope.nameChanged = function(){
					//console.log("New searching Grid name: %s", $scope.item.name);
					populateItems($scope.item.name);
					console.log("$scope.items: " + $scope.items);
				};
				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove(); //TODO: sta je ovo?
					$scope.selectingCanceled();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						$scope.selectedGrid($scope.selectedItem);
						$element.remove();
					}
					else{
						window.alert('Please, select a Grid');
					}
				};
    		}
    	};
	}])
	.directive('mcmMapSelectSubEntity', ['McmMapSchemaService', 'KnalledgeMapVOsService', function(McmMapSchemaService, KnalledgeMapVOsService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectSubEntity.tpl.html',
			controller: function ( $scope, $element) {
				var kNodesById = [];
				var kEdgesById = [];

				var checkIfNodeOrSubchildrenAreSelectable = function(kNode, entityDecorating){
					// check if node itself is selectable
					var nodeSelectable;
					// returns a list of entities that entity type accept
					var allowedSubEntities = McmMapSchemaService.getAllowedSubEntities(kNode.type);
					// if node is not recognized by McmMapSchemaService.getAllowedSubEntities we do not traverse it
					if(!allowedSubEntities) return false;

					if(allowedSubEntities[entityDecorating.type]){
						nodeSelectable = true;
					}else{
						nodeSelectable = false;
					}

					// build subree structure from children and check if any of subchildren is possible to decorate with entityDecorating
					var selectableInChildren = false;
					var edgeTypes = KnalledgeMapVOsService.getChildrenEdgeTypes(kNode);
					for(var edgeType in edgeTypes){

						// iterate through children (of one edgeType and recirsively call buildSubTree and 
						//	check if any of children or subchildren is possible to drop in the entityDecorating)
						var kChildren = KnalledgeMapVOsService.getChildrenNodes(kNode, edgeType);
						var selectableInSubTypeChildren = false;
						for(var kChildId in kChildren){
							var selectableInChild = checkIfNodeOrSubchildrenAreSelectable(kChildren[kChildId], entityDecorating);
							selectableInSubTypeChildren = selectableInSubTypeChildren || selectableInChild;
						}
						selectableInChildren = selectableInChildren || selectableInSubTypeChildren;
					}
					nodeSelectable = nodeSelectable || selectableInChildren;

					// if parent or any of children is possible to decorate with the entityDecorating
					return nodeSelectable;
				};
				var buildTree = function(entityRoot, entityDecorating, kNodesById, kEdgesById){
					var buildSubTree = function(parentKNode, kNode, entityDecorating, subTree, kNodesById, kEdgesById){
						if(!("children" in subTree)) subTree.children = [];
						if(!('visual' in kNode)) kNode.visual = {};
						kNode.visual.isOpen = true;

						var selectable = checkIfNodeOrSubchildrenAreSelectable(kNode, entityDecorating);
						if(selectable){
							// this node will be added after we get confirmation of any possibility to add it
							// (either it is possible to drop entityDecorating on, or any of its children)

							subTree.children.push(kNode);
							kNodesById.push(kNode);
							kNode.visual.selectable = true;

							// creating edge between parent and child and adding it to list of edges
							if(parentKNode){
								var kEdge = new knalledge.KEdge();
								kEdge.name = "";
								kEdge.sourceId = parentKNode._id;
								kEdge.targetId = kNode._id;

								kEdgesById.push(kEdge);
							}
						}

						// build subree structure from children and check if any of subchildren is possible to decorate with entityDecorating
						//var selectableInChildren = false;
						var edgeTypes = KnalledgeMapVOsService.getChildrenEdgeTypes(kNode);
						for(var edgeType in edgeTypes){

							// iterate through children (of one edgeType and recirsively call buildSubTree and 
							//	check if any of children or subchildren is possible to drop in the entityDecorating)
							var kChildren = KnalledgeMapVOsService.getChildrenNodes(kNode, edgeType);
							var selectableInSubTypeChildren = false;
							for(var kChildId in kChildren){
								var kChild = kChildren[kChildId];
								var selectableInChild = checkIfNodeOrSubchildrenAreSelectable(kChild, entityDecorating);
								selectableInSubTypeChildren = selectableInSubTypeChildren || selectableInChild;
							}

							if(selectableInSubTypeChildren){
								if(!("children" in kNode)) kNode.children = [];

								// node that represents group of subentities (var-in, var-out, ...)
								var subTypeKNode = new knalledge.KNode();
								subTypeKNode.name = McmMapSchemaService.getEdgeDesc(edgeType).objects;
								subTypeKNode.visual = {
									isOpen: true,
									selectable: false

								};
								
								// adding subtype node into parent ...
								kNode.children.push(subTypeKNode);
								// ... and list of all nodes
								kNodesById.push(subTypeKNode);

								// creating edge between parent node and subtype node and adding it to the list of all edges
								var kEdge = new knalledge.KEdge();
								kEdge.name = "";
								kEdge.sourceId = kNode._id;
								kEdge.targetId = subTypeKNode._id;

								kEdgesById.push(kEdge);

								// call each child in subtype to fill in subtree with itself and subchildren
								for(var kChildId in kChildren){
									buildSubTree(subTypeKNode, kChildren[kChildId], entityDecorating, subTypeKNode, kNodesById, kEdgesById);
								}
							}
						}
					};

					var treeHolder = {
						children: []
					};
					var tree = null;

					buildSubTree(null, entityRoot.kNode, entityDecorating, treeHolder, kNodesById, kEdgesById);
					if(treeHolder.children.length > 0){
						tree = treeHolder.children[0];
					}
					return tree;
				};

				var entityDecorating = McmMapSchemaService.getEntityDesc($scope.decoratingEdge.object);

				var vkMap = buildTree($scope.entityRoot, entityDecorating, kNodesById, kEdgesById);

				$scope.mapConfigForInjecting = {
					tree: {
						viewspec: "viewspec_tree", // "viewspec_tree" // "viewspec_manual"
						fixedDepth: {
							enabled: false,
							levelDepth: 150
						},
						sizing: {
							setNodeSize: true,
							nodeSize: [200, 100]
						},
						margin: {
							top: 10,
							left: 20,
							right: 100,
							bottom: 10
						},
						mapService: {
							enabled: false
						}
					},
					nodes: {
						html: {
							dimensions: {
								sizes: {
									width: 100
								}
							}
						},
					},
					keyboardInteraction: {
						enabled: false
					},
					draggingConfig: {
						enabled: false
					}
				};

				var properties = {
					name: "Selectable tree of subentities",
					date: "",
					authors: "MCM Model",
					mapId: null,
					rootNodeId: vkMap._id
				};

				$scope.mapDataForInjecting = {
					vkMap: vkMap,
					properties: properties,
					map: {
						nodes: kNodesById,
						edges: kEdgesById
					},
					selectedNode: vkMap // the root node in the tree
				};

				$scope.title = "Select decoration entity";
				$scope.path = "Name";
				$scope.selectedNode = {
					selected: false,
					vkNode: $scope.entityRoot
				};
				$scope.nodeSelected = function(vkNode, dom){
					$scope.selectedNode.vkNode = vkNode;
					$scope.selectedNode.selected = true;
				};

				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove();
					$scope.addigCanceled();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					$scope.addedEntity($scope.selectedNode.vkNode);
					$element.remove();
				};
    		}
    	};
	}])
	.directive('mcmMapTools', ["$rootScope", "$timeout", 'ConfigMapToolset', 'McmMapSchemaService',
		function($rootScope, $timeout, ConfigMapToolset, McmMapSchemaService){
		console.log("[mcmMapTools] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-tools.tpl.html',
			controller: function ( $scope, $element) {
				var clickedToolEntity = null;
				var toolsetClientInterface = {
					getContainer: function(){
						return $element.find('ul');
					},
					getData: function(){
						return $scope.tools;
					},
					toolEntityClicked: function(toolEntity){
						if(clickedToolEntity == toolEntity){
							clickedToolEntity = null;
						}else{
							clickedToolEntity = toolEntity;
						}
						var eventName = "mapToolEntityClickedEvent";
						$rootScope.$broadcast(eventName, clickedToolEntity);

					},
					timeout: $timeout
				};

				$scope.tools = [];
				$scope.tools.length = 0;
				var entity = McmMapSchemaService.getEntityDesc('unselected');
				for(var edgeName in entity.contains){
					$scope.tools.push(McmMapSchemaService.getEdgeDesc(edgeName));
				}

				var toolset = new mcm.EntitiesToolset(ConfigMapToolset, toolsetClientInterface);
				toolset.init();

				var eventName = "mapEntitySelectedEvent";
				$scope.$on(eventName, function(e, eventObj) {
					if(eventObj.mapEntity){
						console.log("[mcmMapTools.controller::$on] ModelMap  mapEntity (%s): %s", eventObj.mapEntity.kNode.type, eventObj.mapEntity.kNode.name);
					}
					$scope.tools.length = 0;
					var entity = McmMapSchemaService.getEntityDesc(eventObj.mapEntity ? eventObj.mapEntity.kNode.type : "unselected");
					for(var edgeName in entity.contains){
						$scope.tools.push(McmMapSchemaService.getEdgeDesc(edgeName));
					}
					toolset.update();
				});
    		}
    	};
	}])
	.directive('mcmPreferences', ['$rootScope', '$timeout', 'ConfigMapToolset', 'McmMapViewService',
		function($rootScope, $timeout, ConfigMapToolset, McmMapViewService){
		return {
			restrict: 'AE',
			scope: {
			},
			templateUrl: '../components/mcmMap/partials/mcm-preferences.tpl.html',
			controller: function ( $scope, $element ) {
				$scope.config = McmMapViewService.config;
				$scope.configChanged = function(){
					var mapStylingChangedEventName = "mapStylingChangedEvent";
					$rootScope.$broadcast(mapStylingChangedEventName);
				};
    		}
    	};
	}])

	.directive('mcmMapList', ['$rootScope', '$timeout', 'ConfigMapToolset', 'KnalledgeMapVOsService', 'McmMapSchemaService', 'McmMapVariableOperatorService', 'McmMapVisualService',
		function($rootScope, $timeout, ConfigMapToolset, KnalledgeMapVOsService, McmMapSchemaService, McmMapVariableOperatorService, McmMapVisualService){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-list.tpl.html',
			controller: function ( $scope, $element ) {
				var mcmMapModel = null;
				var mcmMap = null;

				var dialogues = McmMapVisualService.getDialogues();

				var mcmMapClientInterface = {
					mapEntityClicked: function(){
					},
					dialogues: dialogues,
					timeout: $timeout,
					update: function(mapEntity){
						var eventName = "modelMapStructureChanged";
						$rootScope.$broadcast(eventName, mapEntity);
					},
					clicked: function(mapEntity){
						var mapEntityDesc = McmMapSchemaService.getEntityDesc(mapEntity.type);
						if(!mapEntityDesc || !mapEntityDesc.contains || Object.keys(mapEntityDesc.contains).length <= 0) return;
						var eventName = "mapEntitySelectedEvent";
						$rootScope.$broadcast(eventName, {mapEntity: mapEntity.vkNode, emittingScope: $scope});
					}
				};

				var services = {
					McmMapVariableOperatorService: McmMapVariableOperatorService
				};
				mcmMap = new mcm.list.Map(d3.select($element.get(0)),
					ConfigMapToolset, mcmMapClientInterface, McmMapSchemaService, KnalledgeMapVOsService, KnalledgeMapVOsService.mapStructure, services);

				$scope.currentEntity = null;

				$scope.goToParentClicked = function(){
					var parentEntities = KnalledgeMapVOsService.mapStructure.getParentNodes($scope.currentEntity);
					if(parentEntities.length > 0){
						var eventName = "mapEntitySelectedEvent";
						$rootScope.$broadcast(eventName, {mapEntity: parentEntities[0], emittingScope: $scope});
					}
				};

				var eventName = "mapEntitySelectedEvent";
				$scope.$on(eventName, function(e, eventObj) {
					if(eventObj.mapEntity){
						console.log("[mcmMapList.controller::$on] ModelMap mapEntity (%s): %s", eventObj.mapEntity.kNode.type, eventObj.mapEntity.kNode.name);
						$scope.currentEntity = eventObj.mapEntity;
						mcmMap.changeSubtreeRoot(eventObj.mapEntity);
					}
				});

				eventName = "modelMapStructureChanged";
				$scope.$on(eventName, function(e, mapEntity) {
					console.log("[mcmMapList.controller::$on] modelMapStructureChanged");
					if(mapEntity){
						if(mapEntity.kNode){
							console.log("[mcmMapList.controller::$on] ModelMap  mapEntity (%s): %s", mapEntity.kNode.type, mapEntity.kNode.name);
							// $scope.currentEntity = mapEntity;
						}
						// it will call mapLayout processData
						mcmMap.changeSubtreeRoot($scope.currentEntity);
					}
				});

				eventName = "modelLoadedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					// not the map type we are interested in
					if(eventModel.properties.type != 'mcm_map') return;

					console.log("[mcmMapTools.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.map.nodes.length, JSON.stringify(eventModel.map.nodes));
					console.log("[mcmMapTools.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));
					mcmMapModel = eventModel;
					mcmMap.init(function(){
						mcmMapModel = eventModel;
						mcmMap.processData(mcmMapModel);

						var eventName = "mapEntitySelectedEvent";
						$rootScope.$broadcast(eventName, {mapEntity: KnalledgeMapVOsService.mapStructure.rootNode, emittingScope: $scope});
					});
				});
    		}	
    	};
	}])
	.directive('mcmImportAssumptions', ['$q', 'KnalledgeMapVOsService', 'KnalledgeNodeService', 'KnalledgeEdgeService', 'KnalledgeMapService', 'McmMapAssumptionService', 
		function($q, KnalledgeMapVOsService, KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapService, McmMapAssumptionService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcm-importAssumption.tpl.html',
			controller: function ( $scope, $element) {
				$scope.selectedItem = null;
				$scope.mapAssumptions = null;

				var populateCategories = function(){
					console.log("populateCategories");
					$scope.items = [];
					$scope.categories = McmMapAssumptionService.getAssumptionsCategories();

					var categoryKeys = Object.keys($scope.categories);
					for(var i in $scope.categories){
						$scope.items.push($scope.categories[i]);
						$scope.categories[i].status = "queued"
					}

					var populateCategory = function(categoryId, categoryKeys){
						if(categoryId>=categoryKeys.length){
							window.alert("All categories are imported");
							return;
						};

						var category = $scope.items[categoryId];
						var promises = [];

						// create assumption category
						var item = category;

						var kEdge = new knalledge.KEdge();
						kEdge.type = "containsAssumptionCategory";
						kEdge.mapId = $scope.mapAssumptions._id;
						kEdge.dataContent = {
							source: {
								created: 0
							}
						};

						var kNode = new knalledge.KNode();
						kNode.type = "assumptionCategory";
						kNode.name = item.name;
						kNode.mapId = $scope.mapAssumptions._id;
						kNode.dataContent = {
							source: {
								created: 0
							}
						};
						var categoryNode = kNode;

						var createAssumptionCategory = function(item, parentNode, edge, assumptionNode){
							var kEdge = KnalledgeMapVOsService.createNodeWithEdge(parentNode, edge, assumptionNode);
							kEdge.$promise.then(function(kEdge){
								item.status = "created";
							});
							return kEdge;
						}
						var kEdge = createAssumptionCategory(item, $scope.rootNodeAssumption, kEdge, kNode);

						kEdge.$promise.then(function(){
							for(var i in category.items){
								var item = category.items[i];
								item.status = "queued";

								var kEdge = new knalledge.KEdge();
								kEdge.type = "containsAssumption";
								kEdge.mapId = $scope.mapAssumptions._id;
								kEdge.dataContent = {
									source: {
										created: 0
									}
								};

								var kNode = new knalledge.KNode();
								kNode.type = "assumption";
								kNode.name =  item.name;
								kNode.mapId = $scope.mapAssumptions._id;
								kNode.dataContent = {
									mcm: {
										id: item.id
									},
									source: {
										created: 0
									}
								};

								var createAssumption = function(item, parentNode, edge, assumptionNode){
									var kEdge = KnalledgeMapVOsService.createNodeWithEdge(parentNode, edge, assumptionNode);
									kEdge.$promise.then(function(kEdge){
										item.status = "created";
									});
									return kEdge;
								}
								promises.push(createAssumption(item, categoryNode, kEdge, kNode).$promise);
								item.status = "creating";
							}
							$q.all(promises).then(function(){
								populateCategory(categoryId+1, categoryKeys);
							})						});
						item.status = "creating";
					}

					populateCategory(0, categoryKeys);
				};

				var clearPreviousAssumptions = function(){
					var promiseNodes = KnalledgeNodeService.destroyByModificationSource($scope.mapAssumptions._id).$promise;
					var promiseEdges = KnalledgeEdgeService.destroyByModificationSource($scope.mapAssumptions._id).$promise;

					promiseNodes.then(function(result){
						window.alert("Previous assumptions (nodes) are destroyed");
					});
					promiseEdges.then(function(result){
						window.alert("Previous assumptions (edges) are destroyed");
					});

					var promiseAll = $q.all([promiseNodes, promiseEdges])
						.then(function(result){
							window.alert("Previous assumptions (both nodes and edges) are destroyed");
						});
						//.catch(handleReject); //TODO: test this. 2nd function fail or like this 'catch'
					return promiseAll;

				};

				$scope.importCategories = function	(){
					// TODO: assumptions map should be used from McmMapAssumptionService bnot reloaded again
					KnalledgeMapService.queryByType("assumptions").$promise.then(function(maps){
						console.log("maps (%d): %s", maps.length, JSON.stringify(maps));
						if(maps.length <= 0){
							window.alert("Error: There is no map of 'assumptions' type created")
						}else{
							$scope.mapAssumptions = maps[0];

							KnalledgeNodeService.getById($scope.mapAssumptions.rootNodeId).$promise.then(function(rootNode){
								$scope.rootNodeAssumption = rootNode;
								clearPreviousAssumptions().then(function(result){
									window.alert("Previous assumptions are destroyed. populating categories");
									populateCategories();
								});
							});
						}
					});
				}

				$scope.listTitle = "Assumptions are loading ...";
				McmMapAssumptionService.getLoadingPromise().then(function(){
					$scope.listTitle = "Assumptions are loaded. Importing ...";
				});

    		}
    	};
	}])
	.directive('mcmImportVariables', ['$q', 'KnalledgeMapVOsService', 'KnalledgeNodeService', 'KnalledgeEdgeService', 'KnalledgeMapService', 'McmMapObjectService', 
		function($q, KnalledgeMapVOsService, KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapService, McmMapObjectService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcm-importVariables.tpl.html',
			controller: function ( $scope, $element) {
				$scope.selectedItem = null;
				$scope.mapVariables = null;
				$scope.itemsImportingNo = 0;
				$scope.itemsImportedNo = 0;
				$scope.items = [];

				var populateItems = function(){
					console.log("populateItems");
					$scope.items = McmMapObjectService.getObjectsDescs();
					$scope.itemsImportingNo = $scope.items.length;
					$scope.itemsImportedNo = 0;

					var populateItem = function(itemId){
						if(itemId >= $scope.items.length){
							window.alert("All variables are imported");
							return;
						};

						var item = $scope.items[itemId];

						McmMapObjectService.createNewVariable(item, $scope.mapVariables._id, $scope.rootNodeVariable, McmMapObjectService.CREATED_BY_SYSTEM).then(function(){
							$scope.itemsImportedNo = itemId;
							populateItem(itemId+1);
						});
					}

					populateItem(0);
				};

				var clearPreviousVariables = function(){
					var promiseNodes = KnalledgeNodeService.destroyByModificationSource($scope.mapVariables._id).$promise;
					var promiseEdges = KnalledgeEdgeService.destroyByModificationSource($scope.mapVariables._id).$promise;

					promiseNodes.then(function(result){
						window.alert("Previous variables (nodes) are destroyed");
					});
					promiseEdges.then(function(result){
						window.alert("Previous variables (edges) are destroyed");
					});

					var promiseAll = $q.all([promiseNodes, promiseEdges])
						.then(function(result){
							window.alert("Previous variables (both nodes and edges) are destroyed");
						});
						//.catch(handleReject); //TODO: test this. 2nd function fail or like this 'catch'
					return promiseAll;

				};

				$scope.importItems = function(){
					// TODO: variables map should be used from McmMapObjectService bnot reloaded again
					McmMapObjectService.getLoadingPromise().then(function(){

						KnalledgeMapService.queryByType("variables").$promise.then(function(maps){
							console.log("[McmMapObjectService:queryItems] maps (%d): %s", maps.length, JSON.stringify(maps));
							if(maps.length <= 0){
								window.alert("[McmMapObjectService:queryItems] Error: There is no map of 'variables' type created")
							}else{
								$scope.mapVariables = maps[0];
	
								KnalledgeNodeService.getById($scope.mapVariables.rootNodeId).$promise.then(function(rootNode){
	
									$scope.rootNodeVariable = rootNode;

									clearPreviousVariables().then(function(result){
										window.alert("Previous variables are destroyed. populating categories");
										populateItems();
									});

								});
							}
						});
					});
				}

				$scope.listTitle = "Variables are loading ...";
				McmMapObjectService.getLoadingPromise().then(function(){
					$scope.listTitle = "Variables are loaded. Ready to get imported.";
				});

    		}
    	};
	}])
;

}()); // end of 'use strict';