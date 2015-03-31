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
					width: 100,
					height: 50
				}
			}
		}
	},
	view: {
		viewspec: 'viewspec_manual'
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
};

//var env = envs['json'];
// var env = envs.json;
var env = envs.server;

angular.module('Config', [])
	.constant("ENV", env)
	.constant("ConfigMap", map)
	.constant("ConfigMapToolset", mapToolset);

}()); // end of 'use strict';