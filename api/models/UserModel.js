/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserModel.js    */

'use strict';
var ObjectId = require('mongodb').ObjectId;

/**
 * user class responsible for interfacing with the Users collection from the database. Full CRUD functionality on all properties:
 - name: User's Name
 - _id: user ID (key)
 - savedTasks[]: Array that contains a list of task ID's that the user has saved as templates.
 */
class User {
  /**
   * Takes an Object and turns it into a User with all the necessary properties.
   * @param {Object} user 
   */
  constructor(user) {
    this.name = user.name == null ? null : user.name;
    this._id = user._id == null ? null : user._id;
    this.savedTasks = user.savedTasks == null ? [] : user.savedTasks;
  }

  /**
   * inserts a new user into the database
   * If no user is found, there is no data retuned and a statusMsgs with the reason why there was an error.
   * @param {Collection} usersDB: MongoDB collection that the function will be run on
   * @param {string} newUser: User object that you want add to the database.
   * @param {function} result: Function to call for the server response
   */
  static addUser(usersDB, newUser, result) {
    var resultObj;
    usersDB.insertOne(newUser, function (err, res) {
      if (err) { //Unkown error, return to client and display it in the log.
        resultObj = ResultObj("Error when adding user to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(resultObj);
      } else { //user was added to the database.
        resultObj = ResultObj("Added user " + newUser.name, null, true, newUser._id, newUser);
        result(resultObj);
      }
    });
  }

  /**
   * GetUser returns the data of the user with the given ID.
   * If no user is found, there is no data retuned and a statusMsg with the reason why there was an error.
   * @param {Collection} usersDB: MongoDB collection that the function will be run on
   * @param {string} userId: User id for the user you want to delete
   * @param {function} result: Function to call for the server response
   */
  static getUser(usersDB, queryUser, result) {
    var query = queryUser;
    if (queryUser._id) {
      query._id = new ObjectId(queryUser._id)
    }
    var resultObj;
    usersDB.find(query).toArray(function (err, res) {
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
    });
  }

  /**
   * updateUser function is responsible for updating anything that may be stored in a user object.
   * the user object is only responsible for storing:
   - Saved tasks
   - Name
   - _id
   * @param {Collection} usersDB: MongoDB collection that the function will be run on
   * @param {User} newUser: User object that contains the new data
   * @param {function} result: Function that will get called when the update is finished
   */
  static updateUser(usersDB, newUser, result) {
    var resultObj;
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
        if (newUser.name != null)
          updateName(usersDB, newUser, resultObj).then(result);
        if (newUser.savedTasks.length > 0)
          updateSavedTasks(usersDB, newUser, resultObj).then(result);
      }
    });
  }

  /**
   * Deletes a user from the database.
   * searching for the userId(for now we will find by userId) and remove them from the database
   * @param {Collection} usersDB: MongoDB collection that the function will be run on
   * @param {string} userId: User id for the user you want to delete
   * @param {function} result: Function to call for the server response
   */
  static deleteUser(usersDB, userId, result) {
    var resultObj;
    usersDB.find({
      _id: new ObjectId(userId)
    }).toArray(function (err, res) {
      if (err) {
        resultObj = ResultObj("Error when deleting user to database", err);
        console.log(resultObj.statusMsg + ": " + JSON.stringify(err));
        result(resultObj);
      } else {
        usersDB.deleteOne({
          _id: new ObjectId(userId)
        }, function (err2) {
          if (err) {
            resultObj = ResultObj("Error when user user to database", err2);
            console.log(resultObj.statusMsg + ": " + JSON.stringify(err2));
            result(resultObj);
          } else {
            resultObj = ResultObj("user with ID:" + userId + "was deleted", null, true, null, null);
            result(resultObj);
          }
        });
      }
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// General Use Functions /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructor function for a result Object. Allows fast creation of a return object for an API response.
 * 
 * ResultObj constructor function. Since we need to create a different return object for many different possible scenarios, all this functionality
  can be put in one function.

  The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
 * @param {string} statusMsg: Message that gives more detail on the result of the call.
 * @param {Object} statusObj: Object containing details about errors if there is an error
 * @param {boolean} success: Status of the API call
 * @param {string} id: ID of the object affected
 * @param {Object} data: data that can be read from the reciever
 */
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

/**
 * Updates the name of the user that is passed.
 * @param {Collection} usersDB: MongoDB collection that the function will be run on
 * @param {User} newUser: User object that contains the new data
 * @param {ResultObj} resultObj: JSON object that contains the server response
 */
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

/**
 * Updates the list of the users saved tasks with what is contained in the sent User object.
 * @param {Collection} usersDB: MongoDB collection that the function will be run on
 * @param {User} newUser: User object that contains the new data
 * @param {ResultObj} resultObj: JSON object that contains the server response
 */
async function updateSavedTasks(usersDB, newUser, resultObj) {
  return new Promise(function (resolve) {
    usersDB.find({
        _id: new ObjectId(newUser._id)
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

module.exports = {
  User,
  ResultObj
};