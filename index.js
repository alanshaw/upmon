var xtend = require('xtend')
var config = require('rc')('upmon', {
  ping: {
    interval: 300000,
    services: []
  }
})
var ping = require('./ping')

module.exports = function (opts) {
  return ping(xtend(config.ping, opts))
}
