(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/* App Module */

var requiresList = [
	  'ngRoute'
	, 'ngSanitize' // necessary for outputing HTML in angular directive
	, 'ngStorage' // local storage support for Angular
	, 'ngAnimate'

	, 'ui.bootstrap' // UI-bootstrap
	// , 'textAngular'
	// , 'textAngularSetup'
	, 'ngWizard'
	, 'btford.socket-io'

	, 'collaboPluginsServices'
	, 'collaboPluginsDirectives'

	, 'knalledgeMapServices' // KnAllEdge Map component
	, 'knalledgeMapDirectives'

	, 'mcmMapDirectives' // KnAllEdge Map component
	, 'mcmMapServices'
	, 'mcmMapsDirectives' // KnAllEdge Map component
];

requiresList.push('rimaServices');
requiresList.push('rimaDirectives');
requiresList.push('rimaFilters');

requiresList.push('loginServices');
requiresList.push('loginDirectives');

requiresList.push('notifyServices');
requiresList.push('notifyDirectives');

// requiresList.push('topiChatServices');
// requiresList.push('topiChatDirectives');

// we want to avoid hardoced registering plugins here
// requiresList.push('ontovServices');

// requiresList.push('requestServices');
// requiresList.push('suggestionServices');
// requiresList.push('changeServices');

angular.module('McModelarApp', requiresList)
// routes
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/map/id/:id', {
		templateUrl: 'components/knalledgeMap/partials/new-index.tpl.html',
		// https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
		// http://stackoverflow.com/questions/17981281/change-route-parameters-without-updating-view
		reloadOnSearch: false
	})
	.when('/mcmap', {
		templateUrl: 'components/mcmMap/partials/mcm-index.tpl.html',
	})
	.when('/mcmap/id/:id', {
		templateUrl: 'components/mcmMap/partials/mcm-main-index.tpl.html'
	})
	.when('/importAssumptions', {
		templateUrl: 'components/mcmMap/partials/mcmImportAssumptions-index.tpl.html'
	})
	.when('/importVariables', {
		templateUrl: 'components/mcmMap/partials/mcmImportVariables-index.tpl.html'
	})
	.when('/preferences', {
		templateUrl: 'components/mcmMap/partials/mcm-preferences-index.tpl.html'
	})
	.when('/maps', {
		templateUrl: 'components/mcmMaps/partials/index.tpl.html'
	})

	// http://localhost:8410/app/index-dev.html#/login/iAmId
	.when('/login', {
		templateUrl: 'components/login/partials/index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/register
	.when('/register', {
		templateUrl: 'components/login/partials/register-index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/login/iAmId
	.when('/login/iAmId/:iAmId?', {
		templateUrl: 'components/login/partials/index.tpl.html'
	})
	// https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
	// http://stackoverflow.com/questions/17510962/can-angularjs-routes-have-optional-parameter-values
	// http://localhost:8410/app/index-dev.html#/login/iAmId/55268521fb9a901e442172f8/token/1/route/whoAmI
	.when('/login/iAmId/:iAmId/token/:token?/route/:route?', {
		templateUrl: 'components/login/partials/index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/logout
	.when('/logout', {
		templateUrl: 'components/login/partials/logout-index.tpl.html'
	})
	// http://localhost:8410/app/index-dev.html#/whoAmI
	.when('/whoAmI', {
		templateUrl: 'components/rima/partials/rima-whoAmI.tpl.html'
	})

	.otherwise({
		redirectTo: '/maps'
	});
}])

// .config(["TopiChatServiceProvider", function(TopiChatServiceProvider) {
//   TopiChatServiceProvider.setActive(false);
// }]);


// Disabling Debug Data
// https://docs.angularjs.org/guide/production#disabling-debug-data
//.config(['$compileProvider', function ($compileProvider) {
//	$compileProvider.debugInfoEnabled(false);
//}])
;

}()); // end of 'use strict';
