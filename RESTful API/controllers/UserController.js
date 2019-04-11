/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserController.js    */

'use strict'

const User = require('../models/UserModel.js').User;
const ResultObj = require('../models/UserModel.js').resultObj;

exports.addUser = function (req, res) {
  var newUser = new User(req.body);
  var regex = /^(([A-Za-z\.' -])+){3}$/;
  if(!regex.test(newUser.name)) {
    res.json(new ResultObj("Invalid user name"));
  }
  User.addUser(req.app.locals.users, newUser, function (result) {
    res.json(result);
  });
};

exports.getUser = function (req, res) {
  User.getUser(req.app.locals.users, req.params.id, function (result) {
    res.json(result);
  });
}

exports.updateUser = function (req, res) {
  User.updateUser(req.app.locals.users,req.params.id, function (result) {
    res.json(result);
  });
}

exports.deleteUser = function (req, res) {
  User.deleteUser(req.app.locals.users, function ( result) {
    res.json(result);
  });
}