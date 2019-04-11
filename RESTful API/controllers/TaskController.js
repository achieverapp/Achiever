/* CptS 489, Spring 2019
    Project: Task Tracker
    File: UserController.js    */

    'use strict'

    const Task = require('../models/TaskModel.js');
    
    exports.addTask = function (res, err) {
      var newTask = new Tass(req.body);
      Users.addTask(req.app.locals.Tasks, newTask, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      })
    };
    
    exports.getTask = function (res, err) {
      Users.getUsers(req.app.locals.Tasks, function (err, result) {
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

    }