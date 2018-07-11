const fs = require('fs');
const path = require('path');
const git = require('simple-git/promise');
const { spawn } = require('child_process');

const config = require('./config.json');
const dancefloor = require('./dancefloor');
const bootScreen = require('./screens/boot');
const { list } = require('./games');

config.dancefloor.host = process.argv[2] || config.dancefloor.host;
config.dancefloor.port = process.argv[3] || config.dancefloor.port;

async function run() {
    await dancefloor.init(config.dancefloor, bootScreen.init());
    const pullSummary =
        await git()
            .env('GIT_SSH_COMMAND', 'ssh -i /home/pi/.ssh/id_rsa -o UserKnownHostsFile=/home/pi/.ssh/known_hosts')
            .pull('origin', 'master', { '--recurse-submodules': null });
    const changedPaths = pullSummary.files.map(path.normalize);
    const games = list();

    for (game of games) {
        if (changedPaths.some(p => p.startsWith(path.normalize(game.workingDir)))) {
            const installScript = path.join(game.workingDir, 'install.sh');
            if (fs.existsSync(installScript)) {
                try {
                    console.log(`Executing install script in ${game.workingDir}`);
                    const child = spawn('./install.sh', { cwd: game.workingDir, stdio: ['inherit', 'inherit', 'inherit'] });
                    await new Promise((resolve, reject) => {
                        child.on('exit', (code) => {
                            if (code === 0) {
                                console.log('Install script completed successfully');
                                resolve();
                            } else {
                                reject(`Child process returned code ${code}`);
                            }
                        })
                    });
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
