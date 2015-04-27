(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('mcmMapsDirectives', ['Config'])
	
	.directive('mcmMapsList', ["$rootScope", "$timeout", 'ConfigMapToolset', 'KnalledgeMapService', 
		function($rootScope, $timeout, ConfigMapToolset, KnalledgeMapService){
		console.log("[mcmMapsList] loading directive");
		return {
			restrict: 'AE',
			scope: {
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/mcmMaps/partials/mcmMaps-list.tpl.html',
			controller: function ( $scope, $element) {
				KnalledgeMapService.query().$promise.then(function(maps){
					$scope.maps = maps;
					console.log('maps:'+JSON.stringify($scope.maps));
				})


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