// COMMENTS ROUTES
var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");


router.get("/new", isloggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

router.post("/",isloggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, newlyCreatedComment){
                if (err) {
                    console.log(err);
                } else {
                    newlyCreatedComment.author.id = req.user._id;
                    newlyCreatedComment.author.username = req.user.username;
                    newlyCreatedComment.save();
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

function isloggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
