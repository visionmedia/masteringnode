
# File System

 To work with the filesystem, node provides the "fs" module. The commands emulate the POSIX operations, and most methods work synchronously or asynchronously. We will look at how to use both, then establish which is the better option.
 
## Working with the filesystem

 Lets start with a basic example of working with the filesystem. This example creates a directory, creates a file inside it, then writes the contents of the file to console:
    
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
  
  As evident in the example above, each callback is placed in the previous callback &mdash; these are referred to as chainable callbacks. This pattern should be followed when using asynchronous methods, as there's no guarantee that the operations will be completed in the order they're created. This could lead to unpredictable behavior.
 
  The example can be rewritten to use a synchronous approach:

    fs.mkdirSync('./helloDirSync',0777);
    fs.writeFileSync('./helloDirSync/message.txt', 'Hello Node');
    var data = fs.readFileSync('./helloDirSync/message.txt','UTF-8');
    console.log('file created with contents:');
    console.log(data);

  It is better to use the asynchronous approach on servers with a high load, as the synchronous methods will cause the whole process to halt and wait for the operation to complete. This will block any incoming connections or other events.

## File information
  
  The fs.Stats object contains information about a particular file or directory. This can be used to determine what type of object we're working with. In this example, we're getting all the file objects in a directory and displaying whether they're a file or a
  directory object.

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

 
## Watching files

  The fs.watchfile method monitors a file and fires an event whenever the file is changed.

    var fs = require('fs');

    fs.watchFile('./testFile.txt', function (curr, prev) {
      console.log('the current mtime is: ' + curr.mtime);
      console.log('the previous mtime was: ' + prev.mtime);
    });

    fs.writeFile('./testFile.txt', "changed", function (err) {
      if (err) throw err;

      console.log("file write complete");   
    });

  A file can also be unwatched using the fs.unwatchFile method call. This should be used once a file no longer needs to be monitored.

## Nodejs Docs for further reading

  The node API [docs](http://nodejs.org/api.html#file-system-106) are very detailed and list all the possible filesystem commands
  available when working with Nodejs.
