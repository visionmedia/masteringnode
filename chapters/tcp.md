
# TCP

  ...

## TCP Servers

Many times, a server will do two things: write data to the console and send data to a client connection.  Below is a simple TCP server which echos "You were connected!" to a client connection and outputs "A client has connected!" to _stdout_.

	// tcp_server.js
	var sys = require('sys');
	var tcp = require('net');
	var server = tcp.createServer({ allowHalfOpen:false }, function(socket) {
	    sys.puts("A client has connected!");
	    socket.write("You were connected!\n", "utf8");
	    socket.end();
	}).listen(8000, '127.0.0.1');


To test this server, enter `node tcp_server.js` in a terminal.  Then, open another terminal to telnet into this server.

	$ telnet 127.0.0.1 8000

In the server's terminal, you should see the message output from `sys.puts`, while the client's server should display, "You were connected!"

## TCP Clients

 ...
