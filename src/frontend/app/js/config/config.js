(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var envs = {
	"server": {
		"server": {
			"frontend": "http://headsware.com/mcm/McMap/app",
			"backend": "http://headsware.com/mcm/McMap/app/data",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"localhost": {
		"server": {
			"frontend": "http://localhost:8310/app",
			"backend": "http://localhost:8042",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"json": {		
		"server": {
			"frontend": "http://localhost:8310/app",
			"backend": "http://localhost:8310/app/data",
			"parseResponse": false
		}
	}
};

var map = {
	nodes: {
		html: {
			show: true,
			refCategory: 'map_entity',
			dimensions: {
				sizes: {
					y: 10,
					x: 50,
					width: 150,
					height: 100
				},
				margines: {
					top: 35,
					right: 35,
					bottom: 35,
					left: 35
				}
			}
		}
	},
	edges: {
		show: false,
		labels: {
			show: true
		}
	},
	tree: {
		margin: {
			top: 10,
			left: 20,
			right: 100,
			bottom: 10
		}
	},
	interaction: {
		resizingConfig: {
			target: {
				refClass: 'resizable_map_entity',
				opacity:  0.5,
				zIndex: 10,
				cloningContainer: null, // getting native dom element from jQuery selector (set in code)
				leaveAtDraggedPosition: true,
				callbacks: {
					onend: null, // (set in code)
				}
			},
			debug: {
				size: false
			}
		},
		draggingConfig: {
			draggTargetElement: true,
			target: {
				refCategory: '.draggable_map_entity',
				opacity:  0.5,
				zIndex: 10,
				cloningContainer: null, // getting native dom element from jQuery selector (set in code)
				leaveAtDraggedPosition: true,
				updateDatumPosition: null, //  (set in code)
				callbacks: {
					onend: null //  (set in code)
				}
			},
			debug: {
				origVsClone: false
			}
		},
		draggingInConfig: {
			dropzone: {
				refCategory: '.dropzone',
				overlap: 0.5,
				dragenteredClass: 'drop-target',
				activeClass: 'drop-active'
			},
			draggable: {
				refCategory: '.yes-drop',
				candropClass: 'can-drop',
				messages: {
					in: 'Dragged in',
					out: 'Dragged out',
					dropped: 'Dropped'
				},
				callbacks: {
					onend: null //  (set in code)
				}
			},
			debug: {
				draggingStatus: false
			}
		}
	},
	keyboardInteraction: {
		enabled: true
	},
	view: {
		viewspec: 'viewspec_manual',
		childsRelativePositions: true
	},
	transitions: {
		enter: {
			duration: 1000,
			// if set to true, entering elements will enter from the node that is expanding
			// (no matter if it is parent or grandparent, ...)
			// otherwise it elements will enter from the parent node
			referToToggling: false,
			animate: {
				position: false,
				opacity: true
			}
		},
		update: {
			duration: 500,
			referToToggling: false,
			animate: {
				position: false,
				opacity: true
			}
		},
		exit: {
			duration: 750,
			// if set to true, exiting elements will exit to the node that is collapsing
			// (no matter if it is parent or grandparent, ...)
			// otherwise it elements will exit to the parent node
			referToToggling: false,
			animate: {
				position: false,
				opacity: true
			}
		}
	}
};

var mapToolset = {
	nodes: {
		html: {
			refCategory: 'tool_entity',
			dimensions: {
				sizes: {
					y: 0,
					x: 0,
					width: "100%",
					height: "50px"
				}
			}
		}
	},
	interaction: {
		draggingInConfig: {
			dropzone: {
				refCategory: '.dropzone',
				overlap: 0.5,
				dragenteredClass: 'drop-target',
				activeClass: 'drop-active'
			},
			draggable: {
				refCategory: '.yes-drop',
				candropClass: 'can-drop',
				messages: {
					in: 'Dragged in',
					out: 'Dragged out',
					dropped: 'Dropped'
				},
				callbacks: {
					onend: null //  (set in code)
				}
			},
			debug: {
				draggingStatus: false
			}
		}
	},
	view: {
	},
	transitions: {
		enter: {
			duration: 1000,
			// if set to true, entering elements will enter from the node that is expanding
			// (no matter if it is parent or grandparent, ...)
			// otherwise it elements will enter from the parent node
			referToToggling: false,
			animate: {
				position: false,
				opacity: true
			}
		},
		update: {
			duration: 500,
			referToToggling: false,
			animate: {
				position: false,
				opacity: true
			}
		},
		exit: {
			duration: 750,
			// if set to true, exiting elements will exit to the node that is collapsing
			// (no matter if it is parent or grandparent, ...)
			// otherwise it elements will exit to the parent node
			referToToggling: false,
			animate: {
				position: false,
				opacity: true
			}
		}
	}
};

//var env = envs['json'];
// var env = envs.json;
// var env = envs.server;
var env = envs.localhost;

angular.module('Config', [])
	.constant("ENV", env)
	.constant("ConfigMap", map)
	.constant("ConfigMapToolset", mapToolset);

}()); // end of 'use strict';