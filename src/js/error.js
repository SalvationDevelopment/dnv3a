
;(function() {
"use strict";

window.ErrorView = View.extend({
	id: 'errorview',
	err: null,

	init: function(err) {
		this._super();
		this.err = err;
	},

	open: function() {
		$('#error-msg').text(this.err);
		destroyLoggedInState();
	}
});

})();
