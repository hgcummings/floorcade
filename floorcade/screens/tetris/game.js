const Game = require('../../games/tetris/index')
const {
    data: {
        ground: {
            size: {
                width,
                height
            }
        }
    },
    structs: {
        block: {
            getData
        },
        ground: {
            EMPTY,
            get
        }
    }
} = require('intris');

console.log(EMPTY);

const SCALE = 2;
const colours = [
    [0, 255, 255], // I
    [255, 255, 0], // O
    [0, 0, 255], // J
    [255, 128, 0], // L
    [0, 255, 0], // S
    [192, 0, 192], // T
    [255, 0, 0]  // Z
];
const maskColours = colours.map(colour => colour.map(component => component / 2));

module.exports.init = (config) => {
    let data;

    const game = new Game();
    const pixels = new Uint8Array(config.width * config.height * 3);

    const drawUnit = (x, y, type, mask = false) => {
        if (type !== EMPTY) {
            const fillColour = mask ? maskColours[type] : colours[type];
            
            for (let i = 0; i < SCALE; ++i) {
                for (let j = 0; j < SCALE; ++j) {
                    const screenX = (SCALE * x) + i;
                    const screenY = (SCALE * y) + j;

                    for (let z = 0; z < 3; ++z) {
                        pixels[((screenX + (screenY * config.width)) * 3) + z] = fillColour[z];
                    }
                }
            }
        }
    }

    const drawBlock = (block, mask = false) => {
        const data = getData(block);
        for (let x = 0; x < data.size.width; x++) {
            for (let y = 0; y < data.size.height; y++) {
                if (data.data[y][x]) {
                    drawUnit(x + block.x, y + block.y, block.type, mask);
                }
            }
        }
    }

    const drawGround = (ground) => {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                drawUnit(x, y, get(ground, x, y));
            }
        }
    };

    const render = () => {
        pixels.fill(0);
        
        if (!data) {
            return pixels;
        }

        drawGround(data.ground);
        drawBlock(data.maskBlock, true);
        drawBlock(data.block);

        return pixels;
    }

    const activity = game.run(value => {
        data = value.data;
    });

    return {
        render,
        activity
    }
}