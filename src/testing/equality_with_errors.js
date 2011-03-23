// This is written to produce no output (there are no AssertionErrors to be thrown)
var fs = require('fs'), util = require('util');
var assert = require('assert'),
	tester_a = {
	  val : 'aa'
	}, 	
	tester_aa = {
	  val : 'bb'
	}, 
	tester_b = {
	  val : 'cc'
	},
	tester_c = {
	  val : 'dd',
	  extra : 'ee'
	}, 
	tester_a_copy = tester_a, total = 0, good = 0;

// assert.equal(actual, expected, [message])
try {
    console.log("assert.equal(tester_a.val, 'a')");
    assert.equal(tester_a.val, 'a');
    passed();
} catch (err) { writeException(err); }

try {
    console.log("assert.equal(tester_b.val, 'b')");
    assert.equal(tester_b.val, 'b');
    passed();
} catch (err) { writeException(err); }

try {
    console.log("assert.equal(tester_c.extra, 'cc')");
    assert.equal(tester_c.extra, 'cc', 'tester_c.extra was not the expected value'); // change 'cc' to display this error.
    passed();
} catch (err) { writeException(err); }

// assert.notEqual(actual, expected, [message])
try {
    console.log("assert.notEqual(tester_a.val, tester_b.val)");
    assert.notEqual(tester_a.val, tester_b.val);
    passed();
} catch (err) { writeException(err); }

try {
    console.log("assert.notEqual(tester_b.val, tester_c.extra)");
    assert.notEqual(tester_b.val, tester_c.extra, 'tester_b.val and tester_c.extra should not be equal'); // change tester_c.extra to display this error.
    passed();
} catch (err) { writeException(err); }

// assert.deepEqual(actual, expected, [message])
try {
    console.log("assert.deepEqual(tester_a, tester_aa)");
    assert.deepEqual(tester_a, tester_aa); // objects are structurally the same
    passed();
} catch (err) { writeException(err); }

try {
    console.log("assert.deepEqual(tester_a, tester_a_copy)");
    assert.deepEqual(tester_a, tester_a_copy); // objects are the same in memory
    passed();
} catch (err) { writeException(err); }

// assert.notDeepEqual(actual, expected, [message])
try {
    console.log("assert.notDeepEqual(tester_a, tester_c)");
    assert.notDeepEqual(tester_a, tester_c); // tester_c has an 'extra' property that tester_a does not
    passed();
} catch (err) { writeException(err); }

// assert.strictEqual(actual, expected, [message])
try {
    console.log("assert.strictEqual(tester_a, tester_a_copy)");
    assert.strictEqual(tester_a, tester_a_copy); // both objects reference the same memory
    passed();
} catch (err) { writeException(err); }

// assert.notStrictEqual(actual, expected, [message])
try {
    console.log("assert.notStrictEqual(tester_b, tester_a_copy)");
    assert.notStrictEqual(tester_b, tester_a_copy); // same properties, but different values
    passed();
} catch (err) { writeException(err); }

try {
    console.log("assert.notStrictEqual(tester_aa, tester_a_copy)");
    assert.notStrictEqual(tester_aa, tester_a_copy); // same properties, same values but different memory
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
