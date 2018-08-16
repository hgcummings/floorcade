const { components } = require('./directions');
const log = require ('../../log');

module.exports.init = ({width, height}) => {
    var startingPositions = [{x: 20, y: 20}];
    return startingPositions.map(({x, y}, index) => new Player({
        id: index + 1,
        x: x,
        y: y,
        dx: 0,
        dy: 0
    }));
};

class Player {
    constructor({id, x, y, dx, dy}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.dwidth = 1;
        this.dheight = 1;
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
        const directionComponents = components(direction);
        if (directionComponents) {
            this.dx = directionComponents.dx;
            this.dy = directionComponents.dy;
        }
    }

    updatePosition() {
        if (this.alive) {
            this.x += this.dx;
            this.y += this.dy;
        }
        this.dx = 0;
        this.dy = 0;
        this.nextDirection = []
    }

    checkCollisions(state) {
        const bullets = state.bullets;
        for (var i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            if ((bullet.x >= this.x - this.dwidth) 
                && (bullet.x <= this.x + this.dwidth)
                && (bullet.y >= this.y - this.dheight) 
                && (bullet.y <= this.y + this.dheight)) {
                this.alive = false;
                // TODO: Make this not the worst
                throw new Error("you dead")
            }
        }
    }
}
