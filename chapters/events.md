
# Events

 Events are crucial to node, and used greatly throughout core and 3rd-party modules. Node's core library _events_


	var EventEmitter = require('events').EventEmitter;

	var emitter = new EventEmitter;

	emitter.on('name', function(first, last){
	    console.log(first + ', ' + last);
	});

	emitter.emit('name', 'tj', 'holowaychuk');
	emitter.emit('name', 'simon', 'holowaychuk');