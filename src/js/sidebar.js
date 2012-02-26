
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
		
		var that = this;
		$('#sidebar').on('click', '.sidebar-minimize-button', function() {
			var param = $(this).parents('.sidebar-box').data('param');
			that.toggleVisibility(param);
		});
	},

	show: function() {
		$('#sidebar').css('width', '20%').css('display', 'table-cell');
		$('#views').css('width', '80%');
	},

	hide: function() {
		$('#sidebar').css('width', '0%').css('display', 'none');
		$('#views').css('width', '100%');
	},

	toggleVisibility: function(param) {
		param.box.toggleClass('open');
		this.layout();
	},

	layout: function() {
		var boxes = this.ui.find('.sidebar-box');
		var nvisible = boxes.filter('.open').length;
		var spacing = 7;
		var unavailableHeight = spacing * boxes.length;
		boxes.filter(':not(.open)').css('height', '').each(function() {
			unavailableHeight += $(this).outerHeight();
		});
		var calcExpr = 'calc((100% - ' + unavailableHeight + 'px) / ' + nvisible;
		boxes.filter('.open')
			.css('height', '-moz-' + calcExpr)
			.css('height', calcExpr);
	},

	add: function(param) {
		var box = param.box = $('<div>').addClass('sidebar-box border-box open');
		box.data('param', param);

		$('<div>').addClass('sidebar-title border-box').text(param.title)
			.append(
				$('<div>').addClass('sidebar-minimize-button')
			).appendTo(box);

		param.element.addClass('sidebar-content border-box').appendTo(box);

		// Add the box at the right place sorted by 'order'.
		var greaterBoxes = this.ui.children().filter(function() {
			return param.order < $(this).data('param').order;
		});
		if (greaterBoxes.length)
			box.insertBefore(greaterBoxes[0]);
		else
			this.ui.append(box);

		this.layout();

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
