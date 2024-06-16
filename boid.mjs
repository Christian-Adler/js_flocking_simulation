import {Vector} from "./vector.mjs";

class Boid {
  constructor() {
    this.position = new Vector(0, 0);
    this.velocity = Vector.fromAngle(Math.random() * (2 * Math.PI)).mult(Math.random() - 0.5);
    this.acceleration = new Vector(0, 0);
  }

  update() {
    this.position.addVec(this.velocity);
    this.velocity.addVec(this.acceleration);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

export {Boid};