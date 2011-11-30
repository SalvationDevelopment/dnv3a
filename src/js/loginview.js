
;(function() {
"use strict";

window.LoginView = View.extend({
	id: 'loginview',
	loaded: false,

	init: function() {
		this._super();
		Sidebar.close();
		this.setStatus(true, 0, "");

		// Give the username field focus right after the view has been shown.
		var uinput = this.ui.find('input[name=username]');
		setTimeout(function() {
			uinput.focus();
		});

		Communicator.setup(function(loaded) {
			if (loaded) {
				this.loaded = true;
			}
			else {
				this.setStatus(false, 2, "Flash could not load.");
			}
		}.bind(this));
	},

	loadUI: function() {
		var f = this.ui.find('form');
		var that = this;
		f.submit(function() {
			that.login(this);
			return false;
		});
	},

	setStatus: function(active, st, text) {
		var submit = this.ui.find('input[type=submit]');
		var loading = $('#loadingstatus');
		submit.attr('disabled', !active);
		loading.children('span').text(text);

		var ind = loading.children('img');
		if (st === 1)
			ind.attr('src', "img/loading.gif");
		if (st === 2)
			ind.attr('src', "img/error.png");

		if (st === 0)
			loading.hide();
		else
			loading.slideDown("slow");
	},

	login: function(f) {
		if (!this.loaded) return;

		var user = f.username.value;
		var pass = f.pwd.value;

		// Silently fail on empty usernames and passwords.
		if (user === '' || pass === '') return;

		// TODO: Remember usernames.

		this.setStatus(false, 1, "Logging in...");
		this.connect(user, pass);
	},

	handleError: function(err) {
		if (err === 'password') {
			this.setStatus(true, 2, "Wrong password.");
		}
		else if (err === 'close') {
			this.setStatus(true, 2, "Invalid username.");
		}
		else {
			this.setStatus(true, 2, "Socket error (" + err + ").");
		}
	},

	handleMessage: function(ev, data) {
		if (ev === 'Connected' && data.length >= 1) {
			// TODO: Do something with this?
			var admin = parseInt(data[0], 10);

			this.loginSuccess();
			return true;
		}
		else {
			// Anything else must mean we have an incorrect password.
			Communicator.closeConnection();
			this.handleError('password');
		}
		return true;
	},

	connect: function(user, pass) {
		Communicator.openConnection(function() {
			Communicator.send(['Connect9', user, hex_md5(pass), randHex32()]);
		});
	},

	loginSuccess: function() {
		setView(new MenuView());
		Sidebar.open();

		// Show the global chat.
		ChatManager.openGlobalChat();
	}
});

})();
