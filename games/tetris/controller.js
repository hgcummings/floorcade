/**
 * Responsible for handling the game protocol (input and output) as described in the README.
 * Nothing below is game-specific; all games will need to implement the functionality below.
 */
const modelFactory = require('./model');
const viewFactory = require('./view');
const most = require('most');
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser();
parser.addArgument(['--width']);
parser.addArgument(['--height']);
const config = parser.parseArgs();

process.stdin.setEncoding('utf8');

const playerEvents = most.fromEvent('data', process.stdin)
    .filter(data => data[0] === 'P')
    .map(data => ({
            id: parseInt(data[1], 10),
            key: data.substr(2, 2),
            type: data[4] === '1' ? 'down' : 'up'
        }));    

const model = modelFactory.init(playerEvents);
const view = viewFactory.init(config, model.state);

process.stdin.on('data', data => {
    if (data.trim() === 'STICK') {
        process.stdout.write(view.render());
    } else if (data.trim() === 'SKILL') {
        process.exit();
    }
});    

console.log('READY');

model.activity
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
