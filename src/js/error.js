
;(function() {
"use strict";

window.ErrorView = View.extend({
	id: 'errorview',
	init: function(err) {
		this._super();
		destroyLoggedInState();
		$('#error-msg').text(err);
	}
});

})();
