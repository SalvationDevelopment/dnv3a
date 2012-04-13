
;(function() {
"use strict";

function urlToLink(text) {
	var url;
	if (text.startsWith('http://') || text.startsWith('https://'))
		url = text;
	else
		url = 'http://' + text;
	var attrHTML = url.replace(/"/g, '&quot;');
	return '<a href="' + attrHTML + '" target="_blank">' + text + '</a>';
}

function linkify(text) {
	var rest = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
	var out = '';

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

var Chat = SidebarWidget.extend({
	sidebarHandle: null,
	ignoreHandle: null,

	holder: null,
	cont: null,
	chatField: null,

	init: function(title, order) {
		this.title = title;
		this.order = order;

		this.ui = $('<div>').addClass('chat');
		this.holder = $('<div>').addClass('sidebar-box-holder border-box')
			.appendTo(this.ui);
		this.cont = $('<div>').addClass('sidebar-box-cont border-box')
			.appendTo(this.holder);
		this.chatField = $('<input>').addClass('sidebar-box-field border-box')
		    .prop('value', '').attr('placeholder', "Reply...").appendTo(this.holder);

		this.chatField.keydown(function(e) {
			if (e.which === 13) this.send();
		}.bind(this));

		this.ignoreHandle = IgnoreList.listen(this.ignoreListener.bind(this));
	},

	destroy: function() {
		IgnoreList.unlisten(this.ignoreHandle);
	},

	send: function() {
		var value = this.chatField.attr('value');
		if (ChatManager.locked || !value)
			return;
		ChatManager.locked = true;
		Communicator.send(['Global message', value]);
		this.chatField.attr('value', '');
	},

	ignoreListener: function(ev, name) {
		if (ev === 'add') {
			this.ui.find('div').each(function() {
				if ($(this).find('.chat-author').text() === name + ": ") {
					$(this).remove();
				}
			});
		}
	},

	shown: function() {
		var el = this.cont[0];
		el.scrollTop = el.scrollHeight;
	},

	addMessage: function(from, message, color) {
		if (IgnoreList.has(from))
			return;

		var el = this.cont[0];
		var scrollToBottom = (this.isVisible() &&
			el.scrollTop + el.offsetHeight === el.scrollHeight);

		var line = $('<div>').addClass('chat-line').append(
			$('<span>').addClass('chat-author').css('color', color).text(from + ": ")
		).append(
			$('<span>').addClass('chat-message').html(linkify(message))
		).appendTo(this.cont);

		addUserContextMenu(line, from);

		if (scrollToBottom)
			el.scrollTop = el.scrollHeight;
	}
});

window.ChatManager = {
	locked: true,
	globalChat: null,

	setupGlobalChat: function() {
		console.assert(!this.globalChat);
		this.globalChat = new Chat("Global chat", 'a');
		this.globalChat.open(true);
	},

	removeAllChats: function() {
		console.assert(this.globalChat);
		this.globalChat.destroy();
		this.globalChat = null;
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
			var from = data[0], message = data[1];
			var user = Users.getUser(from);
			console.assert(user);
			this.globalChat.addMessage(from, message, user.getColor());
			return true;
		}
		if (ev === 'Chat error') {
			if (data[0] !== 'Quick chat')
				this.locked = false;
			return false;
		}
		return false;
	}
};

})();
