
;(function() {
"use strict";

window.messages = [];
window.Debug = {
	holder: null,
	cont: null,
	filterField: null,
	filter: '',

	isSpam: function(ev, data, sending) {
		// Tweak to whatever fits.
		if (ev === 'Heartbeat')
			return true;
		if (ev === 'Online users' || ev === 'Offline users')
			return true;
		if (ev === 'Add duels' || ev === 'Remove duels')
			return true;
		if (ev === 'Add watches' || ev === 'Remove watches')
			return true;
		if (ev === 'Global message' && !sending)
			return true;
		return false;
	},

	init: function() {
		var ui = $('<div>');
		this.holder = $('<div>').addClass('debug-holder border-box')
			.appendTo(ui);
		this.cont = $('<div>').addClass('debug-cont border-box')
			.appendTo(this.holder);
		this.filterField = $('<input>').addClass('debug-filter border-box')
		    .prop('value', '').appendTo(this.holder);

		this.cont.on('click', '.debug-row', function() {
			$(this).toggleClass('expand');
		});

		var that = this;
		this.filterField.on('input', function() {
			var el = that.cont[0];
			var scrollToBottom = (el.scrollTop + el.offsetHeight === el.scrollHeight);

			var filt = that.filter = this.value;
			that.cont.children().each(function() {
				$(this).toggle(this.textContent.indexOf(filt) !== -1);
			});

			if (scrollToBottom)
				el.scrollTop = el.scrollHeight;
		});

		Sidebar.add({
			title: "Debug log",
			element: ui
		});

		ui.parent().height(200);
	},

	handleMessage: function(ev, data, sending) {
		messages.push([(sending ? 'SEND ' : '') + ev].concat(data));
		if (this.isSpam(ev, data, sending)) return;

		var el = this.cont[0];
		var scrollToBottom = (el.scrollTop + el.offsetHeight === el.scrollHeight);

		var row = $('<div>').addClass('debug-row').append(
			$('<span>').addClass('debug-ev').text(ev + (data.length ? "; " : ""))
		).append(
			$('<span>').text(data.join(","))
		).appendTo(this.cont);

		var obj = row[0];
		if (sending) {
			row.css('color', 'darkgreen');
		}

		if (obj.textContent.indexOf(this.filter) === -1) {
			row.hide();
		}

		if (scrollToBottom)
			el.scrollTop = el.scrollHeight;
	},

	interceptSentMessages: function() {
		var orig = Communicator.send.bind(Communicator);
		Communicator.send = function(ar) {
			Debug.handleMessage(ar[0], ar.slice(1), true);
			orig(ar);
		};
	}
};

})();
