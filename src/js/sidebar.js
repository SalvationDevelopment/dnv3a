
;(function() {
"use strict";

window.Sidebar = {
	ui: null,
	boxes: null,
	ind: 0,

	init: function() {
		this.boxes = {};
		this.ind = 0;

		this.ui = $('<div>').addClass('sidebar-ui border-box');
		$('#sidebar').append(this.ui);
	},

	show: function() {
		$('#sidebar').css('width', '20%').css('display', 'table-cell');
		$('#views').css('width', '80%');
	},

	hide: function() {
		$('#sidebar').css('width', '0%').css('display', 'none');
		$('#views').css('width', '100%');
	},

	add: function(param) {
		var box = param.box = $('<div>').addClass('sidebar-box');

		$("<div>").addClass('sidebar-title border-box').text(param.title)
			.appendTo(box);

		param.element.addClass('sidebar-content border-box').appendTo(box);

		this.ui.append(box);

		// Find an empty spot for the box in the list, and add it there.
		var handle = 'handle' + (this.ind++);
		this.boxes[handle] = param;
		return handle;
	},

	remove: function(handle) {
		var param = this.boxes[handle];
		delete this.boxes[handle];

		console.assert(param !== null);
		param.box.remove();
	}
};

})();
