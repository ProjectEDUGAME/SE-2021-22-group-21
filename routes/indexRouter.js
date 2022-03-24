const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect("/user/index")
});

router.get('/user/login', function(req, res, next) {
  res.redirect("/user/index")
});


module.exports = router;
