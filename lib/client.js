#!/usr/bin/env node

'use strict';

const minimist = require('minimist');
const net = require('net');
const objectPath = require('object-path');

const SOCKET = '/tmp/xavier.sock';
const argv = require('minimist')(process.argv.slice(2));

const client = net.createConnection(SOCKET);
const log = console.log.bind(console);

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
