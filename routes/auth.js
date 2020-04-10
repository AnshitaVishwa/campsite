var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");   


router.get("/", function(req, res){
    res.render("landing");
});

function isloggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}




//REGISTER

router.get("/register", function(req, res){
    res.render("register");
});

  router.post("/register", function(req, res){
      var newUser = new User(
          {
              username: req.body.username
          }
      );
      User.register(newUser, req.body.password, function(err, newlyCreatedUser){
            if (err) {
                console.log(err);
                return res.render("register");
            } 
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
      });
  });

// LOGIN
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//LOGOUT

// app.get("/logout", function(res, req){
//     req.logout();
//     res.redirect("/campgrounds");
// });

router.get('/logout', function (req, res){
    req.session.destroy(function (err) {
      res.redirect('/campgrounds'); //Inside a callback… bulletproof!
    });
  });

module.exports = router;
