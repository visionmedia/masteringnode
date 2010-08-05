
require.paths.unshift(__dirname + '/math');

var add = require('add'),
    sub = require('sub');

console.log(add(1,2))
console.log(sub(1,2))