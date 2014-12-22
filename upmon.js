var config = require('config')
var ping = require('./ping')(config.ping)
var mail = require('./mail')(config.mail)

ping.pipe(mail)

console.log('Up pinging', config.ping.services.length, 'services, every', config.ping.interval + 'ms')