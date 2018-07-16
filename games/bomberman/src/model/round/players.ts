const { shuffle } = require('./utils');
import { Action, MoveAction } from '../input';
import * as _ from 'lodash';

export const init = ({width, height}) => {
    const offset = Math.round(Math.min(width / 4, height / 4));
    const startingPositions = shuffle([
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: 1 }
    ]);
    return startingPositions.map(({x, y}, index) => new Player({
        id: index + 1,
        x: Math.round(x * offset + width / 2),
        y: Math.round(y * offset + height / 2),
    }));
};

export class Player {
    id: any;
    x: any;
    y: any;
    width: number = 3;
    height: number = 3;
    sprite: number[][] = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ]
    alive: boolean = true;
    inputActionsThisTick: Action[] = [];
    actionThisTick: { dropDynamiteRequested: boolean, move: { dx: number, dy: number } };

    constructor({id, x, y}) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    startTick() {
        const inputActions = this.inputActionsThisTick;
        this.inputActionsThisTick = []; // Refresh for next tick
        const lastMoveAction = _.findLast(inputActions, a => a.type === 'move');
        const move = lastMoveAction as MoveAction || { dx: 0, dy: 0 }

        this.actionThisTick = {
            dropDynamiteRequested: _.some(inputActions, a => a.type === 'dynamite'),
            move: move
        };
    }

    registerInput(action: Action) {
        this.inputActionsThisTick.push(action);
    }

    updatePosition() {
        if (this.alive) {
            this.x += this.actionThisTick.move.dx;
            this.y += this.actionThisTick.move.dy;
        }
    }
}
