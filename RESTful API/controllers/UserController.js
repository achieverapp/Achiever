/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserController.js    */

'use strict'

const User = require('../models/UserModel.js');

exports.addUser = function (req, res) {
  var newUser = new User(res.body);
  var regex = /^(([A-Za-z\.' -])+){3}$/;
  User.addUser(req.app.locals.Users, newUser.name, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
};

exports.getUser = function (req, res) {
  User.getUser(req.app.locals.Users, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}

exports.updateUser = function (req, res) {
  User.updateUser(req.app.locals.Users, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}

exports.deleteUser = function (req, res) {
  User.deleteUser(req.app.locals.Users, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}