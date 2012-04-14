
;(function() {
"use strict";

window.Card = Class.extend({
	id: -1,
	number: 0,
	name: '',
	treatedAs: '',
	imageUrl: '',
	text: '',
	limit: 0
});

window.MonsterCard = Card.extend({
	type: '',
	attribute: '',
	atk: '',
	def: '',
	level: 0
});

window.EffectMonsterCard = MonsterCard.extend({});
window.NormalMonsterCard = MonsterCard.extend({});
window.SynchroMonsterCard = MonsterCard.extend({});

window.STCard = Card.extend({
	type: ''
});

window.SpellCard = STCard.extend({});
window.TrapCard = STCard.extend({});

// Unimplemented
window.FusionMonsterCard = SynchroMonsterCard;
window.XYZMonsterCard = SynchroMonsterCard;
window.RitualMonsterCard = SynchroMonsterCard;

window.createCard = function(data) {
	console.assert(data.length === 16);

	var type = data[5], card = null;
	if (type === 'effect')
		card = new EffectMonsterCard;
	else if (type === 'normal')
		card = new NormalMonsterCard;
	else if (type === 'synchro')
		card = new SynchroMonsterCard;
	else if (type === 'xyz')
		card = new XYZMonsterCard;
	else if (type === 'ritual')
		card = new RitualMonsterCard;
	else if (type === 'spell')
		card = new SpellCard;
	else if (type === 'trap')
		card = new TrapCard;
	console.assert(card);

	card.id = +data[0];
	card.number = +data[1];
	card.name = data[2];
	card.imageUrl = UrlBase + "images/cards/" + data[3];
	card.treatedAs = data[4];
	card.type = data[6];
	card.text = data[8];
	card.limit = +data[12];
	if (card instanceof MonsterCard) {
		card.attribute = data[7];
		card.atk = data[9];
		card.def = data[10];
		card.level = +data[11];
	}
	return card;
};

})();
