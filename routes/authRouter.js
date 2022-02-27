const authController = require("../controllers/authController")
const express = require("express");
const router = express.Router();
const SchoolModel = require("../models/schoolModel");

router.get('/login', function(req, res, next) {
    res.render('authLogin.html', { title: 'Express', message:req.flash('message')});
});

router.post("/login", async function(req,res){
    let schoolString = req.body.schoolString;
    const doc = await SchoolModel.findOne({string: schoolString});
    if (doc){
        req.flash('message', "School String is corrected! please continue enter ID now.")
        res.redirect("/auth/login/"+schoolString)
    }else{
        req.flash('message', "School not Found! please enter string again. ")
        res.render('authLogin.html', { title: 'Express', message:req.flash('message')});
    }
});


router.get('/login/:string', async function(req, res, next) {
    let schoolString = req.params["string"];
    const doc = await SchoolModel.findOne({string: schoolString});
    if (doc){
        res.render('authLoginID.html', { title: 'Express', message:req.flash('message')});
    }else{
        req.flash('message', "School not Found! please enter string again. ")
        res.redirect("/auth/login")
    }
});


router.post('/login/:string', async function(req, res, next) {
    let schoolString = req.params["string"];
    const doc = await SchoolModel.findOne({string: schoolString});
    if (doc){
        let idstring = req.body.idstring;
        // if contains specific ids
        if (doc.ids.includes(parseInt(idstring))){
            req.flash('message', "Sorry, ID is in used!")
        }else{
            doc.ids.push(parseInt(idstring));
            await doc.save();
            req.flash('message', "ID has not been used and created succeed!")
        }
        res.render('authLoginID.html', { title: 'Express', message:req.flash('message')});
    }else{
        req.flash('message', "School not Found! please enter string again. ")
        res.redirect("/auth/login")
    }
});


module.exports = router;
