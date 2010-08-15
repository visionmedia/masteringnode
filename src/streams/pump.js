
/**
 * Module dependencies.
 */

var http = require('http'),
    sys = require('sys');

http.createServer(function(req, res){
    res.writeHead(200);
    sys.pump(req, res);
}).listen(3000);