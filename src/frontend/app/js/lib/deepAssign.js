//https://www.npmjs.com/package/deep-assign
var deepAssign;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//var isObj = require('is-obj');

function isObj(x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};

var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Sources cannot be null or undefined');
	}

	return Object(val);
}

function assignKey(to, from, key) {
	var val = from[key];

	if (val === undefined || val === null) {
		return;
	}

	if (hasOwnProperty.call(to, key)) {
		if ((to[key] === undefined || to[key] === null) && isObj(val)) {

		/* CollaboFramework (ChaOS / Knowlede Federation : Sinisa Rudan) fix
		//original version was: `if (to[key] === undefined || to[key] === null) {`
		//but we want to be able to set non-obj values from obje to object, no matter if
		//they wer in `to` object 'null' or 'undefined'
		*/

			throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
		}
	}

	if (!hasOwnProperty.call(to, key) || !isObj(val)) {
		to[key] = val;
	} else {
		to[key] = assign(Object(to[key]), from[key]);
	}
}

function assign(to, from) {
	if (to === from) {
		return to;
	}

	from = Object(from);

	for (var key in from) {
		if (hasOwnProperty.call(from, key)) {
			assignKey(to, from, key);
		}
	}

	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(from);

		for (var i = 0; i < symbols.length; i++) {
			if (propIsEnumerable.call(from, symbols[i])) {
				assignKey(to, from, symbols[i]);
			}
		}
	}
	return to;
}

deepAssign = function deepAssign(target) {
	target = toObject(target);

	for (var s = 1; s < arguments.length; s++) {
		assign(target, arguments[s]);
	}

	return target;
};
}()); // end of 'use strict';
