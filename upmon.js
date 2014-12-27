var xtend = require('xtend')
var config = require('rc')('upmon', {
  ping: {
    interval: 300000,
    services: []
  }
})
var ping = require('./ping')
var mail = require('./mail')

module.exports = function (opts) {
  opts = xtend(config, opts)

  var pinger = ping(opts.ping)

  if (opts.mail) {
    var mailer = mail(opts.mail)
    pinger.pipe(mailer)
  }

  return pinger
}
