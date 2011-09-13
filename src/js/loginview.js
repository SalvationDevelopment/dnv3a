
;(function() {

function LoginView() {}
LoginView.prototype = new View();
LoginView.prototype.id = 'loginview';
LoginView.prototype.login = function(f) {
	var user = f.username.value;
	var pass = f.pwd.value;
	// TODO: Remembering usernames.
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
};
window.LoginView = LoginView;

})();
