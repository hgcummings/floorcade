const HID = require('node-hid');
const device = new HID.HID(1411,8288);

const stream = process.stdout;
const player = 0;

const on = (player, button) => stream.write(`P${player}${button}1\n`);
const off = (player, button) => stream.write(`P${player}${button}0\n`);

// Names as per https://wiki.unrealengine.com/List_of_Key/Gamepad_Input_Names#Gamepads
const axes = [['DL','DR'], ['DU','DD']];
const btns = ['FR','FB','FL','FT','LS','RS','SL','SR'];

let prevAxes = [128, 128];
let prevBtns = 0;

device.on('data', data => {
    let currAxes = [data[0], data[1]];
    for (let i = 0; i < axes.length; ++i) {
        if (currAxes[i] !== prevAxes[i]) {
            if (currAxes[i] < 64) {
                on(player, axes[i][0]);
            } else if (currAxes[i] > 192) {
                on(player, axes[i][1]);
            }
            if (prevAxes[i] < 64) {
                off(player, axes[i][0]);
            } else if (prevAxes[i] > 192) {
                off(player, axes[i][1]);
            }
        }
    }
    prevAxes = currAxes;
});

device.on('data', data => {
    let currBtns = data[2];
    if (currBtns !== prevBtns) {
        for (let i = 0, btn = 1; i < btns.length; btn <<= 1, ++i) {
            if ((btn & currBtns) && !(btn & prevBtns)) {
                on(player, btns[i]);
            } else if ((btn & prevBtns) && !(btn & currBtns)) {
                off(player, btns[i]);
            }
        }
    }
    prevBtns = currBtns;
});
