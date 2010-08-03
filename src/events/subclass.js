
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

function Animal(name) {
    this.name = name;
    EventEmitter.call(this);
}

Animal.prototype.__proto__ = EventEmitter.prototype;

var simon = new Animal('simon');

simon.on('bark', function(){
    console.log(this.name + ' barked');
});

setInterval(function(){
    simon.emit('bark');
}, 500);
