var express = require('express');
var router = express.Router();
// Access the data.js and school.js files
const User = require("../models/data")
const School = require("../models/schools")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

