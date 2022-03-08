var express = require('express');
var router = express.Router();
var auth = require("../auth")
const User = require("../models/userModel");

/* GET users listing. */
router.get('/', auth.loginRequired, function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/tutorial', auth.loginRequired,function(req, res, next) {
  res.render('tutorial.html', { title: 'Express' });
});

router.get('/classroom', auth.loginRequired,function(req, res, next) {
  var color = req.user.wallColour;
  res.render('classroom.html', { title: 'Express' , message:req.flash('message'), color:color});
});

router.get('/wallcolour', auth.loginRequired,function(req, res, next) {
  res.render('wallColour.html', { title: 'Express' });
});


router.post('/wallcolour', auth.loginRequired,function(req, res, next) {
  var color = req.body.options;
  var user = req.user;
  user.wallColour = color;
  user.save(function (err) {
    if(err){
      req.flash("meesage", err);
      res.redirect("/user/wallcolour");
    }
    res.redirect("/user/classroom");
  })
});

router.get('/bell', auth.loginRequired,function(req, res, next) {
  res.render('bell.html', { title: 'Express' });
});

module.exports = router;
