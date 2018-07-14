const orientations = require('./orientations.js');

module.exports = class Ball {
  constructor({id, x, y, dx = 1, dy = 1 }) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
  }

  move(bats){

    const collidingBats = bats.filter(b => this.collidesWith(b.pixels()));
    if (collidingBats.some(b => b)){
      if(collidingBats.some(b => b.orientation == orientations.horizontal)){
        this.dy *= -1;
      }
      if(collidingBats.some(b => b.orientation == orientations.vertical)){
        this.dx *= -1;
      }
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  collidesWith(pixels){
      const nextX = this.x + this.dx;
      const nextY = this.y + this.dy;
    return pixels.map(p => p.x).includes(nextX)
  && pixels.map(p => p.y).includes(nextY);
  }

  pixels(){
    return [{x: this.x, y: this.y}];
  }
}
