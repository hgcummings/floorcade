const most = require('most');
const keyMap = require('./keyMap.json');

const {
    data: {
      engine: EngineData,
      input: InputData
    },
    engine: Engine,
    input: {
        utils: {
            keyStore: KeyStore
        }
    }
} = require('../extris');

module.exports = class Game {
  constructor(player, ticker, inputEvents, playfield, randomSeed, external) {
    this.player = player;
    const config = most.just(EngineData.config);
    const input = inputEvents
      .filter(({ id }) => id === player)
      .map(({ id, type, key}) => ({id, type, key: keyMap[key]}))
      .thru(KeyStore(InputData.keys));
    this.stream =
      ticker
        .thru(Engine({ config, input, external, playfield, randomSeed }));
  }
  run(handler) {
    return new Promise((resolve, reject) => {
      this.subscription =
        this.stream
          .subscribe({
            next: handler,
            complete: resolve,
            error: (err) => {
              console.error(err);
              reject(err);
            },
          });
    });
  }
  destroy() {
    this.subscription.unsubscribe();
  }
}
