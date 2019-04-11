/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'use strict';
//var noSql = require('./noSqlDb.js');
// var ObjectId = require('mongodb').ObjectId;

var User = function (user) {
 
  this.name = user.name == null ? null : user.name;
  this._id = user._id == null ? null : user._id;
  this.savedTasks = user.savedTasks == null ? [] : user.savedTasks;
}

function ResultObj(statusMsg = "", statusObj = null, success = false, id = null) { //what will be returned to the requester when the function completes
  var returnObj = {
    objId: id,
    success: success,
    statusMsg: statusMsg,
    statusObj: statusObj,
  };
  return returnObj;
}

var ResultObj2 = function (r) { //what will be returned to the requester when the function completes
  this.objId = r.id == null ? r.id : null;
  this.success = r.success == null ? r.success : null;
  this.statusMsg = r.statusMsg == null ? r.statusMsg : null;
  this.statusObj = r.statusObj == null ? r.statusObj : null;
}

// Takes a new User object that contains all data that we want to add.
User.addUser = function (usersDB, newUser, result) {
  var resultObj;
  usersDB.insertOne(newUser, function (err2) {
    if (err2) { //Unkown error, return to client and display it in the log.
      resultObj = ResultObj("Error when adding user to database", err2);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
      result(resultObj);
    } else { //user was added to the database.
      resultObj = ResultObj("Added user " + newUser.name, null, true, newUser._id);
      result(resultObj);
    }
  });
}

/*
GetUser returns the data of the user with the given ID.
If no user is found, there is no data retuned and a statusMsg with the reason why there was an error.
*/
User.getUser = function (usersDB, UserId, result) {
  var resultObj;
  usersDB.find({
    _id: UserId
  }).toArray(function (err, res) {
    if (err) {
      resultObj = ResultObj("Error when adding user to database", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else if (res.length == 1) {
      resultObj = ResultObj("User retrieved", null, true, res[0]._id);
      result(resultObj);
    } else {
      resultObj = ResultObj("user not found");
      result(resultObj);
    }
  })
}

//Three different Cases:
//  User adds a new task to save
//  User updates their name
//  User updates thier other information (Not implemented yet)
User.updateUser = function (usersDB, user, result) {
  newUser = new User(user);

  //Check if the user is in the database
  usersDB.find({
    _id: user._id
  }).toArray(function (err, res) {
    if (err) { //Unkown error, return to client and display it in the log.
      resultObj.statusMsg = "Error when checking if user with id " + userId + " exists in database.";
      resultObj.statusObj = err;
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj, null);
    } else if (res.length == 0) { //no user with id userId, tell the updater and log it
      resultObj.statusMsg = "Cannot update hole of user with id " + userId + ". No such user exists.";
      console.log(resultObj.statusMsg);
      result(resultObj, null);
    } else { //user is in the database!
      if (false) { //placeholder for checking data to make sure it complies with things that we need. Ex progress not greater than 100% etc
        resultObj.statusMsg = "Cannot update user with id " + userId + ". At least one data item not in proper format or out of order"
        console.log(resultObj.statusMsg);
        result(resultObj, null);
      } else if (false) { //another placeholder for checking if subdata has errors (list of achievements contains one that doesnt exist or somethign like that)
        resultObj.statusMsg = "Cannot update user with id " + userId + ". subdata types are invalid"
        console.log(resultObj.statusMsg);
        result(resultObj, null);
      } else { //There is a user with that Id in the database.
        // Check if they have the new task in the database
        // Update that user in the database
        // if (user.name != null)

      } // New hole data is the same as what is in the database, so we didnt need to update anything!
      resultObj.statusMsg = "Hole Data unchanged, update contained the same data already stored in database";
      result(resultObj, null);

    }
  });
}

async function updateName(usersDB, user) {
  return new Promise(function (resolve, reject) {
    usersDB.updateOne({ //find the user to update
        _id: _id
      }, { //update its data with:
        $set: {
          'name': user.name
        }
      },
      function (err, res) {
        if (err) { //Unkown error, return to client and display it in the log.
          resultObj.statusMsg = "Error when attempting to change name!";
          console.log(resultObj.statusMsg + ": " + err);
          resultObj.statusObj = err;
          resultObj.total = null;
          resolve(resultObj, null);
        } else { //hole updated successfully!
          resultObj.statusMsg = "Name channged to " + user.name;
          resultObj.success = true;
          resolve(resultObj, null);
        }
      });
  });
}

async function updateSavedTasks(usersDB, user) {
  return new Promise(function (resolve, reject) {
    usersDB.find({
        _id: user._id,
        savedTasks: {
          $elemMatch: { //mongoDB to match anything that also matches the data inside the property     
            taskId: user.savedTasks.taskId
          }
        }
      })
      .toArray(function (err, res) {
        if (err) { //Unkown error, return to client and display it in the log.
          resultObj.statusMsg = "Error when locating user";
          console.log(resultObj.statusMsg + ": " + err);
          resultObj.statusObj = err;
          resolve(statusObj, null);
        }
        //Insert a task ID if it is not already in the data
        if (res2.length == 0) {
          usersDB.updateOne({ //select the user with the given userId to update
              _id: user._id
            }, {
              $push: { //adds the holedata as a new element of the holes array
                savedTasks: {
                  savedTask: user.newSavedTask
                }
              },
            },
            function (err2, res2) {
              if (err2) { //Unkown error, return to client and display it in the log.
                resultObj.statusMsg = "Error when attempting to add new hole " + holeData.holeNum + " for user " + user.userName;
                console.log(resultObj.statusMsg + ": " + err2);
                resultObj.statusObj = err2;
                resultObj.total = null;
                resolve(resultObj, null);
              } else { //Hole was added successfully!
                resultObj.statusMsg = "Hole " + holeData.holeNum + " successfully added for user " + user.userName;
                resultObj.success = true;
                resultObj.total = totalObject;
                resolve(resultObj, null);
              }
            });
        }
      });
  });
}


/*delete a user from the database
searching for the userId(for now we will find by userId) and remove them from the database
*/
User.deleteUser = function (usersDB, UserId, result) {
/*
  usersDB.find(_id = userId).toArray(function (err, res) {
    //if err
    if (err) {
      resultObj.statusMsg = "There was an error when trying to access user in database.";
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      resultObj.statusObj = err;
      result(resultObj, null);
    }
    //if one
    else if (res == 1) {
      usersDB.deleteOne({
        _id: UserId
      }, function (err2, res2) {
        //if err
        if (err) {
          resultObj.statusMsg = "unable to delete the specified userId";
          console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
          resultObj.statusObj = err;
          result(resultObj, null);
        }
        //delete
        else {
          resultObj.success = true;
          resultObj.statusMsg = "user with" + userId + "was deleted";
          result(resultObj, null);
        }
      })
    }
    //if nothing
    else {
      resultObj.statusMsg = "user with" + userId + "was not found";
      result(resultObj, null);
    }
  });*/

}

module.exports = {
  User,
  ResultObj
};