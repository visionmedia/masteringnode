
# Buffers

 To handle binary data, node provides us the `Buffer` object. Buffer instances represent memory allocated independently to that of V8's heap. There are several ways to constructor a `Buffer` instance, and many ways you can manipulate it's data.
 
The simplest way to construct a `Buffer` from a string is to simply pass a string as the first argument. As you can see by the log output, we now have a buffer object containing 5 bytes of data represented in hexadecimal.

    var hello = new Buffer('Hello');
    
    console.log(hello);
    // => <Buffer 48 65 6c 6c 6f>

    console.log(hello.toString());
    // => "Hello"

An alternative method is to pass an array of integers representing the octet stream, however in this case functionality equivalent.

    var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
