var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/user/login/', function(req, res, next) {
  res.render('participantDetails.html', { title: 'Express' });
});

module.exports = router;
