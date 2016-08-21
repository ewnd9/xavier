'use strict';

const creds = require('inquirer-credentials')('.xavier-npm');

const GCM_APP_ID = 'GCM_APP_ID';
const GCM_APP_SECRET = 'GCM_APP_SECRET';
const GCM_DEVICE_ID = 'GCM_DEVICE_ID';

exports.SOCKET_PATH = '/tmp/xavier.sock';

exports.gcmOptions = (
  creds.config.data[GCM_APP_ID] ? {
    appId: creds.config.data[GCM_APP_ID],
    appSecret: creds.config.data[GCM_APP_SECRET],
    deviceId: creds.config.data[GCM_DEVICE_ID],
  } : null
);

exports.runGcmInquirer = function() {
  return creds
    .run([
      { name: GCM_APP_ID },
      { name: GCM_APP_SECRET },
      { name: GCM_DEVICE_ID }
    ])
    .catch(err => console.log(err.stack || err));
};
