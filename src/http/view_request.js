var http = require('http'), 
    fs = require('fs'), 
    util = require('util');

http.createServer(function(req, res) {
    console.log("Received a request!");
    fs.writeFile('./request.txt', util.inspect(req) );
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    res.write("<html><head></head><body><h1>Hello, World!</h1><p>We're serving up html!</p></body></html>");
    res.end();
    fs.writeFile('./response.txt', util.inspect(res) );
}).listen(9111);

console.log("Server is running on http://localhost:9111");
