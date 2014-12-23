var Writable = require('stream').Writable
var inherits = require('util').inherits
var nodemailer = require('nodemailer')

function MailStream (opts) {
  Writable.call(this, {objectMode: true})
  this.opts = opts || {}
  this.objectMode = true
  this._transport = nodemailer.createTransport(opts.transport)
  this._lastPing = {}
}
inherits(MailStream, Writable)

MailStream.prototype.sendFailMail = function (lastPing, ping) {
  var opts = {
    from: this.opts.from,
    to: this.opts.to,
    subject: 'FAIL ' + ping.url,
    text: 'FAIL ' + ping.url + ' (' + ping.status + ') at ' + ping.timestamp +
          '\nLast success at: ' + lastPing.timestamp
  }

  console.log('Sending fail mail', ping.url, ping.status, ping.timestamp)

  this._transport.sendMail(opts, function (er, info) {
    if (er) console.error('Failed to send fail mail', opts, er, info)
  })
}

MailStream.prototype.sendRecoverMail = function (lastPing, ping) {
  var opts = {
    from: this.opts.from,
    to: this.opts.to,
    subject: 'RECOVER ' + ping.url,
    text: 'RECOVER ' + ping.url + ' (' + ping.status + ') at ' + ping.timestamp +
          '\nLast fail at: ' + lastPing.timestamp
  }

  console.log('Sending recover mail', ping.url, ping.status, ping.timestamp)

  this._transport.sendMail(opts, function (er, info) {
    if (er) console.error('Failed to send recover mail', opts, er, info)
  })
}

MailStream.prototype._write = function (ping, enc, cb) {
  var lastPing = this._lastPing[ping.url]

  if (lastPing) {
    if (lastPing.status == 200 && ping.status != 200) {
      this.sendFailMail(lastPing, ping)
    } else if (lastPing.status != 200 && ping.status == 200) {
      this.sendRecoverMail(lastPing, ping)
    }
  }

  this._lastPing[ping.url] = ping
  cb()
}

module.exports = function (opts) {
  return new MailStream(opts)
}

module.exports.MailStream = MailStream