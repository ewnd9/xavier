'use strict';

const map = {};

exports.register = function(id, callback) {
  map[id] = callback;
};

exports.clear = function(id) {
  map[id] = undefined;
};

exports.execute = function(id, args) {
  const callback = map[id];

  if (callback) {
    callback.apply(null, args);
    map[id] = undefined;
  }
};
