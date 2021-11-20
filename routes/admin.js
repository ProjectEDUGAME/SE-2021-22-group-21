var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

/* amdin home page. */
router.get('/', function(req, res, next) {
    res.render("admin.html");
});


/* GET unique ID for child. */
router.get('/institutestring', function(req, res, next) {
    res.render("string.html", {title: "Insititute String", generated_string:uuidv4()});
});


/* GET new admin string. */
router.get('/newstring', function(req, res, next) {
    res.render("string.html", {title: "New String For Admin", generated_string:uuidv4()});
});


module.exports = router;
