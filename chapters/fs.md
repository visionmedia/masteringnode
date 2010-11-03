
# File System

 The 'fs' module is the library to work with the filesystem. The commands follows the unix operations to work with the filesystem. 
 Most methods support an asynchronous and synchronous method call. 
 
 //However using the synchronous call will cause the whole process to halt
 //and wait for this operation to complete. It is therefore to be used on in special cases. 

## Working with the filesystem

 A basic example of working with the filesystem using chainable callbacks:
    
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
  
  When working with the asychronous methods, each call must be inside the previous method call as there is no gaurantee that the
  previous call will complete before the next one. This could cause operations to happen in the wrong order. 

  This can also be done using a synchronous approach:

    fs.mkdirSync('./helloDirSync',0777);
    fs.writeFileSync('./helloDirSync/message.txt', 'Hello Node');
    var data = fs.readFileSync('./helloDirSync/message.txt','UTF-8');
    console.log('file created with contents:');
    console.log(data);

  It is advised to rather work using the asynchronous approach as the synchronous methods will cause the whole process to halt and wait
  for the operation to complete, this will block any incoming connections and any other events.

## File information
  
  The fs.Stats object contains information about a particular file or directory. This can be used to determine what type of object we
  are working with. In this example we are getting all the file objects in a directory and display whether they are a file or an object.

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

  


  

    
