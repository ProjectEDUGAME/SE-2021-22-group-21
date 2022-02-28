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



// loads admin home page
router.get('/home', function(req, res, next) {
    res.render("admin.html");
});

// load admin login page
router.get('/login', function(req, res, next) {
    res.render("adminLogin.html");
});


// Admin login functionality
// router.post('/login', async(req, res) => {
//     // get user input
//     let adminstring = req.body.adminstring;
//     // find users with adminstring
//     const result = await School.find(
//         {"string": adminstring}
//     );//database.admins.filter(admin => admin.string ===  adminstring); 

//     console.log(result.length);

//     if (result.length > 0){    // if succeed, return to admin home page
//         req.app.locals.isAdminLogin = true; // set global variables in app.js to true
//         res.redirect("/admin/home");
//     }
//     else{ // if not, stay in the same page and display erross
//         res.render("adminLogin.html", {invalidStr: "Invalid input, please try again!"});
//     }
// });

router.post('/login', async(req, res) => {
    // get user input
    let adminstring = req.body.adminstring;
    original = adminstring;
    // find users with adminstring

    //adminstring = await bcrypt.hash(adminstring.toString(), global.salt);
    let result = false;
    const doc = await School.distinct("string");
    for (const string of doc) {
        const final = await bcrypt.compare(adminstring, string)
        if (final == true){
            result = true;
        }
    };
    console.log(result);

    if (result == true){    // if succeed, return to admin home page
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
    origin = ""
    res.redirect("/admin/login");
})




// loads download data page
router.get("/download", async function (req, res) {
    res.render("downloadData.html")
});

//finds and downloads data
router.post("/download", adminController.downloadInstitute);


// load change admin string page
router.get("/newstring", async function (req, res) {
    res.render("string.html")
});

// changes admin string
router.post("/newstring", async function (req, res) {
    const string = req.body.access_str;
    console.log(string);
    let result;

    if (string.length > 1){
        result = await adminController.generateNewString(string, original);
    }else{
        res.render("string.html", {message:"psw too short"})
        return
    }

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
