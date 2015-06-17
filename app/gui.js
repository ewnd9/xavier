var path = require('path');
var globalShortcut = require('global-shortcut');
var request = require('request');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var Tray = require('tray');
var app = require('app');
var _ = require('lodash');

var defaultConfig = __dirname + '/../default-config.json';
var configManager = require('dot-file-config')('.xavier-npm', defaultConfig);

var config = configManager.data;

var debug = process.argv.slice(2)[0] === '--debug';

process.title = 'Xavier';

configManager.guiLogic = {
  minimizeWindow: function() {
    mainWindow.setSkipTaskbar(true);
  },
  restoreWindow: function() {
    mainWindow.setSkipTaskbar(false);
  }
};

console.log('starting xavier');
console.log('config file: ' + configManager.path);

var Xavier = require('./lib.js').startApp(configManager);

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

ipc.on('save-hotkey-request', function(event, route) {
  config.hotkeys = config.hotkeys || {};
  config.hotkeys[route.path] = route.hotkey;
  configManager.save();
});

ipc.on('remove-hotkey-request', function(event, route) {
  config.hotkeys = config.hotkeys || {};
  delete config.hotkeys[route.path];
  configManager.save();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 400, height: 400});

  mainWindow.on('minimize', function() {
    mainWindow.setSkipTaskbar(true);
  });

  mainWindow.on('restore', function() {
    mainWindow.setSkipTaskbar(false);
  });

  if (debug) {
    mainWindow.openDevTools();
  } else {
    mainWindow.minimize();
  }

  mainWindow.loadUrl('file://' + __dirname + '/../interface/index.html');
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

  _.each(configManager.data.hotkeys, function(hotkey, route) {
    register(hotkey.replace('meta', 'super'), function() {
      request.get('http://localhost:3001' + route, function (error, response, body) {
        console.log(body);
      });
    });
  });

  var appIcon = new Tray(path.resolve(__dirname + '/../icon.png'));

  appIcon.on('clicked', function(event) {
    mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize();
  });

});
