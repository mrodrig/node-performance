'use strict';

var perfTest = require('./perfTest'), // Require our json-2-csv code
    _ = require('underscore'); // Require underscore

// Default options; By using a function this is essentially a 'static' variable
var OPTIONS = function () {
    return {
        DELIMITER         : ',',
        EOL               : '\n',
        PARSE_CSV_NUMBERS : false
    };
}

// Build the options to be passed to the appropriate function
// If a user does not provide custom options, then we use our default
// If options are provided, then we set each valid key that was passed
var buildOptions = function (opts) {
    var out = _.extend(OPTIONS(), {});
    if (!opts) { return out; } // If undefined or null, return defaults
    _.each(_.keys(opts), function (key) {
        if (out[key]) { // If key is valid, set it
            out[key] = opts[key];
        } // Else ignore its value
    });
    return out; // Return customized version
};

// Export the following functions that will be client accessible
module.exports = {
   
    // Client accessible csv2json function
    // Takes a string of CSV to be converted to a JSON document array,
    // a callback that will be called with (err, csv) after
    // processing is completed, and optional options
    start: function (callback, opts) {
        opts = buildOptions(opts);
        perfTest.test(opts, callback);
    }

};