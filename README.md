# Xavier

Pluggable remote control for your system.

## Installation

```
$ npm install -g xavier
```

## Usage

```
$ xavier-cli

socket service: localhost:3002
web interface: localhost:3001
config file: /home/ewnd9/.npm-packages/lib/node_modules/xavier/config.json
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

## License

MIT © [ewnd9](http://ewnd9.com)
