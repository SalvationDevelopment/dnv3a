
;(function() {
"use strict";

function keyToString(key, shift) {
	var ch = String.charCodeAt;
	if (ch('A') <= key && key <= ch('Z')) {
		return String.fromCharCode(key + (shift ? 0 : ch('a') - ch('A')));
	}
	if (key === 37) return "left";
	if (key === 38) return "up";
	if (key === 39) return "right";
	if (key === 40) return "down";
	return null;
}

window.Commands = {
	ui: null,
	obj: null,
	map: {},

	setMap: function(obj, ar) {
		this.ui.find("div").remove();
		this.obj = obj;
		var map = {};
		for (var i = 0; i < ar.length; ++i) {
			var mapping = ar[i];
			var key = mapping[0], text = mapping[1], func = mapping[2];
			map[key] = func;

			// Skip hidden entries.
			if (text === "") continue;

			$("<div>")
				.append($("<span class='key'>").text(key))
				.append(" - " + text)
				.appendTo(this.ui);
		}
		this.map = map;
	},

	keydown: function(key, shift) {
		key = keyToString(key, shift);
		if (key && this.map[key]) {
			this.map[key].call(this.obj);
			return true;
		}
		return false;
	},

	show: function() {
		this.ui.show();
	},

	hide: function() {
		this.ui.hide();
	},

	init: function() {
		this.ui = $("#commands").addClass('border-box');
	}
};

$(document).keydown(function(ev) {
	// We can't handle key bindings with ctrl/meta held.
	if (ev.ctrlKey || ev.metaKey)
		return;

	// If input is already going somewhere, don't use it.
	if (ev.target.nodeName === 'INPUT')
		return;

	var used = Commands.keydown(ev.keyCode, ev.shiftKey);
	if (used)
		ev.preventDefault();
});

})();
