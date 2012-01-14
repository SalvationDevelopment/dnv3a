
;(function() {
"use strict";

var Chat = Class.extend({
	ui: null,
	sidebarHandle: null,

	init: function(title) {
		this.ui = $("<div>").addClass('chat');

		this.sidebarHandle = Sidebar.add({
			title: title,
			element: this.ui
		});
	},

	close: function() {
		Sidebar.remove(this.sidebarHandle);
	},

	addMessage: function(from, message, color) {
		var el = this.ui[0];
		var scrollToBottom = (el.scrollTop + el.offsetHeight === el.scrollHeight);

		$("<div>").addClass('chat-line').append(
			$("<span>").addClass('chat-author').css('color', color).text(from + ": ")
		).append(
			$("<span>").addClass('chat-message').text(message)
		).appendTo(this.ui);

		if (scrollToBottom)
			el.scrollTop = el.scrollHeight;
	}
});

window.ChatManager = {
	locked: true,
	globalChat: null,

	openGlobalChat: function() {
		if (!this.globalChat) {
			this.globalChat = new Chat('Global chat');
		}
		return this.globalChat;
	},

	removeAllChats: function() {
		if (this.globalChat) {
			this.globalChat.close();
			this.globalChat = null;
		}
	},

	openUserChat: function(user) {
		return;
	},

	handleMessage: function(ev, data) {
		if (ev === 'Chat unlock') {
			this.locked = false;
			return true;
		}
		if (ev === 'Global message') {
			// TODO: Make a better color choice.
			var st = parseInt(data[2], 10);
			var col = (st === 0 ? 'black' : 'darkblue');
			this.openGlobalChat().addMessage(data[0], data[1], col);
			return true;
		}
		return false;
	}
};

})();
