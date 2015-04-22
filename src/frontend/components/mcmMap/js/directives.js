(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('mcmMapDirectives', ['Config'])
	.directive('mcmMap', ['$timeout', '$rootScope', 'ConfigMap', '$compile', 'McmMapSchemaService', 'KnalledgeMapService',
		function($timeout, $rootScope, ConfigMap, $compile, McmMapSchemaService, KnalledgeMapService){


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
				var mcmMapClientInterface = {
					getContainer: function(){
						return $element.find('.map-container');
					},
					mapEntityClicked: function(mapEntity /*, mapEntityDom*/){
						$scope.$apply(function () {
							var eventName = "mapEntitySelectedEvent";
							$rootScope.$broadcast(eventName, mapEntity);
						});
					},
					mapEntityDraggedIn: function(mapEntity, decoratingEntity){
						$scope.$apply(function () {
							console.log("Adding entity");
							var directiveScope = $scope.$new(); // $new is not super necessary
							// create popup directive
							var directiveLink = $compile("<div mcm_map_select_sub_entity class='mcm_map_select_sub_entity'></div>");
							// link HTML containing the directive
							var directiveElement = directiveLink(directiveScope);
							$element.append(directiveElement);

							directiveScope.map = mcmMap;
							directiveScope.entityRoot = mapEntity;
							directiveScope.entityDecorating = decoratingEntity;
							directiveScope.addedEntity = function(addingInEntity){
								console.log("Added entity to addingInEntity: %s", JSON.stringify(addingInEntity));

								addingInEntity.draggedInNo++;
								var relationship = {
									"name": "",
								};
								var entity = {
								};

								if(decoratingEntity.type == 'variable'){
									entity.name = "variable";
									entity.type = "variable";
									relationship.type = mcm.Map.CONTAINS_VARIABLE_OUT;
								}
								if(decoratingEntity.type == 'assumption'){
									entity.name = "assumption";
									entity.type = "assumption";
									relationship.type = mcm.Map.CONTAINS_ASSUMPTION_OUT;
								}

								mcmMap.addChildNode(addingInEntity, entity, relationship);

								// var updated = function(nodeFromServer){
								// 	console.log("[knalledgeMap::kMapClientInterface::addImage::addedImage::created'] createNode: " + nodeFromServer);
								// 	if(callback){callback(nodeFromServer);}
								// 	knalledgeMap.update(node);
								// };
								// KnalledgeNodeService.update(node).$promise
								// 	.then(updated);
							}.bind(this);
						});
					},
					timeout: $timeout
				};

				// initiating loading map data from server
				var mapProperties = {
					name: "Anna's Model",
					date: "2015.03.22.",
					authors: "Anna Kelbert",
					mapId: "ec2bf9409b8b80284c2e72c8",
					rootNodeId: "5532f5fb98b4e4789002d290"
				};

				KnalledgeMapService.loadData(mapProperties);

				var schema = {
					entityStyles: McmMapSchemaService.getEntitiesStyles()
				};

				var model = null;
				var mcmMap = new mcm.Map(d3.select($element.find(".map-container").get(0)),
					ConfigMap, mcmMapClientInterface, schema, KnalledgeMapService);

				var eventName = "modelLoadedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					console.log("[mcmMap.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.map.nodes.length, JSON.stringify(eventModel.map.nodes));
					console.log("[mcmMap.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));

					mcmMap.init(function(){
						mcmMap.processData(eventModel);
						model = eventModel;
					});
				});
			}
    	};
	}])
	.directive('mcmMapSelectSubEntity', ['McmMapSchemaService', 'KnalledgeMapService', function(McmMapSchemaService, KnalledgeMapService){ // mcm_map_select_sub_entity
		return {
			restrict: 'AE',
			// scope: {
			// },
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-selectSubEntity.tpl.html',
			controller: function ( $scope, $element) {

				var buildTree = function(entityRoot, entityDecorating){
					var buildSubTree = function(parentKNode, entityDecorating, subTree){
						if(!("children" in subTree)) subTree.children = [];

						var parentVKNode = new knalledge.VKNode();
						parentVKNode.kNode = parentKNode;

						var allowedSubEntities = McmMapSchemaService.getAllowedSubEntities(parentKNode.type);
						// selectable property tells if the specific node in the tree is possible to decorate with entityDecorating
						if(allowedSubEntities[entityDecorating.type]){
							parentVKNode.selectable = true;
						}else{
							parentVKNode.selectable = false;
						}

						// build subree structure from children and check if any of subchildren is possible to decorate with entityDecorating
						var selectableInChildren = false;
						var edgeTypes = KnalledgeMapService.getChildrenEdgeTypes(parentKNode);
						for(var edgeType in edgeTypes){
							var subTypeKNode = new knalledge.KNode();
							subTypeKNode.name = edgeType;
							
							var subTypeVKNode = new knalledge.VKNode();
							subTypeVKNode.kNode = subTypeKNode;

							var children = KnalledgeMapService.getChildrenNodes(parentKNode, edgeType);
							var selectableInSubTypeChildren = false;
							for(var childId in children){
								var selectableInChild = buildSubTree(children[childId], entityDecorating, subTypeVKNode);
								selectableInSubTypeChildren = selectableInSubTypeChildren || selectableInChild;
							}
							if(selectableInSubTypeChildren){
								if(!("children" in parentVKNode)) parentVKNode.children = [];
								parentVKNode.children.push(subTypeVKNode);
							}
							selectableInChildren = selectableInChildren || selectableInSubTypeChildren;
						}

						var parentVKNodeSelectable = parentVKNode.selectable || selectableInChildren;
						// if parent or any of children is possible to decorate with entityDecorating we put parent in the tree
						if(parentVKNodeSelectable){
							subTree.children.push(parentVKNode);
						}
						return parentVKNodeSelectable;
					};

					var treeHolder = {
						children: []
					};
					var tree = null;

					buildSubTree(entityRoot.kNode, entityDecorating, treeHolder);
					if(treeHolder.children.length > 0){
						tree = treeHolder.children[0];
					}
					return tree;
				};

				var vkMap = buildTree($scope.entityRoot, $scope.entityDecorating);

				$scope.mapConfigForInjecting = {
					tree: {
						viewspec: "viewspec_tree", // "viewspec_tree" // "viewspec_manual"
						fixedDepth: {
							enabled: true,
							levelDepth: 150
						}
					},
					nodes: {
						html: {
							dimensions: {
								sizes: {
									width: 85
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

				$scope.mapDataForInjecting = {
					vkMap: vkMap,
					selectedNode: vkMap // the root node in the tree
				};

				$scope.title = "Select decoration entity";
				$scope.path = "Name";

				$scope.cancelled = function(){
					//console.log("Canceled");
					$element.remove();
				};

				$scope.submitted = function(){
					console.log("Submitted");
					$scope.addedEntity($scope.selectedNode.ref);
					$element.remove();
				};
    		}
    	};
	}])
	.directive('mcmMapTools', ["$timeout", 'ConfigMapToolset', 'McmMapSchemaService', 
		function($timeout, ConfigMapToolset, McmMapSchemaService){
		console.log("[mcmMapTools] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-tools.tpl.html',
			controller: function ( $scope, $element) {
				var toolsetClientInterface = {
					getContainer: function(){
						return $element.find('ul');
					},
					getData: function(){
						return $scope.tools;
					},
					timeout: $timeout
				};

				$scope.tools = [];
				$scope.tools.length = 0;
				var entities = McmMapSchemaService.getAllowedSubEntities('unselected');
				for(var entityName in entities){
					$scope.tools.push(McmMapSchemaService.getEntityDesc(entityName));
				}

				var toolset = new mcm.EntitiesToolset(ConfigMapToolset, toolsetClientInterface);
				toolset.init();

				var eventName = "mapEntitySelectedEvent";

				$scope.$on(eventName, function(e, mapEntity) {
					if(mapEntity){
						console.log("[mcmMapTools.controller::$on] ModelMap  mapEntity (%s): %s", mapEntity.kNode.type, mapEntity.kNode.name);
					}
					$scope.tools.length = 0;
					var entities = McmMapSchemaService.getAllowedSubEntities(mapEntity ? mapEntity.kNode.type : "unselected");
					for(var entityName in entities){
						$scope.tools.push(McmMapSchemaService.getEntityDesc(entityName));
					}
					toolset.update();
				});
    		}
    	};
	}])
	.directive('mcmMapList', [function(){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-list.tpl.html',
			controller: function ( $scope ) {

				var eventName = "mapEntitySelectedEvent";
				$scope.$on(eventName, function(e, mapEntity) {
					if(mapEntity){
						console.log("[mcmMapTools.controller::$on] ModelMap  mapEntity (%s): %s", mapEntity.kNode.type, mapEntity.kNode.name);
					}
				});

				var eventName = "modelLoadedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					console.log("[mcmMapTools.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.map.nodes.length, JSON.stringify(eventModel.map.nodes));
					console.log("[mcmMapTools.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));

				});

				var eventName = "modelChangedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					console.log("[mcmMapTools.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.map.nodes.length, JSON.stringify(eventModel.map.nodes));
					console.log("[mcmMapTools.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.map.edges.length, JSON.stringify(eventModel.map.edges));

				});
    		}	
    	};
	}])
	.directive('mcmMapNode', [function(){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'E',
			scope: {
				'sale': '='
				,'isLast': '='
				// default options
				// 	https://github.com/angular/angular.js/issues/3804
				//	http://stackoverflow.com/questions/18784520/angular-directive-with-default-options
				//	https://groups.google.com/forum/#!topic/angular/Wmzp6OU4IRc
				,'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'modules/mcmMap/partials/sale-show.tpl.html',
			controller: function ( $scope ) {
				console.log($scope);
    		}
		};
	}])
	.directive('mcmMapEdge', [function(){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'E',
			scope: {
				'sale': '='
				,'isLast': '='
				// default options
				// 	https://github.com/angular/angular.js/issues/3804
				//	http://stackoverflow.com/questions/18784520/angular-directive-with-default-options
				//	https://groups.google.com/forum/#!topic/angular/Wmzp6OU4IRc
				,'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'modules/mcmMap/partials/sale-show.tpl.html',
			controller: function ( $scope) {
				console.log($scope);
    		}
		};
	}])
;

}()); // end of 'use strict';