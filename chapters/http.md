
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
* Respond to events

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

** getFile(request) **

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

This function uses the same pattern of identifying a callback as the node libraries.  The `noop()` function is defined as `var noop = function() { };` which saves us from creating numerous empty callbacks and checking for functions where those callbacks are required.

** getHtml(request) **

... 

## HTTP Clients

 ...

## Url Module

 ...

## Micro-Frameworks

### Geddy
...

### ZombieJS
...

### cloud9 IDE
...

