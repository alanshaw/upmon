var http = require('http')
var test = require('tape')
var ping = require('./ping')

test('Fail and recover', function (t) {
  t.plan(3)

  var reqCount = 0

  var server = http.createServer(function (req, res) {
    res.statusCode = reqCount == 1 ? 500 : 200
    reqCount++
    res.end()
  }).listen(1337)

  var pinger = ping({
    interval: 1000,
    services: ['http://localhost:1337']
  })

  pinger.on('data', function (ping) {
    if (reqCount == 1) {
      t.equal(ping.status, 200, 'Ping status 200')
    } else if (reqCount == 2) {
      t.equal(ping.status, 500, 'Ping status 500')
    } else if (reqCount == 3) {
      t.equal(ping.status, 200, 'Ping status 200')

      process.nextTick(function () {
        pinger.destroy()
        server.close(t.end)
      })
    }
  })
})

test('DNS error', function (t) {
  t.plan(1)

  var pinger = ping({
    interval: 1000,
    services: ['http://junk' + Date.now() + '.com']
  })

  pinger.on('data', function (ping) {
    t.equal(ping.status, 500, 'Ping status 500')

    process.nextTick(function () {
      pinger.destroy()
      t.end()
    })
  })
})

test('Invalid URL error', function (t) {
  t.plan(1)

  var pinger = ping({
    interval: 1000,
    services: ['notavalidurl']
  })

  pinger.on('data', function (ping) {
    t.equal(ping.status, 500, 'Ping status 500')

    process.nextTick(function () {
      pinger.destroy()
      t.end()
    })
  })
})