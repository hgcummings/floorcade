module.exports.init = (config, input) => {
    const pixels = new Uint8Array(config.width * config.height * 3);
    pixels.fill(0);

    const render = () => pixels;
    
    return {
        render
    }

}