/**
 * Responsible for handling the game protocol (input and output) as described in the README.
 * Nothing below is game-specific; all games will need to implement the functionality below.
 */
const readline = require('readline');
const viewFactory = require('./view');
const most = require('most');
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser();
parser.addArgument(['--width']);
parser.addArgument(['--height']);
const config = parser.parseArgs();

const input = readline.createInterface(process.stdin);
const playerEvents = most.fromEvent('line', input)
    .filter(event => event[0] === 'P')
    .map(event => ({
            id: parseInt(event[1], 10),
            key: event.substr(2, 2),
            type: event[4] === '1' ? 'down' : 'up'
        }));

const view = viewFactory.init(config);

let frameIndex = 0;
const tickRate = 700;
const tick = () => {
    // update state
    frameIndex = (frameIndex + 1) % view.nFrames;
    setTimeout(tick, tickRate);
};

setTimeout(tick, tickRate);

input.on('line', event => {
    if (event.trim() === 'STICK') {
        process.stdout.write(view.render(frameIndex));
    } else if (event.trim() === 'SKILL') {
        process.exit();
    }
});

view.loading.then(() => { process.stdout.write('READY\n') });



