var SocketIO = require('socket.io');
var ip = require('ip');

module.exports = {
  startServer: function(configManager) {
    var config = configManager.data;
    var socketPort = config['socket-port'];

    var io = SocketIO(socketPort);
    console.log('socket service for plugins: ' + ip.address() + ':' + socketPort);

    io.on('connection', function (socket) {
      socket.on('init', function (data) {
        console.log('plugin connected: ' + data.adapter);

        configManager.pluginCommands = configManager.pluginCommands || {};
        configManager.pluginCommands[data.adapter] = {
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
