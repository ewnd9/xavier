#!/usr/bin/env node

var defaultConfig = __dirname + '/../default-config.json';
var configManager = require('dot-file-config')('.xavier-npm', defaultConfig);

var config = configManager.data;

if (process.argv.slice(2).length === 0) {
  console.log('starting xavier');
  console.log('config file: ' + configManager.path);

  var app = require('../app/lib.js');
  app.startApp(configManager);
} else if (process.argv.slice(2)[0] === 'routes') {
  var request = require('request');

  request.get('http://localhost:' + config['port'] + '/api/routes', function(err, res, body) {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        console.log('Error: xavier is not started');
      } else {
        console.log('Error', err);
      }
    }

    console.log(JSON.stringify(JSON.parse(body), null, 4));
  });
}
