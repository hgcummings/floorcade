/**
 * Responsible for handling the game protocol (input and output) as described in the README.
 * Nothing below is game-specific; all games will need to implement the functionality below.
 */
const readline = require('readline');
const modelFactory = require('./model');
const viewFactory = require('./view');
const rxjs = require('rxjs');
const { filter, map } = require('rxjs/operators');
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser();
parser.addArgument(['--width'], { type: 'int' });
parser.addArgument(['--height'], { type: 'int' });
const config = parser.parseArgs();

const input = readline.createInterface(process.stdin);

const playerEvents = rxjs.fromEvent(input, 'line')
    .pipe(filter(event => event[0] === 'P'))
    .pipe(map(event => ({
            id: parseInt(event[1], 10),
            key: event.substr(2, 2),
            type: event[4] === '1' ? 'down' : 'up'
        })));

const model = modelFactory.init(config, playerEvents);
const view = viewFactory.init(config);

input.on('line', event => {
    if (event.trim() === 'STICK') {
        process.stdout.write(view.render(model.state));
    } else if (event.trim() === 'SKILL') {
        process.exit();
    }
});

process.stdout.write('READY\n');

model.activity
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
