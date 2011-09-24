
;(function() {
"use strict";

window.ErrorView = View.extend({
	id: 'errorview',
	init: function(err) {
		this._super();
		Sidebar.close();
		this.ui.text(err);
	}
});

})();
