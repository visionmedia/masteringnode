
/**
 * Module dependencies.
 */

var http = require('http');

http.createServer(function(req, res){
    res.writeHead(200);
    req.on('data', function(data){
        res.write(data);
    });
    req.on('end', function(){
        res.end();
    });
}).listen(3000);