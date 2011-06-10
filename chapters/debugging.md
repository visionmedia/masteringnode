# Debugging

One of the most important aspects of programming in any language is the ability to debug code.

## node-inspector

[node-inspector](https://github.com/dannycoates/node-inspector) is a Web Inspector node.js debugger.  This means you'll need a WebKit browser like Chrome or Safari to run node-inspector.

## Installation

If you've performed the npm installation from the previous section, you should be ready to go.  If not, you can install node-inspector from source or through npm.

	$ npm install node-inspector
	
If you'd like to install from source, check out the [Getting Started from scratch](https://github.com/dannycoates/node-inspector/wiki/Getting-Started---from-scratch) wiki entry from the node-inspector repository.

## Usage

Open one terminal to host a node-inspector server.  This terminal will remain open and provide a debug listener.

	$ node-inspector&
	> visit http://0.0.0.0:8080/debug?port=5858 to start debugging

You will see output directing you to open a browser and point it to the node-inspector server at the default port (8080).

Next, open another terminal and navigate to `./src/events` and run node with the `--debug-brk` switch.  This will connect to the debugger on port 5858.

	$ node --debug-brk basic.js 
	> debugger listening on port 5858
	
Now, open a browser to [http://127.0.0.1:8080/debug?port=5858](http://127.0.0.1:8080/debug?port=5858) and you will see a breakpoint on what would be the first line of your file.  I phrased it like this intentionally because the debugger shows you how node.js sees your file:

	(function (exports, require, module, filename, dirname) {
	/* Your code here */
	});

If you've used the Web Inspector view in Google Chrome, you should be familiar with using node-inspector's version of Web Inspector.  There is a console drawer if you click on the bottom-left icon which allows you to evaluate JavaScript and filter log messages by type (Errors, Warnings, Logs). There is also a 'Console' tab if you need a full view of the console.

Expand the `Watch Expressions` section on the right of the Web Inspector's Scripts tab.  Click the 'Add' button and you can add variables which will be updated as you step through code.  In version 0.1.6 of node-inspector, when I click the 'Add' button, it automatically adds two single-quotes.  If this happens to you, delete the quotes and enter your text.

You'll see as you step through the code that you step directly into node.js functions.  This is very useful if you are exploring node.js or if you want to see how something is implemented, like when you call something like `console.log("%d days without incident", 5);`.

