
;(function() {
"use strict";

window.ErrorView = View.extend({
	id: 'errorview',
	init: function(err) {
		this._super();
		this.ui.text(err);
	}
});

})();
