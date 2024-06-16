import {Boid} from "./boid.mjs";

class Flock {
  constructor(n) {
    this.flock = [];
    for (let i = 0; i < n; i++) {
      this.flock.push(new Boid());
    }
  }

  update(worldWidth2, worldHeight2) {
    for (const boid of this.flock) {
      boid.flock(this.flock);
    }
    for (const boid of this.flock) {
      boid.update(worldWidth2, worldHeight2);
    }
  }

  draw(ctx) {
    for (const boid of this.flock) {
      boid.draw(ctx);
    }
  }
}

export {Flock};