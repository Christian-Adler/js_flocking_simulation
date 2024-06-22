class Obstacle {
  static  obstacles = [];
  static step = 0;

  constructor(position, r) {
    this.position = position;
    this.r = r;
    Obstacle.obstacles.push(this);
  }

  draw(ctx, counter) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    // ctx.stroke();
    ctx.fill();

    for (let i = 1; i < 3; i++) {
      const addX = Math.sin(Obstacle.step * 3 + counter + i) * 5;
      const addY = Math.cos(Obstacle.step * 5 + counter) * 5;
      ctx.beginPath();
      ctx.arc(addX, addY, this.r - this.r / (i + 1), 0, Math.PI * 2);
      // ctx.stroke();
      ctx.fill();
    }
    ctx.restore();
  }

  static draw(ctx) {

    Obstacle.step += 0.003;
    if (Obstacle.step > 15 * Math.PI)
      Obstacle.step = 0;

    let counter = 0;
    for (const obstacle of Obstacle.obstacles) {
      counter++;
      obstacle.draw(ctx, counter);
    }
  }
}

export {Obstacle};