
# HTTP

Node's HTTP module offers a chunkable, buffered interface to the HTTP protocol.  Headers are JSON objects with lower-case keys and original values.

    { 'content-length': '123', 'content-type': 'text/plain' }

The HTTP module is low-level, meaning it handles the headers and the message (and that's about it).  This creates a solid framework ontop of which modules can be built for web frameworks ([express](http://www.expressjs.com), [geddy](http://www.geddy.com), file servers, browsers ([zombie.js](http://www.google.com/?q=zombiejs), and even SaaS ([cloud9 IDE](http://www.cloud9ide.com)).

## HTTP Request

## HTTP Response

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

