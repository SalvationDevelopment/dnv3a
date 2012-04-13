
;(function() {
"use strict";

var Duelist = Class.extend({
	user: null,
	avatar: '',
	back: '',
	color1: 0,
	color2: 0,
	rating: 0,
	rep: 0,
	donated: false,

	init: function(ar) {
		console.assert(ar.length === 8);
		var name = ar[0];
		this.user = Users.getUser(name);
		this.avatar = ar[1];
		this.back = ar[2];
		this.color1 = +ar[3];
		this.color2 = +ar[4];
		this.rating = +ar[5];
		this.rep = +ar[6];
		this.donated = (ar[7] === 'true');
	}
});


var CardLocation = Class.extend({
	player: 0,

	// The cards in the location, last is top.
	cards: null,

	init: function(pl) {
		this.player = pl;
		this.cards = [];
	},

	setup: function(info) {
		var size = info.size, id = info.base;
		for (var i = 0; i < size; ++i) {
			var card = new DuelCard(id++, this, this.player);
			this.cards.push(card);
		}
		this.cards.reverse();
	},

	addCard: function(card) {
		cards.push(card);
	}
});

var GYCardLocation = CardLocation.extend({});
var DeckCardLocation = CardLocation.extend({
	shuffle: function(duel, base) {
		var id = base;
		for (var i = this.cards.length; i --> 0; ) {
			duel.unmapCard(this.cards[i]);
			var card = new DuelCard(id++, this, this.player);
			this.cards[i] = cards;
			duel.mapCard(card);
		}
	}
});
var BanishCardLocation = CardLocation.extend({});
var ExtraCardLocation = CardLocation.extend({});
var HandCardLocation = CardLocation.extend({
	shuffle: function(duel, base, data) {
		var id = base;
		var newCards = [];
		if (data.length) {
			for (var i = 0; i < data.length; ++i) {
				var oldId = +data[i];
				var card = duel.getCard(oldId);
				duel.unmapCard(card);
				card.id = id++;
				duel.mapCard(card);
			}
		}
		else {
			for (var i = 0; i < this.cards.length; ++i) {
				duel.unmapCard(this.cards[i]);
				this.cards[i] = new DuelCard(id++, this, this.player);
				duel.mapCard(this.cards[i]);
			}
		}
	}
});

var FieldCardLocation = CardLocation.extend({
	init: function(pl, size) {
		this._super(pl);
		for (var i = 0; i < size; ++i)
			this.cards.push(null);
	},
	hasOpening: function() {
		return this.cards.indexOf(null) !== -1;
	},
	addCard: function(card, serverPosition) {
		var position = serverPosition;
		if (position === 5) position = 0;
		if (position >= 6) position -= 6;
		console.assert(!this.cards[position]);
		this.cards[position] = card;
	}
});
var MonsterCardLocation = FieldCardLocation.extend({
	init: function(pl) { this._super(pl, 5); }
});
var STCardLocation = FieldCardLocation.extend({
	init: function(pl) { this._super(pl, 5); }
});
var FieldSpellCardLocation = FieldCardLocation.extend({
	init: function(pl) { this._super(pl, 1); }
});


var DuelCard = Class.extend({
	id: -1,
	originalOwner: 0,
	location: null,
	faceup: false,
	defense: false,
	card: null,

	init: function(id, loc, originalOwner) {
		this.id = id;
		this.originalOwner = originalOwner;
		this.location = loc;
	}
});


var DuelUI = Class.extend({
	ui: null,

	init: function(view) {
		// TODO
	},

	setUI: function(duel) {
		// TODO
	},

	setStatus: function(pl, status) {
		// TODO
	},

	moveCard: function(card, reveal) {
		// TODO
	}
});


var Duel = Class.extend({
	locations: null,
	lifepoints: null,
	statuses: null,
	turn: 0,
	phase: '',
	map: null,
	ui: null,

	init: function(view) {
		this.locations = [];
		this.map = [];
		this.statuses = ['', ''];
		for (var pl = 0; pl < 2; ++pl) {
			this.locations.push({
				'gy': new GYCardLocation(pl),
				'deck': new DeckCardLocation(pl),
				'banish': new BanishCardLocation(pl),
				'extra': new ExtraCardLocation(pl),
				'hand': new HandCardLocation(pl),
				'monsters': new MonsterCardLocation(pl),
				'st': new STCardLocation(pl),
				'fieldspell': new FieldSpellCardLocation(pl)
			});
		}

		this.ui = new DuelUI(view);
	},

	mapCard: function(card) {
		this.map[card.id] = card;
	},
	unmapCard: function(card) {
		delete this.map[card.id];
	},
	getCard: function(id) {
		return this.map[id];
	},

	setStatus: function(pl, status) {
		this.statuses[pl] = status;
		this.ui.setStatus(pl, status);
	},

	getLocation: function(pos, fieldPos) {
		var pl = pos.slice(-1) - 1;
		pos = pos.slice(0, -1);
		var locs = this.locations[pl];
		if (pos === 'deck' || pos === 'hand' || pos === 'extra')
			return locs[pos];
		if (pos === 'grave')
			return locs.gy;
		if (pos === 'rfg')
			return locs.banish;
		// TODO: Handle underlays.
		console.assert(pos === 'field');
		if (fieldPos < 5)
			return locs.st;
		if (fieldPos > 5)
			return locs.monsters;
		return locs.fieldSpell;
	},

	_initFromStart: function(ar) {
		locations[0].deck.setup(ar[0]);
		locations[0].extra.setup(ar[1]);
		locations[1].deck.setup(ar[2]);
		locations[1].extra.setup(ar[3]);

		this.turn = 0;
		this.phase = 'dp';
		this.lifepoints = [8000, 8000];

		this.ui.setUI(this);
	},

	_initFromWatchData: function(data) {
		this.phase = data[0];
		this.turn = (data[1] === 'true' ? 0 : 1);
		var latestFieldSpellPlayer = (data[2] === 'true' ? 0 : 1);
		this.lifepoints = [+data[3], +data[4]];
		var statuses = [data[5], data[6]];

		var ind = 7;
		while (ind < data.length) {
			var position = data[i++];
			var cardId = +data[i++];
			var fieldPosition = data[i++];
			var faceup = (data[i++] !== 'true');
			var defense = (data[i++] === 'true');
			var originalOwner = (data[i++] === 'true' ? 0 : 1);
			var isKnown = (data[i++] === 'true');

			var loc = this.getLocation(position, fieldPosition);
			var card = new DuelCard(cardId, loc, originalOwner);
			card.defense = defense;
			card.faceup = faceup;
			card.card = cardInfo;

			if (isKnown) {
				card.card = createCard(data.slice(i, i + 16));
				i += 16;
			}

			if (loc instanceof FieldCardLocation)
				loc.addCard(card, +fieldPosition);
			else
				loc.addCard(card);
		}

		this.ui.setUI(this);
		this.setStatus(0, statuses[0]);
		this.setStatus(1, statuses[1]);
	}
});

Duel.createFromStart = function(view, ar) {
	var d = new Duel(view);
	d._initFromStart(ar);
	return d;
};

Duel.createFromWatchData = function(view, data) {
	var d = new Duel(view);
	d._initFromWatchData(data);
	return d;
};


window.DuelView = View.extend({
	id: 'duelview',
	duel: null,
	duelState: '',
	duelists: null,
	watchers: null,
	watch: false,

	init: function(watch, data) {
		this._super();
		console.assert(watch); // for now
		this.watch = watch;

		var ind = 0;
		this.duelState = data[ind++];

		this.duelists = [];
		for (var i = 0; i < 2; ++i) {
			this.duelists.push(new Duelist(data.slice(ind, ind+8)));
			ind += 8;
		}

		var watcherList = data[ind++].split(',');
		this.watchers = [];
		for (var i = 0; i < watcherList.length; i += 2) {
			var name = watcherList[i];
			this.watchers.push(Users.getUser(name));
		}

		this.watchers = watchers;

		if (this.duelState === 'Duel') {
			this.duel = Duel.createFromWatchData(this, data.slice(ind));
		}
		else if (this.duelState === 'Rock-paper-scissors') {
			// TODO
		}
		else if (this.duelState === 'Turn pick') {
			// TODO
		}
		else if (this.duelState === 'Siding') {
			// TODO
		}
		else {
			console.assertNotReached("Invalid duel state: " + this.duelState);
		}
	},

	open: function() {
		this.setCommands();
	},

	close: function() {
	},

	ignoreLateMessage: function(ev, data) {
		return (ev === 'Duel' || ev === 'Duel start' || ev === 'Turn pick' ||
			ev === 'Player quit');
	},

	handleDuelMessage: function(ev, data) {
		if (ev === 'Move') {
			// TODO
		}
		if (ev === 'Reveal and move') {
			// TODO
		}
		if (ev === 'Attack') {
			// TODO
		}
		if (ev === 'Phase') {
			// (extra arg = true if new turn)
			// TODO
		}
		if (ev === 'Life points') {
			// (name, points)
			// TODO
		}
		if (ev === 'Token') {
			// TODO
		}
		if (ev === 'Coin') {
			// TODO
		}
		if (ev === 'Die') {
			// TODO
		}
		if (ev === 'Shuffle') {
			var deck = this.duel.getLocation(data[0]);
			deck.shuffle(this.duel, +data[1]);
			return true;
		}
		if (ev === 'Hand shuffle') {
			var hand = this.duel.getLocation(data[0]);
			hand.shuffle(this.duel, +data[1], data.slice(2));
			return true;
		}
		if (ev === 'Status1' || ev === 'Status2') {
			this.duel.setStatus(ev.slice(-1) - 1, data[0]);
			return true;
		}
		return false;
	},

	handleMessage: function(ev, data) {
		if (ev === 'Duel start') {
			console.assert(data.length === 8);
			var ar = [];
			for (var i = 0; i < 8; i += 2) {
				ar.push({
					size: +data[i],
					base: +data[i+1]
				});
			}
			this.duelState = 'Duel';
			this.duel = new Duel(ar);
			return true;
		}
		if (ev === 'Duel') {
			return this.handleDuelMessage(data[0], data.slice(1));
		}
		if (ev === 'Player quit') {
			// TODO (sp?)
		}
		return false;
	},

	goBack: function() {
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
