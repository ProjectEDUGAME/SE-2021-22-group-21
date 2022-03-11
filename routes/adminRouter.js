var express = require('express');
var router = express.Router();
const adminController =  require("../controllers/adminController.js");
const User = require("../models/userModel")
const School = require("../models/schoolModel")
const auth = require("../auth")
const passport = require("passport");


// HOME page 
router.get('/home', auth.adminLoginRequired, function(req, res, next) {
    res.render("adminHome.html", {user:req.user, message:req.flash("message")});
});



// DOwNOAD DATA
router.get("/download", auth.adminLoginRequired,  async function (req, res) {
    var schools = await School.find({});
    schools.sort(function(a,b){ 
        var x = a.name.toLowerCase() < b.name.toLowerCase()? -1:1; 
        return x; 
    });
    res.render("adminDownloadData.html", {schools: schools})
});

router.post("/download", auth.adminLoginRequired,  adminController.downloadInstitute);



// ADMIN STRING (password) CHANGE
router.get("/passwordChange", auth.adminLoginRequired,  async function (req, res) {
    res.render("adminPasswordChange.html");
});

router.post("/passwordChange",  auth.adminLoginRequired, async function (req, res) {
    if (req.body.password.length >= 8){
        await req.user.setPassword(req.body.password);
        await req.user.save();
        req.flash("message", req.body.password)
        res.render("adminPasswordChange.html", {message:req.flash('message')});
    }
    else{
        res.render("adminPasswordChange.html", {message:"psw too short"})
    }
});



// GENERATE INSTITUTE STRING
router.get('/inst', auth.adminLoginRequired,  function(req, res, next) {
    res.render("adminGenerateInstString.html", {message:req.flash('message')});
});

router.post("/inst", auth.adminLoginRequired,  adminController.generateInstitute);



// LOGIN
router.get("/login", function(req, res) {
    res.render("adminLogin.html");
})

router.post("/login", function (req, res) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            req.flash('message', err)
            res.render("adminLogin.html", {message: req.flash('message')});
        }else{
            if (!user) {
                req.flash('message', "Invalid input, please try again! ")
                res.render("adminLogin.html", {message: req.flash('message')});
            }else{
                req.login(user, function (err) {
                    if (err) {
                        req.flash('message', err)
                        res.render("adminLogin.html", {message: req.flash('message')});
                    }
                    req.flash('message', "login successful!");
                    res.redirect("/admin/home")

                })
            }
        }
    })(req,res);
});



// LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("message", "logout successfully!")
    res.redirect("/admin/login");
});



module.exports = router;
