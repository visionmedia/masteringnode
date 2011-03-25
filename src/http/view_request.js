var http = require('http'), 
    fs = require('fs'), 
    util = require('util'),
    tty = require('tty');

var server = http.createServer(function(req, res) {
    console.log("Received a request!");
    fs.writeFile((__dirname + '/request.txt'), util.inspect(req) );
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    res.write("<html><head></head><body><h1>Hello, World!</h1><p>We're serving up html!</p></body></html>");
    res.end();
    fs.writeFile((__dirname + '/response.txt'), util.inspect(res) );
});

process.on('exit', function(){
    if(server) {
        console.log('Shutting down the server on http://localhost:9111');
        server.close();
    }
});

process.on('SIGTERM', function(){
    process.exit(1);
});

process.stdin.on('keypress', function(char, key) {
  if (key && key.ctrl && key.name == 'c') {
    console.log('Caught interrupt signal');
    process.exit()
  }
});

server.listen(9111);
fs.writeFile((__dirname + '/server.txt'), util.inspect(server));
tty.setRawMode(true);
process.stdin.resume();

console.log("Server is running on http://localhost:9111");
console.log("Hit CTRL+C to shutdown the http server");
