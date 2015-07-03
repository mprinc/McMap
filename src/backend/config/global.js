'use strict';

var path = require('path');

console.log("Setting up global for earthcube");

// expose this function to our app using module.exports
if (!global.hasOwnProperty('paths')) {
	console.log("Setting up global.paths");
	global.paths = {
		// local
		EXPERIMENTS_FOLDER: path.resolve(__dirname+"/../../../../experiments")
		// server
		// EXPERIMENTS_FOLDER: path.resolve("/var/www_support/bukvik/experiments/experiments-zns")
	};
	global.paths.DATASET_FOLDER = path.resolve(global.paths.EXPERIMENTS_FOLDER + "/data");
	global.paths.FOLDER_OUT = path.resolve(global.paths.DATASET_FOLDER + "/out");
	global.paths.FOLDER_CACHE = path.resolve(global.paths.EXPERIMENTS_FOLDER + "/cache");
}

if (!global.hasOwnProperty('dbConfig')) {
	console.log("Setting up global.dbConfig");
	global.dbConfig = {
		// name: "EarthCube"
		name: "KnAllEdge"
	};
}

// module.exports = global.paths;
module.exports = global;