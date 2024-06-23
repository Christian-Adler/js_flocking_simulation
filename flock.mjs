import {Boid} from "./boid.mjs";
import {Vector} from "./vector.mjs";

class Flock {

  constructor(n, worldWidth, worldHeight) {
    this.flock = [];
    this.matureBoids = [];
    this.deadBoids = [];
    this.birthRate = 25;
    for (let i = 0; i < n; i++) {
      this.flock.push(new Boid(worldWidth, worldHeight, this));
    }
    this.boidCountSpan = document.getElementById("boidCount");
    this.updateBoidCount(worldWidth, worldHeight);
  }

  updateBoidCount(worldWidth, worldHeight) {
    let amount = this.flock.length;
    this.boidCountSpan.innerText = 'Boids: ' + amount;
    if (amount === 0) {
      for (let i = 0; i < this.birthRate * 2; i++) {
        this.flock.push(new Boid(worldWidth, worldHeight, this, new Vector(0, 0)));
      }
      this.updateBoidCount(worldWidth, worldHeight);
    }
  }

  addMatureBoid(boid) {
    this.matureBoids.push(boid);
  }

  addDeadBoid(boid) {
    this.deadBoids.push(boid);
  }

  flocking(worldWidth, worldHeight) {
    for (const matureBoid of this.matureBoids) {
      const idx = this.flock.findIndex(b => b.id === matureBoid.id);
      if (idx >= 0) {
        this.flock.splice(idx, 1);
        for (let i = 0; i < this.birthRate; i++) {
          this.flock.push(new Boid(worldWidth, worldHeight, this, matureBoid.position.clone()));
        }
      }
    }
    for (const deadBoid of this.deadBoids) {
      const idx = this.flock.findIndex(b => b.id === deadBoid.id);
      if (idx >= 0) {
        this.flock.splice(idx, 1);
      }
    }
    if (this.matureBoids.length > 0 || this.deadBoids.length > 0) {
      this.matureBoids = [];
      this.deadBoids = [];
      this.updateBoidCount(worldWidth, worldHeight);
    }

    for (const boid of this.flock) {
      boid.flock(this.flock);
    }
  }

  update(worldWidth, worldHeight) {
    for (const boid of this.flock) {
      boid.update(worldWidth, worldHeight);
    }
  }

  draw(ctx) {
    for (const boid of this.flock) {
      boid.draw(ctx);
    }
  }
}

export {Flock};