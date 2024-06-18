import {Flock} from "./flock.mjs";
import {setAlignmentFactor, setCohesionFactor, setSeparationFactor} from "./statics.mjs";

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

const flock = new Flock(100, worldWidth, worldHeight);


const update = () => {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  if (worldUpdated) {
    worldUpdated = false;
  }
  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();
  flock.update(worldWidth, worldHeight);
  flock.draw(ctx);

  ctx.restore();

  updateWorldSettings();

  requestAnimationFrame(update);
}

update();

const settings = [
  {id: 'rangeAlignment', setter: setAlignmentFactor},
  {id: 'rangeCohesion', setter: setCohesionFactor},
  {id: 'rangeSeparation', setter: setSeparationFactor},
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