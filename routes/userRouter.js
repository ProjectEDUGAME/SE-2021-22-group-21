var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/tutorial/', function(req, res, next) {
  res.render('tutorial.html', { title: 'Express' });
});

module.exports = router;
