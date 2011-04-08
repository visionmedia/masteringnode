
# HTTP

Node's HTTP module offers a chunkable, buffered interface to the HTTP protocol.  Headers are JSON objects with lower-case keys and original values.

    { 'content-length': '123', 'content-type': 'text/plain' }

The HTTP module is low-level, meaning it handles the headers and the message (and that's about it).  This creates a solid framework ontop of which modules can be built for web frameworks ([express](http://www.expressjs.com), [geddy](http://www.geddy.com), file servers, browsers ([zombie.js](http://www.google.com/?q=zombiejs), and even SaaS ([cloud9 IDE](http://www.cloud9ide.com)).

Let's take a look at the `request` and `response` objects of an HTTP server created by node.  To do this, we're going to create a server, inspect both of these objects in the request, and write a dump of the inspection out to a file.

    // http/view_request.js
    var http = require('http'), 
    fs = require('fs'), 
    util = require('util'),
    tty = require('tty');

    var server = http.createServer(function(req, res) {
        console.log("Received a request!");
        fs.writeFile('./request.txt', util.inspect(req) );
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.write("<html><head></head><body><h1>Hello, World!</h1><p>We're serving up html!</p></body></html>");
        res.end();
        fs.writeFile('./response.txt', util.inspect(res) );
    });

    // ... cleanup on exit (see file)

    console.log("Server is running on http://localhost:9111");
    console.log("Hit CTRL+C to shutdown the http server");

Run this sample with `node src/http/view_request.js` from a terminal.  Then, navigate to the server location displayed in the terminal.  This will generate two files: `./src/http/request.txt` and `./src/http/response.txt`.

*!IMPORTANT!* You must always remember to provide a way to close a server.  Leaving an open server running developmental code can be a security risk.

## HTTP Request

Let's take a look at what the request object looks like from the server example above. You should see output similar to:

    // http/request.txt
    // ...
    httpVersion: '1.1',
      complete: false,
      headers: 
       { host: 'localhost:9111',
         connection: 'keep-alive',
         accept: '*/*',
         'user-agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.14 Safari/534.24',
         'accept-encoding': 'gzip,deflate,sdch',
         'accept-language': 'en-US,ru;q=0.8',
         'accept-charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3' },
      trailers: {},
      readable: true,
      url: '/favicon.ico',
      method: 'GET',
      statusCode: null, 
    // ...

## HTTP Response

Let's take a look at what the request object looks like from the server example above. You should see output similar to:

    { output: [],
      outputEncodings: [],
      writable: true,
      _last: false,
      chunkedEncoding: true,
      shouldKeepAlive: true,
      useChunkedEncodingByDefault: true,
      _hasBody: true,
      _trailer: '',
      finished: true,
      socket: null,
      connection: null,
      _events: { finish: [Function] },
      _header: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: keep-alive\r\nTransfer-Encoding: chunked\r\n\r\n',
      _headerSent: true }

## HTTP Servers

http.Server exposes a number of events (request, connection, close, response, etc.) and three functions for creation, listening for requests, and closing the server.  We saw examples of a few of these at the beginning of this section. Up to this point, most of the code we've looked at has been mainly procedural.  To create a server, we will have to implement quite a few things we've learned up to this point:

* Write a module for an http server
* Expose events which occur on the server
* Serve/compile files

Like the first example in this chapter, we'll be using the _http_, _fs_ and _tty_ modules.  To make this interesting, though, we'll also do a compilation from markdown to html so that our server is doing a little more than serving static files. To simplify the example, we won't also be serving static files or even sending a full range of HTTP status codes; everything is `200 OK` in this example.

### Creating the module

Our module will be located at `./src/http/server/`.  The directory is structured in the following way:

    $ ls -l
    total 20
    drwxr-xr-x 3 jim jim 4096 2011-03-23 16:31 lib
    -rw-r--r-- 1 jim jim   56 2011-03-23 17:13 package.json
    drwxr-xr-x 2 jim jim 4096 2011-03-24 07:25 pages
    -rw-r--r-- 1 jim jim 3034 2011-03-24 07:57 server.js
    drwxr-xr-x 2 jim jim 4096 2011-03-23 20:31 templates

The file `server.js` is our module.  So we don't need to call `var server = require('./server/server.js')` at the top of our node application, we're also going to include `package.json` which specifies where the main routine for our module is located.

    // http/server/package.json
    { "name" : "example server",
      "main" : "./server.js" }

Recall from the _Modules_ chapter that it is also possible to include an `index.js` file.  

Next, let's identify the functionality we'll require in this module.  First, we know that we'll have to read a file.  We'll call that function `getFile()`. Then, since we're simplifying things for example's sake, we're assuming all files are in markdown format and converting all files to html.  We'll call that function `getHtml()`.  I know, I'm really creative.

Finally, we'll have a function called `run()` which creates the server and listens on the specified port.  To make our module useful, we have to expose functionality which, in our case, is only the run method.  Here is how we will interface with our module:

    // http/server_example.js
    var server = require('./server');
    server.run({ port: 9222 });

We also have the option of performing a function before starting the server:

    server.run({ port: 9222, 
        beforeStart: function(){ 
            console.log("before start");
        } 
    });

Now that we have a plan in place for the interaction with the module, let's take a look at the three functions, `getFile()`, `getHtml()`, and `run()`.

### getFile(request)

The `getFile()` function assumes that all requests occur at the base of the server's uri. It also ignores requests for `/favicon.ico` and for the base uri `/`.  It then builds a full path to the file and attempts to read the file in a single blocking call. This blocking call helps ensure that we're passing data correctly to the Markdown module.

    // http/server/server.js
    var getFile = function(request) {
        if(!request) {
            console.log("getFile called with empty request");
            noop();
        }
           
       var callback = arguments[arguments.length - 1];
       if (typeof(callback) !== 'function') callback = noop;

       var filename = url.parse(request).pathname.replace('html', 'md');
       if(filename === "/favicon.ico") return;
       if(filename === "/" || filename === "") { filename = "/index.md"; }

       var requestedFile = __dirname + '/pages' + filename;

       console.log('Requested: ' + requestedFile);
       var data = fs.readFileSync(requestedFile, "utf8");
       callback(data);
    };

This function uses the same pattern of identifying a callback as the node libraries.  The `noop()` function is defined as `var noop = function() { };` which saves us from creating numerous empty callbacks and checking for functions where those callbacks are required.  For those unfamiliar with the term _noop_, it means the function performs **no op**eration.

### getHtml(request)

The second function in our module performs the conversion between markdown and html.  It does this in the callack to the `getFile()` function, transforms the markdown to html, and passes the result to its own callback. 

    // http/server/server.js
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

If there are any errors, it returns a string: "Nothing to see here!" A message like this usually accompanies a `404 - Not Found` HTTP status, but we're keeping this pretty simple.

### run()

The run function requires the following server to be created.  The `requestListener` function calls `getHtml` and writes the html to the response.  Here, we're using a buffer to get the proper byte length and attempt to output a properly-encoded html string.

    // http/server/server.js
    var server = http.createServer(function(req, res) {
        getHtml(req.url, function(html) {
            var buf = new Buffer(html, "utf8");
            res.writeHead(200, { 'Content-Type' : 'text/html', 'Content-Length' : buf.length });
            res.write(buf.toString());
            res.end();
        });
    });

Next, the run function sets the options we're allowing (port number and a function to call before starting the server).  We're also catching all errors and logging the output to the console.  

    // http/server/server.js
    var run = function(opts) {
        try {
            if(opts && typeof opts['beforeStart'] === 'function'){
                opts['beforeStart']();
            }
            var port = (opts && opts.port) || 9111;

            // ... Removed CTRL+C interrupt code from previous example

            server.listen(port, function() {
                console.log("Server is running on http://localhost:" + port);
                console.log("Hit CTRL+C to shutdown the http server");
            });
        } catch(err) {
            console.log(err);
        }
    };

Notice how we've moved the console logging to the `server.listen` callback.  This makes more sense than the procedural example from before- if the port isn't available and `server.listen` throws an error, you don't want to tell the developer that the server has started!  This is how things should be programmed, and it's part of what makes node.js so awesome.

### Exposing `run()`

The last thing to do to make our module run is to expose the run function.  To revisit from the _Modules_ chapter, you can do this a few ways:

    // 1. Multiple assignment
    var server = exports.server = http.createServer(requestListener);

    // 2. Inline assignment
    exports.server = http.createServer(requestListener);

    // 3. Post-facto assignment
    var server = http.createServer(requestListener);
    exports.server = server;
    
There's no 'correct' method, and each has it's benefits. Please refer to the _Best Practices_ section for more information.

### Run it!

    $ node src/http/server_example.js 
    Server is running on http://localhost:9222
    Hit CTRL+C to shutdown the http server

After receiving the output to confirm the server is running, visit [http://localhost:9222](http://localhost:9222) to check it out.  Then, hit `CTRL+C` to be sure the server's `close` function is working as expected.

### Where are the events?

You may have noticed that we met only half of the requirements with the above implementation of our server.  To expose events, our `run` method would have to inherit from `EventEmitter`. That doesn't *really* make sense.  For the sake of simplicity and brevity, we previously only had three methods.  We had no class-like objects, and we didn't touch an object's prototype.  Also, the three methods we did have didn't make good use of callbacks.  So, there is another take on this example at _./src/http/server/server2.js_.

This is set up so that our `run` function returns our `Example` object. This object has properties for our configurables (such as the pages directory, template name, etc.).  It also has the functions from the previous example, which have been slightly refactored.

First, you'll notice the inheritence of the `Example` object from `EventEmitter`:

	// http/server/server2.js
	util.inherits(Example, EventEmitter);
	
This allows us to call `this.emit('eventName')` at different times in our code, which executes all of the listeners bound to these events in the order they were declared.

Now, at different points of the code, you'll see a `this.emit()` or `self.emit()` call.  For instance, in the `getServer` function, we emit the `request` and `requestComplete` events.

	// http/server/server2.js
	Example.prototype.getServer = function() {
		var self = this, ct = 'text/html; charset=utf-8';
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
	
Because we know that all responses will be _html_, the request comes in and immediate emits the `request` event.  Our `getHtml` function is written to do one of two things. First, it gets a valid string of html, emits it as _data_ to the `data` event, then passes it to `getHtml`'s callback as the _html_ parameter, which ultimately writes that string to the response. 

The alternative is when a request is ignored either explicitly with the `option.ignorePaths` array, or implicitly by `fs.readFileSync` throwing an error.  Either way, we emit the `data` event with the content as "ignored".  The `getHtml` function above then writes an empty response.

**Note:** `http.ServerRequest`, the type of the `request` parameter in the _requestListener_ passed to `http.createServer`, emits its own _data_ and _end_ events.  Instead of emitting our own events, we could expose the existing events instead of emitting completely new and renamed events.

## HTTP Clients

Node also provides client functionality in the _http_ module.  To begin with the http client functionality, we're going to open one terminal and run the server from the previous example: `node src/http/server_example2.js`.  The first client code we're going to run is slightly modified from node's v0.4.0 documentation.  

### http.get(options, callback)

This example uses the `http.get` function.  This function is a wrapper around the `http.request` function which assumes that a get doesn't write a body to the server request, ultimately only expecting a response.  If you're familiar with jQuery, node's `http.get` is a wrapper around `http.request` in much the same way as jQuery's `$.get` is a wrapper around the `$.ajax` function; the big difference is that in node, we're not working with an _XmlHttpRequest_ object-- we're working directly with _sockets_ and _streams_.

	// http/http_get.js
	var http = require('http'),
		util = require('util');

	var opt = {
		host: 'localhost',
		port: 9222,
		path: '/index.html'
	};

	http.get(opt, function(response) {
		console.log("http.get [Status]: %s", response.statusCode);
		console.log("http.get [method]: %s", response.client._httpMessage.method);
		console.log("http.get [path]: %s", response.client._httpMessage.path);
		console.log("http.get [method]:\n%s", response.client._httpMessage._header);
		// console.log("http.get [client]:\n%s", util.inspect(response.client));
	}).on('error', function(err) {
		console.log("http.get [Error]: " + err.message);
	});

**Note: see the Globals chapter for information on `err.errno` constants**
	
With the server from the previous example running, we can run the _./src/http/http_get.js_ example and examine the output.

	$ node src/http/http_get.js 
	http.get [Status]: 200
	http.get [method]: GET
	http.get [path]: /index.html
	http.get [method]:
	GET /index.html HTTP/1.1
	Host: localhost
	Connection: close
	
If you'd like to view the full client object, uncomment the last line from the callback in the file _./src/http/http_get.js_.  


## Url Module

 ...

## Micro-Frameworks

### Geddy
...

### ZombieJS
...

### cloud9 IDE
...

