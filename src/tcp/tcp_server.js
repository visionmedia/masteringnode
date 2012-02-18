var sys = require('sys');
var net = require('net');
var server = net.createServer({ allowHalfOpen:false }, function(socket) {
    sys.puts("A client has connected!");
    socket.write("You were connected!\n", "utf8");
    socket.end();
}).listen(8000, '127.0.0.1');
