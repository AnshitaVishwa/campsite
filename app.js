var express = require("express"),
app         = express(), 
bodyParser  = require("body-parser"),
passport    = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride = require("method-override"),
passportLocalMongoose = require("passport-local-mongoose"),
mongoose    = require("mongoose"),
seedDB      = require("./seeds");

// seedDB();

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth");

//CONNECT
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
mongoose.connect("mongodb://localhost/yelp_camp_10");

//APP CONFIG

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
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

app.use(authRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000, function(){
    console.log("The Server has started");
});