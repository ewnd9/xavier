'use strict';

const GCM = require('node-gcm-ccs');

const NEXT_TRACK = 'EXTRA_NEXT_TRACK';
const PREVIOUS_TRACK = 'EXTRA_PREVIOUS_TRACK';
const NOW_PLAYING = 'EXTRA_NOW_PLAYING';
const EXTRA_PLAY_PAUSE = 'EXTRA_PLAY_PAUSE';

module.exports = function({ appId, appSecret, deviceId }, rpc) {
  const gcm = GCM(appId, appSecret);
  const cmd = (id, execute) => ({ id, execute });

  gcm.on('message', function(messageId, from, category, data) {
    const { id, message } = data;
    rpc.execute(id, ['x', message]);
  });

  const sendCommand = ({ command, waitForMessage }, obj, id, fn) => {
    gcm.send(deviceId, { id, command }, { delivery_receipt_requested: true }, function(err) {
      if (err) {
        fn(obj.id, err);
      } else if (waitForMessage) {
        rpc.register(id, fn);
      } else {
        fn(obj.id, 'ok');
      }
    });
  };

  return {
    getCommands() {
      return [
        cmd('android/next-track', sendCommand.bind(null, { command: NEXT_TRACK, waitForMessage: false })),
        cmd('android/prev-track', sendCommand.bind(null, { command: PREVIOUS_TRACK, waitForMessage: false })),
        cmd('android/play-pause', sendCommand.bind(null, { command: EXTRA_PLAY_PAUSE, waitForMessage: false })),
        cmd('android/now-playing', sendCommand.bind(null, { command: NOW_PLAYING, waitForMessage: true }))
      ];
    }
  };
};
