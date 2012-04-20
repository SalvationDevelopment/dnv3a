
;(function() {
"use strict";

var replays = {
	'watch': [
		"Watch duel,Turn pick,simonlindholm3,0/1.jpg,,255,255,100,0,false,simonlindholm2,0/1.jpg,,255,255,100,0,false,simonlindholm\\,0,",
		"Turn pick,simonlindholm3",
		"Duel start,40,0,0,0,44,40,0,0",
		"Duel,Move,hand1,1,field1,8,false,false,,,74,98719226,Alien Warrior,55.scf,Alien Warrior,effect,Reptile/Effect,earth,When this card is destroyed by battle and sent to the Graveyard\\, place 2 A-Counters on the monster that destroyed it. (If a monster with an A-Counter battles an \"Alien\" monster\\, it loses 300 ATK and DEF for each A-Counter during damage calculation only.),1800,1000,4,3,,,",
		"Duel,Phase,et,simonlindholm3",
		"Duel,Phase,dp,simonlindholm2,true",
		"Duel,Move,hand2,45,field2,8,false,false,,,3518,67300516,Red-Eyes Wyvern,3344.scf,Red-Eyes Wyvern,effect,Dragon/Effect,wind,During your End Phase\\, if you did not Normal Summon or Set a monster this turn\\, you can remove from play this card from your Graveyard to Special Summon 1 \"Red-Eyes\" monster from your Graveyard\\, except \"Red-Eyes B. Chick\".,1800,1600,4,3,,,",
		"Duel,Move,hand2,43,field2,5,false,false,,,17,00295517,A Legendary Ocean,16.scf,Umi,spell,field,,This card's name is treated as \"Umi\". Downgrade all WATER monsters in both player's hands and on the field by 1 Level. Increases the ATK and DEF of all WATER monsters by 200 points.,?,?,,3,,,",
		"Duel,Move,hand2,42,field2,2,true,false,,",
		"Duel,Move,hand2,41,field2,9,false,false,,special,1857,43793530,Giga Gagagigo,1274.scf,Giga Gagagigo,normal,Reptile,water,In order to fight tremendous evil\\, he gained formidable power through body reconstruction\\, but lost his heart and his redemption.,2450,1500,5,3,,,",
		"Duel,Move,hand2,44,field2,7,true,true,,",
		"Duel,Move,hand2,40,grave2,,false,false,,,3517,88264978,Red-Eyes Darkness Metal Dragon,2323.scf,Red-Eyes Darkness Metal Dragon,effect,Dragon/Effect,dark,You can remove from play 1 Dragon-Type monster you control to Special Summon this card. Once per turn\\, during your Main Phase\\, you can Special Summon 1 Dragon-Type monster\\, except \"Red-Eyes Darkness Metal Dragon\"\\, from your hand or Graveyard.,2800,2400,10,3,,,",
		"Duel,Move,field2,42,hand2,,true,false,,",
		"Duel,Phase,m1,simonlindholm2",
		"Duel,Phase,bp,simonlindholm2",
		"Duel,Attack,field2,41,1",
		"Duel,Phase,et,simonlindholm2",
		"Duel,Phase,dp,simonlindholm3,true",
		"Watch message,simonlindholm3,Hello.,0",
		"Duel,Move,field1,1,field1,8,false,true,,",
		"Duel,Reveal and move,hand1,5,hand1,,true,false,,,251,20277860,Armored Zombie,177.scf,Armored Zombie,normal,Zombie,dark,This warrior blindly swings a deadly blade with devastating force.,1500,0,3,3,,,",
		"Duel,Hand shuffle,hand1,84",
		"Duel,Move,hand1,86,deck1,,true,false,,",
		"Duel,Move,hand1,85,rfg1,,false,false,,,1255,66672569,Dragon Zombie,917.scf,Dragon Zombie,normal,Zombie,dark,A dragon revived by sorcery. Its breath is highly corrosive.,1600,0,3,3,,,",
		"Duel,Move,hand1,84,field1,9,false,false,,,296,75081613,Aztekipede\\, the Worm Warrior,203.scf,Aztekipede\\, the Worm Warrior,effect,Insect/Effect,earth,This card cannot be Normal Summoned or Set. This card cannot be Special Summoned except by removing from play 1 Insect-Type monster from your Graveyard. When this card inflicts Battle Damage to your opponent\\, send the top card of their Deck to the Graveyard.,1900,400,4,3,,,",
		"Duel,Life points,simonlindholm3,7800",
		"Duel,Token,field1,90,7",
		"Duel,Coin,simonlindholm3,heads",
		"Duel,Die,simonlindholm3,2",
		"Duel,Die,simonlindholm3,5",
		"Duel,Die,simonlindholm3,1",
		"Duel,Phase,ep,simonlindholm3",
		"Duel,Move,field1,84,field1,9,false,true,,",
		"Duel,Move,field1,84,field2,10,false,true,,",
		"Duel,Phase,et,simonlindholm3",
		"Duel,Phase,dp,simonlindholm2,true",
		"Duel,Move,hand2,46,field2,2,false,false,,,2081,74519184,Hand Destruction,1436.scf,Hand Destruction,spell,quickplay,,Each player sends 2 cards from their hand to the Graveyard and draws 2 cards.,?,?,,3,,,",
		"Duel,Status2,Viewing Deck",
		"Duel,Move,deck2,76,field2,6,false,false,,special,513,89631139,Blue-Eyes White Dragon,331.scf,Blue-Eyes White Dragon,normal,Dragon,light,This legendary dragon is a powerful engine of destruction. Virtually invincible\\, very few have faced this awesome creature and lived to tell the tale.,3000,2500,8,3,,,",
		"Duel,Move,deck2,77,rfg2,,true,false,,",
		"Duel,Move,deck2,78,rfg2,,false,false,,,168,10667321,Ancient Rules,114.scf,Ancient Rules,spell,normal,,Special Summon 1 Level 5 or higher Normal Monster from your hand.,?,?,,3,,,",
		"Duel,Status2,",
		"Duel,Shuffle,deck2,91",
		"Duel,Move,deck2,,grave2,,false,false,,,1857,43793530,Giga Gagagigo,1274.scf,Giga Gagagigo,normal,Reptile,water,In order to fight tremendous evil\\, he gained formidable power through body reconstruction\\, but lost his heart and his redemption.,2450,1500,5,3,,,",
		"Duel,Move,field2,46,hand2,,true,false,,",
		"Duel,Hand shuffle,hand2,125",
		"Duel,Hand shuffle,hand2,127",
		"Duel,Status1,Viewing Opponent's Hand",
		"Duel,Status1,",
		"Duel,Hand shuffle,hand2,129",
		"Duel,Status1,Viewing Opponent's Banished",
		"Duel,Status1,",
		"Duel,Status2,Viewing Opponent's Banished",
		"Duel,Status2,",
		"Duel,Life points,simonlindholm3,8000",
		"Player quit,simonlindholm3",
		"Player quit,simonlindholm2",
	],
	'watch2': [
		"Watch duel,Duel,simonlindholm2,0/1.jpg,,255,255,100,0,false,simonlindholm,0/1.jpg,,255,255,100,0,false,simonlindholm3\\,0,,dp,true,false,8000,8000,Viewing Extra Deck,,deck1,43,,true,false,true,false,deck1,42,,true,false,true,false,deck1,41,,true,false,true,false,deck1,40,,true,false,true,false,deck1,39,,true,false,true,false,deck1,38,,true,false,true,false,deck1,37,,true,false,true,false,deck1,36,,true,false,true,false,deck1,35,,true,false,true,false,deck1,34,,true,false,true,false,deck1,33,,true,false,true,false,deck1,32,,true,false,true,false,deck1,31,,true,false,true,false,deck1,30,,true,false,true,false,deck1,29,,true,false,true,false,deck1,28,,true,false,true,false,deck1,27,,true,false,true,false,deck1,26,,true,false,true,false,deck1,25,,true,false,true,false,deck1,24,,true,false,true,false,deck1,23,,true,false,true,false,deck1,22,,true,false,true,false,deck1,21,,true,false,true,false,deck1,20,,true,false,true,false,deck1,19,,true,false,true,false,deck1,18,,true,false,true,false,deck1,17,,true,false,true,false,deck1,16,,true,false,true,false,deck1,15,,true,false,true,false,deck1,14,,true,false,true,false,deck1,13,,true,false,true,false,deck1,12,,true,false,true,false,deck1,11,,true,false,true,false,deck1,10,,true,false,true,false,deck1,9,,true,false,true,false,deck1,8,,true,false,true,false,deck1,7,,true,false,true,false,deck1,6,,true,false,true,false,deck2,83,,true,false,false,false,deck2,82,,true,false,false,false,deck2,81,,true,false,false,false,deck2,80,,true,false,false,false,deck2,79,,true,false,false,false,deck2,78,,true,false,false,false,deck2,77,,true,false,false,false,deck2,76,,true,false,false,false,deck2,75,,true,false,false,false,deck2,74,,true,false,false,false,deck2,73,,true,false,false,false,deck2,72,,true,false,false,false,deck2,71,,true,false,false,false,deck2,70,,true,false,false,false,deck2,69,,true,false,false,false,deck2,68,,true,false,false,false,deck2,67,,true,false,false,false,deck2,66,,true,false,false,false,deck2,65,,true,false,false,false,deck2,64,,true,false,false,false,deck2,63,,true,false,false,false,deck2,62,,true,false,false,false,deck2,61,,true,false,false,false,deck2,60,,true,false,false,false,deck2,59,,true,false,false,false,deck2,58,,true,false,false,false,deck2,57,,true,false,false,false,deck2,56,,true,false,false,false,deck2,55,,true,false,false,false,deck2,54,,true,false,false,false,deck2,53,,true,false,false,false,deck2,52,,true,false,false,false,deck2,51,,true,false,false,false,deck2,50,,true,false,false,false,hand1,0,,true,false,true,false,hand1,3,,true,false,true,false,extra1,84,,true,false,true,false,extra1,85,,true,false,true,false,extra1,86,,true,false,true,false,extra1,87,,true,false,true,false,extra2,88,,true,false,false,false,extra2,89,,true,false,false,false,extra2,90,,true,false,false,false,extra2,91,,true,false,false,false,extra2,92,,true,false,false,false,extra2,93,,true,false,false,false,extra2,94,,true,false,false,false,extra2,95,,true,false,false,false,extra2,96,,true,false,false,false,extra2,97,,true,false,false,false,extra2,98,,true,false,false,false,extra2,99,,true,false,false,false,extra2,101,,true,false,false,false,grave1,4,,false,false,true,true,4436,38120068,Trade-In,2917.scf,Trade-In,spell,normal,,Discard 1 Level 8 monster. Draw 2 cards.,?,?,,3,,,,grave2,44,,false,false,false,true,1178,81674782,Dimensional Fissure,865.scf,Dimensional Fissure,spell,continuous,,Any monster sent to the Graveyard is banished instead.,?,?,,3,,,,rfg2,45,,false,false,false,true,2841,44656491,Messenger of Peace,1896.scf,Messenger of Peace,spell,continuous,,During each of your Standby Phases pay 100 Life Points or destroy this card. Neither player can declare attacks with face-up monsters with 1500 or more ATK.,?,?,,3,,,,rfg2,49,,false,false,false,true,926,07572887,D.D. Warrior Lady,661.scf,D.D. Warrior Lady,effect,Warrior/Effect,light,When this card battles with your opponent's monster\\, after damage calculation you can remove from play the opponent's monster and this card.,1500,1600,4,3,,,,field1,1,3,true,false,true,false,field1,2,8,true,true,true,false,field2,48,2,false,false,false,true,1991,16762927,Gravekeeper's Servant,1369.scf,Gravekeeper's Servant,spell,continuous,,Your opponent cannot declare an attack unless they send 1 card from the top of their Deck to the Graveyard.,?,?,,3,,,,field2,46,3,false,false,false,true,4944,83764718,Monster Reborn,1970.scf,Monster Reborn,spell,normal,,Special Summon 1 monster from either player's Graveyard to your side of the field.,?,?,,1,,,,field2,100,9,false,false,false,true,1724,97204936,Gaia Knight\\, the Force of Earth,1225.scf,Gaia Knight\\, the Force of Earth,synchro,Warrior/Synchro,earth,1 Tuner + 1 or more non-Tuner Monsters,2600,800,6,3,,,,underlay2,47,0,false,false,false,true,3095,28297833,Necroface,2029.scf,Necroface,effect,Zombie/Effect,dark,When this card is Normal Summoned\\, shuffle all removed from play cards into their owners' Decks. This card gains 100 ATK for each of those cards. When this card is removed from play\\, both players remove from play the top 5 cards of their Deck.,1200,1800,4,1,,,,field2,102,8,false,false,false,true,5100,05014629,Submersible Carrier Aero Shark,SubmersibleCarrierAeroSharkVG-TF06-JP.jpg,Submersible Carrier Aero Shark,xyz,Fish/Xyz/Effect,water,2 Level 3 monsters\nOnce per turn: You can detach 1 Xyz Material from this card; inflict 100 damage to your opponent for each of your banished monsters.,1900,1000,3,3,,,,field2,5,7,false,false,true,true,3517,88264978,Red-Eyes Darkness Metal Dragon,2323.scf,Red-Eyes Darkness Metal Dragon,effect,Dragon/Effect,dark,You can Special Summon this card (from your hand) by banishing 1 face-up Dragon-Type monster you control. Once per turn: You can Special Summon 1 Dragon-Type monster from your hand or Graveyard\\, except \"Red-Eyes Darkness Metal Dragon\".,2800,2400,10,3,,,",
		"Duel,Move,extra1,87,field1,9,false,true,,special,1604,99267150,Five-Headed Dragon,1146.scf,Five-Headed Dragon,fusion,Dragon/Fusion/Effect,dark,5 Dragon-Type monsters\nThis monster cannot be Special Summoned except by Fusion Summon. This card cannot be destroyed by battle with an EARTH\\, WATER\\, FIRE\\, WIND\\, or DARK monster. (Damage calculation is applied normally.),5000,5000,12,3,959736,22736,5311a0f80d527620c63bc28fe77d892e",
		"Duel,Status1,",
		"Duel,Move,hand1,3,deck1,,true,false,,",
		"Duel,Move,hand1,0,deck1,,true,false,,",
		"Duel,Move,deck1,,hand1,,true,false,,",
		"Duel,Move,deck1,,hand1,,true,false,,",
		"Duel,Move,hand1,3,deck1,,true,false,,",
		"Duel,Move,deck1,,hand1,,true,false,,",
		"Duel,Move,deck1,,hand1,,true,false,,",
		"Duel,Move,hand1,6,deck1_bottom,,true,false,,",
		"Duel,Move,hand1,3,deck1_bottom,,true,false,,",
		"Duel,Move,field1,87,field1,2,false,false,,",
		"Duel,Move,field1,2,hand1,,true,false,,",
		"Duel,Hand shuffle,hand1,103",
		"Duel,Move,hand1,103,field1,8,true,true,,",
		"Duel,Move,field1,103,hand1,,true,false,,",
		"Duel,Hand shuffle,hand1,105",
		"Duel,Move,hand1,105,field1,1,false,false,,,4944,83764718,Monster Reborn,1970.scf,Monster Reborn,spell,normal,,Special Summon 1 monster from either player's Graveyard to your side of the field.,?,?,,1,43769,17712,2a60eb218f2a2043504976f8c3bb8ef9",
		"Duel,Move,field1,105,hand1,,true,false,,",
		"Duel,Hand shuffle,hand1,107",
		"Duel,Move,hand1,108,field1,1,false,false,,,4944,83764718,Monster Reborn,1970.scf,Monster Reborn,spell,normal,,Special Summon 1 monster from either player's Graveyard to your side of the field.,?,?,,1,43769,17712,2a60eb218f2a2043504976f8c3bb8ef9",
		"Load duel room,0,All-Out,false,Old Simochi,true,Warrior/Zombie,true"
	]
};

var DebugWidget = SidebarWidget.extend({
	order: 'd',
	importance: 3,
	title: "Debug log",

	holder: null,
	cont: null,
	filterField: null,
	filter: '',

	init: function() {
		this.ui = $('<div>').addClass('debug-widget');
		this.holder = $('<div>').addClass('sidebar-box-holder border-box')
			.appendTo(this.ui);
		this.cont = $('<div>').addClass('sidebar-box-cont border-box')
			.appendTo(this.holder);
		this.filterField = $('<input>').addClass('sidebar-box-field border-box')
		    .prop('value', '').attr('placeholder', "Filter...").appendTo(this.holder);

		this.cont.on('click', '.debug-row', function() {
			$(this).toggleClass('expand');
		});

		var that = this;
		this.filterField.on('input', function() {
			var el = that.cont[0];
			var scrollToBottom = (that.isVisible() &&
				el.scrollTop + el.offsetHeight === el.scrollHeight);

			var filt = that.filter = this.value.toLowerCase();
			that.cont.children().each(function() {
				$(this).toggle(this.textContent.toLowerCase().indexOf(filt) !== -1);
			});

			if (scrollToBottom)
				el.scrollTop = el.scrollHeight;
		});
	},

	addRow: function(ev, data, sending) {
		var el = this.cont[0];
		var scrollToBottom = (el.scrollTop + el.offsetHeight === el.scrollHeight);

		var row = $('<div>').addClass('debug-row').append(
			$('<span>').addClass('debug-ev').text(ev + (data.length ? "; " : ""))
		).append(
			$('<span>').text(data.join(","))
		).appendTo(this.cont);

		var obj = row[0];
		if (sending) {
			row.css('color', 'darkgreen');
		}

		if (obj.textContent.toLowerCase().indexOf(this.filter) === -1) {
			row.hide();
		}

		if (scrollToBottom)
			el.scrollTop = el.scrollHeight;
	}
});

window.messages = [];
window.Debug = {
	widget: null,

	isSpam: function(ev, data, sending) {
		// Tweak to whatever fits.
		if (ev === 'Heartbeat')
			return true;
		if (ev === 'Online users' || ev === 'Offline users')
			return true;
		if (ev === 'Add duels' || ev === 'Remove duels')
			return true;
		if (ev === 'Add watches' || ev === 'Remove watches')
			return true;
		if (ev === 'Global message' && !sending)
			return true;
		return false;
	},

	init: function() {
		this.widget = new DebugWidget();
		this.widget.open(true);

		// Add replays as needed.
		//this.replay('watch');
	},

	handleMessage: function(ev, data, sending) {
		messages.push([(sending ? 'SEND ' : '') + ev].concat(data));
		if (this.isSpam(ev, data, sending)) return;

		this.widget.addRow(ev, data, sending);
	},

	interceptSentMessages: function() {
		var orig = Communicator.send.bind(Communicator);
		Communicator.send = function(ar) {
			Debug.handleMessage(ar[0], ar.slice(1), true);
			orig(ar);
		};
	},

	replay: function(name) {
		var ar = replays[name];
		var i = 0;
		function iterate() {
			var m = ar[i++];
			Communicator._response(m.replace(/%/g, '%25'));
			if (!ar[i])
				btn.remove();
		}
		var btn = $('<button>').text("+").css({
			'position': 'absolute',
			'bottom': 0,
			'left': 0
		}).click(iterate).appendTo($('body'));
	}
};

})();
