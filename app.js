var express = require("express"),
app         = express(), 
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
seedDB      = require("./seeds");

seedDB();

//CONNECT

mongoose.connect("mongodb://localhost/yelp_camp_5");

//APP CONFIG

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(__dirname, "/public"));

var Campground = require("./models/campground");
var Comment = require("./models/comment");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
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

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
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






app.listen(3000, function(){
    console.log("The Server has started");
});