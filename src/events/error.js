
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter;

emitter.emit('error', new Error('fail!'));