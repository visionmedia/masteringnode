
# Installing Node

In this chapter we will be looking at the installation and compilation of node. Although there are several ways we may install node, we will be looking at [homebrew](http://github.com/mxcl/homebrew), [nDistro](http://github.com/visionmedia/ndistro), and the most flexible method, of course - compiling from source.

### Homebrew

Homebrew is a package management system for _OSX_ written in Ruby, is extremely well adopted, and easy to use. To install node via the `brew` executable simply run:

    $ brew install node.js

## nDistro

[nDistro](http://github.com/visionmedia/ndistro) is a distribution toolkit for node, which allows creation and installation of node distros within seconds. An _nDistro_ is simply a dotfile named _.ndistro_ which defines
 module and node binary version dependencies. In the example
below we specify the node binary version _0.1.102_, as well as
several 3rd party modules.

	node 0.1.102
	module senchalabs connect
	module visionmedia express 1.0.0beta2
	module visionmedia connect-form
	module visionmedia connect-redis
	module visionmedia jade
	module visionmedia ejs

Any machine that can run a shell script can install distributions, and keeps dependencies defined to a single directory structure, making it easy to maintain and deploy. nDistro uses [pre-compiled node binaries](http://github.com/visionmedia/nodes) making them extremely fast to install, and module tarballs which are fetched from [GitHub](http://github.com) via _wget_ or _curl_ (auto detected).

To get started we first need to install nDistro itself, below we _cd_ to our bin directory of choice, _curl_ the shell script, and pipe the response to _sh_ which will install nDistro to the current directory:

    $ cd /usr/local/bin && curl http://github.com/visionmedia/ndistro/raw/master/install | sh

Next we can place the contents of our example in _./.ndistro_, and execute _ndistro_ with no arguments, prompting the program to load the config, and start installing:

    $ ndistro

Installation of the example took less than 17 seconds on my machine, and outputs the following _stdout_ indicating success. Not bad for an entire stack!

	... installing node-0.1.102-i386
	... installing connect
	... installing express 1.0.0beta2
	... installing bin/express
	... installing connect-form
	... installing connect-redis
	... installing jade
	... installing bin/jade
	... installing ejs
	... installation complete

## Building From Source

To build and install node from source, we first need to obtain the code. The first method of doing so is
via `git`, if you have git installed you can execute:

    $ git clone http://github.com/ry/node.git && cd node

For those without _git_, or who prefer not to use it, we can also download the source via _curl_, _wget_, or similar:

    $ curl -# http://nodejs.org/dist/node-v0.1.99.tar.gz > node.tar.gz
    $ tar -zxf node.tar.gz

Now that we have the source on our machine, we can run `./configure` which discovers which libraries are available for node to use such as _OpenSSL_ for transport security support, C and C++ compilers, etc. `make` which builds node, and finally `make install` which will install node.

    $ ./configure && make && make install
