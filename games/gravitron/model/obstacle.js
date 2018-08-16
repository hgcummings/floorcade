module.exports = class Obstacle {
    constructor(x, y, dx = 0, dy = 0) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
};
