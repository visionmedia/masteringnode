
# Globals

 As we have learnt node's module system discourages the use of globals, however node provides a few important globals for use to utilize. The first and most important is the `process` global which exposes process manipulation such as signalling, exiting, the process id (pid), and more. Other globals help drive to be similar to other familiar JavaScript environments such as the browser, by providing a `console` object.

## console

The `console` object contains several methods which are used to output information to _stdout_ or _stderr_. Lets take a look at what each method does.

### console.log()

The most frequently used console method is `console.log()` simply writing to _stdout_ with a line feed (`\n`). Currently aliased as `console.info()`.

    console.log('wahoo');
	// => wahoo

    console.log({ foo: 'bar' });
	// => [object Object]

### console.error()

Identical to `console.log()`, however writes to _stderr_. Aliased as `console.warn()` as well.

    console.error('database connection failed');

### console.dir()

Utilizes the _sys_ module's `inspect()` method to pretty-print the object to
_stdout_.

    console.dir({ foo: 'bar' });
    // => { foo: 'bar' } 

### console.assert()

Asserts that the given expression is truthy, or throws an exception.

    console.assert(connected, 'Database connection failed');

## process

The `process` object is plastered with goodies, first we will take a look
at some properties that provide information about the node process itself.

### process.version

The version property contains the node version string, for example "v0.1.103".

### process.installPrefix

Exposes the installation prefix, in my case "_/usr/local_", as node's binary was installed to "_/usr/local/bin/node_".

### process.execPath

Path to the executable itself "_/usr/local/bin/node_".

### process.platform

Exposes a string indicating the platform you are running on, for example "darwin".

### process.pid

The process id.

### process.cwd()

Returns the current working directory, for example:

    cd ~ && node
    node> process.cwd()
    "/Users/tj"

### process.getuid()

Returns the numerical user id of the running process.

### process.getgid()

Returns the numerical group id of the running process.

### process.env

An object containing the user's environment variables, for example:

    { PATH: '/Users/tj/.gem/ruby/1.8/bin:/Users/tj/.nvm/current/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11/bin'
	, PWD: '/Users/tj/ebooks/masteringnode'
	, EDITOR: 'mate'
	, LANG: 'en_CA.UTF-8'
	, SHLVL: '1'
	, HOME: '/Users/tj'
	, LOGNAME: 'tj'
	, DISPLAY: '/tmp/launch-YCkT03/org.x:0'
	, _: '/usr/local/bin/node'
	, OLDPWD: '/Users/tj'
	}
	