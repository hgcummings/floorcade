const EventEmitter = require('events');
const most = require('most');

const add2 = (a, b) => a + b;
const addMany = function addMany() {
    return Array.prototype.reduce.call(arguments, add2, 0);
};

module.exports = class Garbage {
    constructor(players) {
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(players.length ** 2);
        this.players = players;
    }

    update(source, garbage) {
        this.emitter.emit('garbage', { source, garbage });
    }

    consume (target) {
        return most.combineArray(
            addMany,
            this.players.filter(player => player !== target).map(
                player => most.fromEvent('garbage', this.emitter)
                    .filter(({source}) => source === player)
                    .map(({garbage}) => garbage)
                    .scan((prev, curr) => curr, 0)
            )
        ).map(garbage => ({garbage}));
    }
}