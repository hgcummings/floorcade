const Bat = require('./bat.js');

async function runGame({width, height}, state, input) {
  state.bat = new Bat({ id: 1, x: 2, y:3 });
}

module.exports.init = ({width, height}, inputEvents) => {
    // const input = scanInput(inputEvents);
    const state = {};
    const activity = runGame({width, height}, state, null);

    return {
        state,
        activity
    };
}
