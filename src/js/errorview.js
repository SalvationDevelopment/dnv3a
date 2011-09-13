
;(function() {

function ErrorView(err) {
	$('#' + this.id).text(err);
}
ErrorView.prototype = new View();
ErrorView.prototype.id = 'errorview';
window.ErrorView = ErrorView;

})();
