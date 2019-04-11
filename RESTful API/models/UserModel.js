/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'use strict';
//var noSql = require('./noSqlDb.js');
var ObjectId = require('mongodb').ObjectId;

var User = function (user) {
  this.name = user.name == null ? null : user.name;
  this._id = user._id == null ? null : user._id;
  this.savedTasks = user.savedTasks == null ? [] : user.savedTasks;
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
    _id: new ObjectId(UserId)
  }).toArray(function (err, res) {
    if (err) {
      resultObj = ResultObj("Error when adding user to database", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else if (res.length == 1) {
      resultObj = ResultObj("User retrieved", null, true, res[0]._id, res[0]);
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
User.updateUser = function (usersDB, newUser, result) {
  var resultObj;
  //Check if the user is in the database
  usersDB.find({
    _id: new ObjectId(newUser._id)
  }).toArray(function (err, res) {
    if (err) { //Unkown error, return to client and display it in the log.
      resultObj = ResultObj("Error when checking if user with id " + newUser._Id + " exists in database.", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else if (res.length == 0) { //no user with id userId, tell the updater and log it
      resultObj = ResultObj("User not in database. ID:" + newUser._Id);
      console.log(resultObj.statusMsg);
      result(resultObj);
    } else { //user is in the database!
      if (false) { //THis kind of error checking should be done in the controller and not in the model
        resultObj = ResultObj("Cannot update user with id " + newUser._Id + ". At least one data item not in proper format or out of order");
        console.log(resultObj.statusMsg);
        result(resultObj);
      } else { //There is a user with that Id in the database.

        // Update that user in the database
        if (newUser.name != null)
          updateName(usersDB, newUser, resultObj).then(function (res1) {
            result(res1);
          });
        if (newUser.savedTasks.length > 0)
          updateSavedTasks(usersDB, newUser, resultObj).then(function (res1) {
            result(res1);
          });

      } // New hole data is the same as what is in the database, so we didnt need to update anything!
      // resultObj = ResultObj("Hole Data unchanged, update contained the same data already stored in database");
      // result(resultObj);

    }
  });
}

async function updateName(usersDB, newUser, resultObj) {
  return new Promise(function (resolve) {
    usersDB.updateOne({ //find the user to update
        _id: new ObjectId(newUser._id)
      }, { //update its data with:
        $set: {
          'name': newUser.name
        }
      },
      function (err) {
        if (err) { //Unkown error, return to client and display it in the log.
          resultObj = ResultObj("Error when attempting to change name!", err);
          console.log(resultObj.statusMsg + ": " + err);
          resolve(resultObj);
        } else { //hole updated successfully!
          resultObj = ResultObj("Name channged to " + newUser.name, null, true);
          resolve(resultObj);
        }
      });
  });
}

async function updateSavedTasks(usersDB, newUser, resultObj) {
  return new Promise(function (resolve) {
    usersDB.find({
        _id: new ObjectId(newUser._id),
        savedTasks: {
          $elemMatch: { //mongoDB to match anything that also matches the data inside the property     
            taskId: newUser.savedTasks.taskId
          }
        }
      })
      .toArray(function (err, res) {
        if (err) { //Unkown error, return to client and display it in the log.
          resultObj = ResultObj("Error when locating user", err);
          console.log(resultObj.statusMsg + ": " + err);
          resolve(statusObj);
        }
        if (res.length == 0) { //Insert a task ID if it is not already in the data
          usersDB.updateOne({ //select the user with the given userId to update
              _id: new ObjectId(newUser._id)
            }, {
              $push: { //adds the holedata as a new element of the holes array
                savedTasks: {
                  $each: newUser.savedTasks
                }
              },
            },
            function (err2) {
              if (err2) { //Unkown error, return to client and display it in the log.
                resultObj = ResultObj("Error when attempting to save task ID: " + newUser.savedTasks + " for user " + newUser.userName, err2);
                console.log(resultObj.statusMsg + ": " + err2);
                resolve(resultObj);
              } else { //Task was added successfully!
                resultObj = ResultObj("Task saved as template for user " + newUser.userName, null, true);
                resolve(resultObj);
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

  var resultObj;
  usersDB.find(_id = new ObjectId(userId)).toArray(function (err, res) {
    if (err) {
      resultObj = ResultObj("Error when deleting user to database", err);
      console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
      result(resultObj);
    } else {
      usersDB.deleteOne(UserId, function (err2) {
        if (err) {
          resultObj = ResultObj("Error when user user to database", err2);
          console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
          result(resultObj);
        } else {
          resultObj = resultObj("user with userID:" + userId + "was deleted", null, true, null, null);
          result(resultObj);
        }
      });
    }
  })
}
module.exports = {
  User,
  ResultObj
};