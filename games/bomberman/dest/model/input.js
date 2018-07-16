"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directionBtns = ['DU', 'DR', 'DD', 'DL'];
const { validDirections } = require('./round/directions');
const { scan } = require('rxjs/operators');
const _ = require("lodash");
module.exports = (playerEvents) => playerEvents.pipe(scan((acc, event) => {
    const next = acc.concat();
    if (_.includes(directionBtns, event.key)) {
        const component = 1 << (directionBtns.indexOf(event.key));
        const i = event.id - 1;
        let newDirection = 0;
        if (event.type === 'down') {
            newDirection = acc[i] | component;
        }
        else {
            newDirection = acc[i] & (~component);
        }
        if (!validDirections.hasOwnProperty(newDirection)) {
            newDirection = event.type === 'down' ? component : 0;
        }
        next[i] = newDirection;
    }
    return next;
}, [0, 0, 0, 0]));
//# sourceMappingURL=input.js.map