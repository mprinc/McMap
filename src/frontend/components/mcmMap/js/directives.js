(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('mcmMapDirectives', ['Config'])
	.directive('mcmMap', ['$timeout', 'ConfigMap', function($timeout, ConfigMap){


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
					timeout: $timeout
				};

				var model = null;
				var mcmMap = new mcm.Map(ConfigMap, mcmMapClientInterface);
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
	.directive('mcmMapTools', ["$timeout", function($timeout){
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
				$scope.tools = [
					{
						type: "Assumption",
						icon: "A"
					},
					{
						type: "Variable",
						icon: "V"
					},
					{
						type: "Grid",
						icon: "G"
					}
				];

				var offset = 0;
				var positionItems = function(){
					console.log("[positionItems]");
					d3.select($element.find('ul').get(0)).selectAll("li")
						.style("top", function(){
							var position = offset + "px";
							offset += 50;
							return position;
						});
				};
				$timeout(positionItems, 10);

				var manipulationEnded = function(){
					console.log("tool:manipulationEnded");
				};

				var manipulationConfig = {
					draggTargetElement: true,
					target: {
						refCategory: '.draggable_tool',
						opacity:  0.5,
						zIndex: 10,
						cloningContainer: $element.find('ul').get(0), // getting native dom element from jQuery selector
						leaveAtDraggedPosition: false,
						callbacks: {
							onend: manipulationEnded
						}
					},
					debug: {
						origVsClone: false
					}
				};

				interaction.MoveAndDrag.InitializeManipulation(manipulationConfig);
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