import {Vector} from "./vector.mjs";
import {Obstacle} from "./obstacle.mjs";

let idProvider = 0;

class BoidBase {
  constructor() {
    this.id = ++idProvider;
    this.position = null;
    this.velocity = Vector.fromAngle(Math.random() * (2 * Math.PI)).mult(Math.random());
    this.acceleration = new Vector(0, 0);
    this.perceptionRadius = 50;
    this.maxForce = 0.2;
    this.maxSpeed = 4;

    this.obstacleCount = 0;
  }

  calcObstacleAvoidance() {
    const obstacleAvoidance = Vector.zero();
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
    return obstacleAvoidance;
  }

  calcAvoidance(toAvoidPositions) {
    const posAvoidance = Vector.zero();
    this.obstacleCount = 0;
    for (const otherPos of toAvoidPositions) {
      const distance = this.position.distance(otherPos);
      if (distance < this.perceptionRadius) {
        const diff = this.position.clone().subVec(otherPos);
        diff.mult(1 / this.perceptionRadius);
        posAvoidance.addVec(diff);
      }
    }
    return posAvoidance;
  }

  avoidObstacle(obstacleAvoidance) {
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
}

export {BoidBase}