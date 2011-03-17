var util = require("util");
var events = require("events");

function MyStream() {
	events.EventEmitter.call(this);
};

util.inherits(MyStream, events.EventEmitter);

MyStream.prototype.write = function(data) {
	this.emit("data", data);
};

var stream = new MyStream();

console.log(stream instanceof events.EventEmitter); // true
console.log(MyStream.super_ === events.EventEmitter); // true

stream.on("data", function(data) {
	console.log('Received data: "' + data + '"');
});

stream.write("It works!"); // Received data: "It works!"
