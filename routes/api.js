let route = require('express').Router();
const { Path,State } = require('../controller/api');

route.post("/path", Path);

module.exports = route;