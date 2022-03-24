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

module.exports = app;
