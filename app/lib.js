module.exports = {
  startApp: function(config) {
    var webServer = require('./web-server').startServer(config);
    var app = webServer.app;
    var Xavier = webServer.Xavier;

    var socketServer = require('./socket-server').startServer(config);
    var io = socketServer.io;

    return {
      expressServer: app,
      socketServer: io,
      app: Xavier
    };
  }
}
