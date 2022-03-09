var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var database =  require("../data.json");
const adminController =  require("../controllers/adminController.js");
const {render} = require("nunjucks");
// Access the userModel.js and school.js files
const User = require("../models/userModel")
const School = require("../models/schoolModel")
const {Parser} = require("json2csv");
const bcrypt = require("bcrypt");
const { find } = require('../models/userModel');

const auth = require("../auth")
const passport = require("passport");

// loads admin home page
router.get('/home', auth.adminLoginRequired, function(req, res, next) {
    res.render("admin.html", {user:req.user, message:req.flash("message")});
});

// loads download data page
router.get("/download", auth.adminLoginRequired,  async function (req, res) {
    var schools = await School.find({});


    res.render("downloadData.html", {schools: schools})
});

//finds and downloads data
router.post("/download", auth.adminLoginRequired,  adminController.downloadInstitute);


// load change admin string page
router.get("/passwordChange", auth.adminLoginRequired,  async function (req, res) {
    res.render("passwordChange.html", {message:req.flash('message')});
});

// changes admin string
router.post("/passwordChange",  auth.adminLoginRequired, async function (req, res) {
    await req.user.setPassword(req.body.password);
    await req.user.save();
    req.flash("message", "Password Updated")
    res.render("passwordChange.html", {message:req.flash('message')});
});



// load generate institute string page
router.get('/inst', auth.adminLoginRequired,  function(req, res, next) {
    res.render("generateInstituteString.html", {message:req.flash('message')});
});

// Generates new institute
router.post("/inst", auth.adminLoginRequired,  adminController.generateInstitute);



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
            res.redirect("/admin/login")
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
                req.flash('message', "Invalid Username or password")
                res.render("login.html", {message: req.flash('message')});
            }else{
                req.login(user, function (err) {
                    if (err) {
                        req.flash('message', err)
                        res.render("login.html", {message: req.flash('message')});
                    }
                    req.flash('message', "login successful!");
                    res.redirect("/admin/home")

                })
            }
        }
    })(req,res);
});



// Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("message", "logout successfully!")
    res.redirect("/admin/login");
});



module.exports = router;
