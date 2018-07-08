const { fonts, renderPixels } = require("js-pixel-fonts");
const {
    structs: {
        block: {
            getData
        },
        ground: {
            EMPTY,
            GARBAGE
        }
    }
} = require('./extris');

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
    const pixels = new Uint8Array(config.width * config.height * 3);

    const render = (state) => {
        pixels.fill(0);

        state.forEach((playerState, index) => {
            if (playerState) {
                const offset = index * playerState.ground.width;
                if (typeof(playerState.score) == "number") {
                    drawScore(offset, playerState.score, playerState.ground.width);
                }
                if (playerState.ground) {
                    drawGround(offset, playerState.ground);
                    drawBlock(offset, playerState.maskBlock, true);
                    drawBlock(offset, playerState.block);
                }
            }
        });

        return pixels;
    };

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
    };

    const drawBlock = (offset, block, mask = false) => {
        const data = getData(block);
        for (let x = 0; x < data.size.width; x++) {
            for (let y = 0; y < data.size.height; y++) {
                if (data.data[y][x]) {
                    drawUnit(offset, x + block.x, y + block.y, block.type, mask);
                }
            }
        }
    };

    const drawGround = (offset, ground) => {
        for (let x = 0; x < ground.width; x++) {
            for (let y = 0; y < ground.height; y++) {
                drawUnit(offset, x, y, ground.get(x, y));
            }
        }
    };

    const abbreviate = score => {
        if (score < 10000) {
            return score.toString(10);
        } else if (score < 999500) {
            return ((score) / 1000).toPrecision(3) + "k";
        } else {
            return ((score) / 1000000).toPrecision(3) + "M";
        }
    };

    const drawScore = (offset, score, maxWidth) => {
        const scorePixels = renderPixels(abbreviate(score), fonts.slumbers);
        const leftEdge = ((offset + maxWidth) * SCALE) - scorePixels[0].length - 2;
        for (let j = 0; j < scorePixels.length; ++j) {
            for (let i = 0; i < scorePixels[j].length; ++i) {
                for (let z = 0; z < 3; ++z) {
                    if (scorePixels[j][i]) {
                        pixels[((leftEdge + i + 1) + ((j + 1) * config.width)) * 3 + z] = 255;
                    }
                }
            }
        }
    };

    return {
        render
    };
}
