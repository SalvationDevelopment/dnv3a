
;(function() {
"use strict";

function ErrorView(err) {
	// TODO: Disconnect I guess.
	$('#' + this.id).text(err);
}
ErrorView.prototype = new View();
ErrorView.prototype.id = 'errorview';
window.ErrorView = ErrorView;

})();
