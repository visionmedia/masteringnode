# Net (TCP)

The `net` module handles lower-level networking than the `http` module. In fact, the `http` module uses the `net` module to create connections and `http.Server` even inherits `net.Server` while adding listeners ('connect', 'request').

The `net` module was previously (pre- 0.2.0) called the `tcp` module.  The module was most likely renamed to create a logical API similar to other APIs.

What the `net` module really accomplishes is opening `sockets` for bi-directional communication.  These sockets can either be network-based (TCP/IP) or process-based.  Network-based sockets refer to addresses in the form _ip:port_, which you are probably very familiar with at this point.  Process-based sockets, commonly referred to as _inter-process communication (IPC) sockets_ or _unix domain sockets_, are generally meant for communicating between applications within the operating system. This does _not_ necessarily mean these sockets are inaccessible from the network. It only means they are not explicitly bound to an IP address and port number. _Unix domain sockets_ allow for TCP and UDP packets while the somewhat similar _named pipes_ in Windows allow for TCP packets.  This may be useful in unix-based systems for broadcast messages.  Any limitations with these file-based sockets will be limitations on the transport (TCP or UDP/datagrams).

An example of a _unix domain socket_ is the _iface\_socket_ one would find in _~/.dropbox_ (see [dropbox.com](http://www.dropbox.com/install?os=lnx) for download details).  Connecting to this socket and viewing activity is fairly easy.  Here, I have connected to the _unix domain socket_ and subsequently edited _~/Dropbox/Example.txt_ in gedit.

    $ nc -Ud /home/jim/.dropbox/iface_socket 
    shell_touch
    path    /home/jim/Dropbox/.goutputstream-J48D9V
    done
    shell_touch
    path    /home/jim/Dropbox
    done
    shell_touch
    path    /home/jim/Dropbox/Example.txt~
    done
    shell_touch
    path    /home/jim/Dropbox/Example.txt
    done
    shell_touch
    path    /home/jim/Dropbox/.goutputstream-J48D9V
    done
    shell_touch
    path    /home/jim/Dropbox/Example.txt~
    done
    shell_touch
    path    /home/jim/Dropbox/Example.txt
    done
    shell_touch
    path    /home/jim/Dropbox
    done

I apologize for the length of output here.  Dropbox also provides a _command\_socket_ which allows you to enter commands for processing.  Instead of focussing too much on _unix domain sockets_ right now, we will start with some TCP/IP examples. The application `nc` is the 'netcat' utility used to connect to file-based sockets.  It can also connect to network-based sockets and the manpage says it is scriptable whereas `telnet` is not.  Because Windows users may not have access to `nc`, we will use `telnet` for network-based sockets.


## TCP/IP Servers

Many times, a server will do two things: write data to the console (or, _stdout_) and send data to a client connection.  Below is a simple TCP server which echos "You were connected!" to a client connection and outputs "A client has connected!" to _stdout_.

	// tcp/tcp_server.js
	var sys = require('sys');
	var net = require('net');
	var server = net.createServer({ allowHalfOpen:false }, function(socket) {
	    sys.puts("A client has connected!");
	    socket.write("You were connected!\n", "utf8");
	    socket.end();
	}).listen(8000, '127.0.0.1');


To test this server, enter `node src/tcp/tcp_server.js` in a terminal.  Then, open another terminal to telnet into this server.

	$ telnet 127.0.0.1 8000

In the terminal running the server, you should see the message output from `sys.puts`, while the client terminal should display, "You were connected!".  Because this is TCP/IP, an address is made up of an IP address and a port number. The `listen()` function accepts the port and IP address used to bind this network-based socket.  On the other end, `telnet` requires the IP address and the port number.  If you were to execute `telnet` without a port number, the default port defined in _/etc/services_ would be used.  Grepping this file for 'telnet' should yield:

    $ cat /etc/services | grep telnet
    telnet      23/tcp
    rtelnet     107/tcp             # Remote Telnet
    rtelnet     107/udp
    telnets     992/tcp             # Telnet over SSL
    telnets     992/udp
    tfido       60177/tcp           # fidonet EMSI over telnet

So, invoking `telnet 127.0.0.1` may look like the program accepts an incomplete network socket address (missing port), but the operating system knows and understands these defaults.

It is important to understand that TCP server applications provide a "service" in the sense that a client makes a request and a server reponds. For example, HTTP is the ubiquitous protocol of internet web pages which uses the TCP/IP stack. In the TCP/IP protocol suite, an HTTP server and an HTTP client (or, browser) would exist at the _Application_ layer, while the `net` module would handle the _Transport_ layer and below. The HTTP protocol defines how a client makes a request and how a server responds to that request.

Because we have not discussed TCP clients yet and the first server example of this section provides a service of echoing the obvious, we should take a look at a TCP server example that does something (somewhat) useful-- allows the client user to enter contacts.

    // src/tcp/tcp_contact_server.js
    var sys = require('sys'),
        net = require('net'),
        util = require('util'),
        port = 9108,
        contacts = [];

    // ... some code omitted
    
    var opt = { allowHalfOpen: false };
    var server = net.createServer(opt, function(socket) {
        socket.write('Welcome to the contact manager!\n');
        socket.on('data', function(d) {
            var s = socket;
            onData(s, d);
        });
        showHelp(socket);
    });

    server.on('connection', function(socket) {
        sys.puts('Client connected! (' + socket.remoteAddress + ')');
    });

    server.listen(port, 'localhost', function() {
        sys.puts('TCP server listening on port ' + port);
    });
    
This is quite a bit of code to start.  You may have noticed that `net.createServer` and `.listen()` are no longer chained.  This is to make room for the 'connection' event binding.  Whenever a client connects to this server, we will write a message to _stdout_.  The `.listen()` function also accepts a callback function as the third argument. This function executes after the server is created successfully. It is not only important to give feedback to the client of an application, it is also important to provide some sort of output locally whether it is status messages, debug messages, or error messages.

The `showHelp(socket);` call will write a help message to the socket to which the client application is connected.  This help message resembles:

    Commands: [quit help save list]
	    quit- closes the connection
	    help- displays this message
	    save- saves the contact. e.g save Jim Schubert
	    list- displays the list of contacts
	    
The 'data' event captures a reference to the `socket` and passes it to the `onData` function along with the data from the client.  Although the documention for the `net` module claims this data may be either a `Buffer` or a `String`, play it safe and call `toString()` on that data. 

When a command is accepted from the client (the `d` passed to the emitted `'data'` event), the `onData` function does some processing on the data to determine the command (which we have limited to 4 letters) and any parameters, writing a status message to _stdout_:

    var arg = buffer.toString().replace('\r\n', '');
    var command = arg.substring(0,4);
    sys.puts('Received data: ' + command);
    
The function then switches on each of the known commands, writing out the response to the client. If a command is not known, or is in a format that is unexpected (it is case-sensitive), a message is written to the client that the command is invalid.  The 'save' case may be handled like this:

    var toSave = arg.replace(command,'').trim();
    if(toSave) {
        contacts.push(toSave);
        socket.write(toSave + ' was saved\n');
    } else {
        socket.write('Syntax is: save FirstName LastName\n');
    }
    
Because `save` and `save FirstName LastName` are both valid commands received from the client, the parameter(s) can be determined by removing the command from the line. If the result is `''`, no parameters were given and a message is displayed to the client.

Try this example by again opening two terminals.  In the first terminal, run:

    $ node src/tcp/tcp\_contact\_server.js
    
In the second terminal, connect by running `telnet localhost 9108`. Try saving two or three names, then send the `quit` command.  Reconnect and issue the `list` command. You'll notice that although we didn't persist the contacts to some persistent storage, it remains resident in memory as long as the server application is running.  Depending on your comfort with client-server technologies, this may seem like a basic concept. In any case, it is always important to be mindful of resources in your server application.

## TCP Clients

 ...
