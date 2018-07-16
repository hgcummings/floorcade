const setColorOfPixel = (width, height, pixels, x, y, color) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
        for (let c = 0; c < 3; ++c) {
            pixels[(((y * width) + x) * 3) + c] = color[c];            
        }
    }
};

class Ship {
    constructor() {
        this.posX = 35;
        this.posY = 17;
    }

    render(width, height, pixels) {
        setColorOfPixel(width, height, pixels, this.posX, this.posY, [255, 255, 255]);
    }

    playerButtonPressed() {
        this.posX += 1;
    }
}

module.exports.init = ({width, height}) => {
    const pixels = new Uint8Array(width * height * 3);

    const ship = new Ship();
    
    const render = () => {
        pixels.fill(0);
        ship.render(width, height, pixels);
        return pixels;
    }

    const playerButtonPressed = () => {
        ship.playerButtonPressed();
    }

    return {
        render,
        playerButtonPressed
    }
}
