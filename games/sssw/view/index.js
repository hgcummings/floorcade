const round = require('./round');
const scores = require('./scores');

module.exports.init = ({width, height}) => {
    const pixels = new Uint8Array(width * height * 3);

    const render = state => {
        scores.render({width, height}, state.scores, pixels);
        return pixels;
    }

    return {
        render
    }
}
