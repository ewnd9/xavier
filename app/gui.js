var defaultConfig = __dirname + '/../default-config.json';
var configManager = require('dot-file-config')('.xavier-npm', defaultConfig);

var config = configManager.data;

console.log('starting xavier');
console.log('config file: ' + configManager.path);

var Xavier = require('./lib.js').startApp(config);

var app = require('app');

var BrowserWindow = require('browser-window');
var Menu = require('menu');
var Tray = require('tray');

// Report crashes to our server.
// require('crash-reporter').start();

var mainWindow = null;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

var ipc = require('ipc');

ipc.on('routes-request', function(event, status) {
  console.log(config.commands);
  event.sender.send('routes-reply', Xavier.app.allRoutes());
});

// var globalShortcut = require('global-shortcut');

// Unregister a shortcut.
// globalShortcut.unregister('ctrl+x');
// Unregister all shortcuts.
// globalShortcut.unregisterAll();

var request = require('request');

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 400, height: 400});
  mainWindow.loadUrl('file://' + __dirname + '/../interface/index.html');
  mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  // // Register a 'ctrl+x' shortcut listener.
  // var ret = globalShortcut.register('ctrl+x', function() {
  //   console.log('ctrl+x is pressed');
  //
  //   request.get('http://localhost:3001/api/command/system/volume-up', function (error, response, body) {
  //     console.log(body);
  //   });
  // });

  // if (!ret) console.log('registerion fails');
  // console.log(globalShortcut.isRegistered('ctrl+x'));

  // appIcon = new Tray(null);
  //
  // var onMenuClick = function() {
  //   console.log('clicked');
  // };
  //
  // var contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio', click: onMenuClick },
  //   { label: 'Item2', type: 'radio' },
  //   { label: 'Item3', type: 'radio', checked: true },
  //   { label: 'Item4', type: 'radio' },
  // ]);
  // appIcon.setToolTip('Xavier');
  // appIcon.setContextMenu(contextMenu);
});
