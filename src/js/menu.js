
;(function() {
"use strict";

window.MenuView = View.extend({
	id: 'menuview',

	goDuel: function() {
		alert("My God, it's full of cards!");
	},

	goDeck: function() {
		alert("I'm sorry Dave. I'm afraid I can't do that.");
	},

	init: function() {
		this._super();

		Commands.setMap(this, [
			['d', "Duel", this.goDuel],
			['m', "Modify deck", this.goDeck],
			['q', "Log out", doLogout],
		]);
	}
});

})();
