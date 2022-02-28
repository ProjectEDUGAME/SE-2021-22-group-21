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



/* admin home page. */
router.get('/', function(req, res, next) {
    res.render("admin.html");
});

/* GET LOGIN page. */
router.get('/login', function(req, res, next) {
    res.render("adminLogin.html");
});


/* POST LOGIN page. */
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
        res.redirect("/admin");
    }
    else{ // if not, stay in the same page and display erross
        res.render("adminLogin.html", {invalidStr: "Invalid input, please try again!"});
    }
});



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
// old :(
// router.post("/institute/add", async function (req, res) {  

//     if (req.body.school !== "" && req.body.string !== "" ) {
//         let school = {school: req.body.school, string: req.body.string}
//         let result = await adminController.addInstitute(school);
//         if (result.succeed) {
//             req.flash('message', result.message)
//             res.redirect('/admin/institute');
//         }else{
//             req.flash('message', result.message)
//             res.redirect("/admin/institute")
//         }
//     } else {
//         req.flash('message',  "please input school name or string!")
//         res.redirect("/admin/institute")
//     }

// })

// update institute by id
// router.get("/institute/update/:string", async function (req, res) {
//     let string = req.params.string;
//     let result = await adminController.findInstituteByString(string);
//     if (!result.succeed) {
//         req.flash("message", result.message)
//         res.redirect("/admin/institute")
//     }else{
//         res.render("adminInstituteUpdate.html", {data:result.data})
//     }

// })


// update institute by id
// router.post("/institute/update", async function (req, res) {
//     console.log(req.body);

//     let new_school = {
//         school:req.body.school,
//         string:req.body.string
//     };
//     let result = await adminController.updateInstitute(new_school);
//     if (!result.succeed) {
//         req.flash("message", result.message)
//     }
//     res.redirect("/admin/institute")

// })

// remove institute by id
// router.get("/institute/del/:string", async function (req, res) {
//     let string = req.params.string;
//     let result = await adminController.deleteInstitute(string);

//     if (!result.succeed) {
//         req.flash("message", result.message)
//     }
//     res.redirect("/admin/institute")

// })


// download
router.get("/download", async function (req, res) {
    res.render("downloadData.html")
});

router.post("/download", adminController.downloadInstitute);



router.get("/newstring", async function (req, res) {
    const string = uuidv4();
    let result = await adminController.generateNewString(string);

    if (!result.succeed){
        res.render("string.html", {message:result.message})
    }else{
        res.render("string.html", {string: string})
    }

});



/* admin generate institute string page. */
router.get('/inst', function(req, res, next) {
    res.render("generateInstituteString.html", {message:req.flash('message')});
});

/* admin generate institue string page. */
router.post('/inst', async function(req, res, next) {

    let name = req.body.name;
    let numberOfIDs = req.body.num;
    let  postCode = req.body.postCode;

    let newSchool;
    if (name !== "" && postCode !== "" && numberOfIDs !== "") {
        let existSchool = await School.find({ 'postCode': postCode, 'school': name }).lean()
        console.log(existSchool)

        // generate ids
        let ids = []
        for (let step = 0; step < numberOfIDs; step++) {
            let newId = Math.floor(10000 + Math.random() * 90000);
            ids.push(newId)
        }

        if(existSchool.length == 0){
            // save into mongodb
            newSchool = new School({school: name, string: uuidv4(), postCode: postCode, ids: ids})
            // Save the new model instance, passing a callback
            await newSchool.save();
        }
        else{
            let schols = await School.find({ 'postCode': postCode, 'school': name }).lean()
            for (const el of schols[0].ids){
                ids.push(el)
            }
            console.log(ids)
            await School.updateOne({ 'postCode': postCode, 'school': name },{ $set: { ids: ids}})
        }

        // download
        // find all schools with the postCode
        let schools = await School.find({ 'postCode': postCode, 'school': name }).lean()

        let text = "School: " + schools[0].school
        text += "\nPostcode: " + schools[0].postCode
        text += "\nAccess string: " + schools[0].string
        text += "\nIDs: " + schools[0].ids

        res.attachment(schools[0].school + ".txt");
        res.type("txt")
        return res.send(text);

    } else {
        console.log("sss");
        req.flash('message', "please input school name or string!")
        res.redirect("/admin");
    }


});


module.exports = router;
