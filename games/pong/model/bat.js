const orientations = require('./orientations.js');

module.exports = class Bat {
    constructor({ id, x, y, orientation = orientations.vertical }) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.maxSpeed = 3;
        this.height = orientation === orientations.horizontal ? 1 : 5;
        this.width = orientation === orientations.vertical ? 1 : 10;
        this.orientation = orientation;
        this.lives = 3;
    }

    isAlive() {
        return this.lives > 0;
    }

    loseLife() {
        this.lives--;
    }

    changeVelocity(dx, dy) {
        if (this.orientation === orientations.horizontal) {
            if (Math.abs(this.dx) < this.maxSpeed) {
                this.dx += dx;
            }
        }
        if (this.orientation === orientations.vertical) {
            if (Math.abs(this.dy) < this.maxSpeed) {
                this.dy += dy;
            }
        }
    }

    move({ width, height }) {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0){
            this.x = 0;
            this.dx = 0;
        }
        if (this.x > width - this.width)
        {
            this.x = width - this.width;
            this.dx = 0;
        }
        if (this.y < 0){
            this.y = 0;
            this.dy = 0;
        }
        if (this.y > height - this.height){
            this.y = height - this.height;
            this.dy = 0;
        }
    }

    pixels() {
        let pix = [];
        let x = this.x;
        let y = this.y;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                pix.push({ x, y });
                x++;
            }
            x = this.x;
            y++;
        }
        return pix;
    }
};
