# upmon [![Build Status](https://travis-ci.org/alanshaw/upmon.svg?branch=master)](https://travis-ci.org/alanshaw/upmon) [![Dependency Status](https://david-dm.org/alanshaw/upmon.svg?style=flat)](https://david-dm.org/alanshaw/upmon) [![Coverage Status](https://img.shields.io/coveralls/alanshaw/upmon/master.svg?style=flat)](https://coveralls.io/r/alanshaw/upmon)

Super simple service health monitoring.

Upmon sends a HTTP GET request to your configured URLs. It expects a HTTP 200 response. If it gets any other response code it'll send an email. If the service recovers, it'll send another email.

## Getting started

1. `npm install -g upmon upmon-mail`
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
        "to": ["sysadmin@example.org"],
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

3. `upmon | upmon-mail`

## SMS

Need a txt message sent to your phone when a service goes down?

1. `npm install -g upmon-sms`
2. Add SMS config to your `$HOME/.upmonrc` file:

    ```js
    {
      "sms": {
        // SMS provider config
        // For supported providers see https://github.com/alanshaw/upmon-sms
        "messagebird": {
          "accessKey": "live_hy6ggbrRf4Bvfe48GGip8MtJM",
          "originator": "447000000000",
          "recipients": "447000000000"
        }
      }
    }
    ```

3. `upmon | upmon-mail | upmon-sms`

## Build your own monitor

Want to run upmon from [boss](https://www.npmjs.com/package/process-boss) or [pm2](https://www.npmjs.com/package/pm2)?

Create a new project, add a `.upmonrc` config file, install the upmon modules you need, and pipe them together!

**monitor.js**
```js
var upmon = require('upmon')
var mail = require('upmon-mail')
var sms = require('upmon-sms')

upmon().pipe(mail()).pipe(sms()).pipe(process.stdout)
```

```sh
pm2 start monitor.js
```


