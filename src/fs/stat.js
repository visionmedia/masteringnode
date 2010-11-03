var fs = require('fs');

fs.readdir('/etc/', function (err, files) {
  if (err) throw err;

  files.forEach( function (file) {
    fs.stat('/etc/' + file, function (err, stats) {
      if (err) throw err;

      if (stats.isFile()) {
        console.log("%s is file", file);
      }
      else if (stats.isDirectory ()) {
        console.log("%s is a directory", file);
      }    
    console.log('stats:  %s',JSON.stringify(stats));

    });

  });
});


