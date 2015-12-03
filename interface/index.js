var ipc = require('ipc');
var $ = require('jquery');
var angular = require('angular');

var Combokeys = require('combokeys');
var combokeys = new Combokeys(document);
require('combokeys/plugins/record')(combokeys);

var app = angular.module('XavierApp', [
  require('angular-ui-router')
]);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/hotkeys");

  $stateProvider.state('hotkeys', {
    url: "/hotkeys",
    templateUrl: "templates/hotkeys.html",
    controller: 'HotkeysCtrl'
  });
});

app.controller('HotkeysCtrl', function($scope) {

  $scope.data = {};

  var update = function() {
    ipc.send('routes-request');
    ipc.on('routes-reply', function(routes) {
      $scope.$apply(function() {
        $scope.routes = routes;
      });
    });
  };

  update();

  $scope.isEditing = false;
  $scope.setEditing = function($event, route) {
    route.isEditing = true;

    combokeys.record(function(sequence) {
      $scope.$apply(function() {
        route.hotkey = sequence[0];
        route.isEditing = null;

        ipc.send('save-hotkey-request', route);
      });
    });
  };

  $scope.deleteHotkey = function($event, route) {
    ipc.send('remove-hotkey-request', route);
    delete route.hotkey;
  };
});
