var express = require('express');
var router = express.Router();
var auth = require("../auth")
const User = require("../models/userModel");
const passport = require("passport");

/* GET users listing. */
router.get('/', auth.loginRequired, function(req, res, next) {
  res.render('userHome.html',  {message:req.flash('message')});
});

router.get('/tutorial', auth.loginRequired,function(req, res, next) {
  var user = req.user;
  user.initialized = 1;
  user.save();
  res.render('tutorial.html', { title: 'Express' });
});

router.get('/classroom', auth.loginRequired,function(req, res, next) {
  var color = req.user.wallColour;
  var bell = req.user.bell;
  // if (!color){
  //   color = "green";
  // }

  if (color){ // && bell
    res.render('classroom.html', { title: 'Express' , message:req.flash('message'), color:color, done: "true"});
  }
  else{
    color = "green";
    res.render('classroom.html', { title: 'Express' , message:req.flash('message'), color:color});
  }
  
});

router.get('/checkDone', auth.loginRequired,function(req, res, next) {
  var color = req.user.wallColour;
  var bell = req.user.bell;
  if (color && bell){
    res.render('endpage.html', { title: 'Express' });
  }
  else{
    res.redirect("/user/classroom");
  }
});

router.get('/endpage', auth.loginRequired,function(req, res, next) {
  res.render('endpage.html', { title: 'Express' });
});

router.get('/wallcolour', auth.loginRequired,function(req, res, next) {
  res.render('wallColour.html', { title: 'Express' });
});

router.post('/wallcolour', auth.loginRequired,function(req, res, next) {
  var colour = req.body.options;
  var user = req.user;
  user.wallColour = colour;
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

router.get('/chatter', auth.loginRequired,function(req, res, next) {
  res.render('chatter.html', { title: 'Express' });
});

router.post('/bell', auth.loginRequired,function(req, res, next) {
  var bell = req.body.options;
  var user = req.user;
  user.bell = bell;
  user.save(function (err) {
    if(err){
      req.flash("meesage", err);
      res.redirect("/user/bell");
    }
    res.redirect("/user/classroom");
  })
});

router.get('/login', async function(req, res, next) {
  res.render('userLogin.html', { message: req.flash("message")});
});


router.post('/login',  function(req, res, next) {
    User.findOne({username:req.body.username}).populate("school").exec(function (err, user) {
        if (err){
          req.flash("message", err)
          res.render('userLogin.html', { message: req.flash("message")});
        }
        if (!user){
          req.flash("message", "User Not Found")
          res.render('userLogin.html', { message: req.flash("message")});
        }else{
          if (user.school.accessString === req.body.schoolstring ){
            req.flash("message", "Login Successfully!")
            req.login(user, function (err) {
              if (err) {
                req.flash('message', err)
                res.render("userLogin.html", {message: req.flash('message')});
              }
              req.flash('message', "login successful!");
              res.redirect("/user/tutorial")

            })
          }else{
            req.flash("message", "Login Failed! School Not Matched")
            res.redirect("/user/login")
          }

        }
    })
});



router.get('/logout', function (req,res) {
  req.logout();
  res.redirect("/user/login");
})



module.exports = router;
