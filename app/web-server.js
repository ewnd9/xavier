var exec = require('child_process').exec;
var Promise = require('bluebird');
var ip = require('ip');
var _ = require('lodash');

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

module.exports = {
  startServer: function(configManager) {
    var config = configManager.data;
    var Xavier = {};

    Xavier.systemCommands = function() {
      return config.commands.system;
    };

    Xavier.systemRoutes = function() {
      return _.map(Xavier.systemCommands(), function(command, key) {
        var path = "/api/command/system/" + key;
        console.log(config.hotkeys);

        return {
          name: key,
          path: "/api/command/system/" + key,
          hotkey: config.hotkeys[path]
        };
      });
    };

    Xavier.allPlugins = function() {
      return Object.keys(configManager.pluginCommands || {});
    };

    Xavier.pluginCommands = function(plugin) {
      return configManager.pluginCommands[plugin].commands;
    };

    Xavier.pluginRoutes = function(plugin) {
      return _.map(Xavier.pluginCommands(plugin), function(command) {
        var path = "/api/command/" + plugin + "/" + command.id;

        return {
          name: command.name,
          group: command.group,
          path: path,
          hotkey: config.hotkeys[path]
        };
      });
    };

    Xavier.allPluginsRoutes = function() {
      var result = {};

      _.each(Xavier.allPlugins(), function(plugin) {
        result[plugin] = Xavier.pluginRoutes(plugin);
      });

      return result;
    };

    Xavier.allRoutes = function() {
      var system = Xavier.systemRoutes();
      var plugins = _.flatten(_.map(Xavier.allPlugins(), function(plugin) {
        return Xavier.pluginRoutes(plugin);
      }));
      return system.concat(plugins);
    };

    var express = require('express');
    var app = express();
    var morgan = require('morgan');

    app.use(morgan('request: :remote-addr :method :url :status'));
    app.use(express.static(__dirname + '/public'));
    app.set('view engine', 'jade');

    app.get('/', function (req, res) {
      res.render(__dirname + '/views/index.jade', {
        systemRoutes: Xavier.systemRoutes(),
        pluginsRoutes: Xavier.allPluginsRoutes()
      });
    });

    app.get('/api/routes', function(req, res) {
      res.send(Xavier.allRoutes());
    });

    app.get('/api/command/system/:command', function(req, res) {
      var command = Xavier.systemCommands()[req.params.command];
      if (req.params.command.indexOf('xavier:') === 0) {
        if (req.params.command.indexOf('minimize-window') > -1) {
          configManager.guiLogic.minimizeWindow();
        } else if (req.params.command.indexOf('restore-window') > -1) {
          configManager.guiLogic.restoreWindow();
        }
        res.send('ok');
      } else {
        run(command).then(function(data) {
          res.send(data);
        });
      }
    });

    app.get('/api/command/:adapter/:id(*)', function(req, res) {
      var adapter = configManager.pluginCommands[req.params.adapter];
      var command = _.find(adapter.commands, function(command) { return command.id === req.params.id });
      var data = {
        id: command.id
      };

      adapter.socket.emit('action', data, function(response) {
        console.log('response: ' + response);
        res.send(response);
      });
    });

    var server = app.listen(config['port'], function () {
      var port = server.address().port;
      console.log('web interface: http://' + ip.address() + ':' + port);
    });

    return {
      app: app,
      server: server,
      Xavier: Xavier
    };
  }
};
