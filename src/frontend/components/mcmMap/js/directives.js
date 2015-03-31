(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('mcmMapDirectives', ['Config'])
	.directive('mcmMap', ['$timeout', '$rootScope', 'ConfigMap', function($timeout, $rootScope, ConfigMap){


		// http://docs.angularjs.org/guide/directive
		console.log("[mcmMap] loading directive");
		return {
			restrict: 'EA',
			scope: {
				'readonly': '='
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
					timeout: $timeout
				};

				var entityStyles = {
					"object": {
						typeClass: "map_entity_object",
						icon: "O"
					},
					"process": {
						typeClass: "map_entity_process",
						icon: "P"
					}
				};

				var model = null;
				var mcmMap = new mcm.Map(ConfigMap, mcmMapClientInterface, entityStyles);
				mcmMap.init();

				var eventName = "modelLoadedEvent";
				$scope.$on(eventName, function(e, eventModel) {
					console.log("[mcmMap.controller::$on] ModelMap  nodes(len: %d): %s",
						eventModel.nodes, JSON.stringify(eventModel.nodes));
					console.log("[mcmMap.controller::$on] ModelMap  edges(len: %d): %s",
						eventModel.edges.length, JSON.stringify(eventModel.edges));
					mcmMap.placeModels(eventModel);
					model = eventModel;
				});
			}
    	};
	}])
	.directive('mcmMapTools', ["$timeout", 'ConfigMapToolset', function($timeout, ConfigMapToolset){
		console.log("[mcmMapTools] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '='
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

				var entityListRules = {
					"unselected": [
						{
							id: "assumption",
							name: "assumption",
							type: "assumption",
							icon: "A"
						},
						{
							id: "object",
							name: "object",
							type: "object",
							icon: "O"
						},
						{
							id: "process",
							name: "process",
							type: "process",
							icon: "P"
						},
						{
							id: "grid",
							name: "grid",
							type: "grid",
							icon: "G"
						}
					],
					"object": [
						{
							id: "assumption",
							name: "assumption",
							type: "assumption",
							icon: "A"
						},
						{
							id: "object",
							name: "object",
							type: "object",
							icon: "O"
						},
						{
							id: "process",
							name: "process",
							type: "process",
							icon: "P"
						},
						{
							id: "variable",
							name: "variable",
							type: "variable",
							icon: "V"
						},
						{
							id: "grid",
							name: "grid",
							type: "grid",
							icon: "G"
						}
					],
					"process": [
						{
							id: "assumption",
							name: "assumption",
							type: "assumption",
							icon: "A"
						},
						{
							id: "object",
							name: "object",
							type: "object",
							icon: "O"
						},
						{
							id: "grid",
							name: "grid",
							type: "grid",
							icon: "G"
						}
					]
				};

				$scope.tools = [];
				$scope.tools.length = 0;
				var entities = entityListRules.unselected;
				for(var i in entities){
					$scope.tools.push(entities[i]);
				}

				var toolset = new mcm.EntitiesToolset(ConfigMapToolset, toolsetClientInterface);
				toolset.init();

				var eventName = "mapEntitySelectedEvent";

				$scope.$on(eventName, function(e, mapEntity) {
					console.log("[mcmMapTools.controller::$on] ModelMap  mapEntity: %s", JSON.stringify(mapEntity));
					$scope.tools.length = 0;
					var entities = entityListRules[mapEntity ? mapEntity.type : "unselected"];
					for(var i in entities){
						$scope.tools.push(entities[i]);
					}
					toolset.update();
				});
    		}
    	};
	}])
	.directive('mcmMapList', ['$rootScope', '$window', 'McmMapService', function($rootScope, $window, McmMapService){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMap/partials/mcmMap-list.tpl.html',
			controller: function ( $scope ) {
				$scope.mcmMapFull = McmMapService.query();
				$scope.mcmMapFull.$promise.then(function(result){
					console.log("[mcmMapList] result.model.(nodes.length = %d, edges.length = %d)", 
						result.model.nodes.length, result.model.edges.length);
					console.log("[mcmMapList] $scope.model.mcmMap.(nodes.length = %d, edges.length = %d)",
						result.model.nodes.length, result.model.edges.length);
					var eventName = "modelLoadedEvent";
					$rootScope.$broadcast(eventName, $scope.mcmMapFull.model);
				}, function(fail){
					$window.alert("Error loading mcmMap: %s", fail);
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