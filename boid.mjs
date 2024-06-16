import {Vector} from "./vector.mjs";

let idProvider = 0;

class Boid {
  constructor() {
    this.id = ++idProvider;
    // this.position = new Vector(0, 0);
    this.position = new Vector((Math.random() - 0.5) * 500, (Math.random() - 0.5) * 500);
    this.velocity = Vector.fromAngle(Math.random() * (2 * Math.PI)).mult(Math.random());
    this.acceleration = new Vector(0, 0);
    this.perceptionRadius = 50;
  }

  align(boids) {
    let total = 0;
    let steering = Vector.zero();
    for (const other of boids) {
      if (other.id === this.id) continue;
      if (this.position.distance(other.position) < this.perceptionRadius) {
        steering.addVec(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.mult(1 / total);
      steering.subVec(this.velocity);
    }
    return steering;
  }

  flock(boids) {
    const alignment = this.align(boids);
    this.acceleration = alignment;
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