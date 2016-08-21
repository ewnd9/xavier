# Xavier

CLI remote control for pages in Google Chrome and music playback in Android

## Usage

### [Chrome extension](https://github.com/ewnd9/xavier-browsers)

```sh
$ xavier chrome/tabs
$ xavier chrome/active-tab
$ xavier chrome/activate-tab <url>
$ xavier chrome/move-right
$ xavier chrome/move-left

$ xavier play.google.com/play-or-pause
$ xavier play.google.com/prev
$ xavier play.google.com/next

$ xavier vk.com/play-or-pause
$ xavier vk.com/prev
$ xavier vk.com/next

$ xavier youtube.com/play-or-pause
```

### [Android app](https://github.com/ewnd9/xavier-android)

```sh
$ xavier --setup-gcm # then restart server
$ xavier android/next-track
$ xavier android/previous-track
$ xavier android/play-pause
$ xavier android/now-playing --notify
```

## Why not webdriver?

According to
https://sqa.stackexchange.com/questions/317/attach-to-browser-not-spawned-by-selenium2 it is not that easy.

## Install

```sh
$ npm install -g xavier
```

## Development

```sh
$ npm run build:watch
```

## icon source

http://www.iconarchive.com/show/button-ui-system-apps-icons-by-blackvariant/X11-icon.html

## License
