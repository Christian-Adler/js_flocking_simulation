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
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }

  alignAndCohesion(boids) {
    let total = 0;
    const steering = Vector.zero();
    const targetLocation = Vector.zero();
    for (const other of boids) {
      if (other.id === this.id) continue;
      if (this.position.distance(other.position) < this.perceptionRadius) {
        steering.addVec(other.velocity);
        targetLocation.addVec(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.mult(1 / total);
      steering.setLength(this.maxSpeed);
      steering.subVec(this.velocity);
      steering.limit(this.maxForce);

      targetLocation.mult(1 / total);
      targetLocation.subVec(this.position);
      targetLocation.setLength(this.maxSpeed);
      targetLocation.subVec(this.velocity);
      targetLocation.limit(this.maxForce);
    }
    return {steering, targetLocation};
  }

  flock(boids) {
    const {steering: alignment, targetLocation: cohesion} = this.alignAndCohesion(boids);
    // this.acceleration = alignment;
    // this.acceleration = lerpVec(this.acceleration, alignment, 0.1);
    // this.acceleration = lerpVec(this.acceleration, cohesion, 0.1);
    // this.acceleration = lerpVec(this.acceleration, alignment.addVec(cohesion), 0.1);
    this.acceleration.addVec(alignment.addVec(cohesion));
  }

  update(worldWidth2, worldHeight2) {
    this.position.addVec(this.velocity);
    this.velocity.addVec(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    this.edges(worldWidth2, worldHeight2);
  }

  edges(worldWidth2, worldHeight2) {
    if (this.position.x > worldWidth2)
      this.position.x = -worldWidth2;
    else if (this.position.x < -worldWidth2)
      this.position.x = worldWidth2;

    if (this.position.y > worldHeight2)
      this.position.y = -worldHeight2;
    else if (this.position.y < -worldHeight2)
      this.position.y = worldHeight2;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

export {Boid};