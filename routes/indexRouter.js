const express = require('express');
const SchoolModel = require("../models/schoolModel");
const User = require("../models/userModel")
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' ,message:req.flash('message')});
});


router.post('/', async function(req,res){
  let schoolString = req.body.schoolString;
  const doc = await SchoolModel.findOne({string: schoolString});
  if (doc){
    req.flash('message', "School String is correct! please continue enter ID now.")
    res.redirect("/user/login/"+schoolString)
  }else{
    req.flash('message', "Invalid input, please try again! ")
    res.render('index.html', { title: 'Express', message:req.flash('message')});
  }
});

router.get('/user/login/:string', async function(req, res, next) {

  let schoolString = req.params["string"];
  const doc = await SchoolModel.findOne({string: schoolString});
  if (doc){
    res.render('participantDetails.html', { title: 'Express', message:req.flash('message'), doc:doc});
  }else{
    req.flash('message', "Invalid input, please try again! ")
    res.redirect("/")
  }

});


router.post('/user/login/:string', async function(req, res, next) {
  let schoolString = req.params["string"];
  const doc = await SchoolModel.findOne({string: schoolString});
  console.log(doc);
  if (doc){
        let idstring = req.body.idstring;
        // if contains specific ids

        if (doc.ids.includes(parseInt(idstring))){
          const userId = await User.findOne({user: idstring})
          if (userId){
            req.flash('message', "Sorry, this ID is in use!")
          }else{
            // doc.ids.push(parseInt(idstring));
            // await doc.save();
            newUser = new User({user: idstring, school: schoolString, wallColour: "0", bell: 0})
            await newUser.save();
            return res.redirect("/user/tutorial")
          }
        }else{
          req.flash('message', "Invalid input, please try again!")
        }
        res.render('participantDetails.html', { title: 'Express', message:req.flash('message'), doc:doc});
  }else{
    req.flash('message', "Invalid input, please try again! ")
    res.redirect("/")
  }
});


module.exports = router;
