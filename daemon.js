const { spawn } = require('cross-spawn');
const Gpio = require('onoff').Gpio;
const reset = new Gpio(2, 'in', 'rising', { debounceTimeout: 10, activeLow: true });
const power = new Gpio(3, 'in', 'both', { debounceTimeout: 100, activeLow: true });
const light = new Gpio(4, 'out');

let child;

const STATE = {
    OFF: 0,
    BOOT: 1,
    RUNNING: 2
}

let currentState = STATE.OFF;

const spawnMain = (code) => {
    if (power.readSync()) {
        if (code === 0) {
            child = spawn('node', ['index.js']);
            child.on('exit', spawnMain);
        } else {
            console.error('Child process exited with error code', code);
            currentState = STATE.ERROR;
        }    
    } else {
        currentState = STATE.OFF;
    }
}

setInterval(() => {
    if (currentState === STATE.ERROR) {
        light.writeSync(light.readSync() ^ 1);
    }
}, 500);

power.watch(value => {
    light.writeSync(value);

    switch (currentState) {
        case STATE.OFF:
            if (value) {
                currentState = STATE.BOOT;
                child = spawn('node', ['boot.js']);
                child.on('exit', code => {
                    currentState = STATE.RUNNING;
                    spawnMain(code);
                });
            }
            break;
        case STATE.BOOT:
            break;
        case STATE.ERROR:
            if (!value) {
                currentState = STATE.OFF;
            }
        case STATE.RUNNING:
            if (!value) {
                child.kill();
                currentState = STATE.OFF;
            }
    }
});

reset.watch(_ => {
    if (currentState === STATE.RUNNING) {
        child.kill();
        spawnMain(0);
    }
});
