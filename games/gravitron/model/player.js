module.exports = class Player {
    constructor({id, x, y, screenWidth}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 1;

        this.screenWidth = screenWidth;

        this.shapeCoordsFacingUp = [
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 1],
            [2, 1],
            [2, 2],
        ];

        this.shapeCoordsFacingDown = [
            [0, 1],
            [0, 0],
            [1, 2],
            [1, 1],
            [2, 1],
            [2, 0],
        ];

        // Implicit from the shape but whatever
        this.height = 3;
        this.width = 3;
    }

    move(walls = []) {
        this.x += this.dx;
        this.y += this.dy;

       if (this.x > this.screenWidth) {
           this.x = 0;
       }

       if (this.x + this.width < 0) {
           this.x = this.screenWidth - this.width;
       }

        let collisionWall = walls.find(w => this.dy > 0 ? w.y === this.y + this.height : w.y === this.y);
        if (collisionWall) {
            this.dy = this.dy * -1;
            // TODO: dynamically do this width
            collisionWall.indentsX = [this.x, this.x + 1, this.x + 2];
        }

        walls.filter(w => w !== collisionWall).forEach(w => w.indentsX = undefined);
    }

    shapeCoords() {
        return this.dy < 0 ? this.shapeCoordsFacingDown : this.shapeCoordsFacingUp;
    }

    playerCoords() {
        return this.shapeCoords().map(c => [c[0] + this.x, c[1] + this.y]);
    }

    collidesWithAny(obstacles) {
        return !!this.playerCoords().find(c => obstacles.find(o => o.x === c[0] && o.y === c[1]));
    }
};
