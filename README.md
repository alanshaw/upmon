# up
Super simple service health monitoring.

Up sends a http GET request to your configured URLs. It expects a HTTP 200 response. If it gets any other response code it'll send an email. If the service recovers, it'll send another email.

## Getting started

1. Clone the repo
2. `cp config/defaut.json config/production.json`
3. Alter config to your liking
4. `node up`

### Config

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
    "from": "up@example.org",
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

