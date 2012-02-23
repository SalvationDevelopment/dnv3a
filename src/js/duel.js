
;(function() {
"use strict";

window.Duelist = Class.extend({
	user: null,
	avatar: '',
	back: '',
	color1: 0,
	color2: 0,
	rating: 0,
	rep: 0,
	donated: false,

	init: function(ar) {
		var name = ar[0];
		this.user = Users.getUser(name);
		this.avatar = ar[1];
		this.back = ar[2];
		this.color1 = ar[3]-0;
		this.color2 = ar[4]-0;
		this.rating = ar[5]-0;
		this.rep = ar[6]-0;
		this.donated = (ar[7] === 'true');
	}
});

window.DuelView = View.extend({
	id: 'duelview',
	watch: false,

	init: function(watch, duelState, duelists, watchers) {
		this._super();
		this.watch = watch;
		this.duelState = duelState;
		this.duelists = duelists;
		this.watchers = watchers;
	},

	open: function() {
		this.setCommands();
	},

	close: function() {
	},

	ignoreLateMessage: function() {
	},

	handleMessage: function(ev, data) {
		return false;
	},

	goBack: function() {
		// XXX: This might be incorrect.
		ignoreLateMessages(this.ignoreLateMessage);
		Communicator.send(['Load duel room']);
		setView(new MatchmakingView());
	},

	selectChat: function(watchChat) {
		console.log("Nope, sorry.");
	},

	setCommands: function() {
		// TODO: Commands for when the chat has focus.
		if (this.watch) {
			Commands.setMap(this, [
				[1, "<space>", "Chat (watch)"],
				[0, ' ', "", function() { this.selectChat(true); }],
				[2, 'q', "Quit", this.goBack],
			]);
			return;
		}
		Commands.setMap(this, []);
	}
});

})();
