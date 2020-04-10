var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/" ,function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

router.post("/",isloggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // var newCampground = {name: name, img: image, description: description};
    Campground.create(
        {
            name: name,
            img: image,
            description: description,
            author: author
        }, function(err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
            res.redirect("/campgrounds");
            }
        }
    );
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.get("/:id/edit", checkCampgroundOwnership,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", checkCampgroundOwnership ,function(req, res){
    var data = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, data , function(err, updatedCampground){
        if (err){
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", checkCampgroundOwnership ,function(req, res){
     Campground.findByIdAndRemove(req.params.id, function(err){
         if(err) {
             console.log(err);
         } else {
             res.redirect("/campgrounds");
         }
     });
});

function isloggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    }
}

module.exports = router;