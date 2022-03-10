var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');
const bodyParser = require('body-parser');


var indexRouter = require('./routes/indexRouter');
var userRouter = require('./routes/userRouter');
var adminRouter = require('./routes/adminRouter');


// For testing
// Access the userModel.js and school.js files
const User = require("./models/userModel")
const School = require("./models/schoolModel")

// Starts a server
var app = express();


app.use(express.static("client"));
app.use(bodyParser.json());

const nunjucks=require("nunjucks");
const passport = require("passport");

// configure
nunjucks.configure(path.resolve(__dirname,'views'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
// app.use(express.static('public'));  Just personal question why you need to use ^ instead of < --Karsta
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'sd12312d123121213912',
    cookie: { maxAge: 60*60*1000 }
}));
// passport
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

// // variable across routes
// app.locals.isAdminLogin = false;
// app.use(function (req,res,next) {
//
//     if (req.path.startsWith("/admin")){
//         if (!req.app.locals.isAdminLogin & req.path !== "/" && req.path !== "/admin/login"){
//             res.status(301).redirect("/admin/login")
//         }else{
//             next();
//         }
//     } else{ // to do with user login
//         // TODO
//         next();
//     }
//
// });


// // DATABASE TESTING
// // Adds a new user to the collection database, with a unique ID (by MongoDB) and timestamps, for testing
// // We however want this to be automatically generated once clicking (so add the click events here to add this information in)
// app.get("/add-user", (req, res) => {
//     const user = new User({
//         user: 105,
//         school: "Gr490dfsFF55aa1",
//         wallColour: "#9534eb",
//         bell: 3
//     })
// // Mongoose saves this new instance to the database
//     user.save()
// // Allows us to see the result in the browser, or displays an error in the console
//      .then((result) => {
//          res.send(result)
//      })
//      .catch((err) => {
//          console.log(err);
//      });
// })
//
// app.get("/add-school", (req, res) => {
//     const school = new School({
//         school: "Durham",
//         string: "Hi"
//     })
//     school.save()
//     .then((result) => {
//         res.send(result)
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// })

// We can check our collections on cloud.mongo.db or http://localhost:888/add-user to see that this new data is in our database

// MORE DATABASE TESTING
// Seeing all the users
// app.get("/all-users", (req, res) => {
// // Finds all the users - applied to the Users - instead of using the save instance method on a single user
//     User.find({bell: 6})
// // Same process as before, to see results or display an error
//      .then((result) => {
//          res.send(result)
//      })
//      .catch((err) => {
//          console.log(err);
//      });
// })

// Mongoose (allows us to create simple data models with query methods to change the database)
// Schema defines the structure of our documents (e.g. each user) within a collection (e.g. user table)

// OLD GET AND POST REQUESTS
// // Add to a text file for the meantime
// const loginAttempt = [];

// const schoolString = [];
// const studentID = [];

// const randomID = [];

// // LOGIN PAGE
// // When the login button is selected, send the login details as JSON to main
// app.get("/login/fetch", function(req, resp){
//     resp.json(loginAttempt);
// });

// // ADMIN PAGE
// // When the generate new ID button is selected, send the school string and student ID as JSON to main
// app.get("/admin/fetch", function(req, resp){
//     resp.json(schoolString);
//     resp.json(studentID);
// });

// // The unique strings for the schools are added to the app. These will match up with the school string and student ID (fetched above)
// app.post("/admin/add", function(req, resp){
//     const newID = request.body.newID;
//     randomID.push(newID);
// });

// // (Similar process for other events)
// app.post("/wallColor", function (req, resp){
//     let wallColor = req.body;

//     let id = wallColor.id; //for now, probs gonna use express-session
//     let colorHex = wallColor.colorHex;

//     for(let d of data){
//         if(d.user == id){
//             d.wall = colorHex;
//         }
//     }
//     resp.json("done");

// });

module.exports = app;
