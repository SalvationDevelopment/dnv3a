
;(function() {
"use strict";

window.MenuView = View.extend({
	id: 'menuview',
	init: function() {
		this._super();
	},
	handleMessage: function(ev, data) {
		if (ev === 'Global message') {
			console.log('[' + data[2] + '] Message from ' + data[0] + ': ' + data[1]);
			return true;
		}
		return false;
	}
});

})();
