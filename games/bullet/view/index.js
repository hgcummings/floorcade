const round = require('./round');

module.exports.init = ({width, height}) => {

    const render = state => {
        const pixels = new Uint8Array(width * height * 3);
        round.render(state.round, pixels, {width, height});
        return pixels;
    }

    return {
        render
    }
}
