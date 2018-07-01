const most = require('most');
const gamepad = require("gamepad");
gamepad.init();

most.periodic(8).observe(gamepad.processEvents);

module.exports = most.merge(
  most.fromEvent("down", gamepad).map((eventArgs) => ({
    id: eventArgs[0],
    type: "down",
    key: eventArgs[1]
  })),
  most.fromEvent("up", gamepad).map((eventArgs) => ({
    id: eventArgs[0],
    type: "up",
    key: eventArgs[1]
  }))
);