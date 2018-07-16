const HID = require('node-hid');

// Names as per https://wiki.unrealengine.com/List_of_Key/Gamepad_Input_Names#Gamepads
const axes = [['DL','DR'], ['DU','DD']];
const btns = ['FR','FB','FT','FL','LS','RS','SL','SR'];

const activePlayers = [];
const gamepads = HID.devices().filter(device => 
    device.vendorId === 1411 && device.productId === 8288);

if (!gamepads.length) {
    console.error('No gamepads detected. At least one gamepad must be attached.');
    process.exit(1);
}

module.exports = (playerCount, writeStream) => {
    while (activePlayers.length) {
        activePlayers.pop().device.removeAllListeners('data');
    }
    
    gamepads.forEach((gamepad, index) => {
        let player = {
            number: (index % playerCount) + 1,
            device: new HID.HID(gamepad.path)
        }

        const states = {};
        const on = (button) => {
            states[button] = 'PRESSED';
            setTimeout(() => {
                if (states[button] === 'PRESSED') {
                    states[button] = 'ON';
                    writeStream.write(`P${player.number}${button}1\n`);
                }
            }, 10);
        }
        const off = (button) => {
            if (states[button] === 'ON') {
                writeStream.write(`P${player.number}${button}0\n`);
            }
            states[button] = 'OFF';
        }

        activePlayers.push(player);
    
        let prevAxes = [128, 128];
        let prevBtns = 0;
        
        player.device.on('data', data => {
            let currAxes = [data[0], data[1]];
            for (let i = 0; i < axes.length; ++i) {
                if (currAxes[i] !== prevAxes[i]) {
                    if (currAxes[i] < 64) {
                        on(axes[i][0]);
                    } else if (currAxes[i] > 192) {
                        on(axes[i][1]);
                    }
                    if (prevAxes[i] < 64) {
                        off(axes[i][0]);
                    } else if (prevAxes[i] > 192) {
                        off(axes[i][1]);
                    }
                }
            }
            prevAxes = currAxes;
        });
        
        player.device.on('data', data => {
            let currBtns = data[2];
            if (currBtns !== prevBtns) {
                for (let i = 0, btn = 1; i < btns.length; btn <<= 1, ++i) {
                    if ((btn & currBtns) && !(btn & prevBtns)) {
                        on(btns[i]);
                    } else if ((btn & prevBtns) && !(btn & currBtns)) {
                        off(btns[i]);
                    }
                }
            }
            prevBtns = currBtns;
        });

        if (process.env['DEV']) {
            console.log('Using dev mode for gamepad input.');
            let prevShift = 0;
            player.device.on('data', data => {
                if (data[3] & 32 && !(prevShift & 32)) {
                    player.number = (player.number % playerCount) + 1;
                } else if (data[3] & 16 && !(prevShift & 16)) {
                    player.number = ((player.number - 2 + playerCount) % playerCount) + 1;
                }
                prevShift = data[3];
            });
        }
    });
}
