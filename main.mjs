import {Flock} from "./flock.mjs";

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

const flock = new Flock(100);


const update = () => {
  ctx.fillStyle = "white";

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();
  ctx.translate(worldWidth2, worldHeight2);

  flock.update(worldWidth2, worldHeight2);
  flock.draw(ctx);

  ctx.restore();

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();
