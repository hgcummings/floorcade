const gameScreen = require('./game');

module.exports.init = () => {
    let resolveNext;
    
    const nextPromise = new Promise((resolve) => {
        resolveNext = resolve;
    });

    let pixels;

    const render = (width, height, stream) => {
        //TODO make this real
        if (!pixels) {
            pixels = new Uint8Array(width, height);
            pixels.fill(0);
        }
        
        stream.write(pixels);
    }

    //TODO make this real
    resolveNext(gameScreen.init({
        workingDir: 'games\\tetris',
        ...require('../games/tetris/game.json')
    }));
    
    return {
        render,
        next: () => nextPromise
    }
}
