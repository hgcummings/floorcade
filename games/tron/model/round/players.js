const { shuffle } = require('./utils');
const { components } = require('./directions');

module.exports.init = ({width, height}) => {
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

class Player {
    constructor({id, x, y, dx, dy}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.alive = true;
        this.nextDirection = [];
        this.score = {
            place: 0,
            kills: 0
        }
    }

    updateDirection(direction) {
        if (direction === 0) {
            return;
        }
        const len = this.nextDirection.length;
        if (len > 1) {
            if (this.nextDirection[len - 1] === (direction | this.nextDirection[len - 2])) {
                this.nextDirection.pop();
            }
        }
        this.nextDirection.push(direction);
    }

    checkCollisions({players, arena}) {
        let newDirection = components(this.nextDirection.shift());
        while (newDirection && newDirection.dx === -this.dx && newDirection.dy === -this.dy) {
            newDirection = components(this.nextDirection.shift());
        }
        if (newDirection) {
            this.dx = newDirection.dx;
            this.dy = newDirection.dy;
        }        

        let collided = this.checkCollisionsInternal({players, arena});

        if (collided.length) {
            this.alive = false;
        }

        return collided.filter(x => x !== this.id);
    }

    updatePosition() {
        if (this.alive) {
            this.x += this.dx;
            this.y += this.dy;
        }
    }

    checkCollisionsInternal({players, arena}) {
        if (players
            .filter(p => p.id !== this.id)
            .some(p => p.x === this.x && p.y === this.y)) {
                return [0];
            }                

        const target = arena[this.y + this.dy][this.x + this.dx];
        if (target !== 0) {
            return [target];
        }

        // Special case: can't cross a diagonal line
        if (this.dx && this.dy) {
            const xTarget = arena[this.y][this.x + this.dx];
            const yTarget = arena[this.y + this.dy][this.x];

            if ((xTarget !== 0) && (yTarget !== 0)) {
                if (xTarget === yTarget) {
                    return xTarget;
                } else {
                    return [xTarget, yTarget];
                }
            }
        }

        return [];
    }
}
