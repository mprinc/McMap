(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var plugins = {
	"knalledgeMap": {
        active: true,
        config: {
            knalledgeMapVOsService: {
				// should map participants be broadcasted after loading map
                broadcastMapUsers: true
            },
			knAllEdgeRealTimeService: {
                available: false
            }
        }
	},
	"rima": {
        active: true,
        config: {
            rimaService: {
				available: false,
				ANONYMOUS_USER_ID: "55268521fb9a901e442172f8",
				// should the service wait for users be broadcasted from other components
				// (like KnalledgeMapVOsService) or request loading all of them?
                waitToReceiveRimaList: true
            }
        }
	},
	"request": {
        active: false,
        services: {
            requestService: {
				name: 'RequestService',
				path: 'request.RequestService'
				// icons: {
				// 	showRequests: {
				// 		position: "nw",
				// 		iconClass: "fa-bell",
				// 		action: "showRequests"
				// 	}
				// }
            }
        },
		plugins: {
			mapVisualizeHaloPlugins: ['requestService'],
			// mapInteractionPlugins: ['requestService'],
			keboardPlugins: ['requestService']
		}
	},
	"suggestion": {
        active: true,
        services: {
            suggestionService: {
				name: 'SuggestionService',
				path: 'suggestion.SuggestionService'
            }
        },
		plugins: {
		}
	},
	notify: {
		active: true,
		services: {
			NotifyNodeService: {
			}
		},
		plugins: {
			mapVisualizePlugins: ['NotifyNodeService']
		}
	}
};

if(typeof window.Config === 'undefined') window.Config = {};
window.Config.Plugins = plugins;

angular.module('Config')
	.constant("Plugins", plugins);

}()); // end of 'use strict';