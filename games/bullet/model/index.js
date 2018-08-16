const scanInput = require('./input');
const levelFactory = require('./level');
const scoresFactory = require('./scores');

async function runGame({width, height}, state, input) {
    let playerTotals = [0,0,0,0];
    let topScore = 0;

    while (topScore < 25 || playerTotals.filter(total => total === topScore).length > 1) {
        state.level = levelFactory.init({width, height}, input);
        await state.level.activity;
        const players = state.level.players;
        delete state.level;
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
