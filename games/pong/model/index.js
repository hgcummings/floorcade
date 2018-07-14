
async function runGame({width, height}, state, input) {
  
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
