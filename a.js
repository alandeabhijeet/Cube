const Cube = require('./3X3/index');
Cube.initSolver();
let cube = new Cube();
cube.move("R' L'");
const solutio = cube.solve();
console.log("Solution Moves:", solutio);
const stateString = cube.asString();
console.log("stateString",stateString)
const newCube = Cube.fromString(stateString);

console.log(stateString.length)
const solution = newCube.solve();
console.log("Solution Moves:", solution);
