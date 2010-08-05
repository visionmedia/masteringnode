
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter;

emitter.on('message', console.log);

setInterval(function(){
    emitter.emit('message', 'foo bar');
}, 300);

setTimeout(function(){
    emitter.removeListener('message', console.log);
}, 1000);