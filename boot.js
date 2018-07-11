const fs = require('fs');
const path = require('path');
const execFile = require('util').promisify(require('child_process').execFile);
const git = require('simple-git/promise');

const config = require('./config.json');
const dancefloor = require('./dancefloor');
const bootScreen = require('./screens/boot');
const { list } = require('./games');

config.dancefloor.host = process.argv[2] || config.dancefloor.host;
config.dancefloor.port = process.argv[3] || config.dancefloor.port;

async function run() {
    await dancefloor.init(config.dancefloor, bootScreen.init());
    const pullSummary = await git().pull('origin', 'master', { '--recurse-submodules': null });

    const changedPaths = pullSummary.files.map(path.normalize);
    const games = list();

    for (game of games) {
        if (changedPaths.some(p => p.startsWith(path.normalize(game.workingDir)))) {
            const installScript = path.join(game.workingDir, 'install.sh');
            if (fs.existsSync(installScript)) {
                try {
                    console.log(`Executing install script in ${game.workingDir}`);
                    const result = await execFile('install.sh', { cwd: game.workingDir });
                    if (result.stdout) {
                        console.log(result.stdout);
                    }
                    if (result.stderr) {
                        console.error(result.stderr);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
