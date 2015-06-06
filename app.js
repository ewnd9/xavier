#!/usr/bin/env node

var config = require('./config.json');
var exec = require('child_process').exec;
var Promise = require('bluebird');

var run = function(cmd) {
  return new Promise(function(resolve, reject) {
    exec(cmd, function(error, stdout, stderr) {
      if (error === null) {
        resolve({ stdout: stdout, stderr: stderr });
      } else {
        reject(error);
      }
    });
  });
};

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render(__dirname + '/views/index.jade', { commands: config.commands, pluginCommands: config.pluginCommands });
});

app.get('/api/command/system/:command', function(req, res) {
  var command = config.commands.system[req.params.command];
  run(command).then(function(data) {
    res.send(data);
  });
});

app.get('/api/command/:adapter/:domain/:action', function(req, res) {
  var adapter = config.pluginCommands[req.params.adapter];
  var command = adapter.commands[req.params.domain][req.params.action];

  adapter.socket.emit('action', command.data);
  res.send('wut');
});

var server = app.listen(config['port'], function () {
  var port = server.address().port;
  console.log('web interface: localhost:' + port);
  console.log('config file: ' + __dirname + '/config.json');
});

var socketPort = config['socket-port'];
var io = require('socket.io')(socketPort);
console.log('socket service: localhost:' + socketPort);

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
