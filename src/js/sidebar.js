
;(function() {
"use strict";

window.Sidebar = {
	ui: null,
	boxes: null,

	init: function() {
		this.boxes = [];
		this.makeUI();
	},

	show: function() {
		$('#sidebar').css('width', '20%').css('display', 'table-cell');
		$('#views').css('width', '80%');
	},

	hide: function() {
		$('#sidebar').css('width', '0%').css('display', 'none');
		$('#views').css('width', '100%');
	},

	makeUI: function() {
		var ui = this.ui = $("<div>");
		ui.css({
			'height': '100%',
			'border-right': '1px solid black',
			'padding': '7px'
		});
		CSS.setBorderBox(ui);
		$("#sidebar").append(ui);
	},

	add: function(param) {
		var box = $("<div>");
		param.box = box;
		box.css({
			'border': '2px solid black',
			'height': '300px',
			'border-radius': '4px'
		});

		var header = $("<div>");
		header.text(param.title);
		header.css({
			'height': '22px',
			'padding': '1px',
			'border-bottom': '1px solid black',
			'background-color': 'blue'
		});
		CSS.setBorderBox(header);
		var expandArrow = $("<span>");
		header.append(expandArrow);
		box.append(header);

		var content = param.element;
		content.height(278);
		content.css({
			'overflow-y': 'auto',
			'overflow-x': 'hidden'
		});
		CSS.setBorderBox(content);
		box.append(content);

		this.ui.append(box);

		// Find an empty spot for the box in the list, and add it there.
		var spot = this.boxes.indexOf(null);
		if (spot === -1) {
			spot = this.boxes.length;
			this.boxes.push(param);
		}
		else {
			this.boxes[spot] = param;
		}
		return spot;
	},

	remove: function(ind) {
		var param = this.boxes[ind];
		this.boxes[ind] = null;

		console.assert(param !== null);
		param.box.remove();
	}
};

})();
