var should = require('should'),
  converter = require('.././lib/converter'),
  fs = require('fs'),
  _ = require('underscore'),
  async = require('async');

var
options = {
    DELIMITER         : ';',
    EOL               : '\n',
    PARSE_CSV_NUMBERS : false // Only used by csv2json
};

var json_regularJson    = require('./JSON/regularJson'),
    json_nestedJson     = require('./JSON/nestedJson'),
    json_nestedJson2    = require('./JSON/nestedJson2'),
    json_nestedQuotes   = require('./JSON/nestedQuotes'),
    json_noData         = require('./JSON/noData.json'),
    json_singleDoc      = require('./JSON/singleDoc.json'),
    csv_regularJson     = '',
    csv_nestedJson      = '',
    csv_nestedJson2     = '',
    csv_nestedQuotes    = '',
    csv_noData          = '',
    csv_singleDoc       = '';

var json2csvTests = function () {
    describe('json2csv', function (done) {
        describe('Options Specified', function (done) {
            it('should convert plain JSON to CSV', function(done) {
                converter.json2csv(json_regularJson, function(err, csv) {
                    csv.should.equal(csv_regularJson.replace(/,/g, ';'));
                    csv.split(options.EOL).length.should.equal(6);
                    done();
                }, options);
            });

            it('should parse nested JSON to CSV - 1', function(done) {
                converter.json2csv(json_nestedJson, function(err, csv) {
                    csv.should.equal(csv_nestedJson.replace(/,/g, ';'));
                    csv.split(options.EOL).length.should.equal(6);
                    done();
                }, options);
            });

            it('should parse nested JSON to CSV - 2', function(done) {
                converter.json2csv(json_nestedJson2, function(err, csv) {
                    csv.should.equal(csv_nestedJson2.replace(/,/g, ';'));
                    csv.split(options.EOL).length.should.equal(4);
                    done();
                }, options);
            });

            it('should parse nested quotes in JSON to have quotes in CSV ', function(done) {
                converter.json2csv(json_nestedQuotes, function(err, csv) {
                    csv.should.equal(csv_nestedQuotes.replace(/,/g, ';'));
                    csv.split(options.EOL).length.should.equal(4);
                    done();
                }, options);
            });

            it('should parse an empty array to an empty CSV', function(done) {
                converter.json2csv(json_noData, function(err, csv) {
                    csv.should.equal(csv_noData.replace(/,/g, ';'));
                    csv.split(options.EOL).length.should.equal(3); // Still adds newlines for header, first data row, and end of data
                    done();
                }, options);
            });

            it('should parse a single JSON document to CSV', function (done) {
                converter.json2csv(json_singleDoc, function (err, csv) {
                    csv.should.equal(csv_singleDoc.replace(/,/g, ';'));
                    csv.split(options.EOL).length.should.equal(3);
                    done();
                }, options);
            });

            it('should throw an error about not having been passed data - 1', function (done) {
                converter.json2csv(null, function (err, csv) {
                    err.message.should.equal('Cannot call json2csv on null.');
                    done();
                }, options);
            });

            it('should throw an error about not having been passed data - 2', function (done) {
                converter.json2csv(undefined, function (err, csv) {
                    err.message.should.equal('Cannot call json2csv on undefined.');
                    done();
                }, options);
            });

            it('should throw an error about not being provided a callback - 1', function (done) {
                try {
                    converter.json2csv(undefined, undefined, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 2', function (done) {
                try {
                    converter.json2csv(null, undefined, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 3', function (done) {
                try {
                    converter.json2csv(null, null, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 4', function (done) {
                try {
                    converter.json2csv(undefined, null, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });
        });

        describe('Options Un-specified', function (done) {
            it('should convert plain JSON to CSV', function(done) {
                converter.json2csv(json_regularJson, function(err, csv) {
                    csv.should.equal(csv_regularJson
                    );
                    csv.split(options.EOL).length.should.equal(6);
                    done();
                });
            });

            it('should parse nested JSON to CSV - 1', function(done) {
                converter.json2csv(json_nestedJson, function(err, csv) {
                    csv.should.equal(csv_nestedJson);
                    csv.split(options.EOL).length.should.equal(6);
                    done();
                });
            });

            it('should parse nested JSON to CSV - 2', function(done) {
                converter.json2csv(json_nestedJson2, function(err, csv) {
                    csv.should.equal(csv_nestedJson2);
                    csv.split(options.EOL).length.should.equal(4);
                    done();
                });
            });

            it('should parse nested quotes in JSON to have quotes in CSV ', function(done) {
                converter.json2csv(json_nestedQuotes, function(err, csv) {
                    csv.should.equal(csv_nestedQuotes);
                    csv.split(options.EOL).length.should.equal(4);
                    done();
                });
            });

            it('should parse an empty array to an empty CSV', function(done) {
                converter.json2csv(json_noData, function(err, csv) {
                    csv.should.equal(csv_noData);
                    csv.split(options.EOL).length.should.equal(3); // Still adds newlines for header, first data row, and end of data
                    done();
                });
            });

            it('should parse a single JSON document to CSV', function (done) {
                converter.json2csv(json_singleDoc, function (err, csv) {
                    csv.should.equal(csv_singleDoc);
                    csv.split(options.EOL).length.should.equal(3);
                    done();
                });
            });

            it('should throw an error about not having been passed data - 1', function (done) {
                converter.json2csv(null, function (err, csv) {
                    err.message.should.equal('Cannot call json2csv on null.');
                    done();
                });
            });

            it('should throw an error about not having been passed data - 2', function (done) {
                converter.json2csv(undefined, function (err, csv) {
                    err.message.should.equal('Cannot call json2csv on undefined.');
                    done();
                });
            });

            it('should throw an error about not being provided a callback - 1', function (done) {
                try {
                    converter.json2csv(undefined, undefined);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 2', function (done) {
                try {
                    converter.json2csv(null, undefined);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 3', function (done) {
                try {
                    converter.json2csv(null, null);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 4', function (done) {
                try {
                    converter.json2csv(undefined, null);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 5', function (done) {
                try {
                    converter.json2csv();
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });
        });
    });
};

var csv2jsonTests = function () {
    describe('csv2json', function (done) {
        describe('Options Specified', function (done) {
            it('should convert a basic CSV to JSON', function(done) {
                converter.csv2json(csv_regularJson.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_regularJson);
                    true.should.equal(isEqual);
                    done();
                }, options);
            });

            it('should parse a CSV representing nested objects to JSON - 1', function(done) {
                converter.csv2json(csv_nestedJson.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_nestedJson);
                    true.should.equal(isEqual);
                    done();
                }, options);
            });

            it('should parse a CSV representing nested objects to JSON - 2', function(done) {
                converter.csv2json(csv_nestedJson2.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_nestedJson2);
                    true.should.equal(isEqual);
                    done();
                }, options);
            });

            it('should parse nested quotes in a CSV to have nested quotes in JSON', function(done) {
                converter.csv2json(csv_nestedQuotes.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_nestedQuotes);
                    true.should.equal(isEqual);
                    done();
                }, options);
            });

            it('should parse an empty CSV to an empty JSON array', function(done) {
                converter.csv2json(csv_noData.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_noData);
                    true.should.equal(isEqual);
                    done();
                }, options);
            });

            it('should parse a single JSON document to CSV', function (done) {
                converter.json2csv(json_singleDoc, function (err, csv) {
                    csv.should.equal(csv_singleDoc.replace(/,/g, ';'));
                    csv.split(options.EOL).length.should.equal(3);
                    done();
                }, options);
            });

            it('should throw an error about not having been passed data - 1', function (done) {
                converter.csv2json(null, function (err, json) {
                    err.message.should.equal('Cannot call csv2json on null.');
                    done();
                }, options);
            });

            it('should throw an error about not having been passed data - 2', function (done) {
                converter.csv2json(undefined, function (err, json) {
                    err.message.should.equal('Cannot call csv2json on undefined.');
                    done();
                }, options);
            });

            it('should throw an error about not being provided a callback - 1', function (done) {
                try {
                    converter.csv2json(undefined, undefined, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 2', function (done) {
                try {
                    converter.csv2json(null, undefined, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 3', function (done) {
                try {
                    converter.csv2json(null, null, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 4', function (done) {
                try {
                    converter.csv2json(undefined, null, options);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });
        });

        describe('Options Un-specified', function (done) {
            it('should convert a basic CSV to JSON', function(done) {
                converter.csv2json(csv_regularJson.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_regularJson);
                    false.should.equal(isEqual);
                    done();
                });
            });

            it('should parse a CSV representing nested objects to JSON - 1', function(done) {
                converter.csv2json(csv_nestedJson.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_nestedJson);
                    false.should.equal(isEqual);
                    done();
                });
            });

            it('should parse a CSV representing nested objects to JSON - 2', function(done) {
                converter.csv2json(csv_nestedJson2.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_nestedJson2);
                    false.should.equal(isEqual);
                    done();
                });
            });

            it('should parse nested quotes in a CSV to have nested quotes in JSON', function(done) {
                converter.csv2json(csv_nestedQuotes.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_nestedQuotes); // This should be equal because there are no delimiters in the file
                    true.should.equal(isEqual);
                    done();
                });
            });

            it('should parse an empty CSV to an empty JSON array', function(done) {
                converter.csv2json(csv_noData.replace(/,/g, ';'), function(err, json) {
                    var isEqual = _.isEqual(json, json_noData);
                    true.should.equal(isEqual);
                    done();
                });
            });

            it('should parse a single JSON document to CSV', function (done) {
                converter.json2csv(json_singleDoc, function (err, csv) {
                    csv.should.equal(csv_singleDoc);
                    csv.split(options.EOL).length.should.equal(3);
                    done();
                });
            });

            it('should throw an error about not having been passed data - 1', function (done) {
                converter.csv2json(null, function (err, json) {
                    err.message.should.equal('Cannot call csv2json on null.');
                    done();
                });
            });

            it('should throw an error about not having been passed data - 2', function (done) {
                converter.csv2json(undefined, function (err, json) {
                    err.message.should.equal('Cannot call csv2json on undefined.');
                    done();
                });
            });

            it('should throw an error about not being provided a callback - 1', function (done) {
                try {
                    converter.csv2json(undefined, undefined);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 2', function (done) {
                try {
                    converter.csv2json(undefined, undefined);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 3', function (done) {
                try {
                    converter.csv2json(null, null);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 4', function (done) {
                try {
                    converter.csv2json(undefined, null);
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });

            it('should throw an error about not being provided a callback - 5', function (done) {
                try {
                    converter.csv2json();
                } catch (err) {
                    err.message.should.equal('A callback is required!');
                    done();
                }
            });
        });
    });
};

module.exports = {
    runTests: function (callback) {
        describe('";" Delimited', function() {
            before(function(done) {
                async.parallel([
                    function(callback) {
                        fs.readFile('test/CSV/regularJson.csv', function(err, data) {
                            if (err) callback(err);
                            csv_regularJson = data.toString();
                            callback(null);
                        });
                    },
                    function(callback) {
                        fs.readFile('test/CSV/nestedJson.csv', function(err, data) {
                            if (err) callback(err);
                            csv_nestedJson = data.toString();
                            callback(null);
                        });
                    },
                    function(callback) {
                        fs.readFile('test/CSV/nestedJson2.csv', function(err, data) {
                            if (err) callback(err);
                            csv_nestedJson2 = data.toString();
                            callback(null);
                        });
                    },
                    function(callback) {
                        fs.readFile('test/CSV/nestedQuotes.csv', function(err, data) {
                            if (err) callback(err);
                            csv_nestedQuotes = data.toString();
                            callback(null);
                        });
                    },
                    function(callback) {
                        fs.readFile('test/CSV/noData.csv', function (err, data) {
                            if (err) callback(err);
                            csv_noData = data.toString();
                            callback(null);
                        });
                    },
                    function(callback) {
                        fs.readFile('test/CSV/singleDoc.csv', function (err, data) {
                            if (err) callback(err);
                            csv_singleDoc = data.toString();
                            callback(null);
                        });
                    }
                ],
                function(err, results) {
                    if (err) console.log(err);
                    done();
                });
            });

            // JSON to CSV
            json2csvTests();

            // CSV to JSON
            csv2jsonTests();
        });
    }
};
