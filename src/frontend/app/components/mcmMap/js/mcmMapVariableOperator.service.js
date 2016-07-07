(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices');

mcmMapServices.provider('McmMapVariableOperatorService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
		var variableOperatorsAreSeparate = false;

		var variableOperatorsDescs = [
			{
				name: "variableOperator_1"
			},
			{
				name: "variableOperator_2"
			},
			{
				name: "variableOperator_3"
			},
			{
				name: "variableOperator_12"
			},
			{
				name: "variableOperator_13"
			},
			{
				name: "variableOperator_123"
			},
			{
				name: "variableOperator_14"
			},
			{
				name: "variableOperator_145"
			},
			{
				name: "variableOperator_12345"
			},
			{
				name: "variableOperator_1235"
			},
			{
				name: "variableOperator_143"
			},
			{
				name: "variableOperator_1451"
			},
			{
				name: "variableOperator_1245"
			}
		];

		// var that = this;
		return {
			areVariableOperatorsSeparate: function(){
				return variableOperatorsAreSeparate;
			},

			getVariableOperatorsDescs: function(){
				return variableOperatorsDescs;
			},

			getVariableOperatorsDesByName: function(nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedVariableOperators = [];
				for(var i in variableOperatorsDescs){
					var variableOperator = variableOperatorsDescs[i];
					if(variableOperator.name.toLowerCase().indexOf(nameSubStr) > -1){
						returnedVariableOperators.push(variableOperator);
					}
				}
				return returnedVariableOperators;
			},

		};
	}]
});

}()); // end of 'use strict';
