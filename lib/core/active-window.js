'use strict';

// insipration https://github.com/sindresorhus/active-win
const { execSync } = require('child_process');

const parse = stdout => stdout.trim().split('\n').reduce((total, line) => {
  if (line.indexOf(':') > -1) {
    const [key, value] = line.split(':');
    total[key.trim()] = value.trim();
  } else if (line.indexOf(' = ') > -1) {
    const [key, value] = line.split(' = ');
    total[key] = value;
  }

  return total;
}, {});

const getActiveWindow = () => {
  const xwininfoStdout = execSync('xwininfo -id $(xdotool getactivewindow)').toString();
  const wininfo = parse(xwininfoStdout);

  const match = /Window id: (0x[\d\w]+)/g.exec(xwininfoStdout);
  const id = match[1];

  const xpropStdout = execSync(`xprop -id ${id}`).toString();
  const xprop = parse(xpropStdout);

  return { id, wininfo, xprop };
};

const getActiveClasses = () => {
  try {
    const { xprop, wininfo } = getActiveWindow();
    return xprop['WM_CLASS(STRING)'].split(', ').map(x => JSON.parse(x));
  } catch (e) {
    console.error(e.stack || e);
    return [];
  }
};

module.exports = {
  getActiveWindow,
  getActiveClasses
};
