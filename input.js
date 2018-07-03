const HID = require('node-hid');

// Names as per https://wiki.unrealengine.com/List_of_Key/Gamepad_Input_Names#Gamepads
const axes = [['DL','DR'], ['DU','DD']];
const btns = ['FR','FB','FL','FT','LS','RS','SL','SR'];

const activeDevices = [];
const gamepads = HID.devices().filter(device => 
    device.vendorId === 1411 && device.productId === 8288);

if (!gamepads.length) {
    console.error('No gamepads detected. At least one gamepad must be attached.');
    process.exit(1);
}

module.exports = (playerCount, writeStream) => {
    while (activeDevices.length) {
        activeDevices.pop().removeAllListeners('data');
    }
    
    const on = (player, button) => writeStream.write(`P${player}${button}1\n`);
    const off = (player, button) => writeStream.write(`P${player}${button}0\n`);
    
    gamepads.forEach((gamepad, index) => {
        let player = (index % playerCount) + 1;
        const device = new HID.HID(gamepad.path);
        activeDevices.push(device);
    
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

        if (process.env['DEV']) {
            console.log('Using dev mode for gamepad input.');
            let prevShift = 0;
            device.on('data', data => {
                if (data[3] & 32 && !(prevShift & 32)) {
                    player = (player % playerCount) + 1;
                } else if (data[3] & 16 && !(prevShift & 16)) {
                    player = ((player - 2 + playerCount) % playerCount) + 1;
                }
                prevShift = data[3];
            });
        }
    });
}
