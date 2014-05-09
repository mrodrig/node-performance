// This script was written to test endpoint performance across across after application changes.
// Please do not use it maliciously as that was not it's intent.

var request = require('request'),
    _ = require('underscore'),
    async = require('async');

var perf = {
    // Change this URL to the one that you wish to performance test
    URL: 'http://google.com', // URL that we are performance testing
    HTTP_METHOD: 'GET', // HTTP Method that should be used to make the requests to the URL
    REQ_BODY: {}, // Data to send along with the HTTP Request,
    REQ_HEADERS: {}, // Headers to send along with the HTTP Request
    NUM_PASSES: 10, // Number of passes/times to check the performance
    NUM_REQUESTS: 15, // Number of requests to asynchronously make during each pass
    // DO NOT INCREASE THIS NUMBER SIGNIFICANTLY - YOU CAN TAKE DOWN A WEB SERVICE IF YOU DO

    // Make a request and return the results of the request
    makeRequest: function (indx) {
        //console.log('Generating request #' + indx);
        return function (cb) {
            var start = new Date().getTime(); // Retrieve the time (ms) before starting
            var opts = {
                url: perf.URL,
                method: perf.HTTP_METHOD,
                headers: perf.REQ_HEADERS,
                json: perf.REQ_BODY
            };
            request(opts, function (err, res, body) {
                var finished = new Date().getTime(); // Retrieve the time (ms) after receiving the response
                if (!err && res.statusCode === 200 && body) {
                    cb(null, { 'status': res.statusCode, 'start': start, 'end': finished, 'total': (finished-start) }); // Send our response timing info back
                } else {
                    cb(new Error('Status: ' + res.statusCode + '\nError: ' + err), null);
                }
            });
        };
    },

    // Make a single request to the URL so we have an idea how long a single request should take
    singleRequest: function (cb) {
        console.log('\nPerforming singleRequest for baseline...');
        perf.makeRequest(function (err, res) {
            if (!err) { // Status Code is 200 inside this block
                res = res[0]; // Only one function call - response is always at index 0
                console.log('Finished singleRequest.\n  Request took: ' + res.total + ' ms.');
            } else { // Any other status code or errors
                throw err;
            }
            cb(null, true); // Indicate we are finished running the single request
        });
    },

    // Create an array of _num_ calls to the function that fn(indx) returns
    createList: function (num, fn) {
        var out = [];
        _.each(_.range(num), function (indx) {
            out.push(fn(indx)); // Call fn and pass the indx along. Push the returned function onto the array
        });
        return out;
    },

    // Make a single pass on the endpoint making perf.NUM_REQUESTS requests against the URL
    makePass: function (indx) {
        return function (cb) {
            var requests = perf.createList(perf.NUM_REQUESTS, perf.makeRequest); // Retrieve the list of requests to async hit
            console.log('\n\nStarting pass #' + indx);
            async.parallel(requests, function (err, res) { // Asynchronously make the requests
                var data = { 'sum': _.reduce(res, function(acc, pass) {return acc + pass.total; }, 0) } // Compute the total time taken to fulfill the requests
                data.average = data.sum / perf.NUM_REQUESTS; // Compute the average time to complete a request
                if (!err) { // Status Code is 200 inside this block
                    _.each(res, function (req, indx) {
                        res[indx] = req.total; // Replace the item with just the total request time
                    });
                    console.log('  Response Times (ms): ' + res.join(', '));
                    console.log('  Response Calculations: ', data);
                    cb(null, data.average);
                } else { // Any other status code or errors
                    console.log('Unexpected error occurred!');
                    cb(err, null);
                }
            });
        };
    },

    // Complete all passes in series
    multiRequests: function (cb) {
        var passes = perf.createList(perf.NUM_PASSES, perf.makePass);
        async.series(passes, function (err, res) {
            if (!err) {
                // Report the overall average response time
                console.log('\n\nAverage Response Time: ' + (_.reduce(res, function(acc, avg) { return acc + avg }, 0)/perf.NUM_PASSES) + ' ms');
                console.log('\n\nAll passes have been completed.');
                cb(null, true);
            } else {
                console.log('\n\nAn error occurred during at least one pass.');
                cb(err, null);
            }
        });
    },

    // Initialize the performance test
    init: function () {
        console.log('Starting the performance test...');
        async.series([perf.singleRequest,  // Try a single request first to get a baseline of the current conditions
            perf.multiRequests], // Perform multiple passes of multiple requests to see how the endpoint slows under load
            function (err, res) {
                if (!err) {
                    console.log('Finished the performance test.');
                } else {
                    console.log('An unexpected error occurred.');
                }
            }
        );
    }
};

module.exports = {
    test: perf.init
}
