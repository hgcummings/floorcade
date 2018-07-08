const path = require('path');
const spawn = require('cross-spawn');
const cursor = require('ansi')(process.stdout);

if (process.argv.length < 3) {
    console.error('Must specify a game directory');
    process.exit(1);
}

const width = 72;
const height = 36;
const {columns, rows} = process.stdout;

if (columns < width || rows < height) {
    console.error('Console window must be at least 72 columns by 36 rows');
    process.exit(1);
}

const keyMap = {
    "w": "DU",
    "a": "DL",
    "s": "DD",
    "d": "DR",
    "m": "FB",
    "k": "FR",
    "j": "FL",
    "i": "FT",
    "q": "LS",
    "o": "RS",
    "t": "SL",
    "y": "SR"
};

const hScale = Math.floor(columns / width);
const vScale = Math.min(Math.floor(rows / height), Math.max(1, Math.round(hScale / 2)));

process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');

const workingDir = path.join('games', process.argv[2]);
const configPath = path.join(workingDir, 'game.json');
console.log('Loading config from ', configPath);

const gameConfig = require('./' + configPath.replace('/\\/g', '/'));

game = spawn(
    gameConfig.command,
    ['--width',width,'--height',height],
    {
        cwd: workingDir,
        stdio: ['pipe', 'pipe', 'inherit']
    }
);
game.stdout.pause();

let started = false;
const tickToken = setInterval(() => {
    if (!started) {
        data = game.stdout.read(6);
        if (data && data.toString('utf8').trim() === 'READY') {
            start();
        }
    } else {
        game.stdin.write('STICK\n');
    }
}, 40);
game.stdin.on('close', () => clearInterval(tickToken));
game.on('exit', process.exit);

const start = () => {
    console.clear();
    cursor.hide();
    started = true;
    
    let player = 1;
    process.stdin.on('data', key => {
        if (key === '\u0003') {
            game.stdin.write('SKILL\n');
        }
        const number = parseInt(key, 0);
        if (number > 0 && number <= 4) {
            player = number;
        } else if (keyMap.hasOwnProperty(key)) {
            game.stdin.write(`P${player}${keyMap[key]}1\n`);
            const keyUpEvent = `P${player}${keyMap[key]}0\n`;
            setTimeout(() => game.stdin.write(keyUpEvent), 100);
        }
    });

    let offset = 0;
    let frameBuffer = new Uint8Array(width * height * 3);
    game.stdout.on('data', data => {
        data.copy(frameBuffer, offset);
        offset += data.length;
        if (offset === frameBuffer.length) {
            offset = 0;
            render(frameBuffer);
        }
    });
    game.stdout.resume();
}

const previousFrame = new Uint8Array(width * height * 3);
const render = (frameBuffer) => {
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const pixel = (y * width * 3) + (x * 3);
            if (frameBuffer[pixel] === previousFrame[pixel] &&
                frameBuffer[pixel + 1] === previousFrame[pixel + 1] &&
                frameBuffer[pixel + 2] === previousFrame[pixel + 2]) {
                continue;
            }
            previousFrame[pixel] = frameBuffer[pixel];
            previousFrame[pixel + 1] = frameBuffer[pixel + 1];
            previousFrame[pixel + 2] = frameBuffer[pixel + 2];
            cursor.bg.rgb(frameBuffer[pixel], frameBuffer[pixel + 1], frameBuffer[pixel + 2]);
            for (let i = x * hScale; i < (x + 1) * hScale; ++i) {
                for (let j = y * vScale; j < (y + 1) * vScale; ++j) {
                    cursor.goto(i + 1, j + 1);
                    cursor.write(' ');
                }
            }
        }
    }
    cursor.reset();
    cursor.goto(0, rows + 1);
}
