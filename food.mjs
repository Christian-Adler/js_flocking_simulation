import {Vector} from "./vector.mjs";
import {Obstacle} from "./obstacle.mjs";

class Food {
  static foods = [];
  static step = 0;

  constructor(position) {
    this.position = position;
    this.origin = position.clone();
    this.r = 3;
    Food.foods.push(this);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.stroke();
    // ctx.fill();
    ctx.restore();
  }

  static createRandomFood(worldWidth, worldHeight) {
    let position;
    let foundPos = false;
    let tryCount = 0;
    while (!foundPos && tryCount < 20) {
      foundPos = true;
      tryCount++;
      position = new Vector((Math.random()) * worldWidth, (Math.random()) * worldHeight);

      for (const obstacle of Obstacle.obstacles) {
        const distance = position.distance(obstacle.position);
        if (distance < obstacle.r + 50) {
          foundPos = false;
          break;
        }
      }
    }

    return new Food(position);
  }

  static foodCount() {
    return Food.foods.length;
  }

  static update() {
    Food.step += 0.003;
    if (Food.step > 15 * Math.PI)
      Food.step = 0;
    let counter = 0;
    for (const food of Food.foods) {
      counter++;
      const addX = Math.sin(Food.step * 3 + counter) * 5;
      const addY = Math.cos(Food.step * 5 + counter) * 5;
      food.position.x = food.origin.x + addX;
      food.position.y = food.origin.y + addY;
    }
  }

  static draw(ctx) {
    for (const food of Food.foods) {
      food.draw(ctx);
    }
  }
}

export {Food};