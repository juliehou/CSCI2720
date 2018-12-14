//get user by name
app.get('/user/:username', function (req, res) {
    User
        .findOne({ username: req.params['username'] })
        .exec(
        function (err, result) {
            if (err) {
                return res.send(err);
            }
            if (result == null) {
                return res.send("Cannot find this user");
            }
            res.send("This is user " + result.username + ":<br>\n" +
            "Password: " + result.password + "<br>\n");
        });
});

//get all users
app.get('/user', function (req, res) {
    User
        .find()
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e == null) {
                return res.send("Cannot find this user");
            }

            var allUsers = "";
            e.forEach(function (user) {
                allUsers += "User: " + user.name + "<br>\n"
                "Password: " + user.password + "<br>\n" + "<br>\n"
            })
            res.send(allUsers);
        });
});

//delete user
app.delete('/user/:username', function (req, res) {
    User
        .findOneAndDelete({ username: req.params['username'] })
        .exec(
        function (err, result) {
            if (err) {
                return res.send(err);
            }
            if (result == null) {
                return res.send("Cannot find this user");
            }
        });
});



//create user with hash password
var bcrypt = require('bcrypt.js');

app.post('/user', function (req, res) {
    var hash = bcrypt.hashSync(req.params['password']);
    var user = new UserModel({
        username: req.params['username'],
        password: hash
    })

    user.save(function (err) {
        if (err)
            return handleError(err);
        console.log("Successfully create user!");
    });
})




//get activity by name
app.get('/activity/:name', function (req, res) {
    Activity
        .find({ name: req.params['name'] })
        .populate('date')
        .populate('district')
        .populate('organizer')
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e == null) {
                return res.send("Cannot find activity with this name!");
            }

            //create a string for saving result
            var allResult = "";

            e.forEach(function (result) {
                allResult += "This is activity " + result.name + ":<br>\n" +
            "Activity Date: " + result.date.date + "<br>\n" +
            "Activity District: " + result.district.name + "<br>\n" +
            "Activity Location: " + result.district.name + "<br>\n" +
            "Organizer Name: " + result.organizer.name + "<br>\n" +
            "Organizer Contact: " + result.organizer.contact + "<br>\n" + "<br>\n";
            })
            res.send(allResult);
        });
});

//get all activities
app.get('/activity', function (req, res) {
    Activity
        .find()
        .populate('date')
        .populate('location')
        .populate('organizer')
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e.length == 0) {
                return res.send("There is no activities!")
            }

            //create a string for saving the result
            var allActivities = "";

            e.forEach(function (activity) {
                allActivities += "Activity Name: " + activity.name + "<br>\n" +
					"Activity Date: " + activity.date.date + "<br>\n" +
                    "Activity Location" + activity.location.name + "<br>\n" +
                    "Activity District" + activity.location.dist + "<br>\n" +
                    "Organizer Name " + activity.organizer.name + ":<br>\n" +
                    "Organizer Contact " + activity.organizer.contact + ":<br>\n" +
                    activity._id+ "<br>\n" +"<br>\n";
            })
            res.send(allActivities);
        });
});

//get all districts
app.get('/district', function (req, res) {
    District
        .find()
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e.length == 0) {
                return res.send("There is no districts!")
            }

            //create a string for saving the result
            var allDistricts = "";

            e.forEach(function (district) {
                allDistricts += "District Name: " + district.dist + "<br>\n" +"<br>\n";
            })
            res.send(allDistricts);
        });
});


//get all organizers
app.get('/organizer', function (req, res) {
    Organizer
        .find()
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e.length == 0) {
                return res.send("There is no organizer with this name!")
            }

            //create a string for saving the result
            var allOrganizers = "";
            e.forEach(function (organizer) {
                allOrganizers += "Organizer Name: " + organizer.name + "<br>\n" +
                    "Organizer Contact " + organizer.contact + ":<br>\n" + "<br>\n";
            })
            res.send(allOrganizers);
        });
});



//find all activities with the specified organizer name
app.get('/organizer/:name', function (req, res) {
    var org_id;

    Organizer
        .findOne({name:req.params['name']})
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e == null) {
                return res.send("Cannot find this organizer!")
            }
            else
                org_id = e._id;
            Activity
                .find({ organizer: org_id })
                .populate('district')
                .populate('organizer')
                .exec(function(err,e){
                if(err){
                    return res.send(err);
                }
                if(e.length==0){
                    return res.send("Cannot find any activity with this organizer!")
                }
                var allResult="";
                e.forEach(function (result) {
                    allResult += "This is activity " + result.name + ":<br>\n" +
                "Activity Date: " + result.date.date + "<br>\n" +
                "Activity Location: " + result.location.name + "<br>\n" +
                "Activity District: " + result.location.dist + "<br>\n" +
                "Organizer Name: " + result.organizer.name + "<br>\n" +
                "Organizer Contact: " + result.organizer.contact + "<br>\n" + "<br>\n";
                })
                res.send(allResult);
            })
        }
    )
})

//find all activities with the specified district
app.get('/district/:dist', function (req, res) {

    var dist_id;

    District
        .findOne({ dist: req.params['dist'] })
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e == null) {
                return res.send("Cannot find this district!")
            }
            else
                dist_id = e._id;
            Activity
                .find({ district: dist_id })
                .populate('district')
                .populate('organizer')
                .exec(function (err, e) {
                    if (err) {
                        return res.send(err);
                    }
                    if (e.length == 0) {
                        return res.send("Cannot find any activity with this district!")
                    }
                    var allResult = "";
                    e.forEach(function (result) {
                        allResult += "This is activity " + result.name + ":<br>\n" +
                    "Activity Date: " + result.date + "<br>\n" +
                    "Activity District: " + result.district.name + "<br>\n" +
                    "Activity Location: " + result.district.location + "<br>\n" +
                    "Organizer Name: " + result.organizer.name + "<br>\n" +
                    "Organizer Contact: " + result.organizer.contact + "<br>\n" + "<br>\n";
                    })
                    res.send(allResult);
                })
        }
    )
})

//find all activities with the specified date
app.get('/date/:date', function (req, res) {

    var date_id;

    Date
        .findOne({ date: req.params['date'] })
        .exec(
        function (err, e) {
            if (err) {
                return res.send(err);
            }
            if (e == null) {
                return res.send("Cannot find this date!")
            }
            else
                date_id = e._id;
            Activity
                .find({ date: date_id })
                .populate('date')
                .populate('district')
                .populate('organizer')
                .exec(function (err, e) {
                    if (err) {
                        return res.send(err);
                    }
                    if (e.length == 0) {
                        return res.send("Cannot find any activity with this date!")
                    }
                    var allResult = "";
                    e.forEach(function (result) {
                        allResult += "This is activity " + result.name + ":<br>\n" +
                    "Activity Date: " + result.date + "<br>\n" +
                    "Activity District: " + result.district.name + "<br>\n" +
                    "Activity Location: " + result.district.location + "<br>\n" +
                    "Organizer Name: " + result.organizer.name + "<br>\n" +
                    "Organizer Contact: " + result.organizer.contact + "<br>\n" + "<br>\n";
                    })
                    res.send(allResult);
                })
        }
    )
})

//delete activity
app.delete('/activity/:activity/dist/:dist/org/:org', function (req, res) {
Activity
        .find({ name: req.params['name'] })
        .populate('date')
        .populate('district')
        .populate('organizer')
        .exec(
        function (err, result) {
            if (err) {
                return res.send(err)
            }
            if (result == null) {
                return res.send("Cannot find matched activities!")
            }
            var deleteArray = [];
            result.forEach(function (event) {
                if (event.district.dist == req.params['dist'] && event.organizer.org == req.params['org']) {
                    deleteArray.push(event._id);
                }
            });
            if (deleteArray.length == 0) {
                return res.send("Cannot find matched activities!");
            }
            else {
                deleteArray.forEach(function (id) { 
                    Activity
                    .findOneAndDelete({ _id: id });
                })
                return res.send("Activity deleted!");
            }
        })
});



//post new activity function
app.post('/activity', function (req, res) {

    //create variables for storing result of district and organizer
    var dist_id;
    var org_id;

    District
		.findOne({ dist: req.body['dist'] },
        function (err, result) {
            if (err) {
                return res.send(err);
            }
            if (result == null) {
                var dist = new DistrictModel({
                    dist: req.body['dist'],
                    location: req.body['location']
                })
                dist.save(function (err, saveddist) {
                    if (err)
                        return handleError(err);
                    dist_id = saveddist._id;
                    Organizer
                    .findOne({ org: req.body['org'] },
                    function (err, result) {
                        if (err) {
                            return res.send(err);
                        }
                        if (result == null) {
                            var org = new OrganizerModel({
                                org: req.body['org'],
                                contact: req.body['contact']
                            })
                            org.save(function (err, savedorg) {
                                if (err)
                                    return handleError(err);
                                org_id = savedorg._id;

                                var r = new Activity({
                                    name: req.body['name'],
                                    date: req.body['date'],
                                    dist: dist_id,
                                    loc: req.body['loc'],
                                    organizer: org_id,
                                })

                                r.save(function (err) {
                                    if (err) {
                                        return res.send(err);
                                    }
                                    else res.send("Activity created!");
                                });
                            });
                        }
                        else {
                            org_id = result._id;

                            var r = new Activity({
                                name: req.body['name'],
                                date: req.body['date'],
                                dist: dist_id,
                                loc: req.body['loc'],
                                organizer: org_id,
                            })

                            r.save(function (err) {
                                if (err) {
                                    return res.send(err);
                                }
                                else res.send("Activity created!");
                            });
                        }
                    });
                });
            }
            else {
                dist_id = result._id;

                Organizer
                .findOne({ org: req.body['org'] },
                function (err, result) {
                    if (err) {
                        return res.send(err);
                    }
                    if (result == null) {
                        var org = new OrganizerModel({
                            org: req.body['org'],
                            contact: req.body['contact']
                        })
                        org.save(function (err, savedorg) {
                            if (err)
                                return handleError(err);
                            org_id = savedorg._id;
                            var r = new Activity({
                                name: req.body['name'],
                                date: req.body['date'],
                                dist: dist_id,
                                loc: req.body['loc'],
                                organizer: org_id,
                            })

                            r.save(function (err) {
                                if (err) {
                                    return res.send(err);
                                }
                                else res.send("Activity created!");
                            });
                        });
                    }
                    else {
                        org_id = result._id;

                        var r = new Activity({
                            name: req.body['name'],
                            date: req.body['date'],
                            dist: dist_id,
                            loc: req.body['loc'],
                            organizer: org_id,
                        })
                        r.save(function (err) {
                            if (err) {
                                return res.send(err);
                            }
                            else res.send("Activity created!");
                        });
                    }
                })
            }
        });
});




//update activity
app.put('/activity', function (req, res) {
    District
		.findOne({ dist: req.body['dist'] },
        function (err, result) {
            if (err) {
                return res.send(err);
            }
            if (result == null) {
                var dist = new DistrictModel({
                    dist: req.body['dist'],
                    location: req.body['location']
                })
                dist.save(function (err, saveddist) {
                    if (err)
                        return handleError(err);
                    dist_id = saveddist._id;
                    Organizer
                    .findOne({ org: req.body['org'] },
                    function (err, result) {
                        if (err) {
                            return res.send(err);
                        }
                        if (result == null) {
                            var org = new OrganizerModel({
                                org: req.body['org'],
                                contact: req.body['contact']
                            })
                            org.save(function (err, savedorg) {
                                if (err)
                                    return handleError(err);
                                org_id = savedorg._id;

                                Activity
                                .updateOne(
                                { _id: _id },//activity id
                                {
                                    name: req.body['name'],
                                    date: req.body['date'],
                                    dist: dist_id,
                                    loc: req.body['loc'],
                                    organizer: org_id
                                }
                                )
                            });
                        }
                        else {
                            org_id = result._id;

                            Activity
                                .updateOne(
                                { _id: _id },//activity id
                                {
                                    name: req.body['name'],
                                    date: req.body['date'],
                                    dist: dist_id,
                                    loc: req.body['loc'],
                                    organizer: org_id
                                }
                                )
                        }
                    });
                });
            }
            else {
                dist_id = result._id;

                Organizer
                .findOne({ org: req.body['org'] },
                function (err, result) {
                    if (err) {
                        return res.send(err);
                    }
                    if (result == null) {
                        var org = new OrganizerModel({
                            org: req.body['org'],
                            contact: req.body['contact']
                        })
                        org.save(function (err, savedorg) {
                            if (err)
                                return handleError(err);
                            org_id = savedorg._id;
                            Activity
                                .updateOne(
                                { _id: _id },//activity id
                                {
                                    name: req.body['name'],
                                    date: req.body['date'],
                                    dist: dist_id,
                                    loc: req.body['loc'],
                                    organizer: org_id
                                }
                                )
                        });
                    }
                    else {
                        org_id = result._id;

                        Activity
                                .updateOne(
                                { _id: _id },//activity id
                                {
                                    name: req.body['name'],
                                    date: req.body['date'],
                                    dist: dist_id,
                                    loc: req.body['loc'],
                                    organizer: org_id
                                }
                                )
                    }
                })
            }
        });
});




/*
app.all('/*', function (req, res) {
    // send this to client
    res.sendFile('form.html', { root: __dirname });
});
*/

//listen to port 3000
var server = app.listen(3000);