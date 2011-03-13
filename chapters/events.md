
# Events

 The concept of an "event" is crucial to node, and used greatly throughout core and 3rd-party modules. Node's core module _events_ supplies us with a single constructor, _EventEmitter_.

## Emitting Events

Typically an object inherits from _EventEmitter_, however our small example below illustrates the api. First we create an `emitter`, after which we can define any number of callbacks using the `emitter.on()` method which accepts the _name_ of the event, and arbitrary objects passed as data. When `emitter.emit()` is called we are only required to pass the event _name_, followed by any number of arguments, in this case the `first` and `last` name strings.

	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	emitter.on('name', function(first, last){
	    console.log(first + ', ' + last);
	});

	emitter.emit('name', 'tj', 'holowaychuk');
	emitter.emit('name', 'simon', 'holowaychuk');

## Inheriting From EventEmitter

A perhaps more practical use of `EventEmitter`, and commonly used throughout node is to inherit from it. This means we can leave `EventEmitter`'s prototype untouched, while utilizing its api for our own means of world domination!

To do so we begin by defining the `Dog` constructor, which of course will bark from time to time, also known as an _event_.

	var EventEmitter = require('events').EventEmitter;

	function Dog(name) {
	    this.name = name;
	}

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

## Removing Event Listeners

As we have seen, event listeners are simply functions which are called when we `emit()` an event. Although not seen often we can remove these listeners by calling the `removeListener(type, callback)` method. In the example below we emit the _message_ "foo bar" every `300` milliseconds, which has the callback of `console.log()`. After 1000 milliseconds we call `removeListener()` with the same arguments that we passed to `on()` originally. To compliment this method is `removeAllListeners(type)` which removes all listeners associated to the given _type_.

	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	emitter.on('message', console.log);

	setInterval(function(){
	    emitter.emit('message', 'foo bar');
	}, 300);

	setTimeout(function(){
	    emitter.removeListener('message', console.log);
	}, 1000);

