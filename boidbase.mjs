import {Vector} from "./vector.mjs";

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