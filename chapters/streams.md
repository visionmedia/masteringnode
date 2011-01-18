
# Streams

 Streams are an important concept in node. The stream API is a unified way to handle stream-like data, for example data can be streamed to a file, streamed to a socket to respond to an HTTP request, or a stream can be read-only such as reading from _stdin_. However since we will be touching on stream specifics in later chapters, for now we will concentrate on the API.
 
## Readable Streams

 Readable streams such as an HTTP request inherit from `EventEmitter` in order to expose incoming data through events. The first of these events is the _data_ event, which is an arbitrary chunk of data passed to the event handler as a `Buffer` instance. 

    req.on('data', function(buf){
        // Do something with the Buffer
    });

As we know, we can call `toString()` a buffer to return a string representation of the binary data, however in the case of streams if desired we may call `setEncoding()` on the stream,
after which the _data_ event will emit strings.

    req.setEncoding('utf8');
    req.on('data', function(str){
        // Do something with the String
    });

Another import event is the _end_ event, which represents the ending of _data_ events. For example below we define an HTTP echo server, simply "pumping" the request body data through to the response. So if we **POST** "hello world", our response will be "hello world".

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

The _sys_ module actually has a function designed specifically for this "pumping" action, aptly named `sys.pump()`, which accepts a read stream as the first argument, and write stream as the second.

    var http = require('http'),
        sys = require('sys');
    
    http.createServer(function(req, res){
        res.writeHead(200);
        sys.pump(req, res);
    }).listen(3000);