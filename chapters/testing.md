
# Testing

Testing is a very large topic.  There are different types of testing, each with different methodologies.  Then, there are also strong feelings of developers toward which type of testing is the best or most effective.

* Assertion Testing
    - Tests a true or false condition against known objects or values
* Behavioral Testing
    - Tests how one object acts when interacting with another
* Functional/Acceptance Testing
    - "Black box" testing of a system, usually code-agnostic
* Regression Testing
    - Tests for consistency after changes have been made to code
* Others...

There are many other types of testing, but these are some large topics in the testing arena.  Development practices include Test-Driven Development (TDD), Behavior-Driven Development, and others. Some programmers don't believe in testing, others believe tests should be written before the code, while others still believe tests should only be written for the most important code.  As you can see, this is a large and complex topic.

Whether you write tests before you code, test only the most important code, or casually write tests when there is time, it is important to choose a testing tool that fits your needs.

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

[Nodeunit](https://github.com/caolan/nodeunit) is a framework similar to nunit in that it allows for multiple test cases (running in parallel), and supports mocks and stubs.  It is easy to use, and even allows you to run tests in the browser.

Nodeunit testing starts with exporting a test or two from a module.

    // testing/nodeunit_basics.js
    module.exports = {
        'Test 1' : function(test) {
            test.expect(1);
            test.ok(true, "This shouldn't fail");
            test.done();
        },
        'Test 2' : function(test) {
            test.expect(2);
            test.ok(1 === 1, "This shouldn't fail");
            test.ok(false, "This should fail");
            test.done();
        }
    };
    
Here, we have a module exporting two tests, `Test 1` and `Test 2`.  You may have noticed that the `test` object in the functions have an `ok()` method just like the `assert` module mentioned above.  Good eye.  In fact, `test` supports all of the assert functions and adds two others: `expect(number)` and `done()`.  The `expect` function tells nodeunit how many tests are being run within the context of the current test case.  When all tests are finished, call `test.done()` to let nodeunit know the test case has completed (and a callback may have failed).

The output of nodeunit is visually helpful.  

    $ nodeunit src/testing/nodeunit_basics.js 

    nodeunit_basics.js
    ✔ Test 1
    ✖ Test 2

    Assertion Message: This should fail
    AssertionError: false == true
        at Object.ok (/usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/types.js:81:39)
        at /home/jim/projects/masteringnode/src/testing/nodeunit_basics.js:10:14
        at Object.runTest (/usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/core.js:54:9)
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/core.js:90:21
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:508:13
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:118:25
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:129:25
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:510:17
        at Array.<anonymous> (/usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/types.js:144:17)
        at EventEmitter._tickCallback (node.js:108:26)


    FAILURES: 1/3 assertions failed (8ms)

Nodeunit will list all test cases run within the test, followed by any `AssertionError` output and the number of passing or failing assertions.  This is the default (minimal) output.  

### Nodeunit reporters

Nodeunit ships with a number of reporters and it is possible to add custom reporters.  

    $ nodeunit --list-reporters
    Build-in reporters: 
      * default: Default tests reporter
      * minimal: Pretty minimal output
      * junit: jUnit XML test reports
      * html: Report tests result as HTML
      * skip_passed: Skip passed tests output
      * browser: Browser-based test reporter

To output to junit, run the command as:

    $ cd src/testing && nodeunit --reporter junit nodeunit_basics.js --output junit.out
    
This creates an xml file (whitespace has been condensed):

    // testing/junit.out/nodeunit_basics.js.xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <testsuite name="nodeunit_basics.js"
             errors="0"
             failures="0"
             tests="2">
      <testcase name="Test 1">
      </testcase>
      <testcase name="Test 2">
      </testcase>
    </testsuite>
    
This is great, but in a real-world development environment, you may be asked to write reports with a specific format, wording, or links (in html) to files with failing test cases.  Luckily, nodeunit allows us to customize this output.

### Nodeunit Custom reporters

To write a custom reporter for nodeunit, first decide how you'd like nodeunit to report information about your tests.  As a simple example, let's take a look at a different take on the [minimal](https://github.com/caolan/nodeunit/blob/master/lib/reporters/minimal.js) reporter.

Here are the modifications I'd like to see:

* Show the start time of the test
* Show the filename as bold/green
* Add *[PASS]* or *[FAIL]* after the *✔* or *✖*
* Prefix a test case with a '|'
    
These may seem like contrived requirements.  But, what if my manager wants me to parse textual output for *[FAIL]* and, for whatever reason, it has to say *[FAIL]*?  

The modifications to the _minimal_ reporter are too spread out to include inline here, so be sure to check out the file at _./src/testing/reporterse/example.js_.

Here is the slightly modified minimal output, meeting all of the requirements.

    $ cd src/testing && nodeunit --reporter reporters/example.js nodeunit_basics.js 
    Tests started: Tue Mar 22 2011 21:24:42 GMT-0700 (PDT)
    nodeunit_basics.js: 

    ✔ [PASS] | Test 1
    ✖ [FAIL] | Test 2


    AssertionError: false == true
        at Object.ok (/usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/types.js:81:39)
        at /home/jim/projects/masteringnode/src/testing/nodeunit_basics.js:10:14
        at Object.runTest (/usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/core.js:54:9)
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/core.js:90:21
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:508:13
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:118:25
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:129:25
        at /usr/local/lib/node/.npm/nodeunit/0.5.1/package/deps/async.js:510:17
        at Array.<anonymous> (/usr/local/lib/node/.npm/nodeunit/0.5.1/package/lib/types.js:144:17)
        at EventEmitter._tickCallback (node.js:108:26)


    FAILURES: 1/3 assertions failed (9ms)

These were small modifications, but following through the [reporters included in nodeunit](https://github.com/caolan/nodeunit/tree/master/lib/reporters), it will be easy to output test reports to your desired format.

### Nodeunit Mocks and Stubs

  ...

## Expresso

  ...

## Vows

  ...

## Fixtures

  ...
