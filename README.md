#Hapi lbstatus
[![Build Status](https://travis-ci.org/opentable/hapi-lbstatus.png?branch=master)](https://travis-ci.org/opentable/hapi-lbstatus) [![NPM version](https://badge.fury.io/js/hapi-lbstatus.png)](http://badge.fury.io/js/hapi-lbstatus) ![Dependencies](https://david-dm.org/opentable/hapi-lbstatus.png)

Shared code for the `_lbstatus` endpoint. Essentially a poor-man's service discovery, will be used until the front-door service is ready.

Reads the specified file and looks for the value 'ON' or 'OFF' and returns ON or OFF from the endpoint.

If the file is missing, or empty, or an exception occurs, then default value is OFF.

Also performs a liveness check by injecting a request to a specified endpoint (using server.inject). If the response is an error (or times out) it returns "OFF".

Installation:

```npm install hapi-lbsstatus```

Usage:

```
var server = hapi.createServer();

server.pack.require("hapi-lbstatus",
  {
    file: '/etc/lbstatus/myappname',
    liveness: '/my/api/123',
    headers: {
    // optional headers to apply when making the liveness check
      'accept-language': 'en-US'
    },
    on: "MYAPP_ON", // override the default return value of 'ON'
    off: "MYAPP_OFF" // override the default return value of 'OFF'
  },
  function (err){
    if(err){
      throw err;
    }
  }
);
```

Response Codes:
- ON:  200
- OFF: 503

Notes:

- Supports pack servers as well as single instances
- Supports hapi v5+
