const scanInput = require('./input');
const roundFactory = require('./round');
const scoresFactory = require('./scores');

async function runGame({width, height}, state, input) {
    let playerTotals = [0,0,0,0];
    let topScore = 0;

    while (topScore < 25 || playerTotals.filter(total => total === topScore).length > 1) {
        state.round = roundFactory.init({width, height}, input);
        await state.round.activity;
        const players = state.round.players;
        delete state.round;
        state.scores = scoresFactory.init(players, playerTotals);
        playerTotals = await state.scores.activity;
        delete state.scores;
        topScore = Math.max(...playerTotals);
    }
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
