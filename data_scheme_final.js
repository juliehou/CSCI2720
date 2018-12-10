
const request = require("request-promise");
const mongoose = require('mongoose');

mongoose.connect('mongodb://julie:julie0504@localhost/csci2720');

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
  console.log("Connection is open...");
});

// db.dropCollection('activities');
db.dropCollection('dates');
db.dropCollection('organizers');
db.dropCollection('districts');
db.dropCollection('activities');

//Data Schema
const ActivitySchema = mongoose.Schema({
  name: { type: String, required: true},
  date: { type: [], required: true},
  dist: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true},
  loc: {type: String},
  organizer: {type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true},
  //contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}
});
const Activity = mongoose.model('Activity', ActivitySchema);

//many to many relationship
const DateSchema = mongoose.Schema({
  date: { type: String, required: true, unique: true},
  activities: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}] }
});
const Date = mongoose.model('Date', DateSchema);

const DistSchema = mongoose.Schema({
  dist: {type: String, required: true,unique:true},
  loc: {type: [], required: true},
  activities: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]}
});
const District = mongoose.model('District', DistSchema);

const OrgSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  contact: {type: String, required: true},
  activities: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]}
});
const Organizer = mongoose.model('Organizer', OrgSchema);

const main = async function() {
  try {
    const data = await request({
      url: 'http://fundraising.one.gov.hk/fundraise_query/webservice/psi/json',
      json: true,
    });

    const act = data.activities;
    const allOrg = {};
    let allDate = [];
    const allDist = {};

    act.forEach(function(each){
      let schedule = each.schedule;
      let locName = each.locationNameEnglish;
      let distName = each.districtNameEnglish;
      let contact = each.enquiryContact;
      let orgName = each.organisationNameEnglish;

      // get all unique Org Name
      if (Object.keys(allOrg).includes(orgName) === false){
        allOrg[orgName] = contact;
      };

      if (Object.keys(allDist).includes(distName) === false){
        allDist[distName] = [locName];
      }else{
        allDist[distName].push(locName);
      }

      schedule.forEach(function(s){
          const dateFrom = s.dateFrom;
          if(allDate.includes(dateFrom) === false){
            allDate.push(dateFrom);
          };
        });

        allDate = allDate.sort();
      });

    for (let org in allOrg){
      const newOrg = new Organizer({
        name: org,
        contact: allOrg[org]
      });
      await newOrg.save();
    };

    for (let dist in allDist){
      const newDist = new District({
        dist: dist,
        loc: allDist[dist]
      });
      await newDist.save();
    };

    for (let date in allDate) {
      const newDate = new Date({
        date: date
      });
      await newDate.save();
    }

    const all = await Organizer.find({}).exec();

    for (let i = 0; i < act.length; i++) {
      let each = act[i]
      console.log(each)
      let actName = each.activityNameEnglish;
      let schedule = each.schedule;
      let locName = each.locationNameEnglish;
      let distName = each.districtNameEnglish;
      let orgName = each.organisationNameEnglish;
      console.log(locName);

      const origanizer = await Organizer.findOne({name: orgName}).exec();
      const district = await District.findOne({dist: distName}).exec();
      const activity = new Activity({
        name: actName,
        loc: locName,
        date: schedule,
        dist: district._id,
        organizer: origanizer._id
      });
      await activity.save();

      // if(err){console.log('A save ' + err);};
      // Organizer.update({name: orgName}, {$set: {activities: o.push(a._id)}},function(err){ console.log ('O update ' + err)});
      // Location.update({name: locName}, {$set: {activities: l.push(a._id)}},function(err){ console.log(' L update ' + err)});
      // schedule.forEach(function(s){
      //
      //   const dateFrom = s.dateFrom;
      //   Date.find({date:dateFrom}, function(err, d){
      //     if(err){ console.log('d find ' + err);};
      //     Date.update({date: dateFrom}, {$set: {activities: d.push(a._id)}},function(err){ console.log('Date Update ' + err);});
    }

  } catch (err) {
    console.log(err);
  }
}

// execute
main()
