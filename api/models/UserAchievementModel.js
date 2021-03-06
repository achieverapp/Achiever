/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserAchievementModel.js    */
'use strict';

var ObjectId = require('mongodb').ObjectId;

class UserAchievement {
  constructor(UserAchievement) {
    this.owner = UserAchievement.owner == null ? null : UserAchievement.owner;
    this.datesAchieved = UserAchievement.datesAchieved == null ? [] : UserAchievement.datesAchieved;
    this.recent = UserAchievement.recent == null ? new Date().toISOString : UserAchievement.recent;
    this.achievementId = UserAchievement.achievementId == null ? null : UserAchievement.achievementId;
  }
 /**
   * Inserts a single task to the database     
   * @param {Collection} UserAchievementDB: MongoDB collection that this function will be ran on.
   * @param {UserAchievement} userAchievement: Task object that you want to add to the database.
   * @param {function} result: Function to call for the server response
   */
  static addUserAchievement(userAchievementsDB, userAchievement, result) {
    var resultObj;
    userAchievementsDB.insertOne(userAchievement, function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when adding new useruserachievements to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("Added userachievements ", null, true, userAchievement._id, userAchievement);
        result(null, resultObj);
      }
    });
  }
  /**
   * get a single task to the database     
   * @param {Collection} UserAchievementDB: MongoDB collection that this function will be ran on.
   * @param {UserAchievement} userAchievementId: uaserAchivementid to query in database 
   * @param {function} result: Function to call for the server response
   */
  
  static getUserAchievement(userAchievementsDB, userAchievementId, result) {
    var resultObj, id;
    if (userAchievementId._id) { // If the id is 'default' then we cannot create an ObjectId with it and mus tjust pass it as a string.
      id = new ObjectId(userAchievementId);
    }
    userAchievementsDB.find({
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

  /**
   * get all task of the user to the database     
   * @param {Collection} UserAchievementDB: MongoDB collection that this function will be ran on.
   * @param {UserAchievement} userId: userId of the owner
   * @param {function} result: Function to call for the server response
   */
  static getUserachievements(userAchievementsDB, userId, result) {
    var resultObj;
    userAchievementsDB.find({
      owner: userId
    }).toArray(function (err, res) {
      if (err) {
        resultObj = ResultObj("Error when adding userachievements to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("userachievements retrieved", null, true, userId, res);
        result(null, resultObj);
      }
    });
  }
  /**
   * update a single task to the database     
   * @param {Collection} UserAchievementDB: MongoDB collection that this function will be ran on.
   * @param {UserAchievement} userAchievement: user achivement object that you want to update to the database.
   * @param {function} result: Function to call for the server response
   */
  static updateUserAchievement(userAchievementsDB, userAchievement, result) {
    var userAchievementsId = new ObjectId(userAchievement._id);
    userAchievement._id = userAchievementssId;
    var resultObj;
    userAchievementssDB.find({
      _id: userAchievementssId
    }).toArray(function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when checking if user with id " + userAchievement._id + " exists in database.", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else if (res.length == 0) { //no user with id userId, tell the updater and log it
        resultObj = ResultObj("userAchievements not in database. ID:" + userAchievements._id);
        console.log(resultObj.statusMsg);
        result(null, resultObj);
      } else {
        console.log(result)
        userAchievementssDB.updateOne({
            _id: new ObjectId(userAchievement._id)
          }, {
            $set: userAchievement
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
/**
   * Delete a single task to the database     
   * @param {Collection} UserAchievementDB: MongoDB collection that this function will be ran on.
   * @param {UserAchievement} userAchievement: userAChievement object that you want to remove to the database.
   * @param {function} result: Function to call for the server response
   */
    static deleteUserAchievement(userAchievementsDB, userAchievement, result) 
    {
    var resultObj;
    userAchievementsDB.find({
      _id: new ObjectId(userAchievement)
    }).toArray(function (err) {
      if (err) {
        resultObj = ResultObj("Error when attempting to delete achievement!", err);
        console.log(resultObj.statusMsg + ": " + err);
        resolve(resultObj);
      } else {
        userAchievementDB.deleteOne({
          _id: new ObjectId(userAchievement)
        }).toArray(function (err2) {
          if (err2) {
            resultObj = ResultObj("Error when attempting to delete achievement!", err);
            console.log(resultObj.statusMsg + ": " + err);
            resolve(resultObj);
          } else {
            resultObj = ResultObj("user with" + userAchievement.owner + "deleted");
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
/*
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


module.exports = UserAchievement;