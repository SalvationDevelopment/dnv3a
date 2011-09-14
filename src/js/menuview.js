
;(function() {
"use strict";

function MenuView() {}
MenuView.prototype = new View();
MenuView.prototype.id = 'menuview';
MenuView.prototype.handleMessage = function(ev, data) {
	if (ev === 'Global message') {
		console.log('[' + data[2] + '] Message from ' + data[0] + ': ' + data[1]);
		return true;
	}

	return false;
};
window.MenuView = MenuView;

})();
