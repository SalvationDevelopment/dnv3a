
;(function() {
"use strict";

var Queue = Class.extend({
	q: null,
	timer: null,

	init: function() {
		this.q = [];
	},

	destroy: function() {
		if (this.timer !== null)
			clearTimeout(this.timer);
	},

	next: function() {
		this.timer = null;
		if (this.q.length > 0)
			this.q.shift()();
	},

	push: function(f) {
		this.q.push(function() {
			var duration = f();
			this.timer = setTimeout(this.next.bind(this), duration);
		}.bind(this));
		if (this.timer === null)
			this.next();
	}
});


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
		this.uname = name;
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
	},

	addCard: function(card) {
		this.cards.push(card);
	},

	removeCard: function(card) {
		var ind = this.cards.indexOf(card);
		console.assert(ind !== -1);
		this.cards.splice(ind, 1);
	}
});

var GYCardLocation = CardLocation.extend({});
var DeckCardLocation = CardLocation.extend({
	shuffle: function(duel, base) {
		var id = base;
		for (var i = this.cards.length; i --> 0; ) {
			var oldCard = this.cards[i];
			var card = new DuelCard(id++, this, this.player);
			this.cards[i] = card;
			duel.remapCard(oldCard, card);
		}
	},
	addToTop: function(card) {
		this.cards.unshift(card);
	},
	addToBottom: function(card) {
		this.cards.push(card);
	},
	top: function() {
		console.assert(this.cards.length > 0);
		return this.cards[0];
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
				var oldCard = duel.getCard(oldId);
				var card = Object.clone(oldCard);
				card.id = id++;
				duel.remapCard(oldCard, card);
			}
		}
		else {
			for (var i = 0; i < this.cards.length; ++i) {
				var oldCard = this.cards[i];
				this.cards[i] = new DuelCard(id++, this, this.player);
				duel.remapCard(oldCard, this.cards[i]);
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
	getPosition: function(fp) {
		if (fp < 5) return fp;
		if (fp === 5) return 0;
		return fp - 6;
	},
	addCard: function(card, fieldPosition) {
		var position = this.getPosition(fieldPosition);
		console.assert(!this.cards[position]);
		this.cards[position] = card;
	},
	getCard: function(fieldPosition) {
		var card = this.cards[this.getPosition(fieldPosition)];
		console.assert(card);
		return card;
	},
	removeCard: function(card) {
		var ind = this.cards.indexOf(card);
		console.assert(ind !== -1);
		this.cards[ind] = null;
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


var UICard = Class.extend({
	el: null,
	flipper: null,
	holder: null,
	card: null,
	hasCardInfo: false,
	faceup: undefined,
	rotation: 0,
	frontImg: null,

	flipped: function(front) {
		// Do this with raw CSS, because jQuery is too slow.
		this.frontSide[0].style.display = (front ? 'block' : 'none');
		this.backSide[0].style.display = (front ? 'none' : 'block');
	},

	init: function(holder, card) {
		this.holder = holder;
		this.card = card;
	},

	create: function() {
		this.el = $('<div>').addClass('card');
		this.rotator = $('<div>').addClass('card-rotator').appendTo(this.el);
		this.flipper = $('<div>').addClass('card-flipper').appendTo(this.rotator);
		this.frontSide = $('<div>').addClass('card-front').appendTo(this.flipper);
		this.backSide = $('<div>').addClass('card-back').appendTo(this.flipper);

		$('<img>').addClass('card-frame')
			.attr('src', "img/duel/frames/back.jpg")
			.appendTo(this.backSide);

		this.frontImg = $('<img>').addClass('card-frame')
			.attr('src', "img/duel/frames/back.jpg")
			.appendTo(this.frontSide);

		$('<img>').addClass('card-frame')
			.attr('src', "img/duel/border.png")
			.appendTo(this.frontSide);

		this.holder.append(this.el);
	},

	createCardFront: function() {
		var icard = this.card.card, type;
		if (icard instanceof EffectMonsterCard) {
			type = "effect";
		}
		else if (icard instanceof NormalMonsterCard) {
			type = "normal";
		}
		else if (icard instanceof SynchroMonsterCard) {
			type = "synchro";
		}
		else if (icard instanceof TrapCard) {
			type = "trap";
		}
		else if (icard instanceof SpellCard) {
			type = "spell";
		}
		else {
			console.assertNotReached("Invalid card type.");
		}
		this.frontImg.attr('src', "img/duel/frames/" + type + ".jpg");
	},

	move: function(x, y, w, h, z, faceup, rotation) {
		var delay = 500;
		if (!this.el) {
			this.create();
			delay = 0;
		}

		if (!this.hasCardInfo && this.card.card) {
			this.hasCardInfo = true;
			this.createCardFront();
		}

		var loc = {left: x, top: y, width: w, height: h};
		if (delay) {
			this.el.stop();
			this.el.animate(loc, delay);
		}
		else {
			this.el.css(loc);
		}
		// TODO: Do this at the right time.
		this.el.css({'z-index': z, 'overflow': 'visible'});

		if (this.faceup !== faceup) {
			this.faceup = faceup;
			var dir = (faceup ? 'unflip' : 'flip');
			if (delay) {
				this.flipper.rotate3Di(dir, delay, {
					direction: 'clockwise',
					sideChange: this.flipped.bind(this)
				});
			}
			else {
				// Fake rotation, for speed.
				this.flipped(faceup);
				this.flipper.data('rotate3Di.degrees', 180);
			}
		}

		if (this.rotation !== rotation) {
			// Make jQuery animate a dummy CSS property, and set rotation at
			// each step.
			this.rotation = rotation;
			this.rotator.animate({
				'border-spacing': rotation
			}, {
				step: function(now, fx) {
					$(this).css('transform', 'rotate(' + now + 'deg)');
				},
				duration: delay
			}, 'linear');
		}
	}
});


var DuelUI = Class.extend({
	ui: null,
	fieldCells: null,
	cardMap: null,
	colX: null,
	colW: null,
	rowY: null,
	rowH: null,

	init: function(view) {
		this.cardMap = {};
		this.ui = $('#duel-ui');
		this.cardHolder = $('#duel-cardholder');

		this.colX = [];
		this.colW = [];
		this.rowY = [];
		this.rowH = [];

		this.tableCont = $('<div id="duel-tablecont">').appendTo(this.ui);
		this.duelTable = $('<table id="duel-table">');
		var tbody = $('<tbody>').appendTo(this.duelTable);
		var els = [], midContainer;
		for (var row = 0; row < 5; ++row) {
			var r = $('<tr>').appendTo(tbody), elr = [];
			elr.push($('<td>').addClass('duel-edge').appendTo(r));
			if (row === 2) {
				midContainer = $('<td colspan="5" id="duel-mid">').appendTo(r);
			}
			else {
				for (var i = 0; i < 5; ++i) {
					elr.push($('<td>').addClass('duel-cell').appendTo(r));
				}
			}
			elr.push($('<td>').addClass('duel-edge').appendTo(r));
			if (row === 2) {
				elr[0].addClass('pl1');
				elr[1].addClass('pl0');
			}
			else {
				for (var i = 0; i < 7; ++i) {
					elr[i].addClass((row < 2 ? 'pl1' : 'pl0'));
				}
			}
			els.push(elr);
		}
		this.fieldCells = els;

		midContainer.text("Hello.");
		this.duelTable.appendTo(this.tableCont);

		for (var row = 0; row < 5; ++row) {
			this.rowY.push(els[row][0].offset().top);
			this.rowH.push(els[row][0].height());
		}
		for (var col = 0; col < 7; ++col) {
			this.colX.push(els[0][col].offset().left);
			this.colW.push(els[0][col].width());
		}
	},

	getFieldPosRect: function(row, col) {
		var ratio = 1.45;
		var w = this.colW[col], h = this.rowH[row];
		var x = this.colX[col], y = this.rowY[row];
		var midx = x + w/2, nw = h/1.45;
		return {
			width: nw,
			height: h,
			left: midx - nw/2 + 2,
			top: y + 2
		};
	},

	getHandCardRect: function(card) {
		var loc = card.location, pl = loc.player;
		var index = loc.cards.indexOf(card), ncards = loc.cards.length;
		var startX = this.colX[0], endX = this.colX[6] + this.colW[6];
		var fullW = endX - startX;
		var w = fullW / 5, h = w*1.45;
		var eachX = w;
		if (ncards * w <= fullW + 0.1) {
			// The cards fit; center them.
			startX = startX + fullW/2 - (ncards * w)/2;
		}
		else {
			// They don't; cover the space with some overlap.
			eachX = (endX - startX - w) / (ncards-1);
		}
		var x = startX + eachX*index, y;

		if (pl === 0) {
			y = this.rowY[4] + this.rowH[4] + 10;
		}
		else {
			y = this.rowY[0] - h - 5;
		}

		return {
			left: x,
			top: y,
			width: w,
			height: h,
			z: ncards - index
		};
	},

	getCardRect: function(card) {
		var loc = card.location, pl = loc.player;
		if (loc instanceof HandCardLocation) {
			return this.getHandCardRect(card);
		}

		var row, col;
		// Pretend to be player 0, then mirror the field if (pl === 1).
		if (loc instanceof BanishCardLocation) {
			row = 2;
			col = 6;
		}
		else if (loc instanceof DeckCardLocation) {
			row = 4;
			col = 6;
		}
		else if (loc instanceof GYCardLocation) {
			row = 3;
			col = 6;
		}
		else if (loc instanceof ExtraCardLocation) {
			row = 4;
			col = 0;
		}
		else if (loc instanceof FieldSpellCardLocation) {
			row = 2;
			col = 6;
		}
		else {
			row = (loc instanceof MonsterCardLocation ? 3 : 4);
			col = loc.cards.indexOf(card) + 1;
		}

		if (pl === 1) {
			row = 4-row;
			col = 6-col;
		}

		// TODO: Adjust for 3d effects.
		var rect = this.getFieldPosRect(row, col);
		rect.z = 1;
		return rect;
	},

	destroy: function() {
		this.ui.empty();
		this.cardHolder.empty();
	},

	setUI: function(duel) {
		var self = this;
		for (var pl = 0; pl < 2; ++pl) {
			var locs = duel.locations[pl];
			for (var a in locs) {
				locs[a].cards.forEach(function(c) {
					if (c)
						self.makeCard(c);
				});
			}
		}
	},

	setStatus: function(pl, status) {
		// TODO
	},

	getUICard: function(card) {
		console.assert(this.cardMap[card.id]);
		return this.cardMap[card.id];
	},

	makeCard: function(card) {
		var uiCard = new UICard(this.cardHolder, card);
		this.cardMap[card.id] = uiCard;
		this.moveCard(card);
	},

	remapCard: function(oldCard, card) {
		var uiCard = this.cardMap[oldCard.id];
		uiCard.card = card;
		this.cardMap[card.id] = uiCard;
		delete this.cardMap[oldCard.id];
	},

	moveCard: function(card) {
		var rect = this.getCardRect(card);
		var uiCard = this.getUICard(card);
		var rotation = (card.defense ? -90 : 0) + (card.location.player ? -180 : 0);
		uiCard.move(rect.left, rect.top, rect.width, rect.height,
				rect.z, card.faceup, rotation);
	},

	attack: function(card, target) {
		// TODO (target = null -> direct attack)
	},

	setPhase: function(turn, phase) {
		// TODO
	},

	setLifePoints: function(pl, points) {
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

	destroy: function() {
		this.ui.destroy();
	},

	mapCard: function(card) {
		this.map[card.id] = card;
	},
	unmapCard: function(card) {
		delete this.map[card.id];
	},
	remapCard: function(oldCard, card) {
		this.mapCard(card);
		this.ui.remapCard(oldCard, card);
		this.unmapCard(oldCard);
	},
	getCard: function(id) {
		console.assert(this.map[id]);
		return this.map[id];
	},

	mapAllCards: function() {
		var map = function(c) {
			if (c) this.mapCard(c);
		}.bind(this);

		for (var pl = 0; pl < 2; ++pl) {
			var locs = this.locations[pl];
			for (var a in locs) {
				locs[a].cards.forEach(map);
			}
		}
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
		return locs.fieldspell;
	},

	getTopOfDeck: function(pl) {
		return this.locations[pl].deck.top();
	},

	refreshLocation: function(loc, card) {
		// Refresh an individual card's location, after it has moved to/from
		// there. (For hands, other cards need to rearrange, etc.)
		// If loc is not a FieldCardLocation, card can be null.
		var ui = this.ui;
		if (loc instanceof FieldCardLocation) {
			if (card)
				ui.moveCard(card);
		}
		else {
			loc.cards.forEach(function(c) {
				ui.moveCard(c);
			});
		}
	},

	deckShuffle: function(deck, base) {
		deck.shuffle(this, base);
		this.refreshLocation(deck, null);
	},
	handShuffle: function(hand, base, data) {
		hand.shuffle(this, base, data);
		this.refreshLocation(hand, null);
	},

	moveCard: function(card, toLoc, locPosition, faceup, defense, special, reveal) {
		var fromLoc = card.location;
		fromLoc.removeCard(card);
		card.location = toLoc;
		card.faceup = faceup;
		card.defense = defense;
		if (toLoc instanceof FieldCardLocation) {
			toLoc.addCard(card, locPosition);
		}
		else if (toLoc instanceof DeckCardLocation) {
			if (locPosition === 'bottom')
				toLoc.addToBottom(card);
			else
				toLoc.addToTop(card);
		}
		else {
			toLoc.addCard(card);
		}

		this.refreshLocation(fromLoc, card);
		if (fromLoc !== toLoc)
			this.refreshLocation(toLoc, card);
	},

	drawCard: function(pl, icard) {
		var card = this.locations[pl].deck.top();
		var hand = this.locations[pl].hand;
		var ownHand = false;
		this.moveCard(card, hand, null, ownHand, false, false, false);
	},

	drawInitialCards: function() { // runs on queue
		for (var i = 0; i < 5; ++i) {
			setTimeout(function() {
				this.drawCard(0, null);
				this.drawCard(1, null);
				// TODO: Sound
			}.bind(this), i*500);
		}
		setTimeout(function() {
			this.drawCard(this.turn, null);
		}.bind(this), 5*500);

		return 6*500;
	},

	setPhase: function(turn, phase) {
		this.turn = turn;
		this.phase = phase;
		this.ui.setPhase(turn, phase);
	},

	setLifePoints: function(pl, points) {
		this.ui.setLifePoints(pl, points);
		var dif = points - this.lifepoints[pl];
		this.lifepoints[pl] = points;
		return dif;
	},

	_initFromStart: function(ar) {
		this.locations[0].deck.setup(ar[0]);
		this.locations[0].extra.setup(ar[1]);
		this.locations[1].deck.setup(ar[2]);
		this.locations[1].extra.setup(ar[3]);

		this.turn = 0;
		this.phase = 'dp';
		this.lifepoints = [8000, 8000];

		this.mapAllCards();
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
			var position = data[ind++];
			var cardId = +data[ind++];
			var fieldPosition = data[ind++];
			var faceup = (data[ind++] !== 'true');
			var defense = (data[ind++] === 'true');
			var originalOwner = (data[ind++] === 'true' ? 0 : 1);
			var isKnown = (data[ind++] === 'true');

			var loc = this.getLocation(position, fieldPosition);
			var card = new DuelCard(cardId, loc, originalOwner);
			card.defense = defense;
			card.faceup = faceup;

			if (isKnown) {
				card.card = createCard(data.slice(ind, ind + 16));
				ind += 16;
			}

			if (loc instanceof FieldCardLocation)
				loc.addCard(card, +fieldPosition);
			else if (loc instanceof DeckCardLocation)
				loc.addToBottom(card); // XXX Maybe?
			else
				loc.addCard(card); // XXX Maybe add these in reverse order.
		}

		this.mapAllCards();
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
	startingPlayer: null,
	duelState: '',
	duelists: null,
	watchers: null,
	watch: false,
	queue: null,

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
		this.queue = new Queue();
	},

	close: function() {
		if (this.duel)
			this.duel.destroy();
		this.queue.destroy();
	},

	getDuelistFromName: function(name) {
		for (var i = 0; i < 2; ++i) {
			if (this.duelists[i].uname === name)
				return i;
		}
		console.assertNotReached("No player with name " + name + ".");
	},

	ignoreLateMessage: function(ev, data) {
		return (ev === 'Duel' || ev === 'Duel start' || ev === 'Turn pick' ||
			ev === 'Player quit' || ev === 'Add watcher' || ev === 'Remove watcher' ||
			ev === 'Win' || ev === 'Lose');
	},

	handleDuelMessage: function(ev, data) { // runs on queue
		if (ev === 'Move' || ev === 'Reveal and move') {
			var reveal = (ev === 'Reveal and move');
			var from = data[0];
			var id = data[1], card;
			if (id === '') {
				console.assert(from.startsWith('deck'));
				var pl = from.charAt(4)-1;
				card = this.duel.getTopOfDeck(pl);
			}
			else
				card = this.duel.getCard(+id);

			var to = data[2];
			var locPosition = data[3];
			if (to.endsWith("_bottom")) {
				to = to.slice(0, -7);
				locPosition = 'bottom';
			}
			var toLoc = this.duel.getLocation(to, locPosition);

			var faceup = (data[4] === 'false');
			var defense = (data[5] === 'true');
			var msgToLog = data[6];
			var special = (data[7] === 'special');

			if (data.length > 8)
				card.card = createCard(data.slice(8));

			this.duel.moveCard(card, toLoc, locPosition, faceup, defense, special, reveal);

			if (msgToLog)
				this.addToDuelLog(msgToLog);
			return 500;
		}
		if (ev === 'Attack') {
			var from = data[0];
			var attacker = this.duel.getCard(data[1]);
			var targetId = data[2];
			this.duel.ui.attack(attacker,
					(data[2] ? this.duel.getCard(data[2]) : null));
			return 500;
		}
		if (ev === 'Phase') {
			var phase = data[0];
			var turn = this.getDuelistFromName(data[1]);
			this.duel.setPhase(turn, phase);
			if (data[2]) {
				// XXX: According to captures, we might need to s/3/2 here.
				var icard = (data.length > 3 ? createCard(data.slice(3)) : null);
				this.duel.drawCard(turn, icard);
				return 500;
			}
			return 0;
		}
		if (ev === 'Life points') {
			var uname = data[0];
			var pl = this.getDuelistFromName(uname);
			var points = +data[1];
			var dif = this.duel.setLifePoints(pl, points);

			var msg = uname + (dif > 0 ? " gained " : " lost ") +
				plural(Math.abs(dif), "lifepoint", "", "s") + ".";
			this.addToDuelLog(msg);
			return 0;
		}
		if (ev === 'Token') {
			// TODO
		}
		if (ev === 'Coin') {
			var uname = data[0], result = data[1];
			var msg = uname + " flips a coin. It lands on... " + result + "!";
			this.addToDuelLog(msg);
			return 0;
		}
		if (ev === 'Die') {
			var uname = data[0], result = +data[1];
			var msg = uname + " rolls a die. It lands on... " + result + "!";
			this.addToDuelLog(msg);
			return 0;
		}
		if (ev === 'Shuffle') {
			var deck = this.duel.getLocation(data[0]);
			this.duel.deckShuffle(deck, +data[1]);
			return 500;
		}
		if (ev === 'Hand shuffle') {
			var hand = this.duel.getLocation(data[0]);
			this.duel.handShuffle(hand, +data[1], data.slice(2));
			return 500;
		}
		if (ev === 'Status1' || ev === 'Status2') {
			this.duel.setStatus(ev.slice(-1) - 1, data[0]);
			return 0;
		}
		return -1;
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
			console.assert(this.startingPlayer !== null);
			this.duel = Duel.createFromStart(this, ar, this.startingPlayer);
			// TODO: When duelling, initialize top cards of the deck with
			// provided data.
			this.queue.push(function() {
				return this.duel.drawInitialCards();
			}.bind(this));
			return true;
		}
		if (ev === 'Duel') {
			this.queue.push(function() {
				var time = this.handleDuelMessage(data[0], data.slice(1));
				if (time === -1) {
					console.warn("Unhandled duel message: ", data.slice(1));
					time = 0;
				}
				return time;
			}.bind(this));
			return true;
		}
		if (ev === 'Add watcher') {
			this.watchers.push(Users.getUser(data[0]));
			return true;
		}
		if (ev === 'Remove watcher') {
			// XXX If this can happen after people go offline, this is wrong.
			var ind = this.watchers.indexOf(Users.getUser(data[0]));
			console.assert(ind !== -1);
			this.watchers.splice(ind, 1);
			return true;
		}
		if (ev === 'Turn pick') {
			this.startingPlayer = this.getDuelistFromName(data[0]);
			return true;
		}
		if (ev === 'Player quit') {
			// TODO
		}
		return false;
	},

	addToDuelLog: function(msg) {
		// TODO
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
				[1, "<enter>", "Chat (watch)"],
				[0, 'enter', "", function() { this.selectChat(true); }],
				[2, 'q', "Quit", this.goBack],
			]);
			return;
		}
		Commands.setMap(this, []);
	}
});

})();
