module.exports.init = () => {
    let pixels;

    const render = (width, height, stream) => {
        if (!pixels) {
            pixels = new Uint8Array(width * height * 3);
            pixels.fill(0);
        }

        return stream.write(pixels);
    }
    
    return {
        render
    }
}
