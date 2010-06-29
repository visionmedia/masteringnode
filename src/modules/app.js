
var sys = require('sys'),
    utils = require('./utilities');

var a = { one: 1 };
var b = { two: 2 };
utils.merge(a, b);
sys.p(a);

var math = require('./math');
sys.puts(math.add(3, 1));
sys.puts(math.sub(3, 1));