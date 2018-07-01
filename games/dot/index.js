let prevArg, width, height;
for (let arg of process.argv) {
    if (prevArg === '--width') {
        width = parseInt(arg, 10);
    } else if (prevArg === '--height') {
        height = parseInt(arg, 10);
    }
    prevArg = arg;
}

console.error(width, height);

const position = [Math.floor(width / 2), Math.floor(height / 2)];
const pixels = new Uint8Array(width * height * 3);

process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
    if (data.trim() === 'STICK') {
        pixels.fill(0);
        const [x, y] = position;
        pixels[(y * width * 3) + (x * 3)] = 255;
        process.stdout.write(pixels);
    } else if (data[0] === 'P') {
        const button = data.substr(2,3);
        switch (button) {
            case 'DU1':
                position[1] -= 1;
                break;
            case 'DD1':
                position[1] += 1;
                break;
            case 'DL1':
                position[0] -= 1;
                break;
            case 'DR1':
                position[0] += 1;
                break;
            case 'SR1':
                process.exit(0);
                break;
            default:
                break;
        }
    } else {
        console.log(typeof(data), data.length, data);
    }
});

console.log('READY');