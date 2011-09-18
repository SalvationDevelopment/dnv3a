
;(function() {
"use strict";

window.LoginView = View.extend({
	id: 'loginview',
	loaded: false,
	init: function() {
		this._super();
		this.setStatus(true, 0, "");

		// Give the username field focus right after the view has been shown.
		var uinput = this.ui.find('input[name=username]');
		setTimeout(function() {
			uinput.focus();
		});

		var that = this;
		Communicator.setup(function(loaded) {
			if (loaded) {
				that.loaded = true;
			}
			else {
				that.setStatus(false, 2, "Flash could not load.");
			}
		});
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

		var that = this;
		this.setStatus(false, 1, "Logging in...");
		window.connect(user, pass, function(status) {
			if (status === 'success') {
				setView(new MenuView());
			}
			else if (status === 'password') {
				that.setStatus(true, 2, "Wrong password.");
			}
			else if (status === 'badconnect') {
				that.setStatus(false, 2, "Bad signals.");
				alert("Bad signals.");
			}
			else if (status === 'socket') {
				that.setStatus(false, 2, "Socket error.");
			}
		});
	}
});

})();
