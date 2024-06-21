class Obstacle {
  static  obstacles = [];

  constructor(position, r) {
    this.position = position;
    this.r = r;
    Obstacle.obstacles.push(this);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = 'rgba(64,64,64,0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    // ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  static draw(ctx) {
    for (const obstacle of Obstacle.obstacles) {
      obstacle.draw(ctx);
    }
  }
}

export {Obstacle};