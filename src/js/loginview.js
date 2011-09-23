
;(function() {
"use strict";

window.LoginView = View.extend({
	id: 'loginview',
	loaded: false,
	loginHandler: null,

	init: function() {
		this._super();
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
		if (this.loginHandler) {
			return this.loginHandler(ev, data);
		}
		return false;
	},

	connect: function(user, pass) {
		// Yup. This is how you log in to DuelingNetwork.

		function connectedListener(ev, data) {
			if (ev === 'Connected' && data.length >= 1) {
				// TODO: Do something with this?
				var admin = parseInt(data[0], 10);

				this.loginHandler = pwdListener;
				Communicator.send(['Change password', pass, pass]);
				return true;
			}

			// The first response must be 'Connected', fail otherwise.
			Communicator.closeConnection();
			this.handleError('badconnect');
			return true;
		}

		function pwdListener(ev, data) {
			if (ev === 'Change password') {
				this.loginSuccess();
				return true;
			}
			if (ev === 'Error' && data[0] === 'Invalid current password') {
				Communicator.closeConnection();
				this.handleError('password');
				return true;
			}
			return false;
		}

		Communicator.openConnection(function() {
			this.loginHandler = connectedListener;
			Communicator.send(['Connect6', user, randHex32(), randHex32()]);
		}.bind(this));
	},

	loginSuccess: function() {
		setView(new MenuView());
	}
});

})();
