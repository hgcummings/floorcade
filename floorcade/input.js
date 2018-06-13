const Gamepad = require("gamepad");
const EventEmitter = require('events');

const emitter = new EventEmitter();

const buttons = ['up', 'down', 'left', 'right'];

console.log("Gamepad", Gamepad);

// Create raw dispatcher to see all events.
// Gamepad.context.on = console.log;

Gamepad.on("down", function (deviceId, buttonId) {
  if (buttons[buttonId]) {
    emitter.emit(buttons[buttonId]);
  }
});

module.exports = emitter;

console.log("init");
Gamepad.init()

var num = Gamepad.numDevices();
console.log("numDevices", num);

setInterval(Gamepad.processEvents, 16);
setInterval(Gamepad.detectDevices, 500);

// console.log("shutdown", Gamepad.shutdown());
