/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserController.js    */

'use strict'

const User = require('../models/UserModel.js').User;

/**
 * Constructor function for a result Object. Allows fast creation of a return object for an API response.
 * 
 * The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
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
 * Adds a user to the database.
 * Calls the addUser model function
 * Returns an error if the user's name contains invalid characters.
 */
exports.addUser = function (req, res) {
  var newUser = new User(req.body);
  var regex = /^(([A-Za-z\.' -])+){3}$/;
  if (!regex.test(newUser.name)) {
    res.json(new ResultObj("Invalid user name"));
  }
  User.addUser(req.app.locals.users, newUser, function (result) {
    res.json(result);
  });
};

/**
 * Retrieves user data from the database.
 * Calls the getUser model function
 * Checks to ensure that all needed properties are included. Will return an error if data is missing
 */
exports.getUser = function (req, res) {
  var user = {}
  if (req.params.id !== 'none') {
    user._id = req.params.id
  } else if (req.query.email) {
    user.email = req.query.email
  }
  console.log(user)
  User.getUser(req.app.locals.users, user, function (result) {
    res.json(result);
  });
}

/**
 * Updates some data for a user from the database. Since a User schema is small, we only need to cast the data as a User and
 * call the updateUser model function 
 */
exports.updateUser = function (req, res) {
  var newUser = new User(req.body);
  User.updateUser(req.app.locals.users, newUser, function (result) {
    res.json(result);
  });
}

/**
 * Deletes a user from the database
 * Calls the deleteUser model function 
 */
exports.deleteUser = function (req, res) {
  User.deleteUser(req.app.locals.users, req.params.id, function (result) {
    res.json(result);
  });
}