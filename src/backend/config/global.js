'use strict';

var path = require('path');

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
module.exports = global.paths;