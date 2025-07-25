const Cube = require('../3X3/index');
Cube.initSolver();

module.exports.Path = async (req, res) => {
    let path = req.body.path;
    let cube = new Cube();
    cube.move(path);
    const solution = cube.solve();
    res.status(200).json({
        message: "Solution Moves",
        solution: solution
    });
}

module.exports.State = async (req, res) => {
    let state = req.body.state;
    let cube = Cube.fromString(state);
    const solution = cube.solve();
    res.status(200).json({
        message: "Solution Moves",
        solution: solution
    });
}