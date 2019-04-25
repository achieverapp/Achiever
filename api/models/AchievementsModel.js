/* CptS 489, Spring 2019
    Project: Task Tracker
    File: AchievementModel.js    */

'use strict';

var ObjectId = require('mongodb').ObjectId;

class Acheievment {
  //basic constructor based on what was inside the design docs
  constructor(achievements) {
    this.title = achievements.title == null ? null : this.title;
    this.description = achievements.description == null ? null : this.description;
    // this is just for counting how many times the achievement was completed
    this.counter = achievements.checkcounter == null ? null : 0;
    // might be uneccesary since counter should indicate if a achievements is completed
    //this.completed=achievements.completed==null?  false:this.completed;
    this.userAchievement = achievements.userAchievement == null ? [] : this.userAchievement;
  }

  static addAchievement(achievementsDB, achievement, result) {
    var resultObj;
    achievementsDB.insertOne(achievement, function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when adding new achievements to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("Added achievements " + achievement.title, null, true, achievement._id, achievements);
        result(null, resultObj);
      }
    });
  }

  static getAchievement(achievementsDB, achievementId, result) {
    var resultObj, id;
    if (achievementId._id) { // If the id is 'default' then we cannot create an ObjectId with it and mus tjust pass it as a string.
      id = new ObjectId(achievementId);
    }
    achievementsDB.find({
      _id: id
    }).toArray(function (err, res) {
      if (err) {
        resultObj = ResultObj("Error when adding achievements to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else if (res.length == 1) {
        resultObj = ResultObj("achievements retrieved", null, true, res[0]._id, res[0]);
        result(null, resultObj);
      } else {
        resultObj = ResultObj("achievements not found");
        result(null, resultObj);
      }
    });
  }

  //get all achievementss for a specific user
  static getAchievements(achievementsDB, userId, result) {
    var resultObj;
    achievementsDB.find({
      owner: userId
    }).toArray(function (err, res) {
      if (err) {
        resultObj = ResultObj("Error when adding achievements to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("achievements retrieved", null, true, userId, res);
        result(null, resultObj);
      }
    });
  }

  static updateAchievement(achievementsDB, newAchievement, result) {
    var achievementsId = new ObjectId(newAchievement._id);
    newachievements._id = achievementsId;
    var resultObj;
    achievementsDB.find({
      _id: achievementsId
    }).toArray(function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when checking if user with id " + newachievements._id + " exists in database.", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else if (res.length == 0) { //no user with id userId, tell the updater and log it
        resultObj = ResultObj("achievements not in database. ID:" + newachievements._id);
        console.log(resultObj.statusMsg);
        result(null, resultObj);
      } else {
        console.log(result)
        achievementsDB.updateOne({
            _id: new ObjectId(newAchievements._id)
          }, {
            $set: newAchievements
          },
          function (err) {
            if (err) {
              resultObj = ResultObj("Error when attempting to change name!", err);
              console.log(resultObj.statusMsg + ": " + err);
              result(null, resultObj)
            } else {
              resultObj = ResultObj("achievement changed to ", null, true);              
              result(null, resultObj)
            }
          })
      }
    })
  };
  // maybe not necessary to delete achievements 
  static deleteachievement(achievementsDB, achievementId) {
    var resultObj;
    achievementsDB.find({
      _id: new ObjectId(achievementId)
    }).toArray(function (err) {
      if (err) {
        resultObj = ResultObj("Error when attempting to delete achievement!", err);
        console.log(resultObj.statusMsg + ": " + err);
        resolve(resultObj);
      } else {
        achievementsDB.deleteOne({
          _id: new ObjectId(achievementId)
        }).toArray(function (err2) {
          if (err2) {
            resultObj = ResultObj("Error when attempting to delete achievement!", err);
            console.log(resultObj.statusMsg + ": " + err);
            resolve(resultObj);
          } else {
            resultObj = ResultObj("user with" + achievementId.title + "deleted");
            resultObj(resultObj);
          }
        });
      }
    });
  }
}


/*
  ResultObj constructor function. Since we need to create a different return object for many different possible scenarios, all this functionality
  can be put in one function.

      ResultObj constructor function. Since we need to create a different return object for many different possible scenarios, all this functionality
      can be put in one function.
    
      The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
    
The most common parameters are closer to the start of the list
while the ones that rarely get called are towards the end.*/

function ResultObj(statusMsg = "", statusObj = null, success = false, id = null, data = null) { //what will be returned to the requester when the function completes
  var returnObj = {
    objId: id,
    success: success,
    statusMsg: statusMsg,
    statusObj: statusObj,
    data: data,
  };
  return returnObj;
}

// checks to see if the achievement is completed


module.exports = Acheievment;