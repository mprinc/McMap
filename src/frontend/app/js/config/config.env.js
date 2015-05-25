(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var envs = {
	"server": {
		"server": {
			"frontend": "http://earthcube.headsware.com/app",
			"backend": "http://earthcube.headsware.com:8042",
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


// var env = envs.json;
// var env = envs.server;
var env = envs.localhost;

angular.module('Config')
	.constant("ENV", env)

}()); // end of 'use strict';