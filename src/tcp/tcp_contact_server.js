var sys = require('sys'),
    net = require('net'),
    util = require('util'),
    port = 9108,
    contacts = [];

var showHelp = function(socket) {
    var msg = 'Commands: [quit help save list]\n' +
        '\tquit- closes the connection\n' +
        '\thelp- displays this message\n' +
        '\tsave- saves the contact. e.g save Jim Schubert\n' +
        '\tlist- displays the list of contacts\n';
    socket.write(msg);
};

var onData = function(socket, buffer) {
    var buffer = buffer || new Buffer('');    

    // Uncomment the next call and notice sys.puts 
    // shows the buffer ends in a '\r\n', not '\n'.
    // sys.puts('Command received:  (' + util.inspect(buffer) + ')\n');
    var arg = buffer.toString().replace('\r\n', '');
    var command = arg.substring(0,4);
    sys.puts('Received data: ' + command);
    
    switch(command) {
        case 'quit':
        socket.end('Goodbye!\n');
        return;
        break;

        case 'help':
        showHelp(socket);
        break;

        case 'save':
        var toSave = arg.replace(command,'').trim();
        if(toSave) {
            contacts.push(toSave);
            socket.write(toSave + ' was saved\n');
        } else {
            socket.write('Syntax is: save FirstName LastName\n');
        }
        break;

        case 'list':
        if(contacts.length > 0) {
            socket.write('Current contacts:\n');
            contacts.forEach(function(val, idx) {
                socket.write(' ·' + val + '\n');
            });
        } else {
            socket.write('There are no contacts!\n\n');
        }
        break;

        default:
        socket.write(command + ' is an invalid command\n\n');
    }
};

var server = net.createServer({ allowHalfOpen: false }, function(socket) {
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
