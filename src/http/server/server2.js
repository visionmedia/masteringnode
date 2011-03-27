var http = require('http'),
	util = require('util'),
    fs = require('fs'),
    tty = require('tty'),
    url = require('url');
var EventEmitter = require('events').EventEmitter;
var markdown = require(__dirname + '/lib/generator/markdown');

var noop = function() { };

function Example(options) {
   if(!this instanceof Example) {
		return new Example(options);
   }
   
   var merge = function(obj1, obj2) {
   		for (val in obj2) { obj1[val] = obj2[val]; }
   }
   this.options = options || {};
   this.templateDir =  __dirname + '/templates/';
   this.master = '_master.html';
   this.noop = noop;
   
   this.ignorePaths = ["/favicon.ico"];
   merge(this.ignorePaths, this.options.ignorePaths);
   
   this.redirectPathsToIndex = ["/", ""];
   this.index = "/index.md";
   
   // caches master template in memory
   this.template =  fs.readFileSync(this.templateDir + this.master, "utf8");
   
   this.port = this.options.port || 9222;
   this.pageDir = (__dirname + '/pages');
};
util.inherits(Example, EventEmitter);
exports.Example = Example;

Example.prototype.parseUrl = function(request) {
   var self = this, filename, callback;
   
   callback = arguments[arguments.length - 1];
   if (typeof(callback) !== 'function') callback = self.noop;
   
   filename = url.parse(request).pathname.replace('html', 'md');
   
   self.ignorePaths.forEach(function(val) {
   		if(val === filename) filename = null;
   });
   
   self.redirectPathsToIndex.forEach(function(val) {
   		if(val === filename) filename = "/index.md";
   });
   
   callback(filename);
};

Example.prototype.getFile = function(request) {
    var self = this, callback, data;
    if(!request) self.noop();
       
   callback = arguments[arguments.length - 1];
   if (typeof(callback) !== 'function') callback = self.noop;
   
   self.parseUrl(request, function(filename) {
		if(filename) {
			try{
				data = fs.readFileSync(self.pageDir + filename, "utf8");
			} catch(err) { /* todo: real error handling */ }
		} 
		callback(data);
   });
};

Example.prototype.getHtml = function(request) {
    var self = this, callback, html = "Nothing to see here!";
    
    callback = arguments[arguments.length - 1];
    if (typeof(callback) !== 'function') callback = noop;

    // get the data and call markdown
    try {
        self.getFile(request, function(data) {
            if(data) {
			    html = self.template.replace("{{content}}", 
			    	markdown.toHTML(markdown.parse(data), {xhtml:true}));
			    console.log(html);
			    self.emit('data', data);
            } else { self.emit('data', "ignored"); }
        }); 
    } catch(err) { self.emit('error', err); }
    
    callback(html);
};

Example.prototype.getServer = function() {
	var self = this, ct =  'text/html; charset=utf-8';
	return http.createServer(function(req, res) {
		self.emit('request', req.url);
		self.getHtml(req.url, function(html) {
			var buf = new Buffer(html, "utf8");
			res.writeHead(200, 
				{ 
					'Content-Type' : ct, 
				 	'Content-Length' : buf.length 
			 	});
			res.write(buf.toString());
			res.end();
			self.emit('requestComplete');
		});
	});
};

var run = function(opts) {
	var  example, server;
    try {
    	example = new Example(opts || {});
    	server = example.getServer();
    	
        tty.setRawMode(true);
        process.stdin.resume();

        server.listen(example.port, function() {
            console.log("Server is running on http://localhost:" + example.port);
            console.log("Hit CTRL+C to shutdown the http server");
        });
        
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
    } catch(err) {
        console.log(err.message);
    }
	
	return example;
};

process.stdin.on('keypress', function(char, key) {
  if (key && key.ctrl && key.name == 'c') {
    console.log('Caught interrupt signal');
    process.exit()
  } else { noop(); }
});

exports.run = run;
exports.Server = run;
