var socket;
function socketConnect() {
   var host1 = location.href.replace("http", "ws");
   var host;
   if (host1.indexOf("/tetris") >= 0) {
      host = host1.substring(0, host1.indexOf("/tetris"));
   } else { 
      host = host1;
   }
   debugoutput("Connecting to " + host);
   socket = new WebSocket(host);
   socket.onopen = function(e) {
      debugoutput("Connection opened to " + host);
   }
   socket.onclose = function(e) {
      debugoutput("Connection closed to " + host);
      socket = null;
   }
   socket.onerror = function(e) {
      warnoutput("Connection error to " + host);
      socket = null;
   }
}

function socketDisconnect() {
   if (socket) socket.close();
}

function socketSend(message) {
   try {
      if (message && socket) { socket.send(message); }
   } catch (e) {
      erroroutput("Exception sending message " + message);
   }
}
