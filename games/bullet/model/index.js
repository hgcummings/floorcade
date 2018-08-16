const scanInput = require('./input');
const levelFactory = require('./level');

async function runGame({width, height}, state, input) {
    let playerTotals = [0];

    state.level = levelFactory.init({width, height}, input);
    await state.level.activity;
} 

module.exports.init = ({width, height}, inputEvents) => {
    const input = scanInput(inputEvents);
    const state = {};
    const activity = runGame({width, height}, state, input);

    return {
        state,
        activity
    };
}
