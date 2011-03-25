
# Events

 The concept of an "event" is crucial to node, and used greatly throughout core and 3rd-party modules. Node's core module _events_ supplies us with a single constructor, `EventEmitter`.

## Emitting Events

Typically an object inherits from `EventEmitter`, however our small example below illustrates the api. First we create an `emitter`, after which we can define any number of callbacks using the `emitter.on()` method which accepts the _name_ of the event, and arbitrary objects passed as data. When `emitter.emit()` is called we are only required to pass the event _name_, followed by any number of arguments, in this case the `first` and `last` name strings.

	// events/basic.js
	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	emitter.on('name', function(first, last){
	    console.log(first + ', ' + last);
	});

	emitter.emit('name', 'tj', 'holowaychuk');
	emitter.emit('name', 'simon', 'holowaychuk');

## Inheriting From EventEmitter

Perhaps a more practical use of `EventEmitter`, and commonly used throughout node, is to inherit from it. This means we can leave `EventEmitter`'s prototype untouched, while utilizing its api for our own means of world domination!

To do so we begin by defining the `Dog` constructor, which of course will bark from time to time, also known as an _event_.

	// events/subclass.js
	var EventEmitter = require('events').EventEmitter;

	function Dog(name) {
	    this.name = name;
	}

* Note: JavaScript doesn't have 'classes'.  The file above is called 'subclass' because this is a term commonly used for inheritance in an object-oriented language.*

Here we inherit from `EventEmitter`, so that we may use the methods provided such as `EventEmitter#on()` and `EventEmitter#emit()`. If the `__proto__` property is throwing you off, no worries! we will be touching on this later.

	Dog.prototype.__proto__ = EventEmitter.prototype;

Now that we have our `Dog` set up, we can create .... simon! When simon barks we can let _stdout_ know by calling `console.log()` within the callback. The callback it-self is called in context to the object, aka `this`.

	var simon = new Dog('simon');

	simon.on('bark', function(){
	    console.log(this.name + ' barked');
	});

Bark twice a second:

	setInterval(function(){
	    simon.emit('bark');
	}, 500);

You may look at the above code and think, "Why don't I just add a *bark* function?"  That's a good question.  The power of events is in subscribing to events that occur when a function on the object is executed.  For instance, if you have a writeable `Stream` object with the function `write()`, you may subscribe to a data event.  The following event example is directly from the node api documentation:

	// events/streams.js
	var util = require("util");
	var events = require("events");

	function MyStream() {
	    events.EventEmitter.call(this);
	}

	util.inherits(MyStream, events.EventEmitter);

	MyStream.prototype.write = function(data) {
	    this.emit("data", data);
	}

	var stream = new MyStream();

	console.log(stream instanceof events.EventEmitter); // true
	console.log(MyStream.super_ === events.EventEmitter); // true

	stream.on("data", function(data) {
		console.log('Received data: "' + data + '"');
	});
	stream.write("It works!"); // Received data: "It works!"

This example is fairly complicated compared to most of the examples so far.  It does a number of things that haven't yet been covered, but are included here for completeness.  First of all, we're creating an object of `MyStream` called `stream`, which inherits from `EventEmitter`. This was mentioned earlier, but the api's example provides a nice use of the util module for inheritance.  Then, we set the `write` function to emit the *data* event to any subscribers (which are called *EventListeners*).  In this function, we could also provide some default functionality (more than emitting an event), such as writing to an inner sink, logging, or any number of operations.

After setting up the object, this example writes to `console.log()` to demonstrate that both the stream and the `super_` object are instances of `EventEmitter`.  Afterward, we subscribe to the `"data"` event and log the data that is emitted from the `MyStream.prototype.write` function.  This means that anything passed to the `write()` function is emitted to all subscribers as the single object passed to the callback function.  In other words, anytime we call `write()`, we're going to log with a little message to show that the parameter is being written by the emitted event.

So, unlike the dog barking example, this shows that a single function can have multiple operations occur via events.

**Note: when adding an event, it is pushed onto the end of an array of existing events** 


## Removing Event Listeners

As we have seen, event listeners are simply functions which are called when we `emit()` an event. Although not seen often, we can remove these listeners by calling the `removeListener(type, callback)` method. In the example below, we emit the _message_ `'foo bar'` every `300` milliseconds, which has the callback of `console.log()`. After 1000 milliseconds we call `removeListener()` with the same arguments that we passed to `emitter.on()` originally. To complement this method is `removeAllListeners(type)`, which removes all listeners associated to the given _type_.

	// events/removing.js
	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	emitter.on('message', console.log);

	setInterval(function(){
	    emitter.emit('message', 'foo bar');
	}, 300);

	setTimeout(function(){
	    emitter.removeListener('message', console.log);
	}, 1000);

