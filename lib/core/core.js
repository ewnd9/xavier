'use strict';

const SocketIO = require('socket.io');
const log = console.log.bind(console);

module.exports = function(port, cb) {
  const io = SocketIO(port);
  io.on('connection', handleConnection);

  function handleConnection(socket) {
    socket.on('init', handleInitResponse);
    socket.on('disconnect', () => console.log('plugin disconnected'));

    function handleInitResponse(data) {
      log(`${data.adapter} connected (${data.commands.length} commands)`);

      cb(data.commands.map(
        cmd => {
          cmd.execute = emitMessage;
          return cmd;
        }
      ));
    }

    function emitMessage(message, callback) {
      socket.emit('action', message, function(response) {
        handleActionResponse(message, response, callback);
      });
    }

    function handleActionResponse(message, response, callback) {
      let data = response;

      try {
        data = JSON.parse(data);
      } catch (e) {
        log(`${data} is not a json file`);
      }

      callback(message.id, data);
    }
  }
};
