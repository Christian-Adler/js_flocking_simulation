import {Vector} from "./vector.mjs";
import {getAlignmentFactor, getCohesionFactor, getSeparationFactor} from "./statics.mjs";
import {Obstacle} from "./obstacle.mjs";

let idProvider = 0;

class Boid {
  constructor(worldWidth, worldHeight) {
    this.id = ++idProvider;
    // this.position = new Vector(0, 0);

    let foundPos = false;
    let tryCount = 0;
    while (!foundPos && tryCount < 20) {
      foundPos = true;
      tryCount++;
      this.position = new Vector((Math.random()) * worldWidth, (Math.random()) * worldHeight);

      for (const obstacle of Obstacle.obstacles) {
        const distance = this.position.distance(obstacle.position);
        if (distance < obstacle.r) {
          foundPos = false;
          break;
        }
      }
    }

    this.velocity = Vector.fromAngle(Math.random() * (2 * Math.PI)).mult(Math.random());
    this.acceleration = new Vector(0, 0);
    this.perceptionRadius = 50;
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.obstacleCount = 0;

    this.size = 1;
  }

  alignAndCohesionAndSeparation(boids) {
    let total = 0;

    const alignment = Vector.zero();
    const cohesion = Vector.zero();
    const separation = Vector.zero();
    const obstacleAvoidance = Vector.zero();

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

    this.obstacleCount = 0;
    for (const obstacle of Obstacle.obstacles) {
      const distance = this.position.distance(obstacle.position);
      if (distance < this.perceptionRadius + obstacle.r) {
        const diff = this.position.clone().subVec(obstacle.position);
        diff.mult(1 / this.perceptionRadius);
        obstacleAvoidance.addVec(diff);
        this.obstacleCount++;
      }
    }

    return {alignment, cohesion, separation, obstacleAvoidance};
  }

  flock(boids) {
    const {alignment, cohesion, separation, obstacleAvoidance} = this.alignAndCohesionAndSeparation(boids);
    this.acceleration.addVec(alignment.mult(getAlignmentFactor()));
    this.acceleration.addVec(cohesion.mult(getCohesionFactor()));
    this.acceleration.addVec(separation.mult(getSeparationFactor()));

    // Remove direction to obstacle from vector
    // https://stackoverflow.com/questions/5060082/eliminating-a-direction-from-a-vector
    if (!this.velocity.isZero() && !obstacleAvoidance.isZero()) {
      const obstacleNormVec = obstacleAvoidance.normalize();
      const dotProductVal = this.velocity.clone().dotProduct(obstacleNormVec);
      const negVelocity = this.velocity.clone().subVec(obstacleNormVec.mult(dotProductVal));
      if (this.obstacleCount > 1)
        negVelocity.mult(this.obstacleCount);
      this.acceleration.addVec(negVelocity);
    }
  }

  update(worldWidth, worldHeight) {
    this.position.addVec(this.velocity);
    if (this.acceleration.isZero())
      this.velocity.mult(1.05);
    else
      this.velocity.addVec(this.acceleration);
    let velocityLimit = this.maxSpeed;
    if (this.obstacleCount > 0)
      velocityLimit /= this.obstacleCount;
    this.velocity.limit(velocityLimit);
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

    // turn speed to color
    const degVelocity = this.velocity.len() / this.maxSpeed * 270;
    const style = 'hsl(' + degVelocity + ' 100% 50% / ' + (80) + '%)';
    ctx.strokeStyle = style;
    ctx.fillStyle = style;

    ctx.beginPath();
    ctx.arc(0, 0, 5 * this.size, Math.PI, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5 * this.size, 0);
    ctx.lineTo(0, 20 * this.size);
    ctx.lineTo(5 * this.size, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -5 * this.size);
    ctx.lineTo(5 * this.size, -15 * this.size);
    ctx.lineTo(-5 * this.size, -15 * this.size);
    ctx.lineTo(0, -5 * this.size);
    ctx.stroke();
    ctx.restore();
  }
}

export {Boid};