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

    move(bats, walls, {width, height}) {
        const collidingBats = bats.filter(b => this.collidesWithBat(b));

        const bounceVelocity = (x) => x * -1 * (1 + (Math.random() * 0.1));

        const makeMultiball = () => {
            this.makeBall({
                x: Math.floor(this.x),
                y: Math.floor(this.y),
                dx: bounceVelocity(this.dx),
                dy: bounceVelocity(this.dy),
                makeBall: this.makeBall
            });
        };

// BAT collision
        if (collidingBats.some(b => b)) {
            if (collidingBats.some(b => b.orientation === orientations.horizontal)) {
                makeMultiball();
                this.dy = bounceVelocity(this.dy);
            }
            if (collidingBats.some(b => b.orientation === orientations.vertical)) {
                makeMultiball();
                this.dx = bounceVelocity(this.dx);
            }
        }

        // WALL collision
        let nextX = this.x + this.dx;
        let nextY = this.y + this.dy;
        if (nextX < 0 && walls.find(w => w.name === 'LEFT')) {
            this.dx *= -1;
        }
        if (nextX > width && walls.find(w => w.name === 'RIGHT')) {
            this.dx *= -1;
        }
        if (nextY < 0 && walls.find(w => w.name === 'TOP')) {
            this.dy *= -1;
        }
        if (nextY > height && walls.find(w => w.name === 'BOTTOM')) {
            this.dy *= -1;
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
        const nextX = this.x + this.dx;
        const nextY = this.y + this.dy;
        if (bat.orientation === orientations.vertical){
            if (bat.wall.name === 'LEFT'){
                return nextY >= bat.y && nextY <= bat.y + bat.height && nextX < bat.x + bat.width;
            }
            if (bat.wall.name === 'RIGHT'){
                return nextY >= bat.y && nextY <= bat.y + bat.height && nextX >= bat.x;
            }
        }
        if (bat.orientation === orientations.horizontal){
            if (bat.wall.name === 'TOP'){
                return nextX >= bat.x && nextX <= bat.x + bat.width && nextY < bat.y + bat.height;
            }
            if (bat.wall.name === 'BOTTOM'){
                return nextX >= bat.x && nextX <= bat.x + bat.width && nextY >= bat.y;
            }
        }
    }

    pixels() {
        return [{ x: Math.floor(this.x), y: Math.floor(this.y)}];
    }
};
