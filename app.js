var express = require("express"),
app         = express(), 
bodyParser  = require("body-parser"),
passport    = require("passport"),
LocalStrategy = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
mongoose    = require("mongoose"),
seedDB      = require("./seeds");

seedDB();

//CONNECT
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
mongoose.connect("mongodb://localhost/yelp_camp_6");

//APP CONFIG

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(__dirname, "/public"));

// PASSPORT CONFIG

app.use(require("express-session")(
    {
        secret: "he is the cutest dog",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.initialize());  
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

//USE ON EVERY ROUTE

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

function isloggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/campgrounds" ,function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, img: image, description: description};
    Campground.create(
        {
            name: name,
            img: image,
            description: description
        }, function(err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
            res.redirect("/campgrounds");
            }
        }
    );
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", isloggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments",isloggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, newlyCreatedComment){
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(newlyCreatedComment);
                    foundCampground.save(function(err, updatedCampground){
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect("/campgrounds/" + foundCampground._id);
                        }
                    });
                }
            });
        }
    });
});

//REGISTER

app.get("/register", function(req, res){
    res.render("register");
});

  app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//LOGOUT

// app.get("/logout", function(res, req){
//     req.logout();
//     res.redirect("/campgrounds");
// });

app.get('/logout', function (req, res){
    req.session.destroy(function (err) {
      res.redirect('/campgrounds'); //Inside a callback… bulletproof!
    });
  });



app.listen(3000, function(){
    console.log("The Server has started");
});