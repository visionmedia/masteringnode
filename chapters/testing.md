
# Testing

## assert Module

To begin, require the assert module:

	var assert = require('assert');

This module exposes a few functions common to assertion testing:

	// equality
	assert.equal(actual, expected, [message])
	assert.notEqual(actual, expected, [message])
	assert.deepEqual(actual, expected, [message])
	assert.notDeepEqual(actual, expected, [message])
	assert.strictEqual(actual, expected, [message])
	assert.notStrictEqual(actual, expected, [message])

	// exception
	assert.throws(block, [error], [message])
	assert.doesNotThrow(block, [error], [message])
	assert.ifError(value)
	
	// condition
	assert.ok(value, [message])
	assert.fail(actual, expected, message, operator)

These are pretty self-explanatory if you've written assertion tests before. Let's look at a pretty simple test, anyway.  We'll code in an object for the test that will do what we want for each test.

### Synchronous Testing with Assert

    // testing/equality_no_errors.js
    var assert = require('assert'),
	    tester_a = {
	      val : 'a'
	    }, 	
	    tester_b = {
	      val : 'b'
	    };

    assert.equal(tester_a.val, 'a');
    assert.equal(tester_b.val, 'b');

In this example, we're using the assert module to check that a value on each of these objects is the expected value.  This works well because the values are equal.  But, the assert module throws an `AssertionError` whenever an assertion fails.  So, it doesn't really make sense to have a single file with end-to-end assertions as in the `./src/testing/equality\_no\_errors.js` file.  This is where testing frameworks like _nodeunit_ or _expresso_ come in very handy.  They offer common functionality of test frameworks (like metrics, etc.).

To see how the `AssertionError` being thrown from `assert.equal` can be problematic, change the expected value in the first test to an incorrect value.  Then, change the expected value in the very last test to an incorrect value and run `node src/testing/equality_no_errors.js` again.  You'll see that, because of the procedural style of the code, the last test never runs!  

In order to run multiple assertions and provide feedback, the simplest test (without a testing framework) would use a `try/catch` and provide output to _stdout_.
    
    // testing/equality_with_errors.js
    var assert = require('assert'),
	    tester_a = {
	      val : 'aa'
	    }, total = 0, good = 0;

    // assert.equal(actual, expected, [message])
    try {
        console.log("assert.equal(tester_a.val, 'a')");
        assert.equal(tester_a.val, 'a');
        passed();
    } catch (err) { writeException(err); }

    console.log("%d of %d tests passed", good, total);

    function writeException(err) {
        console.log("Test failed!");
        util.inspect(err);
        if(err["name"] === "AssertionError") {
            console.log("Message: " + (err["message"] || "None"));
            console.log("Expected: " + err["expected"]);
            console.log("Actual: " + err["actual"]);
            console.log("Operation: " + err["operator"]);
        }
        console.log("");
        total = total + 1;
    }

    function passed() {
        good = good + 1;
        total = total + 1;
        console.log("Test passed!\n");
    }

The above code is part of the code from within _./src/testing/equality\_with\_errors.js_.  It shows how to run synchronous tests with a minimal amount of redundant code, *without* writing a lightweight testing module for your tests.  This may be what you want, but most likely it isn't.

### The problems

You *could* write a simple helper module to run these tests for you.  But, how do you verify the order of your tests?  This can become complex very quickly.

You can partially resolve this with the `try/catch` block example above, but this requires a lot of redundant code.  Compare _./src/testing/equality\_with\_errors.js_ and _./src/testing/equality\_no\_errors.js_ to see how the testing quickly expands!  Run `node testing/equality_with_errors.js` to see the output.  That's more like it! Isn't that nice?  

Yes and no.  There are a few problems with this code: 

  1. It isn't evented
  2. It hard-codes test objects
  3. It is very redundant
  4. It isn't scalable

Well, then, _what are other options?_

## Nodeunit

  ...

## Expresso

  ...

## Vows

  ...

## Fixtures

  ...
