var http = require('http')
var https = require('https')
var Readable = require('stream').Readable
var inherits = require('util').inherits

function PingStream (opts) {
  Readable.call(this, {objectMode: true})
  this.opts = opts || {}
  this._results = []
  this._pushOnNext = false
  this._intervalId = setInterval(this._pingServices.bind(this), opts.interval)
  process.nextTick(this._pingServices.bind(this))
}
inherits(PingStream, Readable)

PingStream.prototype._pingServices = function () {
  var self = this
  var remaining = this.opts.services.length

  function pingDone () {
    remaining--
    if (remaining == 0 && self._pushOnNext) {
      self._pushResults()
      self._pushOnNext = false
    }
  }

  this.opts.services.forEach(function (url) {
    console.log('Ping', url)

    var protocol = url.slice(0, 5) == 'https' ? https : http

    protocol.get(url, function (res) {
      console.log('Pong', url, res.statusCode)
      self.push({url: url, status: res.statusCode, timestamp: new Date()})
      res.resume()
      pingDone()
    }).on('error', function (e) {
      console.log('Pong', url, 500)
      self.push({url: url, status: 500, timestamp: new Date()})
      pingDone()
    })
  })
}

PingStream.prototype._pushResults = function () {
  var results = this._results
  while (results.length && this.push(results.shift())) {}
}

PingStream.prototype._read = function () {
  if (!this._results.length) {
    return this._pushOnNext = true
  }
  this._pushResults()
}

PingStream.prototype.destroy = function () {
  clearInterval(this._intervalId)
  this._results = null
  this.push(null)
}

module.exports = function (opts) {
  return new PingStream(opts)
}

module.exports.PingStream = PingStream