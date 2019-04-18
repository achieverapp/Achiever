/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserController.js    */

'use strict'

const User = require('../models/UserModel.js').User;

/*
  ResultObj constructor function. Since we need to create a different return object for many different possible scenarios, all this functionality
  can be put in one function.

  The most common parameters are closer to the start of the list while the ones that rarely get called are towards the end.
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

exports.getUser = function (req, res) {
  var user = {}
  if(req.params.id !== 'none') {
    user._id = req.params.id
  }
  else if (req.query.email) {
    user.email = req.query.email
  }
  console.log(user)
  User.getUser(req.app.locals.users, user, function (result) {
    res.json(result);
  });
}

exports.updateUser = function (req, res) {
  var newUser = new User(req.body);
  User.updateUser(req.app.locals.users, newUser, function (result) {
    res.json(result);
  });
}

exports.deleteUser = function (req, res) {
  User.deleteUser(req.app.locals.users, req.params.id, function (result) {
    res.json(result);
  });
}