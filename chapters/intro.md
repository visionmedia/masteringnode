# Mastering Node

[Node](http://nodejs.org) is an exciting new platform developed by _Ryan Dahl_, allowing JavaScript developers to create extremely high performance servers by leveraging [Google V8](http://code.google.com/p/v8/) JavaScript engine, and asynchronous I/O. In _Mastering Node_) we will discover how to write high concurrency web servers, utilizing the CommonJS module system, node's core libraries, third party modules, high level web development and more.

## Why Node?

Node is an evented I/O framework for server-side JavaScript.  What does that mean, though?  In many programming languages, I/O operations are blocking.  This means that when you open a file, no other code executes until that file is fully opened.  

Using a busy office environment as an example, blocking I/O operations are like a very busy and very focussed desk worker name Frank. Work may pile up on the desk, but Frank finishes every task that he starts (however, when he finds the smallest problem, he gives up).  This is traditionally how procedural programming languages perform tasks.

Node.js is more like an office manager. Sure, there are management tasks, but all of those I/O operations are handled fairly well by the operating system or node addons.  So, the manager sees a task, assigns it to Frank.  The manager may check back on Frank from time to time to see how he's doing, but he doesn't need to waste his time on the task because he knows that when it's completed, Frank will give it back.

Don't worry, though.  Node.js isn't a jerk, so look forward to a healthy relationship.

## Why JavaScript?

**JavaScript is a well-known dynamic language.**

In fact, many people who don't consider themselves programmers know JavaScript. Node.js uses [Google's V8 JavaScript engine](http://code.google.com/apis/v8/intro.html).  V8 is an implementation of the JavaScript standards specified in [ECMA-262, Version 3](http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf). It is a high-performance, garbage-collected execution environment which can be embedded in any stand-alone application.

**Everything in JavaScript is an `Object`.**

Arrays are `Objects`.  Object literals are `Object`s.  Even functions are `Object`s.

**JavaScript supports some fairly advanced functional programming concepts. [?](http://www.ibm.com/developerworks/library/wa-javascript.html#functional)**

Currying, closures, functions-as-arguments, and anonymous functions are concepts typically found in functional programming languages.  There are libraries available, such as [underscore.js](http://documentcloud.github.com/underscore/), which provider more functional programming functionality without changing JavaScript itself.

**It's awesome. I had to say it.**

For a deep understanding of what JavaScript really has to offer, check out [JavaScript Patterns](http://oreilly.com/catalog/9780596806767).

## Hello World!
**Becuase it has to be done**

	// hello.js
	sys = require('sys');
	sys.puts("Hello, World!");

To run the 'Hello, World!' example, execute `node hello.js` on the command line.


