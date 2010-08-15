
# Buffers

 To handle binary data, node provides us the `Buffer` object. Buffer instances represent memory allocated independently to that of V8's heap. There are several ways to constructor a `Buffer` instance, and many ways you can manipulate it's data.
 
The simplest way to construct a `Buffer` from a string is to simply pass a string as the first argument. As you can see by the log output, we now have a buffer object containing 5 bytes of data represented in hexadecimal.

    var hello = new Buffer('Hello');
    
    console.log(hello);
    // => <Buffer 48 65 6c 6c 6f>

    console.log(hello.toString());
    // => "Hello"

By default the encoding is "utf8", however this can be specified by passing as string as the second argument. The ellipsis below for example will be printed to stdout as the '&' character when in "ascii" encoding.

    var buf = new Buffer('…');
    console.log(buf.toString());
    // => …

    var buf = new Buffer('…', 'ascii');
    console.log(buf.toString());
    // => &

An alternative method is to pass an array of integers representing the octet stream, however in this case functionality equivalent.

    var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

Buffers can also be created with an integer representing the number of bytes allocated, after which we may call the `write()` method, providing an optional offset and encoding. As shown below we provide the offset of 2 bytes to our second call to `write()`, buffering "Hel", and then we continue on to write another two bytes with an offset of 3, completing "Hello".

    var buf = new Buffer(5);
    buf.write('He');
    buf.write('l', 2);
    buf.write('lo', 3);
    console.log(buf.toString());
    // => "Hello"

The `.length` property of a buffer instance contains the byte length of the stream, compared to JavaScript strings which will simply return the number of characters. For example the ellipsis character '…' consists of three bytes, however the buffer will respond with the byte length, and not the character length.

    var ellipsis = new Buffer('…', 'utf8');

    console.log('… string length: %d', '…'.length);
    // => … string length: 1

    console.log('… byte length: %d', ellipsis.length);
    // => … byte length: 3
    
    console.log(ellipsis);
    // => <Buffer e2 80 a6>

When working with JavaScript strings, we can also pass a string through the `Buffer.byteLength()` method to determine it's byte length.

The api is written in such a way that it is Array-like, so for example we can work with "slices" of a `Buffer` by passing offsets to the `slice()` method:

    var chunk = buf.slice(4, 9);
    console.log(chunk.toString());
    // => "some"

Alternatively when expecting a string we can pass offsets to `Buffer#toString()`:

    var buf = new Buffer('just some data');
    console.log(buf.toString('ascii', 4, 9));
    // => "some"

