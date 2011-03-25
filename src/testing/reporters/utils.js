/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var sys = require('sys');

/**
 * Improves formatting of AssertionError messages to make deepEqual etc more
 * readable.
 *
 * @param {Object} assertion
 * @return {Object}
 * @api public
 */

exports.betterErrors = function (assertion) {
    if (!assertion.error) return;

    var e = assertion.error;
    // deepEqual error message is a bit sucky, lets improve it!
    // e.actual and e.expected could be null or undefined, so
    // using getOwnPropertyDescriptor to see if they exist:
    if (Object.getOwnPropertyDescriptor(e, 'actual') &&
        Object.getOwnPropertyDescriptor(e, 'expected')) {

        // alexgorbatchev 2010-10-22 :: Added a bit of depth to inspection
        var actual = sys.inspect(e.actual, false, 10).replace(/\n$/, '');
        var expected = sys.inspect(e.expected, false, 10).replace(/\n$/, '');
        var multiline = (
            actual.indexOf('\n') !== -1 ||
            expected.indexOf('\n') !== -1
        );
        var spacing = (multiline ? '\n' : ' ');
        e._message = e.message;
        e.stack = (
            e.name + ':' + spacing +
            actual + spacing + e.operator + spacing +
            expected + '\n' +
            e.stack.split('\n').slice(1).join('\n')
        );
    }
    return assertion;
};

