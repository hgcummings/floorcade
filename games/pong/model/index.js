const Bat = require('./bat.js');

async function runGame({width, height}, state, input) {
  state.bat = new Bat({ id: 1, x: 2, y:3 });
  input.subscribe(e => {
    if(e.key === 'DU' && e.type == 'down'){
      state.bat.y--;
    }
    if (e.key === 'DD' && e.type == 'down'){
      state.bat.y++;
    }
  });
  while(state.bat.isAlive()){
    await new Promise(() => {});
  }
}

module.exports.init = ({width, height}, inputEvents) => {
    // const input = scanInput(inputEvents);
    const state = {};
    const activity = runGame({width, height}, state, inputEvents);

    return {
        state,
        activity
    };
}
