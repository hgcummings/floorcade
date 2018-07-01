const Game = require('./game');
const Garbage = require('./garbage');
const most = require('most');

module.exports.init = (inputEvents) => {
    const state = [];
    const playfield = {
        "size": {
          "width": 9,
          "height": 18
        },
        "padding": {
          "left": 0,
          "right": 0,
          "top": 20,
          "bottom": 0
        }
      };

    const ticker = most.constant(1, most.periodic(16));
    const randomSeed = Date.now();
    const players = [1,2,3,4];
    const garbage = new Garbage(players);
    const games = players.map(player =>
        new Game(player, ticker, inputEvents, playfield, randomSeed, garbage.consume(player)));

    const activity = Promise.all(games.map((game) =>
        game.run(({ data }) => {
            state[game.player - 1] = data;
            garbage.update(game.player, data.garbageProduced);
        })));

    return {
        activity,
        state
    }
}
