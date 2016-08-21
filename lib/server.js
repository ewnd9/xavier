#!/usr/bin/env node

'use strict';

process.title = 'xavier-npm';

const uuid = require('uuid');
const UnixServer = require('./core/unix-server');
const createWebSocketServer = require('./core/core');
const GcmServer = require('./core/gcm-server');
const rpc = require('./core/rpc');

const { gcmOptions, SOCKET_PATH } = require('./shared');

const ALL = { id: 'all' };
const standard = [ALL];
let commands = standard;

if (gcmOptions) {
  const gcm = new GcmServer(gcmOptions, rpc);
  standard.push.apply(standard, gcm.getCommands());
}

const unixServer = new UnixServer(SOCKET_PATH, onConnection);
unixServer.start();

const port = process.argv[2] || '3002';
createWebSocketServer(port, function(_commands) {
  commands = standard.concat(_commands);
});

function onConnection(reply, obj) {
  if (obj.id === ALL.id) {
    reply(JSON.stringify({ message: commands.map(_ => _.id).join('\n') }));
    return;
  }

  const command = commands.find(command => command.id === obj.id);

  if (!command) {
    reply('not found, "$ xavier all" for all available');
  } else {
    let executed = false;
    const id = uuid.v4();

    const timeout = setTimeout(() => {
      if (!executed) {
        executed = true;
        reply(JSON.stringify({ message: 'timeout' }));
      }
    }, 5000);

    command.execute(obj, id, (id, message) => {
      if (!executed) {
        executed = true;
        reply(JSON.stringify({ message }));

        clearTimeout(timeout);
      }
    });
  }
}
