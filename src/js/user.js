
;(function() {
"use strict";

window.User = Class.extend({
	name: null,
	modStatus: 0,

	init: function(name, mod) {
		this.name = name;
		this.modStatus = mod;
	},

	isFriend: function() {
		return Friends.isFriend(this.name);
	},

	getColor: function() {
		// TODO: Properly color different kinds of admins.
		if (this.modStatus === 0) return 'black';
		return 'darkblue';
	}
});

window.Users = Listenable.extendObject({
	map: {},

	isOnline: function(name) {
		return (this.getUser(name) !== null);
	},

	getUser: function(name) {
		return this.map[',' + name] || null;
	},

	handleMessage: function(ev, data) {
		if (ev === 'Online users') {
			for (var i = 0; i < data.length; ) {
				var name = data[i++], mod = +data[i++];
				var user = this.map[',' + name] = new User(name, mod);
				this.dispatch('online', user);
			}
			return true;
		}

		if (ev === 'Offline users') {
			for (var i = 0; i < data.length; ++i) {
				var name = data[i];
				var user = this.map[',' + name];
				delete this.map[',' + name];
				this.dispatch('offline', user);
			}
			return true;
		}
	},

	sendCurrentInfo: function(handler) {
		var cb = this.getSingleDispatcher(handler);
		for (var ind in this.map) {
			var user = this.map[ind];
			cb('online', user);
		}
	}
});

window.IgnoreList = Listenable.extendObject({
	list: [],
	map: {},

	has: function(name) {
		return this.map.hasOwnProperty(',' + name);
	},

	add: function(name) {
		this.map[',' + name] = true;
		this.list.push(name);
		this.dispatch('add', name);
		this.save();
	},

	save: function() {
		try {
			localStorage.dnIgnore = this.list.map(encodeURIComponent).join(',');
		} catch(e) {}
	},

	load: function() {
		try {
			this.list = localStorage.dnIgnore.split(',').map(decodeURIComponent);
			var that = this;
			this.list.forEach(function(name) {
				that.map[',' + name] = true;
			});
		} catch(e) {}
	}
});

window.Friends = Listenable.extendObject({
	loaded: false,
	map: {},
	friends: [],

	isFriend: function(name) {
		return !!this.map[',' + name];
	},

	handleMessage: function(ev, data) {
		if (ev === 'Friends') {
			console.assert(!this.loaded);
			this.loaded = true;
			this.friends = [];

			var that = this;
			data.forEach(function(name) {
				that.doAddFriend(name);
			});

			Users.listen(function(ev, user) {
				if (that.isFriend(user.name)) {
					// Pass online/offline signals regarding friends on.
					that.dispatch(ev, user);
				}
			});
			return true;
		}

		if (ev === 'Add friend') {
			this.doAddFriend(data[0]);
			return true;
		}
		if (ev === 'Delete friend') {
			this.doRemoveFriend(data[0]);
			return true;
		}
	},

	doAddFriend: function(name) {
		console.assert(!this.map[',' + name]);
		this.friends.push(name);
		this.map[',' + name] = 1;

		this.dispatch('friend', name);
		var user = Users.getUser(name);
		if (user) this.dispatch('online', user);
	},

	doRemoveFriend: function(name) {
		var ind = this.friends.indexOf(name);
		console.assert(ind !== -1);
		this.friends.splice(ind, 1);
		delete this.map[',' + name];

		var user = Users.getUser(name);
		if (user) this.dispatch('offline', user);
		this.dispatch('unfriend', name);
	},

	addFriend: function(name) {
		Communicator.send(['Add friend', name]);
		// We will shortly receive either an 'Add friend' signal back, or one
		// of the following 'Async error's:
		// - ["<user> is not a registered user"]
		// - ["<user> is already your friend"]
	},

	removeFriend: function(name) {
		Communicator.send(['Delete friend', name]);
		// We will shortly receive either an 'Delete friend' signal back, or
		// an 'Async error' with data ["<user> is not your friend"].
	},

	sendCurrentInfo: function(handler) {
		var cb = this.getSingleDispatcher(handler);
		this.friends.forEach(function(name) {
			cb('friend', name);
			var user = Users.getUser(name);
			if (user) cb('online', user);
		});
	}
});

})();
