module.exports.init = (config, input) => {
    const model = {
        x: config.width / 2,
        y: config.height / 2
    }

    const render = () => {
        const pixels = new Uint8Array(config.width * config.height * 3);
        pixels.fill(0);
        
        pixels[(model.x + (model.y * config.width)) * 3] = 255;

        return pixels;
    }

    input.on('up', () => model.y -= 1);
    input.on('down', () => model.y += 1);
    input.on('left', () => model.x -= 1);
    input.on('right', () => model.x += 1);

    return {
        render
    }

}