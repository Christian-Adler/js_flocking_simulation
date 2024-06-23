import {Vector} from "./vector.mjs";
import {Obstacle} from "./obstacle.mjs";
import {BoidBase} from "./boidbase.mjs";

class Predator extends BoidBase {
  static predators = [];
  static  predatorCountSpan;

  constructor(worldWidth, worldHeight, optStartPos) {
    super();
    this.maxSpeed = 4.5;
    this.foodPerceptionRadius = 150;
    this.foodEatRadius = 30;
    this.position = optStartPos;

    while (!this.position) {
      this.position = new Vector((Math.random()) * worldWidth, (Math.random()) * worldHeight);

      for (const obstacle of Obstacle.obstacles) {
        const distance = this.position.distance(obstacle.position);
        if (distance < obstacle.r) {
          this.position = null;
          break;
        }
      }
    }
    Predator.predators.push(this);

    this.foodIntervalLength = 10 * 1000;
    this.foodActIntervalStart = Date.now();
    this.foodActIntervalStart -= this.foodActIntervalStart % this.foodIntervalLength;
    this.foodActIntervalStart += this.foodIntervalLength;
    this.foodCount = 0;
    this.foodRate = 0;

    if (!Predator.predatorCountSpan)
      Predator.predatorCountSpan = document.getElementById("predatorCount");
    Predator.updatePredatorCount(worldWidth, worldHeight);
  }

  static updatePredatorCount(worldWidth, worldHeight) {
    let amount = Predator.predators.length;
    Predator.predatorCountSpan.innerText = 'Predators: ' + amount;
    if (amount === 0) {
      new Predator(worldWidth, worldHeight);
      this.updateBoidCount(worldWidth, worldHeight);
    }
  }

  searchFood(flock) {

    let oldestBoid = null;
    // let minDist = Number.MIN_VALUE

    // Find oldest boid reachable
    for (const boid of flock.flock) {
      const distance = this.position.distance(boid.position);
      if (distance < this.foodEatRadius) {
        flock.addDeadBoid(boid);
        this.foodCount++;
        // oldestBoid = null;
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

    const now = Date.now();
    const actInterval = now - now % this.foodIntervalLength;
    if (actInterval > this.foodActIntervalStart) {
      this.foodRate = this.foodCount / this.foodIntervalLength;
      this.foodCount = 0;
      this.foodActIntervalStart = actInterval;
      // console.log(this.foodRate);

      if (this.foodRate > 0.003) {
        new Predator(worldWidth, worldHeight, this.position.clone());
      } else if (this.foodRate < 0.001 && Predator.predators.length > 1) {
        const idx = Predator.predators.findIndex(p => p.id === this.id);
        Predator.predators.splice(idx, 1);
      }
      Predator.updatePredatorCount(worldWidth, worldHeight);
    }

    if (this.acceleration.isZero())
      this.velocity.mult(1.05);
    else
      this.velocity.addVec(this.acceleration);
    let speedLimit = this.maxSpeed;
    if (this.foodRate > 0) {
      speedLimit += (this.foodRate - 0.003) * 1000;
      if (speedLimit > this.maxSpeed * 1.5) speedLimit = this.maxSpeed * 1.5;
    }
    this.velocity.limit(speedLimit);
    this.acceleration.mult(0); // reset
    this.edges(worldWidth, worldHeight);
  }


  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.velocity.toRadians() - Math.PI / 2);

    // turn speed to color
    let style = 'hsl(' + 0 + ' 100% 50% / ' + (100) + '%)';
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

    style = 'hsl(' + this.foodRate * 10000 + ' 100% 50% / ' + (100) + '%)';
    ctx.strokeStyle = style;
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.moveTo(-6, 17);
    ctx.lineTo(0, 30);
    ctx.lineTo(6, 17);
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