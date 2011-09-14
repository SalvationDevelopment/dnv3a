
;(function() {
"use strict";

function MenuView() {}
MenuView.prototype = new View();
MenuView.prototype.id = 'menuview';
MenuView.prototype.handleMessage = function(ev, data) {
	if (ev === 'Global message') {
		console.log('[' + msg[2] + '] Message from ' + msg[0] + ': ' + msg[1]);
		return true;
	}

	return false;
};
window.MenuView = MenuView;

})();
