
require.paths.unshift(__dirname + '/math');
console.dir(require.paths);

var add = require('add'),
    sub = require('sub');

console.log(add(1,2));
console.log(sub(1,2));