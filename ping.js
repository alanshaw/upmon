var http = require('http')
var https = require('https')
var Readable = require('stream').Readable
var inherits = require('util').inherits
var xtend = require('xtend')
var EOL = require('os').EOL

function PingStream (opts) {
  Readable.call(this)
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
      self._pushResult()
    }
  }

  this.opts.services.forEach(function (url) {
    var protocol = url.slice(0, 5) == 'https' ? https : http
    var pingStart = Date.now()
    var pingData = {url: url, timestamp: pingStart}

    protocol.get(url, function (res) {
      pingData = xtend(pingData, {status: res.statusCode, rtt: Date.now() - pingStart})
      self._results.push(pingData)
      res.resume()
      pingDone()
    }).on('error', function (e) {
      pingData = xtend(pingData, {status: 500, rtt: Date.now() - pingStart})
      self._results.push(pingData)
      pingDone()
    })
  })
}

PingStream.prototype._pushResult = function () {
  var results = this._results
  return this.push(this._ndjson(results.shift()))
}

PingStream.prototype._ndjson = function (obj) {
  return JSON.stringify(obj) + EOL
}

PingStream.prototype._read = function () {
  if (!this._results.length) return this._pushOnNext = true
  this._pushOnNext = this._pushResult()
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