var config = require('rc')('upmon', {
  ping: {
    interval: 300000,
    services: []
  },
  mail: {
    from: "upmon@example.org",
    to: ["sysadmin@example.org"],
    transport: {}
  }
})
var ping = require('./ping')(config.ping)
var mail = require('./mail')(config.mail)

ping.pipe(mail)

console.log('Up pinging', config.ping.services.length, 'services, every', config.ping.interval + 'ms')