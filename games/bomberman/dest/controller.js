"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Responsible for handling the game protocol (input and output) as described in the README.
 * Nothing below is game-specific; all games will need to implement the functionality below.
 */
const readline = require("readline");
const modelFactory = require("./model");
const viewFactory = require("./view");
const rxjs = require("rxjs");
const operators_1 = require("rxjs/operators");
const argparse_1 = require("argparse");
const parser = new argparse_1.ArgumentParser();
parser.addArgument(['--width'], { type: 'int' });
parser.addArgument(['--height'], { type: 'int' });
const config = parser.parseArgs();
const input = readline.createInterface(process.stdin);
const playerEvents = rxjs.fromEvent(input, 'line')
    .pipe(operators_1.filter(event => event[0] === 'P'))
    .pipe(operators_1.map(event => ({
    id: parseInt(event[1], 10),
    key: event.substr(2, 2),
    type: event[4] === '1' ? 'down' : 'up'
})));
const model = modelFactory.init(config, playerEvents);
const view = viewFactory.init(config);
input.on('line', event => {
    if (event.trim() === 'STICK') {
        process.stdout.write(view.render(model.state));
    }
    else if (event.trim() === 'SKILL') {
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
//# sourceMappingURL=controller.js.map