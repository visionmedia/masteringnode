
var hello = new Buffer('Hello');
console.log(hello);
console.log(hello.toString());

var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log(hello);
console.log(hello.toString());