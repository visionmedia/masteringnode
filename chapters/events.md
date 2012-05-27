# Events

 The concept of an "event" is crucial to node, and is used heavily throughout core and 3rd-party modules. Node's core module _events_ supplies us with a single constructor, _EventEmitter_.

## Emitting Events

Typically an object inherits from _EventEmitter_, however our small example below illustrates the API. First we create an `emitter`, after which we can define any number of callbacks using the `emitter.on()` method, which accepts the _name_ of the event and arbitrary objects passed as data. When `emitter.emit()` is called, we are only required to pass the event _name_, followed by any number of arguments (in this case the `first` and `last` name strings).

	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	emitter.on('name', function(first, last){
	    console.log(first + ', ' + last);
	});

	emitter.emit('name', 'tj', 'holowaychuk');
	emitter.emit('name', 'simon', 'holowaychuk');

## Inheriting From EventEmitter

A more practical and common use of `EventEmitter` is to inherit from it. This means we can leave `EventEmitter`'s prototype untouched while utilizing its API for our own means of world domination!

To do so, we begin by defining the `Dog` constructor, which of course will bark from time to time (also known as an _event_).

	var EventEmitter = require('events').EventEmitter;

	function Dog(name) {
	    this.name = name;
	}

Here we inherit from `EventEmitter` so we can use the methods it provides, such as `EventEmitter#on()` and `EventEmitter#emit()`. If the `__proto__` property is throwing you off, don't worry, we'll be coming back to this later.

	Dog.prototype.__proto__ = EventEmitter.prototype;

Now that we have our `Dog` set up, we can create... Simon! When Simon barks, we can let _stdout_ know by calling `console.log()` within the callback. The callback itself is called in the context of the object (aka `this`).

	var simon = new Dog('simon');

	simon.on('bark', function(){
	    console.log(this.name + ' barked');
	});

Bark twice per second:

	setInterval(function(){
	    simon.emit('bark');
	}, 500);

## Removing Event Listeners

As we have seen, event listeners are simply functions which are called when we `emit()` an event. We can remove these listeners by calling the `removeListener(type, callback)` method, although this isn't seen often. In the example below we emit the _message_ "foo bar" every `300` milliseconds, which has a callback of `console.log()`. After 1000 milliseconds, we call `removeListener()` with the same arguments that we passed to `on()` originally. We could also have used `removeAllListeners(type)`, which removes all listeners registered to the given _type_.

	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	var log = function(stream){
	  console.log(stream);
	}

	emitter.on('message', log);

	setInterval(function(){
	      emitter.emit('message', 'foo bar');
	}, 300);

	setTimeout(function(){
	      emitter.removeListener('message', log);
	}, 1000);

