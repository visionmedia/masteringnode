
var utils = require('./utilities');

var a = { one: 1 };
var b = { two: 2 };
utils.merge(a, b);
console.dir(a)

var math = require('./math');
console.log(math.add(3, 1));
console.log(math.sub(3, 1));
