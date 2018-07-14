const orientations = require('./orientations.js');

module.exports = class Bat {
  constructor({id, x, y, orientation = orientations.vertical }) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.height = orientation === orientations.horizontal ? 1 : 5;
      this.width = orientation === orientations.vertical ? 1 : 10;
      this.orientation = orientation;
  }

  isAlive(){
    return this.x > 0 && this.y > 0
  }

  move(dx, dy){
    if (this.orientation === orientations.horizontal){
      this.x += dx;
    }
    if (this.orientation === orientations.vertical){
      this.y += dy;
    }
  }

  pixels(){
    let pix = [];
    let x = this.x;
    let y = this.y;
    for(let i = 0; i < this.height; i++){
      for (let j = 0; j < this.width; j++){
        pix.push({x, y});
        x++;
      }
      x = this.x;
      y++;
    }
    return pix;
  }
}
