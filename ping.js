var http = require('http')
var https = require('https')
var Readable = require('stream').Readable
var inherits = require('util').inherits
var xtend = require('xtend')
var EOL = require('os').EOL

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
    var protocol = url.slice(0, 5) == 'https' ? https : http
    var pingStart = Date.now()
    var pingData = {url: url, timestamp: pingStart}

    protocol.get(url, function (res) {
      self.push(xtend(pingData, {status: res.statusCode, rtt: Date.now() - pingStart}))
      res.resume()
      pingDone()
    }).on('error', function (e) {
      self.push(xtend(pingData, {status: 500, rtt: Date.now() - pingStart}))
      pingDone()
    })
  })
}

PingStream.prototype._pushResults = function () {
  var results = this._results
  while (results.length && this.push(this._ndjson(results.shift()))) {}
}

PingStream.prototype._ndjson = function (obj) {
  return JSON.stringify(obj) + EOL
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