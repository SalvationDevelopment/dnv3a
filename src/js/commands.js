
;(function() {
"use strict";

window.Commands = {
	ui: null,
	map: {},

	setMap: function(map) {
		this.ui.find("div").remove();
		this.map = map;
		for (var key in map) {
			$("<div>")
				.append($("<span class='key'>").text(key))
				.append(" - " + map[key][0])
				.appendTo(this.ui);
		}
	},

	keydown: function(key, shift) {
		var ch = String.charCodeAt;
		if (ch('A') <= key && key <= ch('Z')) {
			if (!shift)
				key = String.fromCharCode(key + ch('a') - ch('A'));
			if (this.map[key])
				this.map[key][1]();
		}
	},

	show: function() {
		this.ui.show();
	},

	hide: function() {
		this.ui.hide();
	},

	init: function() {
		this.ui = $("#commands");
	}
};

$(document).keydown(function(ev) {
	// We can't handle key bindings with ctrl/meta held.
	if (ev.ctrlKey || ev.metaKey)
		return;

	// If input is already going somewhere, don't use it.
	if (ev.target.nodeName === 'INPUT')
		return;

	Commands.keydown(ev.keyCode, ev.shiftKey);
});

})();
