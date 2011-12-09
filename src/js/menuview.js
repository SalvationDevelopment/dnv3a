
;(function() {
"use strict";

function goDuel() {
	alert("My God, it's full of cards!");
}

function goDeck() {
	alert("I'm sorry Dave. I'm afraid I can't do that.");
}

window.MenuView = View.extend({
	id: 'menuview',

	init: function() {
		this._super();

		Commands.setMap({
			'd': ["Duel", goDuel],
			'm': ["Modify deck", goDeck],
			'q': ["Log out", doLogout],
		});
	}
});

})();
