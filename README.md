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
  * Open ./options.json and make the necessary changes.
  * Currently, this HTTP performance testing script allows for the following options to be set:
    * `URL` - The web site address that you wish to test. Be sure to include an appropriate protocol (ie. http://, https://, etc)
    * `HTTP_METHOD` - The HTTP Method that will be used to make this call (ie. GET, POST, DELETE, etc)
    * `REQ_BODY` - This is a `key: value` JSON document that will allow you to pass data in the body of the requests.
    * `REQ_HEADERS` - This is a `key: value` JSON document that will allow you to pass data in the headers of the requests.
    * `NUM_PASSES` - The number of times that you wish to run the multiple requests.  Each pass is run in series and will asynchronously make `NUM_REQUESTS` requests to the given web address.
    * `NUM_REQUESTS` - The number of HTTP requests to make asynchronously in each pass.

* Once the options have been configured, run:
```bash
node perfTest.js
```

## Sample Output

```
Starting the performance test...

Performing singleRequest for baseline...
Finished singleRequest.
  Request took: 148 ms.


Starting pass #0
  Response Times (ms): 144, 155, 145, 144, 134, 223, 220, 248, 250, 249, 307, 319, 352, 352, 347
  Response Calculations:  { sum: 3589, average: 239.26666666666668 }


Starting pass #1
  Response Times (ms): 141, 150, 127, 128, 129, 217, 215, 228, 237, 247, 287, 302, 322, 334, 342
  Response Calculations:  { sum: 3406, average: 227.06666666666666 }


Starting pass #2
  Response Times (ms): 131, 127, 126, 161, 159, 217, 455, 228, 245, 255, 304, 319, 318, 332, 335
  Response Calculations:  { sum: 3712, average: 247.46666666666667 }


Starting pass #3
  Response Times (ms): 150, 147, 157, 143, 126, 224, 249, 243, 259, 242, 312, 343, 340, 351, 352
  Response Calculations:  { sum: 3638, average: 242.53333333333333 }


Starting pass #4
  Response Times (ms): 148, 158, 156, 158, 169, 222, 255, 252, 252, 254, 331, 350, 350, 351, 351
  Response Calculations:  { sum: 3757, average: 250.46666666666667 }


Average Response Time: 241.43333333333334 ms


All passes have been completed.
Finished the performance test.
```

## Features
* Provides a baseline for a single request
* Allows you to see how your app/web service/endpoint scales with multiple requests asynchronously
* Provides summary information
* Passes applicable information back to init method's callback

## TODO
* Convert to node module to allow for easier testing
* Pass more applicable data back to the user
