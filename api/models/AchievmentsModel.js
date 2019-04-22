'use strict';

var ObjectId = require('mongodb').ObjectId;

class Acheievments
{
    constructor(achievements)
    {
        this.title=achievements.title==null ? null: this.title;
        this.description=achievements.description==null ? null: this.description;
    }
}
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

  static addAchievements(achievementDB, achievements, result) {
    var resultObj;
    achievementssDB.insertOne(achievements, function (err, res) {
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
  }
  