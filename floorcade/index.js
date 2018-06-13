const config = require('./config.json');
const dancefloor = require('./dancefloor');
const input = require('./input')
const game = require('./game').init(config.dancefloor, input);

async function run() {
  await dancefloor.activate(config.dancefloor, game);
  game.start();
}

run();