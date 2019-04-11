/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserController.js    */

'use strict'

const Users = require('../models/UserModel.js');

exports.addUser = function (res, err) {
  var newUser = new Users(req.body);
  Users.addUser(req.app.locals.Users, newUser, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })
};

exports.getUser = function (res, err) {
  Users.getUsers(req.app.locals.Users, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}

exports.updateUser = function (res, err) {

}

exports.deleteUser = function (res, err) {
  Users.deleteUsers(req.app.locals.Users, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}