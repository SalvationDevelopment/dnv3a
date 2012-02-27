
;(function() {
"use strict";

window.setupLoggedInState = function() {
	Sidebar.show();
	ChatManager.setupGlobalChat();
	OnlineList.open(true);
	Commands.show();
};

window.destroyLoggedInState = function() {
	Commands.hide();
	OnlineList.close();
	ChatManager.removeAllChats();
	Sidebar.hide();
};

window.doLogout = function() {
	destroyLoggedInState();
	Communicator.closeConnection();
	setView(new LoginView());
};

function preload() {
	new Image().src = "img/loading.gif";
	new Image().src = "img/error.png";
	new Image().src = "img/nowatch.png";
	new Image().src = "img/key.png";
	new Image().src = "img/key-nowatch.png";
}

$(function() {
	IgnoreList.load();
	Sidebar.init();
	Commands.init();
	Debug.init();
	preload();
	setView(new LoginView(true));

	// Keep the view maximized with a constant aspect ratio.
	$(window).resize(function() {
		var HWRAT = 9/16;
		var h = window.innerHeight, w = window.innerWidth;
		if (!h) {
			// We can't easily get the sizes including scrollbars in IE, so we
			// cheat and use the ones without scollbars (on page load, it's
			// probably the same).
			h = $(window).height();
			w = $(window).width();
		}
		var rat = h/w, nh = h, nw = w;
		if (rat > HWRAT) nh = w * HWRAT;
		else nw = h / HWRAT;
		$('#fullscreen').css({
			width: nw,
			height: nh,
			left: (w - nw)/2,
			top: (h - nh)/2
		});
	}).resize();
});

})();
