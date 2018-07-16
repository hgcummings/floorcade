import { State } from '../model';

export function init(width: number, height: number) {
    const pixels = new Uint8Array(width * height * 3);

    return {
        render: state => {
            render(width, height, state, pixels);
            return pixels;
        }
    }
}

const floorColour = [255, 0, 0];
const skyColour = [0, 0, 0];
const playerColour = [255, 0, 255];
const pipeColour = [0, 255, 0];

function render(width: number, height: number, state: State, pixels: Uint8Array) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const colour = y === height - 1 ? floorColour : skyColour;
            for (let c = 0; c < 3; c++) {
                pixels[(((y * width) + x) * 3) + c] = colour[c];
            }
        }
    }

    for (let c = 0; c < 3; c++) {
        pixels[(((state.player.y * width) + state.player.x) * 3) + c] = playerColour[c];
    }

    for (const pipe of state.pipes) {
        for (let y = 0; y < height - 1; y++) {
            if (y >= pipe.bottomY && y <= pipe.topY)
                continue;

            for (let c = 0; c < 3; c++) {
                pixels[(((y * width) + pipe.x) * 3) + c] = pipeColour[c];
            }
        }
    }
};
