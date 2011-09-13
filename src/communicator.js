
;(function() {
var Communicator = {};

Communicator.setup = function(ready) {
	Communicator.setup = function() {
		throw "Communicator.setup() should only be called once!";
	};
	Communicator._initialize = function() {
		var swf = document.getElementById('swf_communicator');
		var resp = null, statusHandler = null;
		delete Communicator.initialize;
		Communicator.open = function(respCb, statusCb) {
			resp = respCb;
			statusHandler = statusCb;
			swf.open();
		};
		Communicator.send = function(ar) {
			swf.sendMessage(arrayToString(ar));
		};
		Communicator.close = function() {
			swf.close();
		};
		Communicator._response = function(enc) {
			var pos = 0, ch, dec = '';
			while (pos < enc.length) {
				ch = enc.charAt(pos);
				if (ch === 'U') {
					var to = enc.indexOf('U', pos+1);
					if (to === -1) break;
					dec += String.fromCharCode(parseInt(enc.substring(pos+1, to), 10));
					pos = to+1;
				}
				else {
					dec += String.fromCharCode(parseInt(enc.substr(pos, 2), 16));
					pos += 2;
				}
			}
			window.messages.push(dec);
			resp(stringToArray(dec));
		};
		Communicator._responseStatus = function(st) {
			statusHandler(st);
		};
		if (ready) {
			ready(true);
			ready = null;
		}
	};

	function flashLoaded(e) {
		if (!e.success && ready) {
			ready(false);
			ready = null;
		}
	}

	var flashId = "swf_communicator";
	var flashvars = {};
	var params = {allowscriptaccess: 'always'};
	var attributes = {};
	var el = document.createElement('div');
	el.style.position = 'absolute';
	el.style.left = '-200px';
	el.style.top = '-200px';
	el.id = flashId;
	document.body.appendChild(el);
	swfobject.embedSWF("http://simonsoftware.se/dn/communicator.swf", flashId, "0", "0", "10.0.0", false, flashvars, params, attributes, flashLoaded);

	// Treat flash as not loading after five seconds.
	setTimeout(function() {
		if (ready) {
			ready(false);
			ready = null;
			var el = document.getElementById(flashId);
			if (el && el.parentNode) {
				el.parentNode.removeChild(el);
			}
		}
	}, 5000);
};

window.Communicator = Communicator;
})();
