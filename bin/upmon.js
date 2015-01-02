#!/usr/bin/env node
var pinger = require('../')()
pinger.pipe(process.stdout)