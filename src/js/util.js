
;(function() {
"use strict";

if (!window.console) window.console = {};
if (!console.assert) {
	console.assert = function(condition, msg) {
		if (!condition) {
			msg = "Assertion failure" + (msg ? ": " + msg : ".");
			var err = new Error(msg);
			var stack = err.stack || err.stacktrace || err.message;
			console.error(msg + "\n" + stack);
			throw err;
		}
	};
}
if (!console.assertNotReached) {
	console.assertNotReached = function(msg) {
		console.assert(0, msg);
	};
}


window.randTo = function(to) {
	return Math.floor(Math.random() * 16);
};

window.randHex32 = function() {
	var ret = '';
	for (var i = 0; i < 32; ++i) {
		ret += randTo(16).toString(16);
	}
	return ret;
};

// Calculate a%b, returning something in [0, b) even if a is negative.
window.modulo = function(a, b) {
	var res = a%b;
	return (res >= 0 ? res : res + b);
};

// Function.prototype.bind polyfill, taken from MDN.
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") // closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");

		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));    
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}

window.Listenable = Class.extend({
	cbMap: null,
	cbInd: 0,

	init: function() {
		this.cbMap = {};
	},

	listen: function(callback) {
		var handler = 'cb' + (this.cbInd++);
		this.cbMap[handler] = callback;
		return handler;
	},

	unlisten: function(handler) {
		delete this.cbMap[handler];
	},

	dispatch: function() {
		for (var handler in this.cbMap) {
			var cb = this.cbMap[handler];
			cb.apply(cb, arguments);
		}
	},

	getSingleDispatcher: function(handler) {
		return this.cbMap[handler];
	}
});

})();
