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

if(window.Config.Plugins.puzzles.rima.config.rimaService.available){
	requiresList.push('rimaServices');
	requiresList.push('rimaDirectives');
	requiresList.push('rimaFilters');
}

requiresList.push('loginServices');
requiresList.push('loginDirectives');

requiresList.push('notifyServices');
requiresList.push('notifyDirectives');

requiresList.push('gardeningServices');

requiresList.push('topiChatServices');
// requiresList.push('topiChatDirectives');

// we want to avoid hardoced registering plugins here

// requiresList.push('requestServices');
// requiresList.push('suggestionServices');
requiresList.push('changeServices');

// This code loads all external puzzles-containers and scans for any ng1 module
// and adds it as a requirement to the main module
for(var puzzlesContainerName in window.Config.Plugins.external){
	var puzzlesContainer = window.Config.Plugins.external[puzzlesContainerName];

	for(var puzzleName in puzzlesContainer.puzzles){
		var puzzle = puzzlesContainer.puzzles[puzzleName];
		if(!puzzle.active) continue;

		for(var serviceName in puzzle.services){
			var service = puzzle.services[serviceName];
			if(!service.isNG2 || service.isAvailableInNG1){
				if(requiresList.indexOf(service.module) < 0){
					console.info("[app] adding module: ", service.module);
					requiresList.push(service.module);
				}
			}
		}
	}
}

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
	.when('/maps-old', {
		templateUrl: 'components/mcmMaps/partials/index.tpl.html'
	})
	.when('/maps', {
		templateUrl: 'components/mapsList/partials/maps-list-index.tpl.html'
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
