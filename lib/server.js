#!/usr/bin/env node

'use strict';

process.title = 'xavier-npm';

const uuid = require('uuid');
const UnixServer = require('./core/unix-server');
const createWebSocketServer = require('./core/websocket-server');
// const GcmServer = require('./core/gcm-server');
// const rpc = require('./core/rpc');

const { getActiveClasses } = require('./core/active-window');
const awesomeFallback = require('./core/awesome-wm-fallback');

const { /*gcmOptions, */ SOCKET_PATH } = require('./shared');

const ALL = { id: 'all' };
const standard = [ALL];
let commands = standard;

// if (gcmOptions) {
//   const gcm = new GcmServer(gcmOptions, rpc);
//   standard.push.apply(standard, gcm.getCommands());
// }

const unixServer = new UnixServer(SOCKET_PATH, onConnection);
unixServer.start();

const port = process.argv[2] || '3002';
createWebSocketServer(port, function(_commands) {
  commands = standard.concat(_commands);
});

function onConnection(_reply, obj) {
  const reply = m => _reply(JSON.stringify(m));

  if (obj.id === ALL.id) {
    reply({ message: commands.map(_ => _.id).join('\n') });
    return;
  }

  const command = commands.find(command => command.id === obj.id);

  if (!command) {
    reply({ message: 'not found, "$ xavier all" for all available' });
    return;
  }

  if (obj.argv.class) {
    const classes = getActiveClasses().map(s => s.toLowerCase());

    if (classes.indexOf(obj.argv.class) === -1) {
      const wrongClass = `requested active class: ${obj.argv.class}, actual active classes: ${classes.join(', ')}`;

      if (obj.argv.fallback) {
        const result = awesomeFallback(obj.argv.fallback);
        reply({ message: `error:\nfallback (${obj.argv.fallback}) executed: ${result}\n${wrongClass}` });
        return;
      } else {
        reply({ message: `error:\nno fallback\n${wrongClass}`});
        return;
      }
    }
  }

  let executed = false;
  const id = uuid.v4();

  const timeout = setTimeout(() => {
    if (!executed) {
      executed = true;
      reply({ message: 'timeout' });
    }
  }, 5000);

  command.execute(obj, id, (id, message) => {
    if (!executed) {
      executed = true;
      reply({ message });

      clearTimeout(timeout);
    }
  });
}
