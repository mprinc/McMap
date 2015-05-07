(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('mcmMapsDirectives', ['Config'])
	
	.directive('mcmMapsList', ["$rootScope", "$timeout", "$location", 'ConfigMapToolset', 'KnalledgeMapService', 'KnalledgeMapVOsService', 'RimaUsersService',
		function($rootScope, $timeout, $location, ConfigMapToolset, KnalledgeMapService, KnalledgeMapVOsService, RimaUsersService){
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

				KnalledgeMapService.queryByType("mcm_map").$promise.then(function(maps){
					$scope.items = maps;
					console.log('maps:'+JSON.stringify($scope.maps));
					RimaUsersService.loadUsersFromList(); //TODO remove, after centralized loading is done
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
						rootNode.mapId = mapFromServer._id;
						KnalledgeMapVOsService.updateNode(rootNode)
					}

					var rootNodeCreated = function(rootNode){
						$scope.mapToCreate.rootNodeId = rootNode._id;
						$scope.mapToCreate.type = "mcm_map";
						var map = KnalledgeMapService.create($scope.mapToCreate);
						map.$promise.then(mapCreated);
					}

					console.log("createNew");
					$scope.modeCreating = false;

					var rootNode = new knalledge.KNode();
					rootNode.name = $scope.mapToCreate.name;
					rootNode.type = "model_component";
					rootNode.iAmId = RimaUsersService.getActiveUserId();
					rootNode.mapId = null;
					rootNode.visual = {
					    isOpen: true,
					    xM: 0,
					    yM: 0
					};

					rootNode = KnalledgeMapVOsService.createNode(rootNode);
					rootNode.$promise.then(rootNodeCreated);					
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
    		}
    	};
	}])
;

}()); // end of 'use strict';