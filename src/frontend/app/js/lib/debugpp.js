/**
debugpp
Copyright(c) 2015-2016 Sasha Rudan <mprinc@gmail.com>
MIT Licensed
Augmented (namespaces, ...) debug nodejs package
*
```js
var debugpp = require('debugpp');
```
*/

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
@description
## Info
This package extends debug package @see {@link https://www.npmjs.com/package/debug}.

## Dependencies
This module requires [debug module]{@link https://www.npmjs.com/package/debug} (please check also the @see {@link https://github.com/visionmedia/debug | debug github})
@module module:debugpp
@requires module:debug
*/

var debug = (typeof global !== 'undefined' && global.debug) || (typeof window !== 'undefined' && window.debug);

if(typeof require !== 'undefined'){
	debug = require('debug');
}
/* istanbul ignore if  */
if(!debug){
	throw new Error("Missing dependency: debug");
}

/**
 * @external debug
 * @see [debug (npm)]{@link https://www.npmjs.com/package/debug} & [debug (github)]{@link https://github.com/visionmedia/debug}
 */


/**

Example

```js
debug.enable('worker:*');
debug.enable('worker:b');
debug.enable('worker:*:b');
```

Examples with localStorage
```js
localStorage.debug = 'worker:*';
localStorage.debug = 'worker:*:log';
localStorage.debug = '*';
localStorage.debug = 'cw.background.*.error';
localStorage.debug = 'cw.background';
localStorage.debug = 'cw.background.*.error; cw.model.data.*.error';
localStorage.debug = 'cw.background.*.*; cw.model.ContextModel.*; cw.model.CWModel.*; cw.tabs.TabsView.*';
```
*/

var debugpp = (function() {

	/*
	@exports debugpp
	*/
	var debugpp = {
		author: 'Sasha Mile Rudan (mPrinC) <mprinc@gmail.com>',
		name: 'debugpp',
		desc: 'Augmented (namespaces, ...) debug nodejs package',
		version: '1.0.0'
	};

	/**
	Creates a new debug
	@memberof debugpp#
	@function debug
	@param {string} namespace - namespace of debugger (both ':' and '.' are possible for namespacing)
	@param {boolean} [enable] - if set to true enables namespace,
		if set to false disables namespace, if ommited follows external settings (localStorage, DEBUG, ...)
	@returns {debugpp} semantic-namespaced debug (log, warn, error)
	*/
	debugpp.debug = function(namespace, enable){
		namespace = namespace.replace(/\./g, ':');

		if(enable){
			this.enableExt(namespace, true);
		}else if(typeof enable === 'boolean' && enable === false){
			this.disableExt(namespace, true);
		}

		var def = debug(namespace);
		def.log = debug(namespace+':log');
		def.warn = debug(namespace+':warn');
		def.error = debug(namespace+':error');

		return def;
	};

	/**
	Enables namespace
	@memberof debugpp#
	@function enableExt
	@param {string} namespace - namespace of debugger (both ':' and '.' are possible for namespacing)
	to enable semantic subnamespace just provide it as a subspace, for example:
	```js
	enableExt('test:log');
	enableExt('test:*');
	```
	@param {string} [enableSubspaces=true] - if set to true it will enable subspaces (log, warn, error)
	*/
	debugpp.enableExt = function(namespace, enableSubspaces){
		var namespace = namespace.replace(/\./g, ':');
		debug.enable(namespace);
		/* istanbul ignore else  */
		if(enableSubspaces !== false){
			namespace += ':*';
			debug.enable(namespace);
		}
	};

	/**
	Disables namespace
	@memberof debugpp#
	@function enableExt
	@param {string} namespace - namespace of debugger (both ':' and '.' are possible for namespacing)
	to disable semantic subnamespace just provide it as a subspace, for example:
	```js
	enableExt('test.log');
	enableExt('test.*');
	enableExt('test:*');
	```
	@param {string} [disableSubspaces=true] - if set to true it will disable subspaces (log, warn, error)
	*/
	debugpp.disableExt = function(namespace, disableSubspaces){
		namespace = namespace.replace(/\./g, ':');
		debug.disable(namespace);
		if(disableSubspaces !== false){
			namespace += '.*';
			debug.disable(namespace);
		}
	};

	var localStorageDebug = localStorage && localStorage.debug;

	// register internal debugger stream
	debug.enable('debugPP');
	debugpp._internal = debug('debugPP');

	// enable debugger streams
	if(typeof localStorage !== 'undefined'){
		debugpp._internal("localStorage exists. localStorage.debug: %, localStorage.debugpp: %", localStorage.debug, localStorage.debugpp);

		// work nicely with debug
		if(!localStorage.debugpp && localStorageDebug) localStorage.debugpp = localStorageDebug;

		var debugNSs = (typeof localStorage.debugpp !== 'undefined') ? localStorage.debugpp.split(";") : ['*'];
		for(var nsi in debugNSs){
			var ns = debugNSs[nsi].trim();
			debugpp._internal("Enabling namespace: %s", ns);

			debugpp.enableExt(ns);
		}
	}

	debugpp._internal("Debug is extended");

	return debugpp;
})();

if(typeof global !== 'undefined') global.debugpp = debugpp;

// node.js world
if(typeof module !== 'undefined'){
	module.exports = (function() {
		return debugpp;
	})();
}
if(typeof window != 'undefined'){
	window.debugpp = debugpp;
}

}()); // end of 'use strict';
