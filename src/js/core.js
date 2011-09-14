
;(function() {

// An abstract 'view' class - exactly one view is active at a time and
// represents a fullscreen activity like 'Deck Constructor' or 'Duel'.
function View() {}

// A destructor function, called when the view is replaced by another.
View.prototype.close = function() {};

// The message handler function, called when a socket message is received.
// Should return a boolean indicating whether event was handled by the view;
// if so, it does not bubble on to the global message handler or generate an
// error.
View.prototype.handleMessage = function(ev, data) { return false; };

// The id of the related DOM element.
View.prototype.id = null;

window.View = View;


var currentView = null;
function setView(view) {
	if (currentView !== null) {
		currentView.close();
		$('#'+currentView.id).removeClass('active');
	}
	currentView = view;
	$('#'+currentView.id).addClass('active');
}
window.setView = setView;

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
		if (this.timer !== null) {
			this.has = true;
			this.lost = lost;
			this.timer = setInterval(this.beat, 30000);
		}
	},
	stop: function() {
		if (this.timer !== null) {
			clearInterval(this.timer);
			this.timer = null;
			this.lost = null;
		}
	}
};


var connectListener = null;
var heartbeatListener = null;
window.messages = [];
function handleMessage(msg) {
	window.messages.push(msg);
	if (msg.length === 0) return;
	var ev = msg[0];
	var data = msg.slice(1);
	if (Heartbeat.listener(ev, data))
		return;
	if (connectListener && connectListener(ev, data))
		return;
	if (currentView.handleMessage(ev, data))
		return;

	if (ev === 'Online users' || ev === 'Offline users')
		return;
	if (ev === 'Chat unlock')
		return;

	// TODO: Handle chat etc. properly.
	console.warning('Interesting message: ', ev, data);
}

function lostConnection() {
	Communicator.close();
	setView(new ErrorView("Lost connection! (oh noes)"));
}

function connect(user, pass, callback) {
	// Yup. This is how you log in to DuelingNetwork.
	// XXX: Maybe this should go in LoginView.

	function close(err) {
		connectListener = null;
		Heartbeat.stop();
		Communicator.close();
		callback(err);
	}

	function pwdListener(ev, data) {
		if (ev === 'Change password') {
			connectListener = null;
			callback('success');
			return true;
		}
		if (ev === 'Error' && data[0] === 'Invalid current password') {
			close('password');
			return true;
		}
		return false;
	}

	function connectedListener(ev, data) {
		if (ev === 'Connected' && data.length >= 1) {
			// TODO: Do something with this?
			var admin = parseInt(data[0], 10);

			connectListener = pwdListener;
			Communicator.send(['Change password', pass, pass]);
			return true;
		}

		// If the first response isn't 'Connected', we're doomed. DOOMED.
		close('badconnect');
		return true;
	}

	function randHex() {
		var ret = '';
		for (var i = 0; i < 32; ++i) {
			ret += Math.floor(Math.random() * 16).toString(16);
		}
		return ret;
	}

	function socketStatus(st) {
		if (st === 'connected') {
			connectListener = connectedListener;
			Communicator.send(['Connect6', user, randHex(), randHex()]);
			Heartbeat.start(lostConnection);
		}
		else {
			// TODO: Give some error if not in login phase.
			callback('socket');
		}
	}

	Communicator.open(handleMessage, socketStatus);
}
window.connect = connect;

})();

