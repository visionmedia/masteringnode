
require.registerExtension('.ejs', require('./compiler/extended').compile);

var example = require('./compiler/example');

console.dir(example)
console.log(example.min(2, 3));
console.log(example.max(10, 8));