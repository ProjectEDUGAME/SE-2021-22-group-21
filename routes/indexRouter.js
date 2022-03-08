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
  res.render('index.html', { message:req.flash('message')});
});


router.post('/', async function(req,res){
  let schoolString = req.body.schoolString;
  const doc = await SchoolModel.findOne({string: schoolString});
  if (doc){
    // req.flash('message', "School String is correct! please continue enter ID now.")
    res.redirect("/user/login/"+schoolString)
  }else{
    req.flash('message', "Invalid input, please try again! ")
    res.render('index.html', { title: 'Express', message:req.flash('message')});
  }
});

// router.get('/user/login/:string', async function(req, res, next) {
//
//   let schoolString = req.params["string"];
//   const doc = await SchoolModel.findOne({string: schoolString});
//   if (doc){
//     res.render('participantDetails.html', { title: 'Express', doc:doc});
//   }else{
//     req.flash('message', "Invalid input, please try again! ")
//     res.redirect("/")
//   }
//
// });
//
//
// router.post('/user/login/:string', async function(req, res, next) {
//   let schoolString = req.params["string"];
//   const doc = await SchoolModel.findOne({string: schoolString});
//   console.log(doc);
//   if (doc){
//         let idstring = req.body.idstring;
//         // if contains specific ids
//
//         if (doc.ids.includes(parseInt(idstring))){
//           const userId = await User.findOne({user: idstring})
//           if (userId){
//             req.flash('message', "Sorry, this ID is in use!")
//           }else{
//             // doc.ids.push(parseInt(idstring));
//             // await doc.save();
//             newUser = new User({user: idstring, school: schoolString, wallColour: "0", bell: 0})
//             await newUser.save();
//             return res.redirect("/user/tutorial")
//           }
//         }else{
//           req.flash('message', "Invalid input, please try again!")
//         }
//         res.render('participantDetails.html', { title: 'Express', message:req.flash('message'), doc:doc});
//   }else{
//     req.flash('message', "Invalid input, please try again! ")
//     res.redirect("/")
//   }
// });
//
//
// // router.get('/user/logout', function (req,res) {
// //   res.redirect("/");
// // })

router.get("/register", function(req, res) {
  res.render("register.html", {message:req.flash('message')});
})

router.post('/register', function(req, res) {
  if(!req.body.username || !req.body.password || !req.body.password2 || !req.body.email) {
    req.flash('message', "please fill all field ")
    res.render("register.html", {message:req.flash('message')});
  }

  if(req.body.password2 !== req.body.password) {
    req.flash('message', "password not match ")
    res.render("register.html", {message:req.flash('message')});
  }

  User.register({email: req.body.email, username: req.body.username}, req.body.password, function (err, user) {
    if (err) {
      req.flash('message',  err)
      res.render("register.html", {message:req.flash('message')});
    } else {
      req.flash('message', "Your account has been saved and you can login now.")
      res.redirect("/login")
    }
  });
});

router.get("/login", function(req, res) {
  res.render("login.html", {message:req.flash('message')});
})



router.post("/login", function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      req.flash('message', err)
      res.render("login.html", {message: req.flash('message')});
    }else{
      if (!user) {
        req.flash('message', "User not Found")
        res.render("login.html", {message: req.flash('message')});
      }else{
        req.login(user, function (err) {
          if (err) {
            req.flash('message', err)
            res.render("login.html", {message: req.flash('message')});
          }
          req.flash('message', "login successful!");
          res.redirect("/")

        })
      }
    }
  })(req,res);
});





module.exports = router;
