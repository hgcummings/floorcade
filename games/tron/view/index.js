const round = require('./round');
const scores = require('./scores');

module.exports.init = ({width, height}) => {
    const pixels = new Uint8Array(width * height * 3);

    const render = state => {
        if (state.round) {
            round.render(state.round, pixels);
        } else if (state.scores) {
            scores.render({width, height}, state.scores, pixels);
        }
        return pixels;
    }

    return {
        render
    }
}
