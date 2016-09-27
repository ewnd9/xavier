'use strict';

const x11 = require('x11');

const MODIFIER_NO_KEY = 0;
// const MODIFIER_CTRL_KEY = 4;

const POINTER_MODE = false;
const KEYBOARD_MODE = true;

let X;
let root;

module.exports = function(keys) {
  return new Promise((resolve, reject) => {
    x11
      .createClient(function(err, display) {
        if (err) {
          reject(err);
          return;
        }

        X = display.client;
        root = display.screen[0].root;

        Object
          .keys(keys)
          .map(key => {
            X.GrabKey(root, 0, MODIFIER_NO_KEY, key, POINTER_MODE, KEYBOARD_MODE);
          });

        resolve();
      })
      .on('event', function(event) {
        const action = keys[event.keycode];

        if (event.name === 'KeyPress') {
          action();
        }
      });
  });
};

// export const unregisterEvents = events => {
//   if (X) {
//     _.map(events, (event, key) => {
//       X.UngrabKey(root, key, 0);
//     });
//   }
// };
