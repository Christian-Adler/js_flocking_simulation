import {Boid} from "./boid.mjs";

class Flock {

  constructor(n, worldWidth, worldHeight) {
    this.flock = [];
    this.matureBoids = [];
    this.deadBoids = [];
    for (let i = 0; i < n; i++) {
      this.flock.push(new Boid(worldWidth, worldHeight, this));
    }
  }

  addMatureBoid(boid) {
    this.matureBoids.push(boid);
  }

  addDeadBoid(boid) {
    this.deadBoids.push(boid);
  }

  update(worldWidth, worldHeight) {
    for (const matureBoid of this.matureBoids) {
      const idx = this.flock.findIndex(b => b.id === matureBoid.id);
      if (idx >= 0) {
        this.flock.splice(idx, 1);
        this.flock.push(new Boid(worldWidth, worldHeight, this, matureBoid.position.clone()));
        this.flock.push(new Boid(worldWidth, worldHeight, this, matureBoid.position.clone()));
      }
    }
    for (const deadBoid of this.deadBoids) {
      const idx = this.flock.findIndex(b => b.id === deadBoid.id);
      if (idx >= 0) {
        this.flock.splice(idx, 1);
      }
    }

    for (const boid of this.flock) {
      boid.flock(this.flock);
    }
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