const config = require('./config.json');
const dancefloor = require('./dancefloor');
const bootScreen = require('./screens/boot');

config.dancefloor.host = process.argv[2] || config.dancefloor.host;
config.dancefloor.port = process.argv[3] || config.dancefloor.port;

let currentScreen = bootScreen.init();

async function run() {
  await dancefloor.init(config.dancefloor, currentScreen);
  while (currentScreen) {
    dancefloor.setScreen(currentScreen);
    currentScreen = await currentScreen.next();
  }
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });