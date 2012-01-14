
;(function() {
"use strict";

if (!window.console) window.console = {};
if (!console.assert) {
	console.assert = function(condition) {
		if (!condition)
			throw "Assertion failed.";
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

})();
