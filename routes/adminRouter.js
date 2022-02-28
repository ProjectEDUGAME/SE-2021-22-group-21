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



// loads admin home page
router.get('/home', function(req, res, next) {
    res.render("admin.html");
});

// load admin login page
router.get('/login', function(req, res, next) {
    res.render("adminLogin.html");
});


// Admin login functionality
router.post('/login', async(req, res) => {
    // get user input
    let adminstring = req.body.adminstring;
    // find users with adminstring
    const result = await School.find(
        {"string": adminstring}
    );//database.admins.filter(admin => admin.string ===  adminstring); 

    console.log(result.length);

    if (result.length > 0){    // if succeed, return to admin home page
        req.app.locals.isAdminLogin = true; // set global variables in app.js to true
        res.redirect("/admin/home");
    }
    else{ // if not, stay in the same page and display erross
        res.render("adminLogin.html", {invalidStr: "Invalid input, please try again!"});
    }
});


//logs out
router.get('/logout', function (req,res) {
    req.app.locals.isAdminLogin = false; // set global variables in app.js to true
    res.redirect("/admin/login");
})




// loads download data page
router.get("/download", async function (req, res) {
    res.render("downloadData.html")
});

//finds and downloads data
router.post("/download", adminController.downloadInstitute);


// OLD - need to migrate new one
router.get("/newstring", async function (req, res) {
    const string = uuidv4();
    let result = await adminController.generateNewString(string);

    if (!result.succeed){
        res.render("string.html", {message:result.message})
    }else{
        res.render("string.html", {string: string})
    }

});



// load generate institute string page
router.get('/inst', function(req, res, next) {
    res.render("generateInstituteString.html", {message:req.flash('message')});
});

// Generates new institute
router.post("/inst", adminController.generateInstitute);


module.exports = router;
