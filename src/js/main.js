
;(function() {

$(function() {
	setView(new LoadingView());
	Communicator.setup(function(loaded) {
		if (loaded) {
			setView(new LoginView());
		}
		else {
			setView(new ErrorView("Flash could not load!"));
		}
	});
});

})();
