module.exports = class Obstacle {
    constructor({x, y, dx, dy = 0, screenWidth}) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.screenWidth = screenWidth;
    }

    move(walls = []) {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x > this.screenWidth) {
            this.x = 0;
        }

        if (this.x < 0) {
            this.x = this.screenWidth;
        }

        let collisionWall = walls.find(w => this.dy > 0 ? w.y === this.y : w.y === this.y);
        if (collisionWall) {
            this.dy = this.dy * -1;
        }
    }
};
