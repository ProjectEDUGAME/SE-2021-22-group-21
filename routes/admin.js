var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var database =  require("../data.json");
const adminController =  require("../controllers/adminController.js");
const {render} = require("nunjucks");
// Access the data.js and school.js files
const User = require("../models/data");
const School = require("../models/schools");
const bcrypt = require("bcrypt");
const { find } = require('../models/data');


/* admin home page. */
router.get('/', function(req, res, next) {
    res.render("admin.html");
});

/* GET LOGIN page. */
router.get('/login', function(req, res, next) {
    res.render("adminLogin.html");
});

// SAME HASH & OUTPUT DIFFERENT 

/* POST LOGIN page. */
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

//     const result = await School.find(
//        {"string": adminstring}
//    );//database.admins.filter(admin => admin.string ===  adminstring); 

//     const result2 = await User.find(
//        {"string": adminstring}
//    ); 

//     console.log(result);

//    console.log(result.length); 
    if (result == true){    // if succeed, return to admin home page
        req.app.locals.isAdminLogin = true; // set global variables in app.js to true
        res.redirect("/admin");
    }

    // if (result2.length > 0){    // if succeed, return to admin home page
    //    req.app.locals.isAdminLogin = true; // set global variables in app.js to true
    //    res.redirect("/user");
    //} 
    else{ // if not, stay in the same page and display erross
        res.render("adminLogin.html", {message: "Whoops! We can't found this string. Please input again!"});
    }
}); 


/* POST LOGIN page. */
//router.post('/login', async(req, res) => {
    // get user input
//    let adminstring = req.body.adminstring;
//    original = adminstring
    // find users with adminstring
//    const result = await School.find(
//        {"string": adminstring}
//    );//database.admins.filter(admin => admin.string ===  adminstring); 

///*     const result2 = await User.find(
//        {"string": adminstring}
//    ); */
//
//    console.log(result.length);
//
//    if (result.length > 0){    // if succeed, return to admin home page
//        req.app.locals.isAdminLogin = true; // set global variables in app.js to true
//        res.redirect("/admin");
//    }
//    /* if (result2.length > 0){    // if succeed, return to admin home page
//        req.app.locals.isAdminLogin = true; // set global variables in app.js to true
//        res.redirect("/user");
//    } */
//    else{ // if not, stay in the same page and display erross
//        res.render("adminLogin.html", {message: "Whoops! We can't found this string. Please input again!"});
//    }
//});


router.get('/logout', function (req,res) {
    req.app.locals.isAdminLogin = false; // set global variables in app.js to true
    res.redirect("/admin/login");
})

router.get("/institute", async function (req, res) {
    // for flash message when request if redirect to current page
    let allFlashMessages = req.flash('message');
    let message;
    if (allFlashMessages.length > 0){
        message = allFlashMessages[0]
    }

    let allData = await adminController.readInstitute();
    if (allData.succeed) {
        res.render('adminInstitute.html', {message: message, data: allData.data, string: uuidv4()})
    }else{
        message += " " + allData.message;
        res.render('adminInstitute.html', {message: message, string: uuidv4()})
    }

})


// add institute
router.post("/institute/add", async function (req, res) {

    if (req.body.school !== "" && req.body.string !== "" ) {
        let school = {school: req.body.school, string: req.body.string}
        let result = await adminController.addInstitute(school);
        if (result.succeed) {
            req.flash('message', result.message)
            res.redirect('/admin/institute');
        }else{
            req.flash('message', result.message)
            res.redirect("/admin/institute")
        }
    } else {
        req.flash('message',  "please input school name or string!")
        res.redirect("/admin/institute")
    }

})

// update institute by id
router.get("/institute/update/:string", async function (req, res) {
    let string = req.params.string;
    let result = await adminController.findInstituteByString(string);
    if (!result.succeed) {
        req.flash("message", result.message)
        res.redirect("/admin/institute")
    }else{
        res.render("adminInstituteUpdate.html", {data:result.data})
    }

})


// update institute by id
router.post("/institute/update", async function (req, res) {
    console.log(req.body);

    let new_school = {
        school:req.body.school,
        string:req.body.string
    };
    let result = await adminController.updateInstitute(new_school);
    if (!result.succeed) {
        req.flash("message", result.message)
    }
    res.redirect("/admin/institute")

})

// remove institute by id
router.get("/institute/del/:string", async function (req, res) {
    let string = req.params.string;
    let result = await adminController.deleteInstitute(string);

    if (!result.succeed) {
        req.flash("message", result.message)
    }
    res.redirect("/admin/institute")

})


// download
// router.get("/institute/download", adminController.downloadInstitute);

router.get("/download", async function (req, res) {
    res.render("download.html")
});

router.post("/download", adminController.downloadInstitute);

// router.post("/download", async function (req, res) {
//     const string = req.body.schooldl;
//     console.log(string)

//     let result = await adminController.downloadInstitute();

//     if (!result.succeed){
//         res.render("download.html", {message:result.message})
//     }else{
//         res.render("download.html", {string: string})

//     }

// });


// Display the admin string page and change the admin string
router.get("/newstring", async function (req, res) {
    res.render("string.html")
});

router.post("/newstring", async function (req, res) {
    const string = req.body.accessstr;
    console.log(string)

    let result = await adminController.generateNewString(string, original);

    if (!result.succeed){
        res.render("string.html", {message:result.message})
    }else{
        res.render("string.html", {string: string})

    }

});


module.exports = router;
