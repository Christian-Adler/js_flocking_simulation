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

  alignAndCohesionAndSeparation(boids) {
    let total = 0;

    const alignment = Vector.zero();
    const cohesion = Vector.zero();
    const separation = Vector.zero();

    for (const other of boids) {
      if (other.id === this.id) continue;
      const distance = this.position.distance(other.position);
      if (distance < this.perceptionRadius) {
        alignment.addVec(other.velocity);

        cohesion.addVec(other.position);

        const diff = this.position.clone().subVec(other.position);
        diff.mult(1 / distance);
        separation.addVec(diff);

        total++;
      }
    }
    if (total > 0) {
      alignment.mult(1 / total);
      alignment.setLength(this.maxSpeed);
      alignment.subVec(this.velocity);
      alignment.limit(this.maxForce);

      cohesion.mult(1 / total);
      cohesion.subVec(this.position);
      cohesion.setLength(this.maxSpeed);
      cohesion.subVec(this.velocity);
      cohesion.limit(this.maxForce);

      separation.setLength(this.maxSpeed);
      separation.subVec(this.velocity);
      separation.limit(this.maxForce);
    }
    return {alignment, cohesion, separation};
  }

  flock(boids) {
    const {alignment, cohesion, separation} = this.alignAndCohesionAndSeparation(boids);
    // this.acceleration = alignment;
    // this.acceleration = lerpVec(this.acceleration, alignment, 0.1);
    // this.acceleration = lerpVec(this.acceleration, cohesion, 0.1);
    // this.acceleration = lerpVec(this.acceleration, alignment.addVec(cohesion), 0.1);
    this.acceleration.addVec(alignment);
    this.acceleration.addVec(cohesion);
    this.acceleration.addVec(separation);
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