const express = require('express');
const SchoolModel = require("../models/schoolModel");
const User = require("../models/userModel")
const passport = require("passport");
const {errors} = require("passport-local-mongoose");
const router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index.html', { title: 'Express' ,message:req.flash('message')});
// });

router.get('/', function(req, res, next) {
  res.redirect("/user/index")
});






module.exports = router;
