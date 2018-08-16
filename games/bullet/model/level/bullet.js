const log = require ('../../log');

module.exports.init = (timeSinceStart) => {
    const speedup = (timeSinceStart / 50000);
    log("speedup" + speedup)
    const y = Math.floor(Math.random()*36);
    return new Bullet({
        x: 72,
        y: y,
        dx: -(1 + speedup),
        dy: 0
    });
};

class Bullet {
    constructor({id, x, y, dx, dy}) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    updatePosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

}
