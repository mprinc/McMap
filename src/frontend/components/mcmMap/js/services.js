(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var mcmMapServices = angular.module('mcmMapServices', ['ngResource', 'Config']);

mcmMapServices.factory('McmMapService', ['$resource', '$q', 'ENV', function($resource, $q, ENV){
	console.log("[mcmMapServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/mcmMap/one-:type/:searchParam.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		get: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[DatasetsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasetsService] accessId: %s", serverResponse.accessId);
				var datasets = serverResponse.dataset;
				return datasets[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		query: {method:'GET', params:{type:'all', searchParam:''}, isArray:true, 
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[DatasetsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasetsService] accessId: %s", serverResponse.accessId);
				var datasets = serverResponse.dataset;
//				for(var datasetId in datasets){
//					var dataset = datasets[datasetId];
//				}
				//console.log("[DatasetsService] data: %s", JSON.stringify(data));
				return datasets;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}}
	});
	
	resource.query = function(){
		var data = {
			$promise: null,
			$resolved: false
		};
		
		data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
			var jsonUrl = ENV.server.backend + "/sample-small.json";
			$.getJSON(jsonUrl, null, function(jsonContent){
				console.log("Loaded: %s, mcmMap (nodes: %d, edges: %d)", jsonUrl,
					jsonContent.model.nodes.length, jsonContent.model.edges.length);
				for(var id in jsonContent){
					data[id] = jsonContent[id];
				}
				data.$resolved = true;
				resolve(jsonContent);
			});
			// reject('Greeting ' + name + ' is not allowed.');
		});
		return data;
	};
	return resource;
}]);

}()); // end of 'use strict';