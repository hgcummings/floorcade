const fs = require('fs');
const path = require('path');
const { spawn } = require('cross-spawn');
const { list } = require('./games');

async function run() {
    const games = list();

    for (game of games) {
        const installScript = path.join(game.workingDir, 'install.sh');
        if (fs.existsSync(installScript)) {
            console.log(`Executing install script in ${game.workingDir}`);
            const child = spawn('./install.sh', { cwd: game.workingDir, stdio: ['inherit', 'inherit', 'inherit'] });
            await new Promise((resolve, reject) => {
                child.on('exit', (code) => {
                    if (code === 0) {
                        console.log('Install script completed successfully');
                    } else {
                        console.error(`WARNING: Install script exited with code ${code}. ${game.title} will not be playable.`);
                    }
                    resolve();
                })
            });
        }
    }
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
