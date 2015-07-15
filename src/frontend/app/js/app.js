(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/* App Module */

angular.module('McModelarApp',[
	  'ngRoute'
	, 'ngSanitize' // necessary for outputing HTML in angular directive
	// http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html
	// http://outlandish.com/blog/conditional-view-change-animations-in-angular-js/
	// https://scotch.io/tutorials/animating-angularjs-apps-ngview
	// https://docs.angularjs.org/api/ngRoute/directive/ngView
	, 'ngAnimate' // necessary for animating views
	, 'ngStorage' // local storage support for Angular

	, 'ui.bootstrap' // UI-bootstrap
	, 'btford.socket-io'

	, 'collaboPluginsServices'
	, 'collaboPluginsDirectives'

	, 'mcmMapDirectives' // KnAllEdge Map component
	, 'mcmMapServices'
	, 'knalledgeMapDirectives' // KnAllEdge Map component
	, 'knalledgeMapServices'
	, 'mcmMapsDirectives' // KnAllEdge Map component

	, 'rimaServices'
	, 'rimaDirectives'

	, 'notifyServices'
	, 'notifyDirectives'

	, 'topiChatServices'
	, 'topiChatDirectives'

])
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/map', {
		templateUrl: '../components/mcmMap/partials/mcm-index.tpl.html'
	})
	.when('/map/id/:id', {
		templateUrl: '../components/mcmMap/partials/mcm-index.tpl.html'
	})
	.when('/importAssumptions', {
		templateUrl: '../components/mcmMap/partials/mcmImportAssumptions-index.tpl.html'
	})
	.when('/importVariables', {
		templateUrl: '../components/mcmMap/partials/mcmImportVariables-index.tpl.html'
	})
	.when('/preferences', {
		templateUrl: '../components/mcmMap/partials/mcm-preferences-index.tpl.html'
	})
	.when('/maps', {
		templateUrl: '../components/mcmMaps/partials/index.tpl.html'
	})
	.otherwise({
		redirectTo: '/maps'
	});
}])

.config(["TopiChatServiceProvider", function(TopiChatServiceProvider) {
  TopiChatServiceProvider.setActive(false);
}]);


// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
//.config(['$compileProvider', function ($compileProvider) {
//	$compileProvider.debugInfoEnabled(false);
//}])
;

}()); // end of 'use strict';