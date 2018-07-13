const config = require('./config.json');
const dancefloor = require('./dancefloor');
const { fonts, renderPixels } = require('js-pixel-fonts');
const readline = require('readline');

config.dancefloor.host = process.argv[2] || config.dancefloor.host;
config.dancefloor.port = process.argv[3] || config.dancefloor.port;

const lines = [];
const input = readline.createInterface(process.stdin);

input.on('line', line => {
    lines.push(renderPixels(line, fonts.sevenPlus));
    if (lines.length > 4) {
        lines.shift();
    }
});

let screen = {
    render: (width, height, stream) => {
        const rowBuffer = new Uint8Array(width * 3);
        rowBuffer.fill(0);
        let rows = 0;

        const writeRow = () => {
            stream.write(rowBuffer);
            rowBuffer.fill(0);
            ++rows;
        }

        writeRow();
        for (let line of lines) {
            let y = 0;
            for (; y < line.length; ++y) {
                for (let x = 0; x < width; ++x) {
                    if (line[y][x - 1]) {
                        for (z = 0; z < 3; ++z) {
                            rowBuffer[x * 3 + z] = 255;
                        }
                    }
                }
                writeRow();
            }
            for (; y < 8; ++y) {
                writeRow();
            }
        }

        while (rows < height) {
            writeRow();
        }
    }
};

dancefloor.init(config.dancefloor, screen);
