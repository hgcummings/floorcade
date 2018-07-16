const scanInput = require('./input');
const roundFactory = require('./round');

async function runGame({width, height}, state, input) {
    state.round = roundFactory.init({width, height}, input);
    await state.round.activity;
} 

export const init = ({width, height}, inputEvents) => {
    // const input = scanInput(inputEvents);
    const input = inputEvents;
    const state = {};
    const activity = runGame({width, height}, state, input);

    return {
        state,
        activity
    };
}
