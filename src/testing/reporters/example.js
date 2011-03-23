/*!
 * Nodeunit 
 * Minimal Reporter 
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 *
 * Modifications by Jim Schubert as an example for Mastering Node
 */
 
/**
 * Module dependencies
 */
 
var nodeunit = require('nodeunit'),
    fs = require('fs'),
    sys = require('sys'),
    path = require('path'),
    utils = require('./utils'),
    AssertionError = require('assert').AssertionError;

/**
 * Reporter info string
 */

exports.info = "Mastering Node example";

/**
 * Run all tests within each module, reporting the results to the command-line.
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (files, options) {

    if (!options) {
        // load default options
        var content = fs.readFileSync(
            // grab the nodeunit.json file in the same directory
            __dirname + 'nodeunit.json', 'utf8'
        );
        options = JSON.parse(content);
    }

    var red   = function (str) {
        return options.error_prefix + str + options.error_suffix;
    };
    var green = function (str) {
        return options.ok_prefix + str + options.ok_suffix;
    };
    var magenta = function (str) {
        return options.assertion_prefix + str + options.assertion_suffix;
    };
    var bold  = function (str) {
        return options.bold_prefix + str + options.bold_suffix;
    };

    var start = new Date();
    var paths = files.map(function (p) {
        return path.join(process.cwd(), p);
    });
        
    nodeunit.runFiles(paths, {
        moduleStart: function (name) {
            // 1. Before tests run, display name or other information.
            sys.puts('Tests started: ' + start);
            sys.puts(bold(green(name + ': \n')));
        },
        moduleDone: function (name, assertions) {
            sys.puts('');
            if (assertions.failures()) {
                assertions.forEach(function (a) {
                    if (a.failed()) {
                        a = utils.betterErrors(a);
                        if (a.error instanceof AssertionError && a.message) {
                            sys.puts(
                                'Assertion in test ' + bold(a.testname) + ': ' +
                                magenta(a.message)
                            );
                        }
                        sys.puts(a.error.stack + '\n');
                    }
                });
            }

        },
        testStart: function () {
        },
        testDone: function (name, assertions) {
            if (!assertions.failures()) {
                // We want the same checkbox from default.js
                sys.puts(green('✔ [PASS] | ' + name));
            }
            else {
                // We want the same x from default.js
                sys.puts(red('✖ [FAIL] | ' + name) + '\n');
                assertions.forEach(function (assertion) {
                    assertion.testname = name;
                });
            }
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start.getTime();
            if (assertions.failures()) {
                sys.puts(
                    '\n' + bold(red('FAILURES: ')) + assertions.failures() +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)'
                );
            }
            else {
                sys.puts(
                    '\n' + bold(green('OK: ')) + assertions.length +
                    ' assertions (' + assertions.duration + 'ms)'
                );
            }
            // should be able to flush stdout here, but doesn't seem to work,
            // instead delay the exit to give enough to time flush.
            setTimeout(function () {
                process.reallyExit(assertions.failures());
            }, 10);
        }
    });
};

