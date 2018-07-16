export function init(width: number, height: number) {
    const pixels = new Uint8Array(width * height * 3);

    return {
        render: state => {
            render(width, height, pixels);
            return pixels;
        }
    }
}

function render(width: number, height: number, pixels: Uint8Array) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const colour = y == height - 1 ? [255, 0, 0] : [0, 0, 255];
            for (let c = 0; c < 3; ++c) {
                pixels[(((y * width) + x) * 3) + c] = colour[c];
            }
        }
    }
};
