var mongoose = require("mongoose");

var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "SolarSeven",
        img: "https://images.pexels.com/photos/2496880/pexels-photo-2496880.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        description: "A campsite or camping pitch is a place used for overnight stay in an outdoor area. In UK English, a campsite is an area, usually divided into a number of pitches, where people can camp overnight using tents or camper vans or caravans; this UK English use of the word is synonymous with the US English expression campground. In American English, the term campsite generally means an area where an individual, family, group, or military unit can pitch a tent or park a camper; a campground may contain many campsites."
    },
    {
        name: "Cloud's Rest",
        img: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?cs=srgb&dl=photo-of-pitched-dome-tents-overlooking-mountain-ranges-1687845.jpg&fm=jpg",
        description: "A campsite or camping pitch is a place used for overnight stay in an outdoor area. In UK English, a campsite is an area, usually divided into a number of pitches, where people can camp overnight using tents or camper vans or caravans; this UK English use of the word is synonymous with the US English expression campground. In American English, the term campsite generally means an area where an individual, family, group, or military unit can pitch a tent or park a camper; a campground may contain many campsites."
    },
    {
        name: "Desert Masa",
        img: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?cs=srgb&dl=silhouette-of-person-standing-near-camping-tent-2398220.jpg&fm=jpg",
        description: "A campsite or camping pitch is a place used for overnight stay in an outdoor area. In UK English, a campsite is an area, usually divided into a number of pitches, where people can camp overnight using tents or camper vans or caravans; this UK English use of the word is synonymous with the US English expression campground. In American English, the term campsite generally means an area where an individual, family, group, or military unit can pitch a tent or park a camper; a campground may contain many campsites."
    }
];

function seedDB() {
    Campground.remove({}, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("All the files are removed");
            data.forEach(function(seed){
                Campground.create(seed, function(err, newlyCreatedCampground){
                    if (err){
                        console.log(err);
                    } else {
                        console.log("created initial campgrounds");
                        Comment.create(
                            {
                                text: "This place is great, but I wish it would be there",
                                author: "Anshita Vishwa"
                            }, function(err, newlyCreatedComment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Comment to that post has been created");
                                    newlyCreatedCampground.comments.push(newlyCreatedComment);
                                    newlyCreatedCampground.save(function(err, updatedWithComment){
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log("Campground updated with a comment");
                                        }
                                    });
                                }
                            }
                        );
                    }
                });
            });
        }
    });
}

module.exports = seedDB;


