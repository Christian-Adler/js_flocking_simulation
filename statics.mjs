let alignmentFactor = 1;
let cohesionFactor = 1;
let separationFactor = 1;

const setAlignmentFactor = (val) => {
  alignmentFactor = val / 100;
};
const getAlignmentFactor = () => {
  return alignmentFactor;
};
const setSeparationFactor = (val) => {
  separationFactor = val / 100;
};
const getSeparationFactor = () => {
  return separationFactor;
};
const setCohesionFactor = (val) => {
  cohesionFactor = val / 100;
};
const getCohesionFactor = () => {
  return cohesionFactor;
};

export {
  setAlignmentFactor, getAlignmentFactor,
  setSeparationFactor, getSeparationFactor,
  setCohesionFactor, getCohesionFactor
};