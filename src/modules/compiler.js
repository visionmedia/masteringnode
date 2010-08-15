
require.registerExtension('.ejs', function(js){
    return require('./compiler/extended').compile(js);
});

var example = require('./compiler/example');
console.dir(example)
console.log(example.min(2, 3));
console.log(example.max(10, 8));