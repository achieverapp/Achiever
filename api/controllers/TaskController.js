/* CptS 489, Spring 2019
    Project: Task Tracker
    File: TaskController.js    */

'use strict'

const Task = require('../models/TaskModel.js');

exports.addTask = function (req, res) {
  var newTask = new Task(req.body);
  Task.addTask(req.app.locals.tasks, newTask, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
};

//we need to deal with determining if the request is for a single task or for all the tasks from a certain user
exports.getTask = function (req, res) {
  Task.getTask(req.app.locals.tasks, req.params.id, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}

exports.getTasks = function (req, res) {
  Task.getTasks(req.app.locals.tasks, req.params.id, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
}

exports.updateTask = function (req, res) {
  if (req.body._id == "default") { //When we are adding a new task, the ID will be default    
    delete req.body._id; //remove the ID from the task object
    var newTask = new Task(req.body); //turn it into a task object  
    console.log(newTask);

    Task.addTask(req.app.locals.tasks, newTask, function (err, result) { //call the addTask function to deal with the rest.
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  } else {
    Task.updateTask(req.app.locals.tasks, req.body, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
}

exports.deleteTask = function (req, res) {
  Task.getTasks(req.app.locals.tasks, req.params.id);
}