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
])
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/map', {
		templateUrl: '../components/mcmMap/partials/index.tpl.html'
	})
	.otherwise({
		redirectTo: '/map'
	});
}])
// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
//.config(['$compileProvider', function ($compileProvider) {
//	$compileProvider.debugInfoEnabled(false);
//}])
;

}()); // end of 'use strict';