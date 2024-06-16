import {Boid} from "./boid.mjs";

class Flock {
  constructor(n) {
    this.flock = [];
    for (let i = 0; i < n; i++) {
      this.flock.push(new Boid());
    }
  }

  update() {
    for (const boid of this.flock) {
      // boid.align(this.flock);
      boid.flock(this.flock);
      boid.update();
    }
  }

  draw(ctx) {
    for (const boid of this.flock) {
      boid.draw(ctx);
    }
  }
}

export {Flock};