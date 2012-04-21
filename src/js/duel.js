
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
	cards: null,

	init: function(pl) {
		this.player = pl;
		this.cards = [];
	},

	removeCard: function(card) {
		var ind = this.cards.indexOf(card);
		console.assert(ind !== -1);
		this.cards.splice(ind, 1);
	}
});

var UnderlayCardLocation = CardLocation.extend({
	base: null,

	init: function(card) {
		this._super(-1);
		Object.defineProperty(this, 'player', {
			get: function() {
				return card.location.player;
			},
			enumerable: true,
			configurable: true
		});
		this.base = card;
	},

	addCard: function(card) {
		this.cards.push(card);
	}
});

var CardPileLocation = CardLocation.extend({
	// 'cards' is top-to-bottom

	uiPile: null,

	setup: function(info) {
		var size = info.size, id = info.base;
		for (var i = 0; i < size; ++i) {
			var card = new DuelCard(id++, this, this.player);
			this.cards.push(card);
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

var GYCardLocation = CardPileLocation.extend({});
var DeckCardLocation = CardPileLocation.extend({
	shuffle: function(duel, base) {
		var id = base;
		for (var i = this.cards.length; i --> 0; ) {
			var oldCard = this.cards[i];
			var card = new DuelCard(id++, this, this.player);
			this.cards[i] = card;
			duel.remapCard(oldCard, card);
		}
	}
});
var BanishCardLocation = CardPileLocation.extend({});
var ExtraCardLocation = CardPileLocation.extend({});
var HandCardLocation = CardLocation.extend({
	// 'cards' is left-to-right for player 0, right-to-left for player 1

	addCard: function(card) {
		this.cards.push(card);
	},

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
	// 'cards' is a fixed-size array of cards (/null for no card)

	base: 0,

	init: function(pl, base, size) {
		this._super(pl);
		this.base = base;
		for (var i = 0; i < size; ++i)
			this.cards.push(null);
	},
	hasOpening: function() {
		return this.cards.indexOf(null) !== -1;
	},
	getFieldPosition: function(card) {
		var ind = this.cards.indexOf(card);
		console.assert(ind !== -1);
		return ind + this.base;
	},
	addCard: function(card, fieldPosition) {
		var position = fieldPosition - this.base;
		console.assert(!this.cards[position]);
		this.cards[position] = card;
	},
	getCard: function(fieldPosition) {
		var card = this.cards[fieldPosition - this.base];
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
	init: function(pl) { this._super(pl, 6, 5); }
});
var STCardLocation = FieldCardLocation.extend({
	init: function(pl) { this._super(pl, 0, 5); }
});
var FieldSpellCardLocation = FieldCardLocation.extend({
	init: function(pl) { this._super(pl, 5, 1); }
});


var DuelCard = Class.extend({
	id: -1,
	originalOwner: 0,
	location: null,
	faceup: false,
	defense: false,
	card: null,
	underlay: null,

	init: function(id, loc, originalOwner) {
		this.id = id;
		this.originalOwner = originalOwner;
		this.location = loc;
	},

	makeUnderlay: function() {
		if (!this.underlay)
			this.underlay = new UnderlayCardLocation(this);
	}
});


var UIPile = Class.extend({
	holder: null,
	owner: 0,
	topUICard: null,
	baseRect: null,
	adj: null,
	z: 100,

	// Copies of the cards in the pile, as of the time they were added.
	// The last is topmost.
	stack: null,

	init: function(holder, rect) {
		this.holder = holder;
		this.stack = [];
		this.topUICard = null;
		this.baseRect = rect;
	},

	indexOf: function(card) {
		return this.stack.map(function(c) {
			return c.id;
		}).indexOf(card.id);
	},

	remap: function(oldCard, card) {
		var ind = this.indexOf(oldCard);
		console.assert(ind !== -1);
		this.stack[ind] = Object.clone(card);
	},

	remove: function(card) {
		var ind = this.indexOf(card);
		console.assert(ind !== -1);
		var oldClone = this.stack.splice(ind, 1)[0];
		var wasTop = (oldClone === this.topUICard.card);
		if (!wasTop)
			this.setZ(300);
		this.update(wasTop);
		return oldClone;
	},

	updateFromLocation: function(loc) {
		this.stack = [];
		loc.cards.forEach(function(card) {
			this.stack.unshift(Object.clone(card));
		}.bind(this));
		this.update(true);
	},

	setUI: function(loc, adj) {
		this.owner = loc.player;
		this.adj = adj;
		this.updateFromLocation(loc);
	},

	setZ: function(z) {
		this.z = z;
		if (this.topUICard) {
			this.topUICard.setZ(z);
		}
	},

	update: function(topChange) {
		var rect = this.baseRect;
		if (topChange) {
			if (this.topUICard) {
				this.topUICard.destroy();
				this.topUICard = null;
			}
			if (this.stack.length > 0) {
				var card = this.stack[this.stack.length-1];
				this.topUICard = new UICard(this.holder, card);
				var w = rect.width, h = rect.height;
				var rot = (this.owner === 0 ? 0 : -180);
				this.topUICard.move(0, 0, w, h, card.faceup, rot);
				this.topUICard.setZ(this.z);
			}
		}

		if (this.topUICard) {
			// Create a 3D effect.
			var dx = this.adj[0], dy = this.adj[1];
			var n = this.stack.length;
			this.topUICard.setDirectPosition(
				rect.left + dx*(n-1),
				rect.top + dy*(n-1)
			);
			var shadows = [];
			for (var i = 0; i < n; i += 5) {
				var pos = (-dx*(n-i)) + 'px ' + (-dy*(n-i)) + 'px ';
				shadows.unshift(pos + '1px #ccc, ' + pos + '0 #000');
			}
			this.topUICard.el.css('box-shadow', shadows.join(', '));
		}
	},

	getNextPositionAdjustment: function() {
		var dx = this.adj[0], dy = this.adj[1];
		var n = this.stack.length;
		return {dx: dx*n, dy: dy*n};
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
	frontSide: null,
	backSide: null,
	frontImg: null,
	cardImg: null,

	flipped: function(front) {
		// Do this with raw CSS, because jQuery is too slow.
		this.frontSide[0].style.display = (front ? 'block' : 'none');
		this.backSide[0].style.display = (front ? 'none' : 'block');
	},

	init: function(holder, card) {
		this.holder = holder;
		this.card = card;
	},

	destroy: function() {
		if (this.el)
			this.el.remove();
	},

	remap: function(oldCard, card) {
		console.assert(this.card === oldCard);
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

		this.cardImg = $('<img>').addClass('card-image')
			.attr('src', "img/loading.gif")
			.appendTo(this.frontSide);

		$('<img>').addClass('card-frame')
			.attr('src', "img/duel/border.png")
			.appendTo(this.frontSide);

		this.holder.append(this.el);
	},

	createCardFront: function() {
		var icard = this.card.card, type = icard.cardType;
		if (icard instanceof TokenMonsterCard)
			type = "normal";
		this.frontImg.attr('src', "img/duel/frames/" + type + ".jpg");
		this.cardImg.attr('src', icard.imageUrl);
	},

	setDirectPosition: function(x, y) {
		this.el.css({left: x, top: y});
	},

	setZ: function(z) {
		this.el.css('z-index', z);
	},

	getCenter: function() {
		var x = parseFloat(this.el.css('left'), 10);
		var y = parseFloat(this.el.css('top'), 10);
		var w = parseFloat(this.el.css('width'), 10);
		var h = parseFloat(this.el.css('height'), 10);
		// This works even in case of rotations, because the center stays.
		return {x: x + w/2, y: y + h/2};
	},

	move: function(x, y, w, h, faceup, rotation, finished) {
		// z is the z-index for the card, set to:
		// - 200+ for moving cards
		// - 100 for cards on field, including piles
		// - 99- for underlays
		// - 300 for piles when the a moving card is supposed to be under it
		// - 400+ for cards in hand
		var delay = 500;
		if (!this.el) {
			this.create();
			delay = 0;
		}

		if (!this.hasCardInfo && this.card.card) {
			this.hasCardInfo = true;
			this.createCardFront();
		}

		console.assert(!(faceup && !this.hasCardInfo));

		var loc = {left: x, top: y, width: w, height: h};
		if (delay) {
			this.el.stop();
			this.el.animate(loc, delay, finished);
		}
		else {
			this.el.css(loc);
		}
		this.el.css('overflow', 'visible');

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
				this.flipper.data('rotate3Di.degrees', (faceup ? 0 : 180));
			}
		}

		if (this.rotation !== rotation) {
			// Make jQuery animate a dummy CSS property, and set rotation at
			// each step.
			this.rotation = rotation;
			this.rotator.animate({
				'text-indent': rotation
			}, {
				step: function(now, fx) {
					$(this).css('transform', 'rotate(' + now + 'deg)');
				},
				duration: delay
			}, 'linear');
		}

		if (!delay && finished)
			finished();
	}
});


var DuelUI = Class.extend({
	duel: null,
	isPlaying: false,
	ui: null,
	cardHolder: null,
	duelists: null,
	fieldCells: null,
	turnIndicator: null,
	phaseIndicator: null,
	nextTurnIndicator: null,
	statusIndicators: null,
	lpEl: null,
	map: null,
	colX: null,
	colW: null,
	rowY: null,
	rowH: null,

	init: function(view, duel) {
		this.duel = duel;
		this.isPlaying = duel.isPlaying;
		this.duelists = view.duelists;
		this.map = {};
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

		// In the middle, add indicators (wrapped within a div, to enable
		// position: absolute).
		var mid = $('<div id="duel-mid-wrapper">').appendTo(midContainer);

		// Add turn indicators in the middle.
		var ind = $('<div id="duel-indicators">').appendTo(mid);
		this.turnIndicator = $('<div id="duel-turn">').appendTo(ind);
		this.phaseIndicator = $('<div id="duel-phase">').appendTo(ind);
		this.nextTurnIndicator = $('<div id="duel-next">').appendTo(ind);

		// Add player indicators in the middle.
		this.lpEl = [];
		this.statusIndicators = [];
		for (var i = 0; i < 2; ++i) {
			var name = this.duelists[i].uname;
			var pl = $('<div>').addClass('duel-player p'+i).appendTo(mid);
			$('<div>').addClass('name').text(name).appendTo(pl);
			var lpbg = $('<div>').addClass('lp-bg');
			var lpcont = $('<div>').addClass('lp-cont');
			$('<div>').addClass('lp').append(lpbg).append(lpcont).appendTo(pl);
			this.lpEl.push({
				bg: lpbg,
				cont: lpcont
			});

			var st = $('<div>').addClass('duel-status').appendTo(pl);
			this.statusIndicators.push(st);
		}

		this.duelTable.appendTo(this.tableCont);

		for (var row = 0; row < 5; ++row) {
			this.rowY.push(els[row][0].offset().top);
			this.rowH.push(els[row][0].height());
		}
		for (var col = 0; col < 7; ++col) {
			this.colX.push(els[0][col].offset().left);
			this.colW.push(els[0][col].width());
		}

		for (var pl = 0; pl < 2; ++pl) {
			var locs = duel.locations[pl];
			for (var name in locs) {
				var loc = locs[name];
				if (loc instanceof CardPileLocation) {
					var rect = this.getLocRect(loc, false);
					var pile = new UIPile(this.cardHolder, rect);
					loc.uiPile = pile;
				}
			}
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
			top: y + 2,
			z: 100
		};
	},

	getLoc3DAdj: function(loc) {
		var scale = this.rowH[0] / 100;
		var adj;
		if (loc instanceof DeckCardLocation) {
			adj = [0.25, 0.05];
		}
		else if (loc instanceof ExtraCardLocation) {
			adj = [-0.25, 0.05];
		}
		else if (loc instanceof GYCardLocation) {
			adj = [0.08, 0.01];
		}
		else if (loc instanceof BanishCardLocation) {
			adj = [0.07, 0];
		}
		else {
			console.assertNotReached("Invalid location.");
		}
		if (loc.player === 1) {
			adj[0] *= -1;
			adj[1] *= -1;
		}
		return [adj[0]*scale, adj[1]*scale];
	},

	getLocRect: function(loc, correct3D) {
		var row, col;
		if (loc instanceof FieldSpellCardLocation) {
			row = 2;
			col = 6;
		}
		else if (loc instanceof DeckCardLocation) {
			row = 4;
			col = 6;
		}
		else if (loc instanceof ExtraCardLocation) {
			row = 4;
			col = 0;
		}
		else if (loc instanceof GYCardLocation) {
			row = 3;
			col = 6;
		}
		else if (loc instanceof BanishCardLocation) {
			row = 2;
			col = 6;
		}
		else {
			console.assertNotReached("Invalid location.");
		}

		// Mirror the field for player 1.
		if (loc.player === 1) {
			row = 4-row;
			col = 6-col;
		}

		var rect = this.getFieldPosRect(row, col);
		if (correct3D && loc instanceof CardPileLocation) {
			var adj = loc.uiPile.getNextPositionAdjustment();
			rect.left += adj.dx;
			rect.top += adj.dy;
		}
		return rect;
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

		var x, y;
		if (pl === 0) {
			x = startX + eachX*index;
			y = this.rowY[4] + this.rowH[4] + 10;
		}
		else {
			x = startX + eachX*(ncards-1-index);
			y = this.rowY[0] - h - 5;
		}

		return {
			left: x,
			top: y,
			width: w,
			height: h,
			z: 400 + ncards - index
		};
	},

	adjustRectForUnderlays: function(r, index, max) {
		var rat = (max === 0 ? 0 : index/max - 0.5);
		var availableX = r.height - r.width;
		r.left += rat * availableX;
	},

	getFieldCardRect: function(card, adjustForUnderlays) {
		var loc = card.location;
		var row = (loc instanceof MonsterCardLocation ? 3 : 4);
		var col = loc.cards.indexOf(card) + 1;

		// Mirror the field for player 1.
		if (loc.player === 1) {
			row = 4-row;
			col = 6-col;
		}

		var r = this.getFieldPosRect(row, col);
		if (adjustForUnderlays && !card.defense && card.underlay)
			this.adjustRectForUnderlays(r, 0, card.underlay.cards.length);
		return r;
	},

	getUnderlayCardRect: function(card) {
		var loc = card.location, base = loc.base;
		var ind = loc.cards.indexOf(card),
			max = loc.cards.length-1;
		if (!base.defense) {
			++ind;
			++max;
		}
		var r = this.getFieldCardRect(base, false);
		this.adjustRectForUnderlays(r, ind, max);
		r.z -= ind + 1;
		return r;
	},

	getCardRect: function(card) {
		var loc = card.location;
		if (loc instanceof HandCardLocation) {
			return this.getHandCardRect(card);
		}
		else if (loc instanceof STCardLocation ||
			loc instanceof MonsterCardLocation) {
			return this.getFieldCardRect(card, true);
		}
		else if (loc instanceof UnderlayCardLocation) {
			return this.getUnderlayCardRect(card);
		}
		else {
			return this.getLocRect(loc, true);
		}
	},

	destroy: function() {
		this.ui.empty();
		this.cardHolder.empty();
	},

	setUI: function() {
		var self = this, duel = this.duel;
		for (var pl = 0; pl < 2; ++pl) {
			var locs = duel.locations[pl];
			for (var name in locs) {
				var loc = locs[name];
				if (loc instanceof CardPileLocation) {
					var pile = loc.uiPile;
					var adj = this.getLoc3DAdj(loc);
					pile.setUI(loc, adj);
					loc.cards.forEach(function(c) {
						self.mapCardPile(pile, c);
					});
				}
				else {
					loc.cards.forEach(function(c) {
						if (!c) return;
						self.makeCard(c);
						if (!c.underlay) return;
						c.underlay.cards.forEach(function(c2) {
							self.makeCard(c2);
						});
					});
				}
			}

			this.setLifePoints(pl, duel.lifepoints[pl], true);
			this.setStatus(pl, duel.statuses[pl]);
		}

		this.setPhase(duel.turn, duel.phase);
	},

	makeCard: function(card) {
		var uiCard = new UICard(this.cardHolder, card);
		this.map[card.id] = uiCard;
		var rect = this.getCardRect(card);
		var rotation = (card.defense ? -90 : 0) + (card.location.player ? -180 : 0);
		uiCard.move(rect.left, rect.top, rect.width, rect.height,
				card.faceup, rotation);
		uiCard.setZ(rect.z);
	},

	destroyCard: function(card) {
		var thing = this.map[card.id];
		if (thing instanceof UICard) {
			thing.destroy();
			delete this.map[card.id];
		}
	},

	remapCard: function(oldCard, card) {
		var thing = this.map[oldCard.id];
		thing.remap(oldCard, card);
		delete this.map[oldCard.id];
		this.map[card.id] = thing;
	},

	mapCardPile: function(pile, card) {
		this.map[card.id] = pile;
	},

	moveCard: function(card) {
		var rect = this.getCardRect(card);
		var thing = this.map[card.id], uiCard;

		if (thing instanceof UIPile) {
			// Extract the card from its pile (automatically adjusts z-index).
			var oldClone = thing.remove(card);
			console.assert(oldClone.id === card.id);
			this.makeCard(oldClone);
			uiCard = this.map[card.id];
			uiCard.card = card;
		}
		else {
			uiCard = thing;
		}

		var toLoc = card.location;
		var rotation = (card.defense ? -90 : 0) + (toLoc.player ? -180 : 0);

		// Adjust z-index of moved card, target pile.
		var toPile = toLoc.uiPile;
		if (toPile && toLoc.cards.length > 0 && toLoc.top() !== card) {
			toPile.setZ(300);
		}
		uiCard.setZ(rect.z >= 400 ? rect.z - 200 : 100 + rect.z);

		var self = this;
		uiCard.move(rect.left, rect.top, rect.width, rect.height,
				card.faceup, rotation, function()
		{
			// Movement has finished, merge card into pile if applicable.
			if (toPile) {
				uiCard.destroy();
				self.map[card.id] = toPile;
				toPile.updateFromLocation(toLoc);
				toPile.setZ(100);
			}
			else {
				// Readjust the z-index to what it is supposed to be.
				uiCard.setZ(rect.z);
			}
			// Reset z-index of piles referred to.
			// TODO: Delay queue callbacks to after this.
			if (thing instanceof UIPile)
				thing.setZ(100);
		});
	},

	setStatus: function(pl, status) {
		var st = this.statusIndicators[pl];
		st.toggle(status !== '').text(status);
	},

	attack: function(card, target) {
		var pl = card.location.player;
		var from = this.map[card.id].getCenter(), to;
		if (target) {
			to = this.map[target.id].getCenter();
		}
		else {
			// Set the target to slightly above/below the field.
			to = {};
			to.x = this.colX[3] + this.colW[3]/2,
			to.y = (pl === 0 ? this.rowY[0]-35 : this.rowY[4] + this.rowH[4] + 35);
		}

		// Draw a thick expanding line 'from' -> 'to'.
		var dif = {
			x: to.x - from.x,
			y: to.y - from.y
		};
		var dist = Math.sqrt(dif.x*dif.x + dif.y*dif.y);
		var angle = Math.atan2(dif.y, dif.x);
		var color = (pl === 0 ? 'red' : 'blue');

		var line = $('<div>').addClass('duel-attackline')
			.css({
				top: from.y-8,
				left: from.x,
				width: 0,
				backgroundColor: color,
				transform: 'rotate(' + angle + 'rad)'
			})
			.appendTo(this.cardHolder);
		line.animate({
			width: dist
		}, 400, function() {
			setTimeout(function() {
				line.remove();
			}, 300);
		});
	},

	setPhase: function(turn, phase) {
		var yourTurn = (this.isPlaying && turn === 0);
		this.turnIndicator.text(yourTurn ?
				"your" : this.duelists[turn].uname + "'s");

		var ph = {
			'dp': "DP",
			'sp': "SP",
			'm1': "MP 1",
			'bp': "BP",
			'm2': "MP 2",
			'ep': "EP",
			'et': "EP"
		};
		this.phaseIndicator.text(ph[phase]);

		this.nextTurnIndicator.toggle(phase === 'et')
			.text(yourTurn ? "(waiting)" : "(next?)");
	},

	setLifePoints: function(pl, points, first) {
		var el = this.lpEl[pl];
		var w = {'width': (points < 8000 ? (points/80) : 100) + '%'};
		el.bg.animate(w, (first ? 0 : 500), function() {
			el.cont.text(points);
		});
	}
});


var Duel = Class.extend({
	locations: null,
	lifepoints: null,
	statuses: null,
	isPlaying: false,
	turn: 0,
	phase: '',
	map: null,
	ui: null,

	init: function(view) {
		this.isPlaying = !view.watch;
		this.locations = [];
		this.map = {};
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

		this.ui = new DuelUI(view, this);
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
			if (!c) return;
			this.mapCard(c);
			if (!c.underlay) return;
			c.underlay.cards.forEach(map);
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
		// Special locations used for movement should never get here.
		console.assert(pos !== 'underlay' && pos !== '');

		var pl = pos.slice(-1) - 1;
		pos = pos.slice(0, -1);

		// Fail to handle 'underlay' locations - they depend on the parent card.
		if (pos === 'underlay')
			return null;

		var locs = this.locations[pl];
		if (pos === 'deck' || pos === 'hand' || pos === 'extra')
			return locs[pos];
		if (pos === 'grave')
			return locs.gy;
		if (pos === 'rfg')
			return locs.banish;
		console.assert(pos === 'field');
		if (fieldPos < 5)
			return locs.st;
		if (fieldPos > 5)
			return locs.monsters;
		return locs.fieldspell;
	},

	verifyLocation: function(card, lname) {
		if (card.location instanceof FieldCardLocation) {
			console.assert(lname.startsWith('field'));
		}
		else if (card.location instanceof UnderlayCardLocation) {
			console.assert(lname.startsWith('underlay'));
		}
		else {
			var loc = this.getLocation(lname, undefined);
			console.assert(card.location === loc);
		}
	},

	getTopOfDeck: function(pl) {
		return this.locations[pl].deck.top();
	},

	refreshLocation: function(loc, card) {
		// Refresh an individual card's location, after it has moved to/from
		// there. (For hands, other cards need to rearrange, etc.)
		// 'card' can be null if no particular card is designated, or if the
		// card is no longer there.
		var ui = this.ui;
		if (loc instanceof HandCardLocation) {
			loc.cards.forEach(function(c) {
				ui.moveCard(c);
			});
		}
		else if (loc instanceof UnderlayCardLocation) {
			loc.cards.forEach(function(c) {
				ui.moveCard(c);
			});
			ui.moveCard(loc.base);
		}
		else if (card) {
			ui.moveCard(card);
			if (card.underlay) {
				card.underlay.cards.forEach(function(c) {
					ui.moveCard(c);
				});
			}
		}
	},

	deckShuffle: function(deck, base) {
		deck.shuffle(this, base);
		// TODO: Shuffle animation.
	},
	handShuffle: function(hand, base, data) {
		hand.shuffle(this, base, data);
		this.refreshLocation(hand, null);
		// TODO: (Better) shuffle animation.
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
		else if (toLoc instanceof CardPileLocation) {
			if (locPosition === 'bottom')
				toLoc.addToBottom(card);
			else
				toLoc.addToTop(card);
		}
		else {
			toLoc.addCard(card);
		}

		if (fromLoc !== toLoc)
			this.refreshLocation(fromLoc, null);
		this.refreshLocation(toLoc, card);
	},

	overlayCard: function(card, target, defense) {
		var toLoc = target.location;
		console.assert(toLoc instanceof FieldCardLocation);
		var fieldPosition = toLoc.getFieldPosition(target);

		card.makeUnderlay();
		var uloc = card.underlay;
		function add(c) {
			c.location.removeCard(c);
			c.location = uloc;
			c.defense = false;
			uloc.addCard(c);
		}
		add(target);
		if (target.underlay) {
			target.underlay.cards.forEach(add);
			target.underlay = null;
		}

		card.location.removeCard(card);
		card.location = toLoc;
		card.faceup = true;
		card.defense = defense;
		toLoc.addCard(card, fieldPosition);
		this.refreshLocation(toLoc, card);
	},

	addToken: function(id, owner, loc, fieldPosition) {
		var card = new DuelCard(id, loc, owner);
		card.defense = true;
		card.faceup = true;
		card.card = createToken();
		loc.addCard(card, +fieldPosition);
		this.mapCard(card);
		this.ui.makeCard(card);
	},

	destroyCard: function(card) {
		var loc = card.location;
		loc.removeCard(card);
		this.refreshLocation(loc, null);
		this.ui.destroyCard(card);
	},

	drawCard: function(pl, icard) {
		var card = this.locations[pl].deck.top();
		var hand = this.locations[pl].hand;
		var ownHand = (this.isPlaying && pl === 0);
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
		this.ui.setLifePoints(pl, points, false);
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
		this.ui.setUI();
	},

	_initFromWatchData: function(data) {
		this.phase = data[0];
		this.turn = (data[1] === 'true' ? 0 : 1);
		var latestFieldSpellPlayer = (data[2] === 'true' ? 0 : 1);
		this.lifepoints = [+data[3], +data[4]];
		this.statuses = [data[5], data[6]];

		var ind = 7;
		var underlays = [];
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

			if (!loc) {
				underlays.push(card);
			}
			else {
				if (underlays.length > 0) {
					card.makeUnderlay();
					var uloc = card.underlay;
					for (var i = 0; i < underlays.length; ++i) {
						underlays[i].location = uloc;
						uloc.addCard(underlays[i]);
					}
					underlays = [];
				}

				if (loc instanceof FieldCardLocation)
					loc.addCard(card, +fieldPosition);
				else if (loc instanceof CardPileLocation)
					loc.addToTop(card);
				else
					loc.addCard(card);
			}
		}

		this.mapAllCards();
		this.ui.setUI();
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
	duelLog: null,
	startingPlayer: null,
	duelState: '',
	duelists: null,
	nwatchers: 0,
	watch: false,
	loadData: null,
	queue: null,

	init: function(watch, data) {
		this._super();
		console.assert(watch); // for now
		this.watch = watch;
		this.loadData = data;
	},

	open: function() {
		var ind = 0;
		var data = this.loadData;
		this.loadData = null;
		this.duelState = data[ind++];

		this.duelists = [];
		for (var i = 0; i < 2; ++i) {
			this.duelists.push(new Duelist(data.slice(ind, ind+8)));
			ind += 8;
		}

		var watcherList = data[ind++].split(',');
		this.nwatchers = 0;
		for (var i = 0; i < watcherList.length; i += 2) {
			var name = watcherList[i], modStatus = watcherList[i+1];
			++this.nwatchers;
		}

		// Ignore duel log (sent only for mods).
		++ind;

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

		this.setCommands();
		this.queue = new Queue();
		this.duelLog = ChatManager.openDuelLog(this.watch ? null : function(msg) {
			this.sendChatMessage(msg);
		}.bind(this));
		this.watchChat = ChatManager.openWatchChat(function(msg) {
			this.sendWatchMessage(msg);
		});
		this.updateWatchTitle();
		this.collapseInfo = Sidebar.collapseUnimportant();
	},

	close: function() {
		if (this.duel)
			this.duel.destroy();
		this.queue.destroy();
		this.duelLog.close();
		this.duelLog.destroy();
		this.watchChat.close();
		this.watchChat.destroy();
		Sidebar.uncollapseUnimportant(this.collapseInfo);
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

			this.duel.verifyLocation(card, from);

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
		if (ev === 'Overlay') {
			var card = this.duel.getCard(+data[1]);
			this.duel.verifyLocation(card, data[0]);

			var to = data[2];
			var target = this.duel.getCard(+data[3]);
			this.duel.verifyLocation(target, to);

			var defense = (data[4] === 'true');

			if (data.length > 5)
				card.card = createCard(data.slice(5));

			this.duel.overlayCard(card, target, defense);
			return 500;
		}
		if (ev === 'Remove') {
			var card = this.duel.getCard(+data[1]);
			this.duel.verifyLocation(card, data[0]);
			this.duel.destroyCard(card);
			return 0;
		}
		if (ev === 'Attack') {
			var attacker = this.duel.getCard(data[1]);
			this.duel.verifyLocation(attacker, data[0]);
			var targetId = data[2];
			this.duel.ui.attack(attacker,
					(data[2] ? this.duel.getCard(data[2]) : null));
			return 700;
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

			var msg = uname + (dif > 0 ? " gains " : " loses ") +
				plural(Math.abs(dif), "lifepoint", "", "s") + ".";
			this.addToDuelLog(msg);
			return 0;
		}
		if (ev === 'Token') {
			var locName = data[0], id = +data[1], fieldPosition = data[2];
			var loc = this.duel.getLocation(locName, fieldPosition);
			var owner = locName.slice(-1) - 1;
			this.duel.addToken(id, owner, loc, fieldPosition);
			return 0;
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
			var pl = ev.slice(-1) - 1, status = data[0];
			this.duel.setStatus(pl, status);
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
					console.warn("Unhandled duel message: ", data[0], data.slice(1));
					time = 0;
				}
				return time;
			}.bind(this));
			return true;
		}
		if (ev === 'Add watcher') {
			var name = data[0], modStatus = data[1];
			++this.nwatchers;
			this.updateWatchTitle();
			return true;
		}
		if (ev === 'Remove watcher') {
			var name = data[0];
			--this.nwatchers;
			this.updateWatchTitle();
			return true;
		}
		if (ev === 'Watch message') {
			var from = data[0], msg = data[1];
			var user = Users.getUser(from);
			this.watchChat.addMessage(from, msg, user.getColor());
			return true;
		}
		if (ev === 'Turn pick') {
			this.startingPlayer = this.getDuelistFromName(data[0]);
			return true;
		}
		if (ev === 'Player quit') {
			this.addToDuelLog(data[0] + " has left the duel.");
			return true;
		}
		return false;
	},

	addToDuelLog: function(msg) {
		var line = $('<div class="duel-log-line">').text(msg);
		this.duelLog.addLine(line);
	},

	sendChatMessage: function(msg) {
		// TODO
	},

	sendWatchMessage: function(msg) {
		Communicator.send(['Watch message', msg]);
	},

	updateWatchTitle: function() {
		this.watchChat.setCount(this.nwatchers);
	},

	goBack: function() {
		ignoreLateMessages(this.ignoreLateMessage);
		setView(new MatchmakingView());
	},

	setCommands: function() {
		// TODO: Commands for when the chat has focus.
		if (this.watch) {
			Commands.setMap(this, [
				[1, "<enter>", "Chat (watch)"],
				[0, 'enter', "", function() { this.watchChat.focus(); }],
				[2, 'q', "Quit", this.goBack],
			]);
			return;
		}
		Commands.setMap(this, []);
	}
});

})();
