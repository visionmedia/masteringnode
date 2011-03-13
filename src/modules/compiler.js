if(require.extensions) {
  require.extensions['.ejs'] = function(module,filename){
    var content = require('fs').readFileSync(filename, 'utf8');
    var newContent = require('./compiler/extended').compile(content);
    module._compile(newContent, filename);
  };
} else {
  require.registerExtension('.ejs', require('./compiler/extended').compile);
}

var example = require('./compiler/example');

console.dir(example)
console.log(example.min(2, 3));
console.log(example.max(10, 8));
