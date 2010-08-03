
# Events

 Events are crucial to node, and used greatly throughout core and 3rd-party modules. Node's core library _events_ supplies us with a single constructor, _EventEmitter_.

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

A perhaps more practical use of `EventEmitter`, and commonly used throughout node is to inherit from it. This means we can leave `EventEmitter`'s prototype untouched, while utilizing it's api for our own means of world domination!

To do so we begin by defining the `Dog` constructor, which of course will bark from time to time, also known as an _event_. Our `Dog` constructor accepts a `name`, followed by `EventEmitter.call(this)`, which invokes the `EventEmitter` function in context to the given argument. Doing this is essentially the same as a "super" or "parent" call in languages that support classes. This is a crucial step, as it allows `EventEmitter` to set up the `_events` property which it utilizes internally to manage callbacks.

	var EventEmitter = require('events').EventEmitter;

	function Dog(name) {
	    this.name = name;
	    EventEmitter.call(this);
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
