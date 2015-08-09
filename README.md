# Xavier

Global shortcut binder and remote control platform.

[Chrome-extension](https://github.com/ewnd9/xavier-browsers) for browser tabs control

## Installation

```
$ npm install -g xavier
```

## Usage

```
$ xavier-cli

socket service: localhost:3002
web interface: localhost:3001
config file: /home/ewnd9/.xavier-npm
```

## Web Interface

![Nexus 5 Example](/web-interface.png?raw=true)

## Protocol

Plugins should send available commands via websocket in format:

```
{
  id: 'string',
  name: 'string',
  group: 'string',
  type: 'string'
}
```

## Development

```
$ bin/xavier.js --debug
```

## Issues

- [ ] Icon vanishes from task bar

## Similar projects

- https://github.com/acrisci/playerctl/
- https://github.com/benkaiser/google-music-controller
- https://github.com/benkaiser/desktop-command-remote
- https://github.com/beardedspice/beardedspice

## License

MIT © [ewnd9](http://ewnd9.com)

icon from http://www.iconarchive.com/show/button-ui-system-apps-icons-by-blackvariant/X11-icon.html
