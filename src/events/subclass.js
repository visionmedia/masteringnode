
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

function Dog(name) {
    this.name = name;
    EventEmitter.call(this);
}

Dog.prototype.__proto__ = EventEmitter.prototype;

var simon = new Dog('simon');

simon.on('bark', function(){
    console.log(this.name + ' barked');
});

setInterval(function(){
    simon.emit('bark');
}, 500);
