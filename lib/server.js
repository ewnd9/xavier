#!/usr/bin/env node

'use strict';

process.title = 'xavier-npm';

const UnixServer = require('./core/unix-server');
const createWebSocketServer = require('./core/core');
const GcmServer = require('./core/gcm-server');

const { gcmOptions, SOCKET_PATH } = require('./shared');

const ALL = { id: 'all' };
const standard = [ALL];
let commands = standard;

if (gcmOptions) {
  const gcm = new GcmServer(gcmOptions);
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
    reply(commands.map(_ => _.id).join('\n'));
    return;
  }

  const command = commands.find(command => command.id === obj.id);

  if (!command) {
    reply('not found, "$ xavier all" for all available');
  } else {
    command.execute(obj, (id, message) => reply(JSON.stringify({ message })));
  }
}
