var path = require('path');
var globalShortcut = require('global-shortcut');
var request = require('request');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var Tray = require('tray');
var app = require('app');

var defaultConfig = __dirname + '/../default-config.json';
var configManager = require('dot-file-config')('.xavier-npm', defaultConfig);

var config = configManager.data;

console.log('starting xavier');
console.log('config file: ' + configManager.path);

var Xavier = require('./lib.js').startApp(config);

// Report crashes to our server.
// require('crash-reporter').start();

var mainWindow = null;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipc.on('routes-request', function(event, status) {
  event.sender.send('routes-reply', Xavier.app.allRoutes());
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 400, height: 400});

  mainWindow.on('minimize', function() {
    mainWindow.setSkipTaskbar(true);
  });

  mainWindow.on('restore', function() {
    mainWindow.setSkipTaskbar(false);
  });

  mainWindow.minimize();

  mainWindow.loadUrl('file://' + __dirname + '/../interface/index.html');
  mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var register = function(shortcut, fn) {
    var ret = globalShortcut.register(shortcut, function() {
      console.log(shortcut + ' is pressed');
      fn();
    });

    if (!ret) {
      console.log(shortcut + ' registerion fails');
    }
    if (globalShortcut.isRegistered(shortcut)) {
      console.log(shortcut + ' registered');
    }
  };

  register('Super+z', function() {
    request.get('http://localhost:3001/api/command/chrome/vk.com/prev', function (error, response, body) {
      console.log(body);
    });
  });

  register('Super+c', function() {
    request.get('http://localhost:3001/api/command/chrome/vk.com/next', function (error, response, body) {
      console.log(body);
    });
  });

  var appIcon = new Tray(path.resolve(__dirname + '/../icon.png'));

  appIcon.on('clicked', function(event) {
    mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize();
  });

});
