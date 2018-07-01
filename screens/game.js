const { spawn } = require('cross-spawn');
const input = require('../input');

module.exports.init = (gameConfig) => {
    let game, resolveNext, loadingPixels, started = false;
    
    const nextPromise = new Promise((resolve) => {
        resolveNext = resolve;
    });

    const render = (width, height, stream) => {
        if (!game) {
            console.log(gameConfig.command, gameConfig.workingDir);
            game = spawn(
                gameConfig.command,
                ['--width', width,'--height', height],
                {
                    cwd: gameConfig.workingDir
                }
            );

            game.on('exit', () => resolveNext());

            loadingPixels = new Uint8Array(width * height * 3);
            loadingPixels.fill(0);
        } else {
            const data = game.stdout.read(6);
            if (data && data.toString('utf8').trim() === 'READY') {
                started = true;
                input(gameConfig.players.max, game.stdin);
                game.stdout.pipe(stream);
            }
        }
        if (started) {
            game.stdin.write('STICK\n');
        } else {
            stream.write(loadingPixels);
        }
    }
    
    return {
        render,
        next: () => nextPromise
    }
}
