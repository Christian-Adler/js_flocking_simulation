import {Vector} from "./vector.mjs";
import {Obstacle} from "./obstacle.mjs";
import {BoidBase} from "./boidbase.mjs";

class Predator extends BoidBase {
  static predators = [];

  constructor(worldWidth, worldHeight) {
    super();
    this.maxSpeed = 4.5;
    this.foodPerceptionRadius = 150;
    this.foodEatRadius = 30;
    this.position = null;
    while (true) {
      this.position = new Vector((Math.random()) * worldWidth, (Math.random()) * worldHeight);

      for (const obstacle of Obstacle.obstacles) {
        const distance = this.position.distance(obstacle.position);
        if (distance < obstacle.r) {
          this.position = null;
          break;
        }
      }
      if (this.position)
        break;
    }
    Predator.predators.push(this);
  }

  searchFood(flock) {

    let oldestBoid = null;
    // let minDist = Number.MIN_VALUE

    // Find oldest boid reachable
    for (const boid of flock.flock) {
      const distance = this.position.distance(boid.position);
      if (distance < this.foodEatRadius) {
        flock.addDeadBoid(boid);
        oldestBoid = null;
        // break;
      } else if (distance < this.foodPerceptionRadius) {
        if (!oldestBoid)
          oldestBoid = boid;
        else if (boid.age > oldestBoid.age)
            // else if (distance < minDist)
          oldestBoid = boid;
      }
    }

    if (oldestBoid) {
      const foodDirection = oldestBoid.position.clone().subVec(this.position);
      foodDirection.setLength(this.maxSpeed);
      foodDirection.subVec(this.velocity);
      foodDirection.limit(this.maxForce);
      this.acceleration.addVec(foodDirection);
    }

    const obstacleAvoidance = this.calcObstacleAvoidance();
    this.avoidObstacle(obstacleAvoidance);
  }

  update(worldWidth, worldHeight) {
    this.position.addVec(this.velocity);

    if (this.acceleration.isZero())
      this.velocity.mult(1.05);
    else
      this.velocity.addVec(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0); // reset
    this.edges(worldWidth, worldHeight);
  }


  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.velocity.toRadians() - Math.PI / 2);

    // turn speed to color
    const style = 'hsl(' + 0 + ' 100% 50% / ' + (100) + '%)';
    ctx.strokeStyle = style;
    ctx.fillStyle = style;
    ctx.lineWidth = 3;

    ctx.beginPath();
    for (let y = -1; y <= 1; y++) {
      ctx.moveTo(-15, y * 7);
      ctx.lineTo(0, 10 + y * 7);
      ctx.lineTo(15, y * 7);
    }
    ctx.moveTo(-10, 15);
    ctx.lineTo(0, 40);
    ctx.lineTo(10, 15);

    ctx.moveTo(-10, -10);
    ctx.lineTo(0, -20);
    ctx.lineTo(10, -10);

    ctx.moveTo(-10, -40);
    ctx.lineTo(0, -20);
    ctx.lineTo(10, -40);
    ctx.lineTo(0, -35);
    ctx.lineTo(-10, -40);

    ctx.stroke();

    ctx.restore();
  }


  static predatorsSearchFood(flock) {
    for (const pred of Predator.predators) {
      pred.searchFood(flock);
    }
  }

  static predatorsUpdate(worldWidth, worldHeight) {
    for (const pred of Predator.predators) {
      pred.update(worldWidth, worldHeight);
    }
  }

  static predatorsDraw(ctx) {
    for (const pred of Predator.predators) {
      pred.draw(ctx);
    }
  }
}

export {Predator}