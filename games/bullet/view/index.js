const level = require('./level');

module.exports.init = ({width, height}) => {

    const render = state => {
        const pixels = new Uint8Array(width * height * 3);
        level.render(state.level, pixels, {width, height});
        return pixels;
    }

    return {
        render
    }
}
