// This is written to produce no output (there are no AssertionErrors to be thrown)
var assert = require('assert'),
	tester_a = {
	  val : 'a'
	}, 	
	tester_aa = {
	  val : 'a'
	}, 
	tester_b = {
	  val : 'b'
	},
	tester_c = {
	  val : 'c',
	  extra : 'cc'
	}, 
	tester_a_copy = tester_a;
// assert.equal(actual, expected, [message])
assert.equal(tester_a.val, 'a');
assert.equal(tester_b.val, 'b');
assert.equal(tester_c.extra, 'cc', 'tester_c.extra was not the expected value'); // change 'cc' to display this error.

// assert.notEqual(actual, expected, [message])
assert.notEqual(tester_a.val, tester_b.val);
assert.notEqual(tester_b.val, tester_c.extra, 'tester_b.val and tester_c.extra should not be equal'); // change tester_c.extra to display this error.

// assert.deepEqual(actual, expected, [message])
assert.deepEqual(tester_a, tester_aa); // objects are structurally the same
assert.deepEqual(tester_a, tester_a_copy); // objects are the same in memory

// assert.notDeepEqual(actual, expected, [message])
assert.notDeepEqual(tester_a, tester_c); // tester_c has an 'extra' property that tester_a does not

// assert.strictEqual(actual, expected, [message])
assert.strictEqual(tester_a, tester_a_copy); // both objects reference the same memory

// assert.notStrictEqual(actual, expected, [message])
assert.notStrictEqual(tester_b, tester_a_copy) // same properties, but different values
assert.notStrictEqual(tester_aa, tester_a_copy) // same properties, same values but different memory
