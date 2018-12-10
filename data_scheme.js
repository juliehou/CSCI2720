
var request = require("request");
var express = require("express");
var app = express();
var async = require("async");

var mongoose = require('mongoose');
mongoose.connect('mongodb://julie:julie0504@localhost/csci2720');

var db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console,
'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
console.log("Connection is open...");
});

// db.dropCollection('activities');
db.dropCollection('dates');
db.dropCollection('organizers');
db.dropCollection('districts');

//People Schema
// var UserSchema = mongoose.Schema({
//   userId: { type: Number, required: true, unique: true },
//   userName: { type: String, required: true, unique:true},
//   userPwd: { type: String, required: true}
//   });
// var User = mongoose.model('User', UserSchema);
//
// var AdminSchema = mongoose.Schema({
//   adminId:{type: Number, required: true, unique:true}
//   });
// var Admin = mongoose.model('Admin', AdminSchema);

//Data Schema
var ActivitySchema = mongoose.Schema({
  name: { type: String, required: true},
  date: { type: [], required: true},
  dist: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true},
  loc: {type: String, required:true},
  organizer: {type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true},
  //contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}
  });
var Activity = mongoose.model('Activity', ActivitySchema);

//many to many relationship
var DateSchema = mongoose.Schema({
  date: { type: String, required: true, unique: true},
  activities: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}] }
  });
var Date = mongoose.model('Date', DateSchema);

var DistSchema = mongoose.Schema({
  dist: {type: String, required: true,unique:true},
  loc: {type: [], required: true},
  activities: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]}
  });
var District = mongoose.model('District', DistSchema);

var OrgSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  contact: {type: String, required: true},
  activities: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]}
  });
var Organizer = mongoose.model('Organizer', OrgSchema);

function preData(){
  request({
    url: 'http://fundraising.one.gov.hk/fundraise_query/webservice/psi/json',
    json: true
  }, function (error, response, body) {

    act = body.activities;

    var allOrg={};
    var allDate=[];
    var allDist={};

    act.forEach(function(each){
      let schedule= each.schedule;
      let locName= each.locationNameEnglish; let distName= each.districtNameEnglish;
      let contact= each.enquiryContact;      let orgName= each.organisationNameEnglish;

      // get all unique Org Name
      if (Object.keys(allOrg).includes(orgName)==false){
        allOrg[orgName]=contact;
      };

      if (Object.keys(allDist).includes(distName)==false){
        allDist[distName]=[locName];
      }else{
        allDist[distName].push(locName);
      }

      schedule.forEach(function(s){
        var dateFrom = s.dateFrom;
        if(allDate.includes(dateFrom)==false){
          allDate.push(dateFrom);
        };
      });

      allDate=allDate.sort();
    });

    for (org in allOrg){
      var newOrg= new Organizer({
        name: org,
        contact: allOrg[org]
      });
      newOrg.save();
    };

    for (dist in allDist){
      var newDist= new District({
        dist: dist,
        loc: allDist[dist]
      });
      newDist.save();
    };

    allDate.forEach(function(date){

      var newDate= new Date({
        date: date
      });
      newDate.save();
    });
    console.log('done');
    return act;
  })
}

function saveAct(act){
    console.log('whyyyyyy');
    act.forEach(function(each){
    console.log('whyyyyyy');
    let actName= each.activityNameEnglish;
    let schedule= each.schedule;
    let locName= each.locationNameEnglish;
    let distName= each.districtNameEnglish;
    let orgName= each.organisationNameEnglish;

    Organizer.findOne({name: orgName},function(err,o){
      if (err) {console.log('O find' + err);}
      console.log(orgName + o.name + o._id);
      District.findOne({dist: distName}, function(err,d){
        if (err) {console.log('D find' + err);}

        var a = new Activity({
          name: actName,
          loc: locName,
          date: schedule,
          dist: d._id,
          organizer: o._id
        });
        a.save(function(err){
          // if(err){console.log('A save ' + err);};
          // Organizer.update({name: orgName}, {$set: {activities: o.push(a._id)}},function(err){ console.log ('O update ' + err)});
          // Location.update({name: locName}, {$set: {activities: l.push(a._id)}},function(err){ console.log(' L update ' + err)});
          // schedule.forEach(function(s){
          //
          //   var dateFrom = s.dateFrom;
          //   Date.find({date:dateFrom}, function(err, d){
          //     if(err){ console.log('d find ' + err);};
          //     Date.update({date: dateFrom}, {$set: {activities: d.push(a._id)}},function(err){ console.log('Date Update ' + err);});
        });
      });
    });
  });
}

async.waterfall([preData, saveAct],function(err){
        console.log(err);
})
