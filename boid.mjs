import {Vector} from "./vector.mjs";

let idProvider = 0;

class Boid {
  constructor(worldWidth, worldHeight) {
    this.id = ++idProvider;
    // this.position = new Vector(0, 0);
    this.position = new Vector((Math.random()) * worldWidth, (Math.random()) * worldHeight);
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

  update(worldWidth, worldHeight) {
    this.position.addVec(this.velocity);
    this.velocity.addVec(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    this.edges(worldWidth, worldHeight);
  }

  edges(worldWidth, worldHeight) {
    if (this.position.x > worldWidth)
      this.position.x = 0;
    else if (this.position.x < 0)
      this.position.x = worldWidth;

    if (this.position.y > worldHeight)
      this.position.y = 0;
    else if (this.position.y < 0)
      this.position.y = worldHeight;
  }

  draw(ctx) {
    // ctx.beginPath();
    // ctx.moveTo(this.position.x, this.position.y);
    // const target = this.position.clone().addVec(this.velocity.clone().mult(4));
    // ctx.lineTo(target.x, target.y);
    // // ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
    // // ctx.fill();
    // ctx.stroke();

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.velocity.toRadians() - Math.PI / 2);

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-5, 0);
    // const target = this.velocity.clone().mult(4);
    ctx.lineTo(0, 20);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, -5);
    ctx.lineTo(5, -15);
    ctx.lineTo(-5, -15);
    ctx.lineTo(0, -5);
    ctx.stroke();
    ctx.restore();
  }
}

export {Boid};