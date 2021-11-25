var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');



var app = express();

const nunjucks=require("nunjucks");

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
app.use(session({   secret: 'sd12312d123121213912', cookie: { maxAge: 60000 }}));
app.use(flash());

// variable across routes
app.locals.isAdminLogin = false;
app.use(function (req,res,next) {

    if (req.path.startsWith("/admin")){
        if (!req.app.locals.isAdminLogin & req.path !== "/" && req.path !== "/admin/login"){
            res.status(301).redirect("/admin/login")
        }else{
            next();
        }
    } else{ // to do with user login
        // TODO
        next();
    }

});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);




module.exports = app;
