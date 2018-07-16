const round = require('./round');

export const init = ({width, height}) => {
    const pixels = new Uint8Array(width * height * 3);

    const render = state => {
        if (state.round) {
            round.render(state.round, pixels);
        }
        return pixels;
    }

    return {
        render
    }
}
