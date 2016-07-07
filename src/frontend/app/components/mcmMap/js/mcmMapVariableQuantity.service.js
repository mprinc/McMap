(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices');

mcmMapServices.provider('McmMapVariableQuantityService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', 'McmMapObjectService'/*, 'McmMapChangesService', '$rootScope'*/,
	function($q, ENV, McmMapObjectService/*, McmMapChangesService, $rootScope*/) {
		var variableQuantitysDescs = [
			{
				name: "variableQuantity_1"
			},
			{
				name: "variableQuantity_2"
			},
			{
				name: "variableQuantity_3"
			}
		];

		// McmMapChangesService.getReadyPromise().then(function(){
		// 	McmMapChangesService.getChangedNodes("new_quantity").$promise
		// 	.then(function(newQuantityNodes){
		// 		for(var i in newQuantityNodes){
		// 			var newQuantityNode = newQuantityNodes[i];
		// 			console.log("newQuantityNode: %s", JSON.stringify(newQuantityNode));
		// 		}
		// 	});
		// });

		// var that = this;
		return {

			MCM_UPDATE_QUANTITIES: "MCM_UPDATE_QUANTITIES",

			// TODO
			getVariableQuantitysDescs: function(objectEntity){
				return variableQuantitysDescs;
			},

			addNewQuantity: function(objectEntity, quantityName){
				var objLabel = McmMapObjectService.getFullObjectName(objectEntity);
				if(objectEntity.kNode.type == "grid_desc"){
					// TODO: FIX
					objLabel = "model_grid";
				}
				var objDesc = McmMapObjectService.getObjectDescByLabel(objLabel);
				if(objDesc){
					if(!objDesc.quantities){
						objDesc.quantities = [];
					}
					if(!objDesc.kNode.dataContent.source.createdQuantities){
						objDesc.kNode.dataContent.source.createdQuantities = [];
					}
					objDesc.quantities.push(quantityName);
					objDesc.kNode.dataContent.source.createdQuantities.push(McmMapObjectService.CREATED_BY_USER);
				}

				// in general not acctually necessary since this is already the same reference during the object loading/creation period
				// necessary only when quantities didn't exist in the object
				objDesc.kNode.dataContent.mcm.quantities = objDesc.quantities;

				return McmMapObjectService.updateVariable(objDesc, this.MCM_UPDATE_QUANTITIES);
			},

			getVariableQuantitysDesInObjectByName: function(objectEntity, nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();

				var objLabel = McmMapObjectService.getFullObjectName(objectEntity);
				if(objectEntity.kNode.type == "grid_desc"){
					// TODO: FIX
					objLabel = "model_grid";
				}
				var objDesc = McmMapObjectService.getObjectDescByLabel(objLabel);
				var returnedVariableQuantitys = [];
				if(objDesc){
					for(var i in objDesc.quantities){
						var variableQuantityName = objDesc.quantities[i];
						if(variableQuantityName.toLowerCase().indexOf(nameSubStr) > -1){
							var variableQuantity = {
								name: variableQuantityName
							};
							returnedVariableQuantitys.push(variableQuantity);
						}
					}
				}
				function SortByName(a, b){
					var aName = (a.name).toLowerCase();
					var bName = (b.name).toLowerCase();
					return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
				}

				returnedVariableQuantitys.sort(SortByName);
				return returnedVariableQuantitys;
			},

		};
	}]
});

}()); // end of 'use strict';
