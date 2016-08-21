'use strict';

const GCM = require('node-gcm-ccs');

const NEXT_TRACK = 'EXTRA_NEXT_TRACK';
const PREVIOUS_TRACK = 'EXTRA_PREVIOUS_TRACK';
const NOW_PLAYING = 'EXTRA_NOW_PLAYING';
const EXTRA_PLAY_PAUSE = 'EXTRA_PLAY_PAUSE';

module.exports = function({ appId, appSecret, deviceId }) {
  const gcm = GCM(appId, appSecret);
  const cmd = (id, execute) => ({ id, execute });

  const setCallback = fn => {
    // or removeListener
    gcm.once('message', function(messageId, from, category, data) {
      fn('x', data.now_playing);
    });

    // gcm.on('receipt', function(messageId, from, category, data) {
    //   // console.log('received receipt', arguments);
    // });
  };

  const sendCommand = ({ command, waitForMessage }, obj, fn) => {
    gcm.send(deviceId, { message: 'hello world', command }, { delivery_receipt_requested: true }, function(err) {
      if (err) {
        fn(obj.id, err);
      } else if (waitForMessage) {
        setCallback(fn);
      } else {
        fn(obj.id, 'ok');
      }
    });
  };

  return {
    getCommands() {
      return [
        cmd('android/next-track', sendCommand.bind(null, { command: NEXT_TRACK, waitForMessage: false })),
        cmd('android/previous-track', sendCommand.bind(null, { command: PREVIOUS_TRACK, waitForMessage: false })),
        cmd('android/play-pause', sendCommand.bind(null, { command: EXTRA_PLAY_PAUSE, waitForMessage: false })),
        cmd('android/now-playing', sendCommand.bind(null, { command: NOW_PLAYING, waitForMessage: true }))
      ];
    }
  };
};
