'use strict';

var ObjectId = require('mongodb').ObjectId;

class Acheievments
{
    //basic constructor based on what was inside the design docs
    constructor(achievements)
    {
        this.title=achievements.title==null ? null: this.title;
        this.description=achievements.description==null ? null: this.description;
        // this is just for counting how many times the achievement was completed
        this.counter=achievements.checkcounter== null ? null: 0;
        // might be uneccesary since counter should indicate if a achievements is completed
        this.completed=achievements.completed==null?  false:this.completed;
        this.userAchievement=achievements.userAchievement==null?[]:this.userAchievement;
        
    }

static addAchievements(achievementsDB, achievements, result) {
    var resultObj;
    achievementsDB.insertOne(achievements, function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when adding new achievements to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("Added achievements " + achievements.title, null, true, achievements._id, achievements);
        result(null, resultObj);
      }
    });
  }

  static getAchievements(achievementsDB, achievementsId, result) {
    var resultObj, id;
    if (achievementsId == "default") { // If the id is 'default' then we cannot create an ObjectId with it and mus tjust pass it as a string.
      id = achievementsId;
    } else {
      id = new ObjectId(achievementsId);
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
  static updateAchievement(achievementsDB, newachievement, result) {
    var resultObj;
    achievementsDB.find({
      _id: new ObjectId(newachievement._id)
    }).toArray(function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when checking if user with id " + newachievement._id + " exists in database.", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(resultObj);
      } else if (res.length == 0) { //no user with id userId, tell the updater and log it
        resultObj = ResultObj("achievement not in database. ID:" + newachievement._id);
        console.log(resultObj.statusMsg);
        result(null, resultObj);
      } else {
        if (newachievement.counter != null) {
          updateachievementPriority(achievementsDB, newachievement, result).then(result);
        }
        if (newachievement.completed != null) {
          updateachievementTB(achievementsDB, newachievement, result).then(result);
        }
      }
    })
  }

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
  function achievementCheck(userId)
  {
    if(userId)
    {
      return true;
    }
    return false;
  }