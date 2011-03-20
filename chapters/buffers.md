
# Buffers

To handle binary data, node provides us with the global `Buffer` object. Buffer instances represent memory allocated independently to that of V8's heap. There are several ways to construct a `Buffer` instance, and many ways you can manipulate it's data.
 
The simplest way to construct a `Buffer` from a string is to pass a string as the first argument to `Buffer`'s constructor. As you can see by the log output, we now have a buffer object containing 5 bytes of data represented in hexadecimal.

	> var hello = new Buffer('Hello');
	    
	> console.log(hello);
	<Buffer 48 65 6c 6c 6f>

	> console.log(hello.toString());
	'Hello'

By default the encoding is "utf8", however this can be specified by passing as string as the second argument. The ellipsis below for example will be printed to stdout as the '&' character when in "ascii" encoding.

	> var buf = new Buffer('…');
	> console.log(buf.toString());
	'…'

	> var buf = new Buffer('…', 'ascii');
	> console.log(buf.toString());
	'&'

An alternative method is to pass an array of integers representing the octet stream.

	> var h = [0x48, 0x65, 0x6c, 0x6c, 0x6f];
	> h
	[ 72, 101, 108, 108, 111 ]

	> h.toString();
	'72,101,108,108,111'

	> var hello = new Buffer(h);
	<Buffer 48 65 6c 6c 6f>

	> hello.toString();
	'Hello'


Buffers can also be created with an integer representing the number of bytes allocated, after which we may call the `write()` method, providing an optional offset and encoding. As shown below, we create a buffer large enough to hold the string "Hello World!"  After writing 'Hello', we see the bytes 5 through 12 are unused bytes.  We then write ' World' starting at byte 6 and examine the output.  Whoops!  We skipped a byte.  We can overwrite this part of the buffer with ' World!' starting at byte 5.  We then call `toString()` on the buffer and see that the buffer is now filled with the desired string.

	> var hello = new Buffer(12);
	> hello.write('Hello');
	5

	> hello.toString();
	'Hello\u0000�̵\u0001\u0000\u0000'
	> hello.write(' World', 6);
	6

	> hello.toString();
	'Hello\u0000 World'

	> hello.write(' World!', 5);
	7

	> hello.toString();
	'Hello World!'

	> hello.length
	12

The `length` property of a buffer instance contains the byte length of the stream, opposed to JavaScript strings which will simply return the number of characters. For example the ellipsis character '…' consists of three bytes, however the buffer will respond with the byte length, and not the character length.

	> var ellipsis = new Buffer('…', 'utf8');
	> console.log('… string length: %d', '…'.length);
	… string length: 1

	> console.log('… byte length: %d', ellipsis.length);
	… byte length: 3

	> ellipsis
	<Buffer e2 80 a6>

When dealing with a JavaScript string, we may pass it to the `Buffer.byteLength()` method to determine it's byte length.

	> Buffer.byteLength('…');
	3

The api is written in such a way that it is String-like, so for example we can work with "slices" of a `Buffer` by passing offsets to the `slice()` method:

	> var chunk = buf.slice(4, 9);
	> console.log(chunk.toString());
	'some'

Alternatively when expecting a string we can pass offsets to `Buffer#toString()`:

	> var buffer = new Buffer('The quick brown fox');
	> buffer.toString('ascii', 4, 9);
	'quick'

A Buffer object has a number of helper functions: `.utf8Write()`, `.utf8Slice()`, `.asciiWrite()`, `.asciiSlice()`, `.binaryWrite()`, `.binarySlice()`.  These methods provide similar functionality while enforcing proper encoding.
