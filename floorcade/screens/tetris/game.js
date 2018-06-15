const Game = require('../../games/tetris/index');
const Garbage = require('../../games/tetris/garbage');
const most = require('most');
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
            GARBAGE,
            get
        }
    }
} = require('intris');

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
colours[GARBAGE] = [128, 128, 128];
const maskColours = colours.map(colour => colour.map(component => component / 8));

module.exports.init = (config) => {
    const gameData = [];

    const ticker = most.constant(1, most.periodic(16));
    const randomSeed = Date.now();
    const players = [0,1,2,3];
    const garbage = new Garbage(players);
    const games = players.map(player => new Game(player, ticker, randomSeed, garbage.consume(player)));
    const pixels = new Uint8Array(config.width * config.height * 3);

    const drawUnit = (offset, x, y, type, mask = false) => {
        if (type !== EMPTY) {
            const fillColour = mask ? maskColours[type] : colours[type];
            
            for (let i = 0; i < SCALE; ++i) {
                for (let j = 0; j < SCALE; ++j) {
                    const screenX = (SCALE * (x + offset)) + i;
                    const screenY = (SCALE * y) + j;

                    for (let z = 0; z < 3; ++z) {
                        pixels[((screenX + (screenY * config.width)) * 3) + z] = fillColour[z];
                    }
                }
            }
        }
    }

    const drawBlock = (offset, block, mask = false) => {
        const data = getData(block);
        for (let x = 0; x < data.size.width; x++) {
            for (let y = 0; y < data.size.height; y++) {
                if (data.data[y][x]) {
                    drawUnit(offset, x + block.x, y + block.y, block.type, mask);
                }
            }
        }
    }

    const drawGround = (offset, ground) => {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                drawUnit(offset, x, y, get(ground, x, y));
            }
        }
    };

    const render = () => {
        pixels.fill(0);

        gameData.forEach((data, player) => {
            if (data && data.ground) {
                const offset = player * width;
                drawGround(offset, data.ground);
                drawBlock(offset, data.maskBlock, true);
                drawBlock(offset, data.block);
            }
        });

        return pixels;
    }

    const activity = Promise.all(games.map((game, player) =>
         game.run(({ data }) => {
            gameData[player] = data;
            garbage.update(player, data.garbageProduced);
         })))

    return {
        render,
        activity
    }
}