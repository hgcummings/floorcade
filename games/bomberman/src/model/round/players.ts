const { shuffle } = require('./utils');
const { components } = require('./directions');

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
        dx: -x,
        dy: -y
    }));
};

export class Player {
    id: any;
    x: any;
    y: any;
    dx: any;
    dy: any;
    alive: boolean = true;
    inputsThisTick: string[] = [];

    constructor({id, x, y, dx, dy}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    registerInput(input) {
        this.inputsThisTick.push(input);
    }

    updatePosition() {
        if (this.alive) {
            this.x += this.dx;
            this.y += this.dy;
        }
    }
}
