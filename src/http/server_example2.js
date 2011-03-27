var util = require('util'),
	Server = require('./server/server2').Server;
var server = new Server({ port: 9222, ignorePaths: ["/favicon.ico", "/page3.html"] });

server.on('data', function(data) {
	console.log('Data before parsing:');
	console.log(util.inspect(data));
});
server.on('request', function(url) {
	console.log('Received request for %s', url);
});

server.on('requestComplete', function() {
	console.log('Completed Request');
});
