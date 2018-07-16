/**
 * Responsible for handling the game protocol (input and output) as described in the README.
 * Nothing below is game-specific; all games will need to implement the functionality below.
 */
const readline = require('readline');
const viewFactory = require('./view');
const { filter, map } = require('rxjs/operators');
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser();
parser.addArgument(['--width'], { type: 'int' });
parser.addArgument(['--height'], { type: 'int' });
const config = parser.parseArgs();

const input = readline.createInterface(process.stdin);

const view = viewFactory.init(config);

input.on('line', event => {
    if (event.trim() === 'STICK') {
        process.stdout.write(view.render());
    } else if (event.trim() === 'SKILL') {
        process.exit();
    } else if (event === 'P2FR1') {
        view.playerButtonPressed();        
    }
});    

process.stdout.write('READY\n');
