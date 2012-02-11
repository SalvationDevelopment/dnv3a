
;(function() {
"use strict";

function urlToLink(text) {
	var url;
	if (text.startsWith("http://") || text.startsWith("https://"))
		url = text;
	else
		url = "http://" + text;
	var attrHTML = url.replace(/"/g, "&quot;");
	return "<a href=\"" + attrHTML + "\" target=\"_blank\">" + text + "</a>";
}

function linkify(text) {
	var rest = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
	var out = "";

	for (;;) {
		var pos = rest.search(/( |\(|^)(http:\/\/|https:\/\/|www\.)/);
		if (pos < 0) {
			out += rest;
			break;
		}

		if (/[ (]/.test(rest.charAt(pos))) ++pos;
		out += rest.substr(0, pos);
		rest = rest.substr(pos);

		var end = rest.search(/$|,| |\.(\W|$)|\)(\.\W|\.$|[,!?)]|$)/);
		if (/\?!/.test(rest.charAt(end-1))) --end;
		out += urlToLink(rest.substr(0, end));
		rest = rest.substr(end);
	}
	return out;
}

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
			$("<span>").addClass('chat-message').html(linkify(message))
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
