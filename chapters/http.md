
# HTTP

Node's HTTP module offers a chunkable, buffered interface to the HTTP protocol.  Headers are JSON objects with lower-case keys and original values.

    { 'content-length': '123', 'content-type': 'text/plain' }

The HTTP module is low-level, meaning it handles the headers and the message (and that's about it).  This creates a solid framework ontop of which modules can be built for web frameworks ([express](http://www.expressjs.com), [geddy](http://www.geddy.com), file servers, browsers ([zombie.js](http://www.google.com/?q=zombiejs), and even SaaS ([cloud9 IDE](http://www.cloud9ide.com)).

Let's take a look at the `request` and `response` objects of an HTTP server created by node.  To do this, we're going to create a server, inspect both of these objects in the request, and write a dump of the inspection out to a file.

    // http/view_request.js
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

Run this sample with `node src/http/view_request.js` from a terminal.  Then, navigate to the server location displayed in the terminal.  This will generate two files: `./src/http/request.txt` and `./src/http/response.txt`.

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

http.Server exposes a number of events (request, connection, close, request, etc.) and three functions for creation, listening for requests, and closing the server.

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

