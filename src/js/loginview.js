
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

function LoginView() {
	var f = $('#' + this.id + '>form');
	if (f.data('loaded') !== 'yes') {
		f.data('loaded', 'yes');
		f.submit(function() {
			login(this);
			return false;
		});
	}
}
LoginView.prototype = new View();
LoginView.prototype.id = 'loginview';
window.LoginView = LoginView;

})();
