
;(function() {
"use strict";

window.User = Class.extend({
	name: null,
	modStatus: 0,

	init: function(name, mod) {
		this.name = name;
		this.modStatus = mod;
	}
});

window.Users = {
	map: {},
	cbMap: {},
	cbInd: 0,

	listen: function(callback) {
		var handler = 'cb' + (this.cbInd++);
		this.cbMap[handler] = callback;
		return handler;
	},

	unlisten: function(handler) {
		delete this.cbMap[handler];
	},

	isOnline: function(name) {
		return (this.getUser(name) !== null);
	},

	getUser: function(name) {
		return map[',' + name] || null;
	},

	handleMessage: function(ev, data) {
		if (ev === 'Online users') {
			for (var i = 0; i < data.length; ) {
				var name = data[i++], mod = data[i++];
				var user = this.map[',' + name] = new User(name, mod);
				this.dispatch('online', user);
			}
			return true;
		}
		else if (ev === 'Offline users') {
			for (var i = 0; i < data.length; ++i) {
				var name = data[i];
				var user = this.map[',' + name];
				this.dispatch('offline', user);
				delete this.map[',' + name];
			}
			return true;
		}
	},

	dispatch: function() {
		for (var cb in cbMap) {
			cbMap[cb].call(arguments);
		}
	}
};

window.Friends = {
	loaded: false,
	cbMap: {},
	cbInd: 0,
	map: {},
	friends: [],

	listen: function(callback) {
		var handler = 'cb' + (this.cbInd++);
		this.cbMap[handler] = callback;
		return handler;
	},

	unlisten: function(handler) {
		delete this.cbMap[handler];
	},

	isFriend: function(name) {
		return !!this.map[',' + name];
	},

	handleMessage: function(ev, data) {
		if (ev === 'Friends') {
			if (this.loaded) {
				console.warn("Friend data gotten twice.");
				return;
			}
			this.loaded = true;

			this.friends = data.slice();
			for (var i = 0; i < data.length; ++i) {
				var name = data[i];
				this.map[',' + name] = 1;
				var user = Users.getUser(name);
				if (user) this.dispatch('online', user);
			}

			var that = this;
			Users.listen(function(ev, user) {
				if (that.isFriend(user.name)) {
					that.dispatch(ev, user);
				}
			});
			return true;
		}
	},

	dispatch: function() {
		for (var cb in cbMap) {
			cbMap[cb].call(arguments);
		}
	}
};

})();
