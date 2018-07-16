/**
 * Responsible for handling the game protocol (input and output) as described in the README.
 * Nothing below is game-specific; all games will need to implement the functionality below.
 */
import * as readline from 'readline';
import { init as modelFactory } from './model';
import { init as viewFactory } from './view';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ArgumentParser } from 'argparse';

const parser = new ArgumentParser();
parser.addArgument(['--width'], { type: 'int' });
parser.addArgument(['--height'], { type: 'int' });
const { width, height } = parser.parseArgs();

const input = readline.createInterface(process.stdin);

const playerEvents = fromEvent<any>(input, 'line')
    .pipe(filter(event => event[0] === 'P'))
    .pipe(map(event => ({ playerId: parseInt(event[1], 10) })));

const model = modelFactory(width, height, playerEvents);
const view = viewFactory(width, height);

input.on('line', event => {
    if (event.trim() === 'STICK') {
        process.stdout.write(view.render(model.state) as Buffer);
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
