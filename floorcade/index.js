const config = require('./config.json');
const dancefloor = require('./dancefloor');
const gameFactory = require('./screens/tetris/game');

config.dancefloor.host = process.argv[2] || config.dancefloor.host;
config.dancefloor.port = process.argv[3] || config.dancefloor.port;

async function run() {
  const game = gameFactory.init(config.dancefloor);
  await dancefloor.activate(config.dancefloor);
  dancefloor.setScreen(game);
  await game.activity;
  console.log('Game over');
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });