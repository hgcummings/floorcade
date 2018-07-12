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

const spawnOpts = { stdio: ['inherit', 'inherit', 'inherit'], cwd: __dirname };

let currentState = STATE.OFF;

const spawnMain = (code) => {
    if (power.readSync()) {
        if (code) {
            console.error('Child process exited with error code', code);
            currentState = STATE.ERROR;
        } else {
            console.log('Child process exited cleanly. Launching new process.')
            child = spawn('node', ['index.js'], spawnOpts);
            child.on('exit', spawnMain);
        }
    } else {
        powerOff();
    }
}

const powerOff = () => {
    if (currentState !== STATE.OFF) {
        console.log('Powering off');
        currentState = STATE.OFF;
    }
}

setInterval(() => {
    if (currentState === STATE.ERROR) {
        light.writeSync(light.readSync() ^ 1);
    }
}, 500);

power.watch((err, value) => {
    console.log('Detected power', value);
    light.writeSync(value);

    switch (currentState) {
        case STATE.OFF:
            if (value) {
                currentState = STATE.BOOT;
                child = spawn('node', ['boot.js'], spawnOpts);
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
                powerOff();
            }
        case STATE.RUNNING:
            if (!value) {
                child.kill();
                powerOff();
            }
    }
});

reset.watch(() => {
    console.log('Detected reset');
    if (currentState === STATE.RUNNING) {
        console.log('Resetting');
        child.kill();
    }
});
