module.exports = {
  startApp: function(configManager) {
    var webServer = require('./web-server').startServer(configManager);
    var app = webServer.app;
    var Xavier = webServer.Xavier;

    var socketServer = require('./socket-server').startServer(configManager);
    var io = socketServer.io;

    return {
      expressServer: app,
      socketServer: io,
      app: Xavier
    };
  }
}
