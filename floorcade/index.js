const config = require('./config.json');
const dancefloor = require('./dancefloor');
const game = require('./screens/tetris/game').init(config.dancefloor);

config.dancefloor.host = process.argv[2] || config.dancefloor.host;
config.dancefloor.port = process.argv[3] || config.dancefloor.port;

async function run() {
  await dancefloor.activate(config.dancefloor);
  dancefloor.setScreen(game);
}

run()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });