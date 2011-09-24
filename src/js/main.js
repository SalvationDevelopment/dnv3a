
;(function() {
"use strict";

$(function() {
	setView(new LoginView());

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
		$("#fullscreen").css({
			width: nw,
			height: nh,
			left: (w - nw)/2,
			top: (h - nh)/2
		});
	}).resize();
});

})();
