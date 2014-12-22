# upmon [![Build Status](https://travis-ci.org/alanshaw/upmon.svg?branch=master)](https://travis-ci.org/alanshaw/upmon) [![Dependency Status](https://david-dm.org/alanshaw/upmon.svg?style=flat)](https://david-dm.org/alanshaw/upmon) [![Coverage Status](https://img.shields.io/coveralls/alanshaw/upmon/master.svg?style=flat)](https://coveralls.io/r/alanshaw/upmon)
Super simple service health monitoring.

Upmon sends a HTTP GET request to your configured URLs. It expects a HTTP 200 response. If it gets any other response code it'll send an email. If the service recovers, it'll send another email.

## Getting started

1. `npm install -g upmon`
2. Create a new `$HOME/.upmonrc` file and add config:

```js
{
  "ping": {
    // Time in ms between pings
    "interval": 5000,
    // URL's of services to ping
    "services": ["http://localhost:8000/"]
  },
  "mail": {
    // Email from address
    "from": "upmon@example.org",
    // Email to address(es)
    "to": ["sysadmin@exmaple.org"],
    // Nodemailer transport options
    // http://www.nodemailer.com/
    "transport": { 
      "service": "",
      "auth": {
        "user": "",
        "pass": ""
      } 
    }
  }
}
```

3. `node upmon`

