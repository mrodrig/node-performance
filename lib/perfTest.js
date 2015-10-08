
// This script was written to test endpoint performance across across after application changes.
// Please do not use it maliciously as that was not it's intent.

var request = require('request'),
    _ = require('underscore'),
    async = require('async');

var perf = {

    OPTIONS: require('./options.json'), // Options - pulled in from options.json

    // Make a request and return the results of the request
    makeRequest: function (indx) {
        return function (cb) {
            var start = new Date().getTime(); // Retrieve the time (ms) before starting
            var opts = {
                url: perf.OPTIONS.URL,
                method: perf.OPTIONS.HTTP_METHOD,
                headers: perf.OPTIONS.REQ_HEADERS,
                json: perf.OPTIONS.REQ_BODY
            };
            request(opts, function (err, res, body) {
                var finished = new Date().getTime(); // Retrieve the time (ms) after receiving the response
                if (!err && res.statusCode === 200 && body) {
                    return cb(err, { status: res.statusCode, start: start, end: finished, total: (finished-start) }); // Send our response timing info back
                } else {
                    return cb(new Error('Status: ' + res.statusCode + '\nError: ' + err), null);
                }
            });
        };
    },

    // Make a single request to the URL so we have an idea how long a single request should take
    singleRequest: function (cb) {
        console.log('\nPerforming singleRequest for baseline...');
        perf.makeRequest(0)(function (err, res) {
            if (!err) { // Status Code is 200 inside this block
                console.log('Finished singleRequest.\n  Request took: ' + res.total + ' ms.');
            } else { // Any other status code or errors
                console.log('An unexpected error occurred during the singleRequest.', err);
            }
            return cb(err, res); // Indicate we are finished running the single request
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

    // Make a single pass on the endpoint making perf.OPTIONS.NUM_REQUESTS requests against the URL
    makePass: function (indx) {
        return function (cb) {
            var requests = perf.createList(perf.OPTIONS.NUM_REQUESTS, perf.makeRequest); // Retrieve the list of requests to async hit
            console.log('\n\nStarting pass #' + indx);
            async.parallel(requests, function (err, res) { // Asynchronously make the requests
                var data = { 'sum': _.reduce(res, function(acc, pass) {return acc + pass.total; }, 0) }; // Compute the total time taken to fulfill the requests
                data.average = data.sum / perf.OPTIONS.NUM_REQUESTS; // Compute the average time to complete a request
                if (!err) { // Status Code is 200 inside this block
                    _.each(res, function (req, indx) {
                        res[indx] = req.total; // Replace the item with just the total request time
                    });
                    console.log('  Response Times (ms): ' + res.join(', '));
                    console.log('  Response Calculations: ', data);
                    return cb(null, data);
                } else { // Any other status code or errors
                    console.log('Unexpected error occurred!');
                    return cb(err);
                }
            });
        };
    },

    // Complete all passes in series
    multiRequests: function (cb) {
        var passes = perf.createList(perf.OPTIONS.NUM_PASSES, perf.makePass);
        async.series(passes, function (err, res) {
            if (!err) {
                // Report the overall average response time
                console.log('\n\nAverage Response Time: ' + (_.reduce(res, function(acc, data) { return acc + data.average }, 0)/perf.OPTIONS.NUM_PASSES) + ' ms');
                console.log('\n\nAll passes have been completed.');
            } else {
                console.log('\n\nAn error occurred during at least one pass.');
            }
            return cb(err, res);
        });
    },

    // Initialize the performance test
    init: function (cb) {
        console.log('Starting the performance test...');
        async.series([perf.singleRequest,  // Try a single request first to get a baseline of the current conditions
            perf.multiRequests], // Perform multiple passes of multiple requests to see how the endpoint slows under load
            cb
        );
    }
};

perf.init(
    function (err, res) {
        if (!err) {
            console.log('Finished the performance test.');
        } else {
            console.log('An unexpected error occurred.', err);
        }
    }
);
