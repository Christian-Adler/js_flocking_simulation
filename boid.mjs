import {Vector} from "./vector.mjs";
import {getAlignmentFactor, getCohesionFactor, getSeparationFactor} from "./statics.mjs";
import {Obstacle} from "./obstacle.mjs";
import {Food} from "./food.mjs";
import {BoidBase} from "./boidbase.mjs";
import {Predator} from "./predator.mjs";


class Boid extends BoidBase {
  constructor(worldWidth, worldHeight, ownFlock, optStartPos) {
    super();
    this.ownFlock = ownFlock;
    this.position = optStartPos;

    if (!optStartPos) {
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
    }


    this.maxSize = 4;
    this.size = 1;

    this.maxAge = 10000;
    this.birthAge = -2000;
    this.age = this.birthAge;
  }

  alignAndCohesionAndSeparation(boids) {
    let total = 0;

    const alignment = Vector.zero();
    const cohesion = Vector.zero();
    const separation = Vector.zero();
    const obstacleAvoidance = this.calcObstacleAvoidance();
    const predatorAvoidance = this.calcAvoidance(Predator.predators.map(p => p.position.clone()));
    const foodDirection = Vector.zero();

    for (const other of boids) {
      if (other.id === this.id) continue;
      const distance = this.position.distance(other.position);
      if (distance > 0 && distance < this.perceptionRadius) {
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


    let shortestDistance = Number.MAX_SAFE_INTEGER;
    let nearestFood = null;
    for (const food of Food.foods) {
      const distance = this.position.distance(food.position);
      if (distance < this.perceptionRadius && distance < shortestDistance) {
        nearestFood = food;
        shortestDistance = distance;
      }
    }
    if (nearestFood) {
      const diff = nearestFood.position.clone().subVec(this.position);
      diff.mult(1 / this.perceptionRadius);
      foodDirection.addVec(diff);
    }

    return {alignment, cohesion, separation, obstacleAvoidance, predatorAvoidance, foodDirection};
  }

  flock(boids) {
    const {
      alignment,
      cohesion,
      separation,
      obstacleAvoidance, predatorAvoidance,
      foodDirection
    } = this.alignAndCohesionAndSeparation(boids);

    this.acceleration.addVec(alignment.mult(getAlignmentFactor()));
    this.acceleration.addVec(cohesion.mult(getCohesionFactor()));
    this.acceleration.addVec(separation.mult(getSeparationFactor()));
    this.acceleration.addVec(predatorAvoidance);
    if (!foodDirection.isZero()) {
      // Reduce so far acc to force food direction
      this.acceleration = this.velocity.clone().mult(-0.1);
      this.acceleration.addVec(foodDirection);
    }

    this.avoidObstacle(obstacleAvoidance);
  }


  checkForFood(worldWidth, worldHeight) {
    for (let i = 0; i < Food.foods.length; i++) {
      const food = Food.foods[i];
      const distance = this.position.distance(food.position);
      if (distance < 5) {
        if (this.size < this.maxSize)
          this.size += 0.5;
        else
          this.ownFlock.addMatureBoid(this);

        if (this.age > 0) // reset age
          this.age = 0;
        food.origin = Food.findRandomPos(worldWidth, worldHeight);
        break;
      }
    }
  }

  update(worldWidth, worldHeight) {
    this.position.addVec(this.velocity);

    if (this.age < this.maxAge)
      this.age++;
    else
      this.ownFlock.addDeadBoid(this);

    this.checkForFood(worldWidth, worldHeight);

    if (this.acceleration.isZero())
      this.velocity.mult(1.05);
    else
      this.velocity.addVec(this.acceleration);
    let velocityLimit = this.maxSpeed - (this.maxSpeed - 0.1) / this.maxAge * Math.max(0, this.age);
    if (this.obstacleCount > 0)
      velocityLimit /= this.obstacleCount;
    this.velocity.limit(velocityLimit);
    this.acceleration.mult(0); // reset
    this.edges(worldWidth, worldHeight);
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
    ctx.lineWidth = this.size;

    let ageSizeFactor = 1;
    if (this.age < 0) {
      ageSizeFactor += this.age / (this.birthAge * -2);
    }

    ctx.beginPath();
    ctx.arc(0, 0, 5 * ageSizeFactor, Math.PI, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5 * ageSizeFactor, 0);
    ctx.lineTo(0, 20 * ageSizeFactor);
    ctx.lineTo(5 * ageSizeFactor, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -5 * ageSizeFactor);
    ctx.lineTo(5 * ageSizeFactor, -15 * ageSizeFactor);
    ctx.lineTo(-5 * ageSizeFactor, -15 * ageSizeFactor);
    ctx.lineTo(0, -5 * ageSizeFactor);
    ctx.stroke();
    ctx.restore();
  }
}

export {Boid};