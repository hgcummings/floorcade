# Floorcade

Arcade games for the dance floor

## Pre-requisites

* [Node.js 10 or higher](https://nodejs.org/)
* [yarn](https://yarnpkg.com/)
* [Platform build tools for node-gyp](https://github.com/nodejs/node-gyp#installation)

## Install and run

Make sure you have at least one XBox One controller attached!

* `git clone --recurse-submodules git@github.com:hgcummings/floorcade.git`
* `cd floorcade`
* `yarn install --ignore-engines` (TODO: update `node-png` dependency so this isn't a problem)
* `cd floorcade`
* `yarn start`

You'll need to be on the same network as the dancefloor server.

To test locally, install and run the dev server from https://github.com/PhilMarsden/DanceFloorV2, then execute `yarn run dev`
