#!/usr/bin/env node
'use strict';

const libui = require('libui-node');
const hotkeys = require('./lib/libs/x11-hotkeys/');

const pify = require('pify');
const exec = pify(require('child_process').exec);

Promise
  .all([
    getTabs(),
    getMouseLocation()
  ])
  .then(([ tabs, { mouseX, mouseY }]) => {
    renderWindow({ tabs, mouseX, mouseY });
  })
  .catch(err => console.log(err.stack || err));

function getMouseLocation() {
  return Promise.resolve({ mouseX: 50, mouseY: 50 });
  // return exec('xdotool getmouselocation --shell')
  //   .then(data => {
  //     const [xx, yy, ...others] = data.split('\n');
  //     const mouseX = +xx.split('=')[1];
  //     const mouseY = +yy.split('=')[1];
  //
  //     return { mouseX, mouseY };
  //   });
}

function getTabs() {
  return exec('xavier chrome/tabs')
    .then(data => {
      return JSON.parse(data).message.result.map(tab => ({
        url: tab.url,
        title: tab.title
      }));
    });
}

function renderWindow({ tabs, mouseX, mouseY }) {
  let mainwin;
  let textString;

  function main() {
    libui.Ui.init();

    let hbox;
    let vbox;

    mainwin = new libui.UiWindow("libui textDrawArea Example", 100, tabs.length * 25, 1);
    mainwin.margined = true;
    process.nextTick(() => {
      const point = new libui.Point(mouseX, mouseY);
      mainwin.position = point; // race condition
    })

    mainwin.onClosing(function () {
      libui.stopLoop();
    });

    hbox = new libui.UiHorizontalBox();
    hbox.padded = true;
    mainwin.setChild(hbox);

    vbox = new libui.UiVerticalBox();
    vbox.padded = true;
    hbox.append(vbox, true);

    const keyboard = {
      q: 24,
      w: 25,
      e: 26,
      a: 38,
      s: 39,
      d: 40,
      z: 52,
      x: 53,
      c: 54
    };

    const keyboardKeys = Object.keys(keyboard);
    const bindings = {};

    tabs
      .forEach((tab, index) => {
        const label = new libui.UiButton();
        const keyboardKey = keyboardKeys[index];

        const onClick = () => {
          exec(`xavier chrome/activate-tab "${tab.url}"`);
          process.exit(0);
        };

        label.text = `${keyboardKey}. ${tab.title}`;
        label.onClicked(onClick);

        bindings[keyboard[keyboardKey]] = onClick;
        vbox.append(label, false);
      });

    hotkeys(bindings);

    mainwin.show();
    libui.startLoop();
  }

  process.title = 'xavier-menu';
  main();
}
