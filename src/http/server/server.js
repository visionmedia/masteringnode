var http = require('http'),
    fs = require('fs'),
    tty = require('tty'),
    url = require('url'),
    markdown = require(__dirname + '/lib/generator/markdown');

// caches master template in memory
var template = fs.readFileSync(__dirname + '/templates/_master.html', "utf8");
var noop = function() { };

var getFile = function(request) {
    if(!request) {
        console.log("getFile called with empty request");
        noop();
    }
       
    var callback = arguments[arguments.length - 1];
    if (typeof(callback) !== 'function') callback = noop;

   // Fix the requested file, for now ignoring non-existant files
   // TODO: Convert HTML once, then serve that file if it exists
   // TODO: RE-convert HTML if the .md is newer than the .html
   var filename = url.parse(request).pathname.replace('html', 'md');
   if(filename === "/favicon.ico") return;
   if(filename === "/" || filename === "") { filename = "/index.md"; }

   var requestedFile = __dirname + '/pages' + filename;

   console.log('Requested: ' + requestedFile);
   var data = fs.readFileSync(requestedFile, "utf8");
   callback(data);
};

var getHtml = function(request) {
    var callback = arguments[arguments.length - 1];
    if (typeof(callback) !== 'function') callback = noop;

    // get the data and call markdown
    try {
        getFile(request, function(data) {
            if(!data) { 
                callback("Nothing to see here!");
            }
            var html = template.replace("{{content}}", markdown.toHTML(markdown.parse(data), {xhtml:true}));
            console.log(html);
            callback(html);
        }); 
    } catch(err) {
        console.log(err);
        callback("Nothing to see here!");
    }
};

var server = http.createServer(function(req, res) {
    getHtml(req.url, function(html) {
        var buf = new Buffer(html, "utf8");
        res.writeHead(200, { 'Content-Type' : 'text/html', 'Content-Length' : buf.length });
        res.write(buf.toString());
        res.end();
    });
});

var run = function(opts) {
    try {
        if(opts && typeof opts['beforeStart'] === 'function'){
            opts['beforeStart']();
        }
        var port = (opts && opts.port) || 9111;

        // allow for CTRL+C interrupt
        process.stdin.on('keypress', function(char, key) {
          if (key && key.ctrl && key.name == 'c') {
            console.log('Caught interrupt signal');
            process.exit()
          } else { noop(); }
        });
        tty.setRawMode(true);
        process.stdin.resume();

        server.listen(port, function() {
            console.log("Server is running on http://localhost:" + port);
            console.log("Hit CTRL+C to shutdown the http server");
        });

    } catch(err) {
        console.log(err);
    }
};

/* 
 * EVENTS
 */

server.on('close', function() {
    console.log('Shutting down the server.');
});

// exit event is assigned here becuase it requires the closure to server and port
process.on('exit', function(){
    if(server) server.close();
});

process.on('SIGTERM', function(){
    process.exit(1);
});


/*
 * Module Exposes
 * call with require('./server').run({ port: 9000 });
 */

exports.run = run;
