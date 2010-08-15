
var hello = new Buffer('Hello');
console.log(hello);
console.log(hello.toString());

var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log(hello);
console.log(hello.toString());

var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log(hello);
console.log(hello.toString());

var ellipsis = new Buffer('…');
console.log('… string length: %d', '…'.length);
console.log('… byte length: %d', ellipsis.length);
console.log('… byte length: %d', Buffer.byteLength('…'));
console.log(ellipsis);

var buf = new Buffer(5);
buf.write('he');
buf.write('l', 2);
buf.write('lo', 3);
console.log(buf.toString());

console.log(new Buffer('…', 'ascii').toString());