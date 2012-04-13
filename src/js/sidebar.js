
;(function() {
"use strict";

window.SidebarWidget = Class.extend({
	order: '',
	title: '',
	ui: null,
	box: null,
	handle: null,

	shown: function() {},

	hidden: function() {},


	open: function(shown) {
		if (this.isOpen())
			return;
		Sidebar.add(this);
		if (shown)
			this.show();
	},

	close: function() {
		if (!this.isOpen())
			return;
		this.hide();
		Sidebar.remove(this);
	},

	isOpen: function() {
		return (!!this.box);
	},


	show: function() {
		if (this.isVisible())
			return;
		this.box.addClass('open');
		this.shown();
		Sidebar.layout();
	},

	hide: function() {
		if (!this.isVisible())
			return;
		this.box.removeClass('open');
		this.hidden();
		Sidebar.layout();
	},

	isVisible: function() {
		console.assert(this.isOpen());
		return this.box.hasClass('open');
	},

	toggleVisibility: function() {
		if (this.isVisible())
			this.hide();
		else
			this.show();
	}
});

window.Sidebar = {
	ui: null,

	init: function() {
		this.ui = $('<div>').addClass('sidebar-ui border-box');
		$('#sidebar').append(this.ui);
		
		var that = this;
		$('#sidebar').on('click', '.sidebar-minimize-button', function() {
			var widget = $(this).parents('.sidebar-box').data('widget');
			widget.toggleVisibility();
		});
	},

	show: function() {
		$('#sidebar').css('width', '18%').css('display', 'table-cell');
		$('#views').css('width', '82%');
	},

	hide: function() {
		$('#sidebar').css('width', '0%').css('display', 'none');
		$('#views').css('width', '100%');
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

	add: function(widget) {
		var box = widget.box = $('<div>').addClass('sidebar-box border-box');
		box.data('widget', widget);

		$('<div>').addClass('sidebar-title border-box').text(widget.title)
			.append(
				$('<div>').addClass('sidebar-minimize-button')
			).appendTo(box);

		widget.ui.addClass('sidebar-content border-box').appendTo(box);

		// Add the box at the right place sorted by 'order'.
		var greaterBoxes = this.ui.children().filter(function() {
			return widget.order < $(this).data('widget').order;
		});
		if (greaterBoxes.length)
			box.insertBefore(greaterBoxes[0]);
		else
			this.ui.append(box);

		this.layout();
	},

	remove: function(widget) {
		widget.box.remove();
		widget.box = null;

		this.layout();
	}
};

})();
