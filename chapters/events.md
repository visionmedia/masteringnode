
# Events

 Events are crucial to node, and used greatly throughout core and 3rd-party modules. Node's core library _events_ supplies us with a single constructor, _EventEmitter_.

Typically an object inherits from _EventEmitter_, however our small example below illustrates the api. First we create an `emitter`, after which we can define any number of callbacks using the `emitter.on()` method which accepts the _name_ of the event, and arbitrary objects passed as data. When `emitter.emit()` is called we are only required to pass the event _name_, followed by any number of arguments, in this case the `first` and `last` name strings.

	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	emitter.on('name', function(first, last){
	    console.log(first + ', ' + last);
	});

	emitter.emit('name', 'tj', 'holowaychuk');
	emitter.emit('name', 'simon', 'holowaychuk');