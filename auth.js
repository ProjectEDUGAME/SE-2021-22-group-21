// check if is LoggedIn
exports.loginRequired = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('message', 'you have to login first!')
    res.redirect("/login");
}
