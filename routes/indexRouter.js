const express = require('express');
const SchoolModel = require("../models/schoolModel");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' ,message:req.flash('message')});
});


router.post('/', async function(req,res){
  let schoolString = req.body.schoolString;
  const doc = await SchoolModel.findOne({string: schoolString});
  if (doc){
    req.flash('message', "School String is corrected! please continue enter ID now.")
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
          req.flash('message', "Sorry, this ID is in use!")
        }else{
          doc.ids.push(parseInt(idstring));
          await doc.save();
          req.flash('message', "ID has not been used and created succeed!")
        }
        res.render('participantDetails.html', { title: 'Express', message:req.flash('message'), doc:doc});
  }else{
    req.flash('message', "Invalid input, please try again! ")
    res.redirect("/")
  }
});


module.exports = router;
