#!/usr/bin/env node

'use strict';

const net = require('net');
const objectPath = require('object-path'); // replace with .jq receipt?
const notifier = require('node-notifier');

const { SOCKET_PATH, runGcmInquirer } = require('./shared');
const argv = require('minimist')(process.argv.slice(2));

if (argv['gcm-setup']) {
  runGcmInquirer();
  return;
}

const client = net.createConnection(SOCKET_PATH);

const cliLog = console.log.bind(console);
const notify = message => notifier.notify({ title: 'xavier', message });

const log = argv.notify ? notify : cliLog;

client.on('error', err => {
  log(`failed to connect to server: ${err}`);
});

client.on('connect', () => {
  client.write(JSON.stringify({ id: argv._[0], args: argv._.slice(1) }));
});

client.on('data', data => {
  const str = data.toString();

  if (argv.path) {
    try {
      log(objectPath.get(JSON.parse(str), argv.path));
    } catch (err) {
      log(err);
    }
  } else {
    log(data.toString());
  }

  client.end();
});
