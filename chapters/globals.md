
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

 ...

