var SocketIO = require('socket.io');
var ip = require('ip');

module.exports = {
  startServer: function(config) {
    var socketPort = config['socket-port'];

    var io = SocketIO(socketPort);
    console.log('socket service for plugins: ' + ip.address() + ':' + socketPort);

    io.on('connection', function (socket) {
      socket.on('init', function (data) {
        console.log('plugin connected: ' + data.adapter);

        config.pluginCommands[data.adapter] = {
          socket: socket,
          commands: data.commands
        };
      });

      socket.on('disconnect', function () {
        console.log('plugin disconnected');
      });
    });

    return {
      io: io
    };
  }
};
