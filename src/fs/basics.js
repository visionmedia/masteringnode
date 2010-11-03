var fs = require('fs');

fs.mkdir('./helloDir',0777, function (err) {
  if (err) throw err;

  fs.writeFile('./helloDir/message.txt', 'Hello Node', function (err) {
    if (err) throw err;
    console.log('file created with contents:');

    fs.readFile('./helloDir/message.txt','UTF-8' ,function (err, data) {
      if (err) throw err;
      console.log(data);
    });
  });
});


console.log("Synchronous");

fs.mkdirSync('./helloDirSync',0777);
fs.writeFileSync('./helloDirSync/message.txt', 'Hello Node');
var data = fs.readFileSync('./helloDirSync/message.txt','UTF-8');
console.log('file created with contents:');
console.log(data);

