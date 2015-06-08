var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
// require('crash-reporter').start();

var mainWindow = null;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

var xavier = require('./lib.js');
var ipc = require('ipc');

ipc.on('routes-request', function(event, status) {
  event.sender.send('routes-reply', xavier.app.systemRoutes());
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/../interface/index.html');
  mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
