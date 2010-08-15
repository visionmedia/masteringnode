
# Streams

 Streams are an important concept in node. The stream api is a unified way to handle stream-like data, for example data can be streamed to a file, streamed to a socket to respond to an HTTP request, or a stream can be read-only such as reading from _stdin_. However since we will be touching on stream specifics in later chapters, for now we will concentrate on the api.
 
## Readable Streams

 Readable streams such as an HTTP request inherit from `EventEmitter` in order to expose incoming data through events. The first of these events is the _data_ event, which is an arbitrary chunk of data passed to the event handler as a `Buffer` instance. 

    req.on('data', function(buf){
        // Do something with the Buffer
    });

As we know, we can call `toString()` on a buffer to return a string, however in the case of streams if desired we may call `setEncoding()` on the stream,
after which the _data_ event will emit strings.

    req.setEncoding('utf8');
    req.on('data', function(str){
        // Do something with the String
    }); 