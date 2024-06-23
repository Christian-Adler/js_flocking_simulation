import {Flock} from "./flock.mjs";
import {setAlignmentFactor, setCohesionFactor, setSeparationFactor} from "./statics.mjs";
import {Vector} from "./vector.mjs";
import {Obstacle} from "./obstacle.mjs";
import {Food} from "./food.mjs";
import {Predator} from "./predator.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let worldWidth = canvas.width;
let worldHeight = canvas.height;
let worldWidth2 = worldWidth / 2;
let worldHeight2 = worldHeight / 2;
let worldUpdated = true;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    worldWidth2 = worldWidth / 2;
    worldHeight2 = worldHeight / 2;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
    worldUpdated = true;
  }
};

updateWorldSettings();

const oR = 50;
for (let i = 0; i < Math.floor(worldWidth / 50); i++) {
  new Obstacle(new Vector((worldWidth - oR * 2) * Math.random() + oR, (worldHeight - oR * 2) * Math.random() + oR), oR / 2 + oR * Math.random());
}

const flock = new Flock(Math.floor(worldWidth / 10), worldWidth, worldHeight);

for (let i = 0; i < 10; i++) {
  const food = Food.createRandomFood(worldWidth, worldHeight);
  Food.foods.push(food);
}

new Predator(worldWidth, worldHeight);

const update = () => {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  flock.flocking(worldWidth, worldHeight);
  Predator.predatorsSearchFood(flock);

  flock.update(worldWidth, worldHeight);
  flock.draw(ctx);

  Predator.predatorsUpdate(worldWidth, worldHeight);
  Predator.predatorsDraw(ctx);

  ctx.fillStyle = 'rgba(64,64,64,0.2)';
  Obstacle.draw(ctx);

  ctx.strokeStyle = 'rgb(200,255,0)';
  Food.update();
  Food.draw(ctx);

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();

const settings = [
  {id: 'rangeAlignment', setter: setAlignmentFactor},
  {id: 'rangeCohesion', setter: setCohesionFactor},
  {id: 'rangeSeparation', setter: setSeparationFactor},
  {id: 'rangeFood', setter: Food.setFoodAmount},
];
for (const setting of settings) {
  const range = document.getElementById(setting.id);
  range.addEventListener("input", (evt) => {
    let val = range.value;
    evt.target.nextSibling.innerText = val;
    val = parseFloat(val);
    setting.setter(val);
  });
}

const switchInputs = document.querySelector('#switchInputs');
switchInputs.addEventListener('click', (e) => {
  e.target.parentNode.classList.toggle('min');
  const isMin = e.target.parentNode.classList.contains('min');
  if (isMin)
    e.target.innerHTML = '&gt;';
  else
    e.target.innerText = 'X';
});

// TODO follow a boid?