var http = require('http')
var test = require('tape')
var stubTransport = require('nodemailer-stub-transport')
var ping = require('./ping')
var mail = require('./mail')

test('Fail and recover', function (t) {
  t.plan(2)

  var reqCount = 0

  var server = http.createServer(function (req, res) {
    res.statusCode = reqCount == 1 ? 500 : 200
    reqCount++
    res.end()
  }).listen(1337)

  var transport = stubTransport()
  var pinger = ping({
    "interval": 1000,
    "services": ["http://localhost:1337"]
  })
  var mailer = mail({
    "from": "up@example.org",
    "to": ["alan@example.org"],
    "transport": transport
  })

  pinger.pipe(mailer)

  var mailCount = 0

  transport.on('end', function (info) {
    var msg = info.response.toString()

    if (!mailCount) {
      t.ok(msg.indexOf('Subject: FAIL http://localhost:1337') > -1, 'Fail mail sent')
    } else {
      t.ok(msg.indexOf('Subject: RECOVER http://localhost:1337') > -1, 'Recover mail sent')
      pinger.destroy()
      server.close(t.end)
    }

    mailCount++
  })
})