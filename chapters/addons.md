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
    #define NODE\_SET\_METHOD(obj, name, callback)                              \
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

In v8, a FunctionTemplate is used to create the equivalent to:

    var template = function() { }

The function at this point is an object and not an _instance_ of the function. 

As an example, we will use the linux package _uuid_ to generate a uuid. We will define the header for this addon as:

    // addons/uuid/v0.1/uuid.h
    #ifndef __node_uuid_h__
    #define __node_uuid_h__

    #include <string>
    #include <v8.h>
    #include <node.h>
    #include "uuid/uuid.h"

    using namespace v8;
    using namespace node;
    
    class Uuid : public node::ObjectWrap {
        public:
            Uuid() { }
            static Persistent<FunctionTemplate> constructor;
            static void Init(Handle<Object> target);
            static Handle<Value> New(const Arguments &args);
            static Handle<Value> Generate(const Arguments &args);
            static Handle<Value> GenerateRandom(const Arguments &args);
            static Handle<Value> GenerateTime(const Arguments &args);
        private:   
            ~Uuid();
            static std::string GetString(uuid_t id);
    };

    #endif // __node_uuid_h__

This addon will showcase three methods, `Generate`, `GenerateRandom`, and `GenerateTime`. It will also include a trivial private `GetString` method to demonstrate how to _Unwrap_ a `node::ObjectWrap` object and interact with C++ code that is not specific to node or v8.

A lot of the public function definitions should look similar to the _Echo_ example. One notable difference is that instead of using a macro and hiding the `FunctionTemplate` method, we are defining `static Persistent<FunctionTemplate> constructor;`.  The `Persistent<T>` type is used "when you need to keep a reference to an object for more than one function call, or when handle lifetimes do not correspond to C++ scopes." [source](http://code.google.com/apis/v8/embed.html).  Since we'd expect our object's constructor to last longer than a single function, we declare it separately and as a persistent handle.  Another point to notice is that all of the method we're pulling from _uuid.h_ have the signature `static Handle<Value> Method(const Arguments &args)` even though we will plan to call it as `uuid.generate()`.  This is because we will be accessing the _scope_ of the call via `args.This()`.

Although more methods are implemented in _uuid.cc_, we will look at three:  

  * `Uuid::Init(Handle<Object> target)`
  * `Handle<Value> Uuid::New(const Arguments &args)`
  * `Handle<Value> Uuid::Generate(const Arguments &args)`
  
Just as before, node expects to find a signature of `extern "C" void init(Handle<Object> target)` in order to initialize the addon.  Inside this method, we may set parameters such as the version number from the previous example.  We may also pass-through initialization to any modules within our node addon.  In this example, our addon will be _uuid.node_ and contain a single module, _Uuid_. There is no reason we can't later add _Uuid2_ which, instead of returning a normalized string value might return a `Buffer` object.  To initialize the Uuid module, we pass the `target` object along to `Uuid::Init` and add the module definition to `target`:

    // addons/uuid/v0.1/uuid.cc
    void Uuid::Init(Handle<Object> target) {
        HandleScope scope;

        // Setup the constructor
        constructor = Persistent<FunctionTemplate>::New(FunctionTemplate::New(Uuid::New));
        constructor->InstanceTemplate()->SetInternalFieldCount(1); // for constructors
        constructor->SetClassName(String::NewSymbol("Uuid"));

        // Setup the prototype
        NODE_SET_PROTOTYPE_METHOD(constructor, "generate", Generate);
        NODE_SET_PROTOTYPE_METHOD(constructor, "generateRandom", GenerateRandom);
        NODE_SET_PROTOTYPE_METHOD(constructor, "generateTime", GenerateTime);

        target->Set(String::NewSymbol("Uuid"), constructor->GetFunction());
    }
    
In this scope, we are instantiating the `constructor` using `Uuid::New` as a new `FunctionTemplate`. We then call `InstanceTemplate()` and on that object we call `SetInternalFieldCount(1)`. This tells v8 that this object holds a reference to one object.

Next, we setup the prototype using another macro provided by node. These calls say, for instance, "Add a method called _generate_ to the constructor function which executes the native method _Generate_".

Lastly, we have to create a "Uuid" module on the object returned by the call to `require()`. Here, `Uuid` will point to a function (`constructor`) which returns a function that internally executes `Uuid::New`.  In other words, we have created something akin to: 

    var Uuid = function() { };
    Uuid.constructor = function() {
        return function() {
            // Uuid::New executes here.
        }
    }
    
Although the above is not exactly what we have done, it may provide a better view for some to understand `FunctionTemplate` references and why we assign one to the constructor object in such a way.

The `Uuid::New` method is defined as:

    // addons/uuid/v0.1/uuid.cc
    Handle<Value> Uuid::New(const Arguments &args) {
        HandleScope scope;
        // no args are checked
        Uuid *uuid = new Uuid();
        uuid->Wrap(args.This());
        return args.This();
    }

As you would expect, calling the constructor function multiple times will create newly-scoped `Uuid` objects on the heap. In this method, we [wrap](https://github.com/joyent/node/blob/v0.4.8/src/node_object_wrap.h#L59) the parameter (scoped object) by setting a reference to `Uuid` in the args as a contextual scope (i.e. `this`) and then returns `this`.

Within the `Generate` method, we will want to unwrap the contextual `Uuid` object and call the private method `GetString`.

    // addons/uuid/v0.1/uuid.cc
    Handle<Value> Uuid::Generate(const Arguments &args) {
        HandleScope scope;
        uuid_t id;
        uuid_generate(id);

        Uuid *uuid = ObjectWrap::Unwrap<Uuid>(args.This());
        return scope.Close(String::New(uuid->GetString(id).c_str()));
    }

As with any JavaScript function call, we have to ensure [functional scope](https://developer.mozilla.org/en/JavaScript/Reference/Functions_and_function_scope). Scoped methods should create a [HandleScope](http://code.google.com/apis/v8/embed.html) object at the start and call `scope.Close()` at the end. `HandleScope` will get rid of temporary handles when the scope is closed.

Within each of the _Generate*_ methods, we will create a `uuid_t` type and call the corresponding method defined in _/usr/includes/uuid/uuid.h_ (location may vary per system). To demonstrate accessing the pointer to our original `Uuid` object, we unwrap the contextual scope of this function using `ObjectWrap::Unwrap<Uuid>(args.This())`. From this pointer, we can access any private methods such as `GetString`. Be careful with your returned values, though. `String::New` in the v8 library does not take `std::string` in any of its signatures. Simply enough, `std::string` provides a `c_str()` method to return a `const char*` which `String::New` does accept.

### uuid.node demo

Navigate to _addons/uuid/v0.1/_ and execute:

    $ node-waf configure build
    
If there are build errors and the _func.cc_ example from before built successfully, check that you have the *uuid-dev* package installed and rerun the above command. Then, navigate to _build/default_ and try out the Uuid addon:

    $ node
    > var Uuid = require('./uuid.node').Uuid;
    > var uuid = new Uuid();
    > uuid.generate();
    '83475e0c-212b-402c-bdc7-b81ebb7b34f8'
    > uuid.generateRandom();
    '4d597bda-8f5f-4c3c-b2fa-1cd6cd4a6903'
    > uuid.generateTime();
    '25a0dd30-5076-11e1-96be-0022fb93b24c'
    > var util = require('util');
    > util.inspect(uuid);
    '{}'
    > util.inspect(Uuid);
    '[Function: Uuid]'
    > 

The above output may surprise you. Firstly, where is the `version` option?! It's at the required module level: `require('./uuid.node').version;`. Secondly, if we can access `uuid.generate()` and others, why don't they display when inspecting the object? That's because we defined those methods on the prototype:

    > uuid.__proto__
    { generate: [Function: generate],
      generateRandom: [Function: generateRandom],
      generateTime: [Function: generateTime] }
    > 

Thirdly, you may have noticed that I didn't say anything about `constructor->SetClassName(String::NewSymbol("Uuid"));` in `Uuid::Init`. You may have also wondered where `SetClassName` actually sets a class name, considering JavaScript is a prototypal language. That string value is what is displayed when you call inspect and get the value `'[Function: Uuid]'`. Just as you would expect, `Uuid` is the constructor and it is named `Uuid`. 

Now, if you've played around with this a bit, you may have noticed that `uuid.__proto__` gives us our three functions but `uuid.prototype` is empty. Why is that? That's because `uuid.__proto__` really is `uuid.constructor.prototype`, which is also really `Uuid.prototype`. This is the essence of prototypal inheritance. If this concept is foreign or difficult to grasp, be sure to check out the excellent explanation on [JavaScript Garden](http://bonsaiden.github.com/JavaScript-Garden/#object.prototype).

Logically, the next step would be to understand how to declare a prototype of our own.

## Function Prototypes

_TODO_

## Function Constructor

_TODO_

## Making it Evented

_TODO_


