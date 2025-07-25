let route = require('express').Router();
const { Path,State } = require('../controller/solve');

route.post("/path", Path);
route.post("/state" , State);

module.exports = route;