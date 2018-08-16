module.exports = class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 1;
    }

    move(walls = []) {
        this.x += this.dx;
        this.y += this.dy;

        let collisionWall = walls.find(w => w.y === this.y);
        if (collisionWall) {
            this.dy = this.dy * -1;
            collisionWall.indentX = this.x;
        }

        walls.filter(w => w.y !== this.y).forEach(w => w.indentX = undefined);
    }


};
