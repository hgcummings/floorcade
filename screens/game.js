const { spawn } = require('cross-spawn');
const input = require('../input');
const { fonts, renderPixels } = require("js-pixel-fonts");

module.exports.init = (gameConfig) => {
    let game, resolveNext, loadingPixels, started = false;
    
    const nextPromise = new Promise((resolve) => {
        resolveNext = resolve;
    });

    const render = (width, height, stream) => {
        if (!game) {
            const [command, ...args] = gameConfig.command.split(' ');
            args.push(...['--width',width,'--height',height]);

            game = spawn(
                command,
                args,
                {
                    cwd: gameConfig.workingDir,
                    stdio: ['pipe', 'pipe', 'inherit']
                }
            );

            game.on('exit', () => resolveNext());

            loadingPixels = new Uint8Array(width * height * 3);
            loadingPixels.fill(0);

            const textPixels = renderPixels("Loading...", fonts.sevenPlus);
            const top = Math.floor((height - textPixels.length) / 2);
            const left = Math.floor((width - textPixels[0].length) / 2);
            for (let y = 0; y < textPixels.length; ++y) {
                const line = textPixels[y];
                for (let x = 0; x < line.length; ++x) {
                    if (textPixels[y][x]) {
                        for (let z = 0; z < 3; ++z) {
                            loadingPixels[(((y + top) * width) + x + left) * 3 + z] = 255;
                        }
                    }
                }
            }
        } else {
            const data = game.stdout.read();
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
