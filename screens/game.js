const { spawn } = require('cross-spawn');

module.exports.init = (gameConfig) => {
    let game;

    const render = (width, height, stream) => {
        if (!game) {

            game = spawn(
                gameConfig.command,
                ['--width', width,'--height', height],
                {
                    cwd: gameConfig.workingDir
                }
            );

            game.stdout.pipe(stream);
        }
    }
    
    return {
        render
    }
}
