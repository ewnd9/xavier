#!/usr/bin/env node

'use strict';

const net = require('net');
const objectPath = require('object-path'); // replace with .jq receipt?
const notifier = require('node-notifier');

const { SOCKET_PATH, runGcmInquirer } = require('./shared');
const argv = require('minimist')(process.argv.slice(2));

if (argv['setup-gcm']) {
  runGcmInquirer();
  return;
}

const client = net.createConnection(SOCKET_PATH);

const cliLog = console.log.bind(console);
const notify = message => notifier.notify({ title: 'xavier', message });

const log = argv.notify ? notify : cliLog;
const args = { id: argv._[0], args: argv._.slice(1), argv };

client.on('error', err => {
  log(`failed to connect to server: ${err}`);
});

client.on('connect', () => {
  client.write(JSON.stringify(args));
});

client.on('data', input => {
  let result;

  try {
    result = JSON.parse(input.toString());
  } catch (e) {
    log(`Can't parse:\n${input.toString()}`);
    return;
  }

  if (argv.path) {
    try {
      log(objectPath.get(result, argv.path));
    } catch (err) {
      log(err);
    }

    return;
  }

  if (argv.verbose) {
    log(JSON.stringify({ args, result }));
  } else if (typeof result.message === 'string') {
    log(`${args.id}: ${result.message}`);
  } else {
    log(JSON.stringify(result));
  }

  client.end();
});
