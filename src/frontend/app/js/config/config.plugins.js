(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var plugins = {
	"ViewComponents": {
		"knalledgeMap.Main": {
			components: {
				TopPanel: {
					active: false,
					path: "/components/topPanel/topPanel"
				}
			}
		},
		"knalledgeMap.KnalledgeMapTools": {
			components: {
				GardeningControls: {
					active: true,
					path: "/components/gardening/gardening-controls.component"
				},
				RimaUsersList: {
					active: true,
					path: "/components/rima/rimaUsersList"
				},
				IbisTypesList: {
					active: false,
					path: "/components/knalledgeMap/ibisTypesList"
				}
			}
		}
	},
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
	"topPanel": {
        active: false,
        config: {
            suggestion: {
				available: false
            },
			request: {
				available: false
            },
        }
	},
	"mapsList": {
		active: true,
		config: {
			title: 'MCM',
			//map_path,
			//
			openMap: {
				routes: [{
					route: 'mcmap',
					name: 'McM-map',
					icon: ''
				}, {
					route: 'map',
					name: 'map',
					icon: ''
				}]
			}
		}
	},
	"ontov": {
        active: false
	},
	"rima": {
        active: true,
        config: {
            rimaService: {
				available: true,
				ANONYMOUS_USER_ID: "55268521fb9a901e442172f8",
				ANONYMOUS_USER_NAME: "Anonymous",
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
	},
	gardening: {
		active: true,
		services: {
			ApprovalNodeService: {
			}
		},
		plugins: {
			mapVisualizePlugins: ['ApprovalNodeService']
		}
	}
};

if(typeof window.Config === 'undefined') window.Config = {};
window.Config.Plugins = plugins;

angular.module('Config')
	.constant("Plugins", plugins);

}()); // end of 'use strict';
