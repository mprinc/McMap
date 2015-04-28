(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/* App Module */

angular.module('McModelarApp',[
	  'ngRoute'
	, 'ngSanitize' // necessary for outputing HTML in angular directive
	, 'ngStorage' // local storage support for Angular

	, 'mcmMapDirectives' // KnAllEdge Map component
	, 'mcmMapServices'
	, 'knalledgeMapDirectives' // KnAllEdge Map component
	, 'knalledgeMapServices'
	, 'mcmMapsDirectives' // KnAllEdge Map component
	
])
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/map', {
		templateUrl: '../components/mcmMap/partials/index.tpl.html'
	})
	.when('/maps', {
		templateUrl: '../components/mcmMaps/partials/index.tpl.html'
	})
	.when('/map/id/:id', {
		templateUrl: '../components/mcmMap/partials/index.tpl.html'
		//,controller: 'CreationsListCtrl' // we do not specify controller her (but in template) since there will be more than one in the template
	})
	.otherwise({
		redirectTo: '/maps'
	});
}])

// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
//.config(['$compileProvider', function ($compileProvider) {
//	$compileProvider.debugInfoEnabled(false);
//}])
;

}()); // end of 'use strict';