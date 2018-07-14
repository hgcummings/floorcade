module.exports = class Bat {
  constructor({id, x, y}) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.height = 5;
  }

  isAlive(){
    return this.x > 0 && this.y > 0
  }

  pixels(){
    let pix = [];
    let x = this.x;
    let y = this.y;
    for(let i = 0; i < this.height; i++){
      pix.push({x, y});
      y++;
    }
    return pix;
  }
}
