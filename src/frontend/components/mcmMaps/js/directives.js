(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('mcmMapsDirectives', ['Config'])
	
	.directive('mcmMapsList', ["$rootScope", "$timeout", "$location", 'ConfigMapToolset', 'KnalledgeMapService', 
		function($rootScope, $timeout, $location, ConfigMapToolset, KnalledgeMapService){
		console.log("[mcmMapsList] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMaps/partials/mcmMaps-list.tpl.html',
			controller: function ( $scope, $element) {
				$scope.mapToCreate = null;
				$scope.modeCreating = false;
				$scope.items = null;
				$scope.selectedItem = null;

				KnalledgeMapService.query().$promise.then(function(maps){
					$scope.items = maps;
					console.log('maps:'+JSON.stringify($scope.maps));
				});

				$scope.showCreateNewMap = function(){
					console.log("showCreateNewMap");
					$scope.mapToCreate = new knalledge.KMap();
					$scope.modeCreating = true;
				};

				$scope.cancelled = function(){
					console.log("Canceled");
					$scope.modeCreating = false;
				};

				$scope.createNew = function(){
					var mapCreated = function(mapFromServer) {
						console.log("mapCreated:");//+ JSON.stringify(mapFromServer));
						$scope.items.push(mapFromServer);
						$scope.selectedItem = mapFromServer;
					}
					console.log("createNew");
					$scope.modeCreating = false;
					KnalledgeMapService.create($scope.mapToCreate,mapCreated);
				};

				$scope.selectItem = function(item) {
				    $scope.selectedItem = item;
				    console.log("$scope.selectedItem = " + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
				};

				$scope.openMap = function() {
				    console.log("openMap");
					if($scope.selectedItem !== null && $scope.selectedItem !== undefined){
						console.log("openning Model:" + $scope.selectedItem.name + ": " + $scope.selectedItem._id);
						console.log("/map/id/" + $scope.selectedItem._id);
						$location.path("/map/id/" + $scope.selectedItem._id);
						//openMap($scope.selectedItem);
						// $element.remove();
					}
					else{
						window.alert('Please, select a Model');
					}
				};

				// var clickedToolEntity = null;
				// var toolsetClientInterface = {
				// 	getContainer: function(){
				// 		return $element.find('ul');
				// 	},
				// 	getData: function(){
				// 		return $scope.tools;
				// 	},
				// 	toolEntityClicked: function(toolEntity){
				// 		if(clickedToolEntity == toolEntity){
				// 			clickedToolEntity = null;
				// 		}else{
				// 			clickedToolEntity = toolEntity;
				// 		}
				// 		var eventName = "mapToolEntityClickedEvent";
				// 		$rootScope.$broadcast(eventName, clickedToolEntity);

				// 	},
				// 	timeout: $timeout
				// };

				// $scope.tools = [];
				// $scope.tools.length = 0;
				// var entities = McmMapSchemaService.getAllowedSubEntities('unselected');
				// for(var entityName in entities){
				// 	$scope.tools.push(McmMapSchemaService.getEntityDesc(entityName));
				// }

				// var toolset = new mcm.EntitiesToolset(ConfigMapToolset, toolsetClientInterface);
				// toolset.init();

				// var eventName = "mapEntitySelectedEvent";

				// $scope.$on(eventName, function(e, mapEntity) {
				// 	if(mapEntity){
				// 		console.log("[mcmMapTools.controller::$on] ModelMap  mapEntity (%s): %s", mapEntity.kNode.type, mapEntity.kNode.name);
				// 	}
				// 	$scope.tools.length = 0;
				// 	var entities = McmMapSchemaService.getAllowedSubEntities(mapEntity ? mapEntity.kNode.type : "unselected");
				// 	for(var entityName in entities){
				// 		$scope.tools.push(McmMapSchemaService.getEntityDesc(entityName));
				// 	}
				// 	toolset.update();
				// });
    		}
    	};
	}])
;

}()); // end of 'use strict';