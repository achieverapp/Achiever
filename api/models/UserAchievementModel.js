




/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserAchievementModel.js    */
'use strict';

var ObjectId = require('mongodb').ObjectId;

class userachievements
{
    constructor(UserAchievement)
    {
        this.owner=UserAchievement.owner==null?null:UserAchievement.owner;
        this.datesAchieved=UserAchievement.datesAchieved==null?[]:UserAchievement.datesAchieved;
        this.recent=UserAchievement.recent==null? new Date().toISOString:UserAchievement.recent;
        this.achievementId=UserAchievement.achievementId==null?null:UserAchievement.achievementId;
    }
    static addUserAchievement(userachievementsDB, userachievement, result) 
    {
        var resultObj;
        userachievementsDB.insertOne(userachievement, function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when adding new useruseruserachievements to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(null, resultObj);
      } else {
        resultObj = ResultObj("Added useruseruserachievements " + useruseruserachievements.title, null, true, useruseruserachievements._id, useruseruserachievements);
        result(null, resultObj);
      }
    });
    }
    static getUserAchievement(userachievementsDB, userachievementId, result) 
    {
    var resultObj, id;
    if (userachievementId._id) { // If the id is 'default' then we cannot create an ObjectId with it and mus tjust pass it as a string.
      id = new ObjectId(userachievementsId);
    }
    userachievementsDB.find({
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
    
    static getUserachievements(userachievementsDB, userId, result) 
    {
    var resultObj;
    userachievementsDB.find({
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

    static updateUserAchievement(useruseruseruserachievementsDB, userachievement, result) 
    {


    }
    /* 
    static deleteUserAchievement(useruseruseruserachievementsDB, userachievement, result) 
    {

    }
*/
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