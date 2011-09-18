
;(function() {
"use strict";

function login(f) {
	var user = f.username.value;
	var pass = f.pwd.value;
	// TODO: Remembering usernames.
	// TODO: Validate non-emptyness of user, pass.
	connect(user, pass, function(status) {
		if (status === 'success') {
			setView(new MenuView());
		}
		else if (status === 'password') {
			alert("Wrong password.");
		}
		else if (status === 'badconnect') {
			alert("Bad signals.");
		}
		else if (status === 'socket') {
			alert("Some socket error.");
		}
	});
}

window.LoginView = View.extend({
	id: 'loginview',
	init: function() {
		this._super();
	},
	loadUI: function() {
		var f = this.ui.children('form');
		f.submit(function() {
			login(this);
			return false;
		});
	}
});

})();
