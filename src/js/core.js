
;(function() {
"use strict";

// An abstract 'view' class - exactly one view is active at a time and
// represents a fullscreen activity like 'Deck Constructor' or 'Duel'.
window.View = Class.extend({

	// A destructor function, called when the view is replaced by another.
	close: function() {},

	// The message handler function, called when a socket message is received.
	// Should return a boolean indicating whether event was handled by the
	// view; if so, it does not bubble on to the global message handler or
	// generate an error.
	handleMessage: function(ev, data) { return false; },

	// A virtual function called when there is a network error (the socket
	// closing prematurely, the server not responding to heartbeats, or so).
	// The connection has been closed when this is called.
	handleError: function(err) {
		setView(new ErrorView("The connection was lost."));
	},

	// A virtual function meant to setup a view's UI. It is called from the
	// View constructor the first time the class is constructed.
	loadUI: function() {},

	// The id of the related DOM element.
	id: null,

	// The DOM element. Equal to $('#' + id) and set by the View constructor.
	ui: null,

	init: function() {
		this.ui = $('#'+this.id);
		if (this.ui.data('loaded') !== 'yes') {
			this.ui.data('loaded', 'yes');
			this.loadUI();
		}
	}
});


var currentView = null;
window.setView = function(view) {
	if (currentView !== null) {
		currentView.close();
		$('#'+currentView.id).removeClass('active');
	}
	window.dbgCurrentView = currentView = view;
	$('#'+currentView.id).addClass('active');
};


var Heartbeat = {
	has: null,
	timer: null,
	lost: null,

	listener: function(ev, data) {
		if (ev === 'Heartbeat') {
			this.has = true;
			return true;
		}
		return false;
	},

	beat: function() {
		// TODO: Check for responses after a shorter time, and at least
		// indicate possible disconnection.
		if (!this.has) {
			var cb = this.lost;
			this.stop();
			cb();
		}
		else {
			Communicator.send(['Heartbeat']);
			this.has = false;
		}
	},

	start: function(lost) {
		if (this.timer === null) {
			this.has = true;
			this.lost = lost;
			this.timer = setInterval(this.beat.bind(this), 30000);
		}
	},

	stop: function() {
		if (this.timer !== null) {
			Communicator.close();
			clearInterval(this.timer);
			this.timer = null;
			this.lost = null;
		}
	}
};


window.messages = []; // for debugging
function handleMessage(msg) {
	window.messages.push(msg);
	if (msg.length === 0) return;
	var ev = msg[0];
	var data = msg.slice(1);
	if (Heartbeat.listener(ev, data))
		return;
	if (currentView.handleMessage(ev, data))
		return;
	if (ChatManager.handleMessage(ev, data))
		return;

	// Avoid spam in the console
	if (ev === 'Online users' || ev === 'Offline users')
		return;

	console.warn('Interesting message: ', ev, data);
}

function lostConnection() {
	Communicator.closeConnection();
	currentView.handleError('lost-connection');
}

Communicator.openConnection = function(success) {
	function socketStatus(st) {
		if (st === 'connected') {
			Heartbeat.start(lostConnection);
			success();
		}
		else {
			Heartbeat.stop();
			currentView.handleError(st);
		}
	}

	Communicator.open(handleMessage, socketStatus);
};

Communicator.closeConnection = function() {
	Heartbeat.stop();
	Communicator.close();
};

})();
