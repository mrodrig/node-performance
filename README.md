# Node HTTP Performance Analysis Tool

![David - Dependency Checker Icon](https://david-dm.org/mrodrig/node-performance.png "node-performance Dependency Status")

## Installation

```bash
git clone https://github.com/mrodrig/node-performance.git
```

## Usage

```bash
cd ./node-performance/
npm install
cd ./lib/
```

* Options
** Open ./options.json and make the necessary changes.
** Currently, this HTTP performance testing script allows for the following options to be set:
*** `URL` - The web site address that you wish to test. Be sure to include an appropriate protocol (ie. http://, https://, etc)
*** `HTTP_METHOD` - The HTTP Method that will be used to make this call (ie. GET, POST, DELETE, etc)
*** `REQ_BODY` - This is a `key: value` JSON document that will allow you to pass data in the body of the requests.
*** `REQ_HEADERS` - This is a `key: value` JSON document that will allow you to pass data in the headers of the requests.
*** `NUM_PASSES` - The number of times that you wish to run the multiple requests.  Each pass is run in series and will asynchronously make `NUM_REQUESTS` requests to the given web address.
*** `NUM_REQUESTS` - The number of HTTP requests to make asynchronously in each pass.

* Once the options have been configured, run:
```bash
node perfTest.js
```

## Features
* Provides a baseline for a single request
* Allows you to see how your app/web service/endpoint scales with multiple requests asynchronously
* Provides summary information
* Passes applicable information back to init method's callback

## TODO
* Convert to node module to allow for easier testing
* Pass more applicable data back to the user