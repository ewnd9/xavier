'use strict';

const { execSync } = require('child_process');

const commands = {
  'meta-j': `
    local awful = require('awful')
    awful.client.focus.byidx( 1)
    if client.focus then client.focus:raise() end
  `,
  'meta-k': `
    local awful = require('awful')
    awful.client.focus.byidx(-1)
    if client.focus then client.focus:raise() end
  `
};

module.exports = command => {
  if (commands[command]) {
    execSync(`echo "${commands[command]}" | awesome-client`);
    return true;
  } else {
    return false;
  }
};
