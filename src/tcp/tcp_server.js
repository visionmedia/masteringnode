var sys = require('sys');
var tcp = require('net');
var server = tcp.createServer({ allowHalfOpen:false }, function(socket) {
    sys.puts("A client has connected!");
    socket.write("You were connected!\n", "utf8");
    socket.end();
}).listen(8000, '127.0.0.1');
