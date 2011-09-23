import flash.external.ExternalInterface;

class Communicator {
	private var socket:flash.net.XMLSocket;
	private static var hex:String = "0123456789abcdef";

	private function respStatus(st:String) {
		ExternalInterface.call("Communicator._responseStatus", st);
	}

	private function dataHandler(e:flash.events.DataEvent) {
		// Use some sort of ugly encoding on the data, because
		// ExternalInterface.call sucks.
		var enc:String = "", data:String = e.data;
		for (i in 0...data.length) {
			var ch:Int = data.charCodeAt(i);
			if (ch > 255) {
				enc += 'U' + ch + 'U';
			}
			else {
				enc += hex.charAt(ch >> 4);
				enc += hex.charAt(ch & 15);
			}
		}
		ExternalInterface.call("Communicator._response", enc);
	}

	private function connectListener(e) {
		respStatus('connected');
	}
	private function closeListener(e) {
		respStatus('close');
	}
	private function secErrorListener(e) {
		respStatus('sec-error');
	}
	private function ioErrorListener(e) {
		respStatus('io-error');
	}

	private function openSocketFromJS() {
		socket = new flash.net.XMLSocket();
		socket.timeout = 5000;
		socket.addEventListener(flash.events.Event.CONNECT, connectListener);
		socket.addEventListener(flash.events.Event.CLOSE, closeListener);
		socket.addEventListener(flash.events.SecurityErrorEvent.SECURITY_ERROR, secErrorListener);
		socket.addEventListener(flash.events.IOErrorEvent.IO_ERROR, ioErrorListener);
		socket.addEventListener(flash.events.DataEvent.DATA, dataHandler);
		socket.connect("duelingnetwork.com", 1234);
	}

	private function closeSocketFromJS() {
		if (socket != null && socket.connected) {
			socket.close();
			socket = null;
		}
	}

	private function sendMessageFromJS(msg:String) {
		if (socket != null && socket.connected) {
			socket.send(msg);
		}
	}

	public function new() {
		ExternalInterface.addCallback("open", openSocketFromJS);
		ExternalInterface.addCallback("close", closeSocketFromJS);
		ExternalInterface.addCallback("sendMessage", sendMessageFromJS);
		ExternalInterface.call("Communicator._initialize");
	}

	static function main() {
		var c:Communicator = new Communicator();
	}
}
