const EventEmitter = require('events');
const most = require('most');

const addMany = function addMany() {
    return Array.prototype.reduce.call(arguments, (a, b) => a + b, 0);
};

module.exports = class Garbage {
    constructor(players) {
        this.state = players.map(player => {
            const emitter = new EventEmitter();
            const stream = most.fromEvent('garbage', emitter);
            return { player, emitter, stream };
        });
    }

    update(source, garbage) {
        this.state.find(s => s.player === source).emitter.emit('garbage', garbage);
    }

    consume(target) {
        return most.combineArray(addMany,
            this.state.filter(s => s.player !== target)
                .map(s => s.stream.scan((_, cur) => cur, 0))
        ).map(garbage => ({garbage}));
    }
}
