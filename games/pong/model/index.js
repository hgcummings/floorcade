const Bat = require('./bat.js');
const Ball = require('./ball.js');
const orientations = require('./orientations.js');

async function runGame({width, height}, state, input) {
  state.bats = [
    new Bat({ id: 1, x: 1, y: 15 }),
    new Bat({ id: 2, x: 30, y: 1, orientation: orientations.horizontal}),
    new Bat({ id: 3, x: 70, y: 15 }),
    new Bat({ id: 4, x: 30, y: 34, orientation: orientations.horizontal }),
  ];
  state.balls = [
    new Ball({id: 1, x: 10, y: 10 }),
  ];
  input.subscribe(e => {
    const movement = [0,0];
    if(e.key === 'DU' && e.type == 'down'){
      movement[1]--;
    }
    if (e.key === 'DD' && e.type == 'down'){
      movement[1]++;
    }
    if (e.key === 'DR' && e.type == 'down'){
      movement[0]++;
    }
    if (e.key === 'DL' && e.type == 'down'){
      movement[0]--;
    }
    movement[0] *= 3;
    movement[1] *= 3;

    state.bats.filter(b => b.id === e.id).forEach(b => b.move(...movement));

    if(e.type == 'down'){
      state.balls.forEach(b => b.move(state.bats));
    }
  });
  while(state.bats.filter(b => b.isAlive()).length > 0){
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
