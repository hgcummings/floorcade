const orientations = require('./orientations.js');

module.exports = class Ball {
    constructor({
                    id, x, y, dx = 1, dy = 1, makeBall = () => {
        }
                }) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.makeBall = makeBall;
    }

    move(bats, walls, { width, height }) {
        const collidingBats = bats.filter(b => this.collidesWithBat(b));

        const makeMultiball = (bat) => {
            if (this.collidesWithEdgeOfBat(bat) && Math.random() > 0.6) {
                this.makeBall({
                    x: Math.floor(this.x),
                    y: Math.floor(this.y),
                    dx: (this.dx * -1),
                    dy: (this.dy * -1),
                    makeBall: this.makeBall
                });
            }
        };

        // i.e. bottom/top bats
        const bounceVertical = () => {
            const speedup = Math.random() * 1;
            const velChange = Math.random() * 0.5;
            this.dx = (this.dx - Math.sign(this.dx) * velChange) + Math.sign(this.dx) * speedup;
            this.dy = -1 * (this.dy + Math.sign(this.dy) * velChange) + Math.sign(this.dy) * speedup;
        };
        // i.e. right/left bats
        const bounceHorizontal = () => {
            const speedup = Math.random() * 0.2;
            const velChange = Math.random() * 0.5;
            this.dy = (this.dy - Math.sign(this.dy) * velChange) + Math.sign(this.dy) * speedup;
            this.dx = -1 * (this.dx + Math.sign(this.dx) * velChange) + Math.sign(this.dx) * speedup;
        };

// BAT collision
        if (collidingBats.some(b => b)) {
            if (collidingBats.some(b => b.orientation === orientations.horizontal)) {
                makeMultiball(collidingBats.find(b => b.orientation === orientations.horizontal));
                bounceVertical();
            }
            if (collidingBats.some(b => b.orientation === orientations.vertical)) {
                makeMultiball(collidingBats.find(b => b.orientation === orientations.vertical));
                bounceHorizontal();
            }
        }

        // WALL collision
        let nextX = this.x + this.dx;
        let nextY = this.y + this.dy;
        if (nextX < 0 && walls.find(w => w.name === 'LEFT')) {
            bounceHorizontal();
        }
        if (nextX > width && walls.find(w => w.name === 'RIGHT')) {
            bounceHorizontal();
        }
        if (nextY < 0 && walls.find(w => w.name === 'TOP')) {
            bounceVertical();
        }
        if (nextY > height && walls.find(w => w.name === 'BOTTOM')) {
            bounceVertical();
        }
        this.x += this.dx;
        this.y += this.dy;
    }

    collidesWith(pixels) {
        const nextX = this.x + this.dx;
        const nextY = this.y + this.dy;
        return pixels.map(p => p.x).includes(nextX)
            && pixels.map(p => p.y).includes(nextY);
    }

    collidesWithBat(bat) {
        const nextX = Math.floor(this.x + this.dx);
        const nextY = Math.floor(this.y + this.dy);
        if (bat.orientation === orientations.vertical) {
            if (bat.wall.name === 'LEFT') {
                return nextY >= bat.y && nextY <= bat.y + bat.height && nextX < bat.x + bat.width;
            }
            if (bat.wall.name === 'RIGHT') {
                return nextY >= bat.y && nextY <= bat.y + bat.height && nextX >= bat.x;
            }
        }
        if (bat.orientation === orientations.horizontal) {
            if (bat.wall.name === 'TOP') {
                return nextX >= bat.x && nextX <= bat.x + bat.width && nextY < bat.y + bat.height;
            }
            if (bat.wall.name === 'BOTTOM') {
                return nextX >= bat.x && nextX <= bat.x + bat.width && nextY >= bat.y;
            }
        }
    }

    collidesWithEdgeOfBat(bat) {
        const nextX = Math.floor(this.x + this.dx);
        const nextY = Math.floor(this.y + this.dy);
        if (bat.orientation === orientations.vertical) {
            if (bat.wall.name === 'LEFT') {
                return nextY >= bat.y && nextY <= bat.y + bat.height && nextX === bat.x + bat.width;
            }
            if (bat.wall.name === 'RIGHT') {
                return nextY >= bat.y && nextY <= bat.y + bat.height && nextX === bat.x;
            }
        }
        if (bat.orientation === orientations.horizontal) {
            if (bat.wall.name === 'TOP') {
                return nextX >= bat.x && nextX <= bat.x + bat.width && nextY === bat.y + bat.height;
            }
            if (bat.wall.name === 'BOTTOM') {
                return nextX >= bat.x && nextX <= bat.x + bat.width && nextY === bat.y;
            }
        }
    }

    pixels() {
        return [{ x: Math.floor(this.x), y: Math.floor(this.y) }];
    }
};
