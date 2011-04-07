# Addons

The node documentation for addons is self-admittedly pretty weak as of v0.4.0.

This chapter doesn't aim to be a replacement for the official documentation.  Instead, we'd hope this can expand on some of the basics a little more than a simple "Hello, World!" and drive you as a developer more on the path toward mastering node through its source code.

In fact, for now, we're only going to cover some shortcuts for creating properties on an object, functions, and interacting with function prototypes.  This doesn't reach the evented level of node's awesomeness, but you should be able to look at examples in node's source and the documention for _libev_ and _libeio_ to find answers.

## Pre-requisites

* Some C/C++ knowledge
* V8 JavaScript
* Internal Node libraries
* [libev](http://cvs.schmorp.de/libev/ev.html)
* libeio

## hello.node

Our first example is the very same one from node's docs.  We're going to include it for those who haven't read through the docs and have instead trusted in the knowledge of this ebook's authors (thanks, by the way).

A node addon begins with a source file containing a single entry point: 

    // addons/hello/hello.cc
    #include <v8.h>

    using namespace v8;

    extern "C" void
    init (Handle<Object> target)
    {
      HandleScope scope;
      target->Set(String::New("hello"), String::New("world"));
    }

This is a C/C++ file which begins by including the _v8.h_ header.  It then uses the _v8_ namespace to make the code a little cleaner. Finally, the entry point accepts a single parameter, `Handle<Object> target`.  If you don't use the _v8_ namespace as we've done here, your parameter will read `v8::Handle<v8::Object> target`.  As you can see, `Object` is a _v8_ class.  This is actually the same object we would otherwise refer to using `exports` in a regular node source file.

Within the `init` method, we do two things.  First, we create a scope.  Again, this is the same as is done with the `exports` object in a JavaScript file.  Then we set a property on the `target` called `hello` which returns the string "world".

If you were to perform the same actions as this source file (ignoring the scope part) in a node REPL console, it would look like:

    $ node
    > var target = {};
    > target.hello = "world";
    'world'

### Building hello.node

Building a node addon requires [WAF](http://code.google.com/p/waf).  _node-waf_  should be installed if you've installed node.js from source or distro. 

    // addons/hello/wscript
    srcdir = '.'
    blddir = 'build'
    VERSION = '0.0.1'

    def set_options(opt):
      opt.tool_options('compiler_cxx')

    def configure(conf):
      conf.check_tool('compiler_cxx')
      conf.check_tool('node_addon')

    def build(bld):
      obj = bld.new_task_gen('cxx', 'shlib', 'node_addon')
      obj.target = 'hello'
      obj.source = 'hello.cc'
      
This file is relatively simple, there are two tasks: _configure_ and _build_.  To run this script:

    $ cd src/addons/hello/wscript && node-waf configure build
    
Notice how you have to run node-waf from the directory of the `wscript` build script. Afterward, your built addon will be located at _./build/default/hello.node_.  You can load and play with the addon when you're finished.

    $ cd build/default && node
    > var hello = require('./hello.node');
    > hello
    { hello: 'world' }
    > 
    
## Basic Functions

The world of functions begins with an object that will resemble the following object:

    { version: '0.1', echo: [Function] }
    
As you can imagine, node is already coding functions in the same way as you would for an addon.  Luckily, _node.h_ provides a helper definition for setting a function to a callback, or method defined within your source file.  If you open _node.h_ and look at line 33, you'll see:

    // [node repo]/src/node.h
    #define NODE_SET_METHOD(obj, name, callback)                              \
      obj->Set(v8::String::NewSymbol(name),                                   \
               v8::FunctionTemplate::New(callback)->GetFunction())

Let's reuse this bit of code.  One thing to note here is that since node is already defining how to set a method on a target object, changes to this functionality in v8 will most likely be reflected in this macro.  Because the addon compilation process links node anyway, including the header here shouldn't be an issue.  Plus, reusing the macro ensures that we're creating functions in the same way as the rest of the framework.

The following example will compile our desired object mentioned earlier.

    // addons/functions/v0.1/func.cc
    #include <v8.h>
    #include <node.h>

    using namespace v8;  

    static Handle<Value> Echo(const Arguments& args) {
      HandleScope scope;

      if (args.Length() < 1) {
        return ThrowException(Exception::TypeError(String::New("Bad argument")));
      }
      return scope.Close(args[0]);
    }

    extern "C" void
    init (Handle<Object> target)
    {
        HandleScope scope;
        
        target->Set(String::New("version"), String::New("0.1"));
        
        NODE_SET_METHOD(target, "echo", Echo);
    }

This example differs in a couple of ways from the _Hello, World!_ example.  First, it includes the _node.h_ header containing the `NODE_SET_METHOD` macro.  Second, this contains a callback which is providing the functionality of our function.
 
Just as you would expect in a JavaScript function, the entrance and exit points of the function define a `scope` in which the _context_ of the function executes (i.e. 'this').  Our function will throw an error if it doesn't receive the proper number of arguments, then returns the first argument regardless of how many others are passed.

The _WAF_ script used to build this file is nearly identical to the one used for the _Hello, World!_ example.  

Now, build the source and toy with it.  Here's a dump of my console, run from _./src/addons/functions/v0.1_. 

    $ node-waf configure build && cd build/default && node
    Checking for program g++ or c++          : /usr/bin/g++ 
    Checking for program cpp                 : /usr/bin/cpp 
    Checking for program ar                  : /usr/bin/ar 
    Checking for program ranlib              : /usr/bin/ranlib 
    Checking for g++                         : ok  
    Checking for node path                   : ok /home/jim/.node_libraries 
    Checking for node prefix                 : ok /usr/local 
    'configure' finished successfully (0.164s)
    Waf: Entering directory `/media/16GB/projects/masteringnode/src/addons/functions/v0.1/build'
    [1/2] cxx: func.cc -> build/default/func_1.o
    Waf: Leaving directory `/media/16GB/projects/masteringnode/src/addons/functions/v0.1/build'
    'build' finished successfully (0.587s)
    > var func = require('./func');
    > func
    { version: '0.1', echo: [Function] }
    > func.echo
    [Function]
    > func.echo()
    TypeError: Bad argument
        at [object Context]:1:6
        at Interface.<anonymous> (repl.js:144:22)
        at Interface.emit (events.js:42:17)
        at Interface._onLine (readline.js:132:10)
        at Interface._line (readline.js:387:8)
        at Interface._ttyWrite (readline.js:564:14)
        at ReadStream.<anonymous> (readline.js:52:12)
        at ReadStream.emit (events.js:59:20)
        at ReadStream._emitKey (tty_posix.js:280:10)
        at ReadStream.onData (tty_posix.js:43:12)
    > func.echo(1)
    1
    > func.echo("asdf", 20)
    'asdf'
    > func.echo(function() { return 1; }, 222)
    [Function]
    > func.echo(function() { return 1; }, 222)()
    1
    
Notice the construct of the last line is `func.echo()()`, which executes the function that is passed as the first argument.

## FunctionTemplate

_TODO_

## Function Prototypes

_TODO_

## Function Constructor

_TODO_

## Making it Evented

_TODO_


