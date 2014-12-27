#!/usr/bin/env node
var ndjson = require('ndjson')
var pinger = require('../')()

pinger.pipe(ndjson.serialize()).pipe(process.stdout)